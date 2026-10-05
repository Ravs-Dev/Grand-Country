local QBCore = exports['qb-core']:GetCoreObject()

local PlayerData = {}
local playerCount = 0
local hudVisible = true
local lastHealth = nil
local lastArmor = nil

local injuries = {
    head = false,
    torso = false,
    leftarm = false,
    rightarm = false,
    leftleg = false,
    rightleg = false
}

local injuryExpire = {}

-- GTA V ped bones grouped into the 6 areas shown by the body detector.
local injuryBones = {
    head = {
        31086, -- head
        39317  -- neck
    },
    torso = {
        11816, -- pelvis
        24816, -- spine0
        24817, -- spine1
        24818, -- spine2
        57597, -- spine3
        23553  -- spine root
    },
    leftarm = {
        64729, -- left clavicle
        45509, -- left upper arm
        61163, -- left forearm
        18905  -- left hand
    },
    rightarm = {
        10706, -- right clavicle
        40269, -- right upper arm
        28252, -- right forearm
        57005  -- right hand
    },
    leftleg = {
        58271, -- left thigh
        63931, -- left calf
        14201, -- left foot
        2108   -- left toe
    },
    rightleg = {
        51826, -- right thigh
        36864, -- right calf
        52301, -- right foot
        20781  -- right toe
    }
}

local function clamp(value, minValue, maxValue)
    value = tonumber(value) or 0
    if value < minValue then return minValue end
    if value > maxValue then return maxValue end
    return value
end

local function contains(list, value)
    for i = 1, #list do
        if list[i] == value then
            return true
        end
    end
    return false
end

local function getBoneZone(bone)
    if contains(injuryBones.head, bone) then return 'head' end
    if contains(injuryBones.leftarm, bone) then return 'leftarm' end
    if contains(injuryBones.rightarm, bone) then return 'rightarm' end
    if contains(injuryBones.leftleg, bone) then return 'leftleg' end
    if contains(injuryBones.rightleg, bone) then return 'rightleg' end
    if contains(injuryBones.torso, bone) then return 'torso' end
    return 'torso'
end

local function cleanInjuryTable(data)
    data = type(data) == 'table' and data or {}
    return {
        head = data.head == true,
        torso = data.torso == true,
        leftarm = data.leftarm == true,
        rightarm = data.rightarm == true,
        leftleg = data.leftleg == true,
        rightleg = data.rightleg == true
    }
end

local function saveInjuries()
    if not Config.SaveInjuriesToMetadata then return end
    TriggerServerEvent('gcr-hud:server:setInjuries', injuries)
end

local function markInjury(zone)
    zone = zone or 'torso'

    if injuries[zone] ~= true then
        injuries[zone] = true
        saveInjuries()
    end

    if not Config.PersistInjuries then
        injuryExpire[zone] = GetGameTimer() + Config.InjuryDisplayTime
    end
end

local function clearInjuries(save)
    injuries = {
        head = false,
        torso = false,
        leftarm = false,
        rightarm = false,
        leftleg = false,
        rightleg = false
    }

    injuryExpire = {}

    if save ~= false then
        saveInjuries()
    end
end

local function refreshPlayerData()
    local data = QBCore.Functions.GetPlayerData()
    if data then
        PlayerData = data
    end
    return PlayerData
end

local function loadInjuriesFromMetadata()
    local metadata = (PlayerData and PlayerData.metadata) or {}
    injuries = cleanInjuryTable(metadata.injuries)
end

local function moneyValue(moneyType)
    local money = (PlayerData and PlayerData.money) or {}
    return tonumber(money[moneyType]) or 0
end

local function getJobText()
    local job = PlayerData and PlayerData.job
    if not job or not job.name then
        return Config.DefaultJob
    end

    local label = job.label or job.name or 'Civilian'
    local gradeName

    if type(job.grade) == 'table' then
        gradeName = job.grade.name or job.grade.label
    elseif job.grade ~= nil then
        gradeName = tostring(job.grade)
    end

    if not gradeName or gradeName == '' then
        gradeName = 'Freelancer'
    end

    return ('%s - %s'):format(label, gradeName)
end

local function getGangText()
    local gang = PlayerData and PlayerData.gang
    if not gang or not gang.name or gang.name == 'none' then
        return Config.DefaultGang
    end

    local label = gang.label or gang.name
    local gradeName

    if type(gang.grade) == 'table' then
        gradeName = gang.grade.name or gang.grade.label
    elseif gang.grade ~= nil then
        gradeName = tostring(gang.grade)
    end

    if not gradeName or gradeName == '' then
        gradeName = 'Member'
    end

    return ('%s - %s'):format(label, gradeName)
end

local function getHealthPercent(ped)
    local current = GetEntityHealth(ped)
    local maximum = GetEntityMaxHealth(ped)

    -- Normal GTA player peds use 100..200 for 0..100 visible health.
    local baseHealth = 100
    local usableMax = math.max(maximum - baseHealth, 1)
    local percent = ((current - baseHealth) / usableMax) * 100.0

    if IsEntityDead(ped) then
        percent = 0
    end

    return math.floor(clamp(percent, 0, 100) + 0.5)
end

local function getNeeds()
    local metadata = (PlayerData and PlayerData.metadata) or {}
    local hunger = tonumber(metadata.hunger) or 100
    local thirst = tonumber(metadata.thirst) or 100
    local stress = tonumber(metadata.stress) or 0

    return math.floor(clamp(hunger, 0, 100)), math.floor(clamp(thirst, 0, 100)), math.floor(clamp(stress, 0, 100))
end

local function getVoiceData()
    local talking = NetworkIsPlayerTalking(PlayerId())
    local mode = 'OFF'

    if LocalPlayer and LocalPlayer.state then
        local proximity = LocalPlayer.state.proximity

        if type(proximity) == 'table' then
            local index = tonumber(proximity.index or proximity.mode)

            if index == 1 then
                mode = 'WHISPER'
            elseif index == 2 then
                mode = 'NORMAL'
            elseif index == 3 then
                mode = 'SHOUT'
            elseif proximity.name then
                mode = tostring(proximity.name)
            elseif proximity.distance then
                mode = tostring(math.floor((tonumber(proximity.distance) or 0) + 0.5)) .. 'M'
            else
                mode = 'ON'
            end
        elseif type(proximity) == 'number' then
            if proximity == 1 then
                mode = 'WHISPER'
            elseif proximity == 2 then
                mode = 'NORMAL'
            elseif proximity == 3 then
                mode = 'SHOUT'
            else
                mode = 'ON'
            end
        elseif proximity ~= nil then
            mode = 'ON'
        elseif talking then
            mode = 'ON'
        end
    elseif talking then
        mode = 'ON'
    end

    return {
        talking = talking,
        mode = mode
    }
end

local function getAmmoInfo(ped)
    local weapon = GetSelectedPedWeapon(ped)

    if weapon == joaat('WEAPON_UNARMED') then
        return false, 0, 0
    end

    -- Flag 4 keeps the ammo card for firearms only, not fists/melee/tools.
    if not IsPedArmed(ped, 4) then
        return false, 0, 0
    end

    local total = GetAmmoInPedWeapon(ped, weapon)
    local hasClip, clip = GetAmmoInClip(ped, weapon)
    clip = (hasClip and clip) or 0

    local reserve = math.max((tonumber(total) or 0) - clip, 0)

    -- Keep the card visible even when ammo reaches 0/0.
    return true, clip, reserve
end

local function updatePlayerCount()
    QBCore.Functions.TriggerCallback('gcr-hud:server:getPlayerCount', function(count)
        playerCount = tonumber(count) or 0
    end)
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData() or {}
    loadInjuriesFromMetadata()

    hudVisible = true
    local ped = PlayerPedId()
    lastHealth = GetEntityHealth(ped)
    lastArmor = GetPedArmour(ped)

    updatePlayerCount()
    SendNUIMessage({ action = 'visible', visible = true })
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
    hudVisible = false
    clearInjuries(false)
    SendNUIMessage({ action = 'visible', visible = false })
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    PlayerData = data or {}

    local metadata = PlayerData.metadata or {}
    if type(metadata.injuries) == 'table' then
        injuries = cleanInjuryTable(metadata.injuries)
    end
end)

-- Keep standard QBCore hunger/thirst events compatible.
-- This HUD shows Hunger, Thirst, Stress, and Run together.
RegisterNetEvent('hud:client:UpdateNeeds', function(newHunger, newThirst)
    PlayerData.metadata = PlayerData.metadata or {}
    PlayerData.metadata.hunger = tonumber(newHunger) or PlayerData.metadata.hunger or 100
    PlayerData.metadata.thirst = tonumber(newThirst) or PlayerData.metadata.thirst or 100
end)

RegisterNetEvent('hud:client:UpdateStress', function(newStress)
    PlayerData.metadata = PlayerData.metadata or {}
    PlayerData.metadata.stress = tonumber(newStress) or PlayerData.metadata.stress or 0
end)

RegisterNetEvent('hud:client:ShowHud', function()
    hudVisible = true
    SendNUIMessage({ action = 'visible', visible = true })
end)

RegisterNetEvent('hud:client:HideHud', function()
    hudVisible = false
    SendNUIMessage({ action = 'visible', visible = false })
end)

RegisterNetEvent('gcr-hud:client:clearInjuries', function()
    clearInjuries(true)
end)

if Config.ClearInjuriesOnRevive then
    RegisterNetEvent('hospital:client:Revive', function()
        clearInjuries(true)
    end)

    RegisterNetEvent('hospital:client:RespawnAtHospital', function()
        clearInjuries(true)
    end)
end

RegisterCommand('hud', function()
    hudVisible = not hudVisible
    SendNUIMessage({ action = 'visible', visible = hudVisible })
end, false)

-- Useful while testing the body detector.
RegisterCommand('clearinjury', function()
    clearInjuries(true)
end, false)

CreateThread(function()
    Wait(1500)

    refreshPlayerData()
    loadInjuriesFromMetadata()
    updatePlayerCount()

    local ped = PlayerPedId()
    lastHealth = GetEntityHealth(ped)
    lastArmor = GetPedArmour(ped)

    while true do
        updatePlayerCount()
        Wait(Config.PlayerCountRefresh)
    end
end)

-- Hide map during gameplay. ESC / pause menu makes it visible again.
CreateThread(function()
    while true do
        if Config.HideMinimapInGameplay then
            local paused = IsPauseMenuActive()
            DisplayRadar(paused)

            if not paused then
                SetRadarBigmapEnabled(false, false)
            end
        end

        Wait(150)
    end
end)

-- Injury detector. It watches BOTH health and armor loss so a bullet that hits
-- armor can still mark the body part red.
CreateThread(function()
    while true do
        if Config.EnableBodyInjury then
            local ped = PlayerPedId()
            local currentHealth = GetEntityHealth(ped)
            local currentArmor = GetPedArmour(ped)

            if lastHealth == nil then lastHealth = currentHealth end
            if lastArmor == nil then lastArmor = currentArmor end

            local tookDamage = currentHealth < lastHealth or currentArmor < lastArmor

            if tookDamage and not IsEntityDead(ped) then
                local success, bone = GetPedLastDamageBone(ped)

                if success and bone then
                    markInjury(getBoneZone(bone))
                else
                    markInjury('torso')
                end
            end

            if not Config.PersistInjuries then
                local now = GetGameTimer()
                local changed = false

                for zone, expireAt in pairs(injuryExpire) do
                    if expireAt and now >= expireAt then
                        injuries[zone] = false
                        injuryExpire[zone] = nil
                        changed = true
                    end
                end

                if changed then
                    saveInjuries()
                end
            end

            lastHealth = currentHealth
            lastArmor = currentArmor
        end

        Wait(100)
    end
end)

CreateThread(function()
    while true do
        if hudVisible then
            local ped = PlayerPedId()
            local playerId = PlayerId()

            PlayerData = QBCore.Functions.GetPlayerData() or PlayerData

            local hunger, thirst, stress = getNeeds()
            local health = getHealthPercent(ped)
            local armor = math.floor(clamp(GetPedArmour(ped), 0, 100))
            local stamina = math.floor(clamp(GetPlayerSprintStaminaRemaining(playerId), 0, 100) + 0.5)
            local ammoVisible, ammoClip, ammoReserve = getAmmoInfo(ped)
            local voice = getVoiceData()

            local vehicleData = nil

            if Config.ShowVehicleHud and IsPedInAnyVehicle(ped, false) then
                local vehicle = GetVehiclePedIsIn(ped, false)
                vehicleData = {
                    speed = math.floor(GetEntitySpeed(vehicle) * 3.6 + 0.5),
                    fuel = math.floor(clamp(GetVehicleFuelLevel(vehicle), 0, 100) + 0.5),
                    engine = math.floor(clamp(GetVehicleEngineHealth(vehicle) / 10.0, 0, 100) + 0.5)
                }
            end

            SendNUIMessage({
                action = 'update',
                data = {
                    serverName = Config.ServerName,
                    serverId = GetPlayerServerId(playerId),
                    playerCount = playerCount,
                    cash = moneyValue('cash'),
                    bank = moneyValue('bank'),
                    job = getJobText(),
                    gang = getGangText(),
                    health = health,
                    armor = armor,
                    hunger = hunger,
                    thirst = thirst,
                    stress = stress,
                    stamina = stamina,
                    voice = voice,
                    injuries = injuries,
                    ammoVisible = ammoVisible,
                    ammoClip = ammoClip,
                    ammoReserve = ammoReserve,
                    vehicle = vehicleData
                }
            })
        end

        Wait(Config.RefreshRate)
    end
end)

local isHUDVisible = true

CreateThread(function()
    while true do
        Wait(Config.RefreshRate)
        if LocalPlayer.state.isLoggedIn then
            local playerPed = PlayerPedId()
            local health = GetEntityHealth(playerPed) - 100
            local armor = GetPedArmour(playerPed)
            
            local PlayerData = QBCore.Functions.GetPlayerData()
            local hunger = PlayerData.metadata['hunger'] or 100
            local thirst = PlayerData.metadata['thirst'] or 100
            local stress = PlayerData.metadata['stress'] or 0

            SendNUIMessage({
                action = 'updateHUD',
                health = math.max(0, health),
                armor = armor,
                hunger = math.floor(hunger),
                thirst = math.floor(thirst),
                stress = math.floor(stress),
                cash = PlayerData.money['cash'] or 0,
                bank = PlayerData.money['bank'] or 0,
                job = PlayerData.job.label .. " - " .. PlayerData.job.grade.name,
                gang = PlayerData.gang.label ~= "No Gang" and PlayerData.gang.label or "No Gang - Unaffiliated",
                id = GetPlayerServerId(PlayerId()),
                visible = isHUDVisible and not IsPauseMenuActive()
            })
        else
            SendNUIMessage({ action = 'hideHUD' })
        end
    end
end)

RegisterCommand('togglehud', function()
    isHUDVisible = not isHUDVisible
end, false)