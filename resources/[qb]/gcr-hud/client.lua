local QBCore = exports['qb-core']:GetCoreObject()

local PlayerData = {}
local hudVisible = true
local lastNeeds = {
    hunger = 100,
    thirst = 100,
    stress = 0
}

local function clamp(value, minValue, maxValue)
    value = tonumber(value) or minValue
    if value < minValue then return minValue end
    if value > maxValue then return maxValue end
    return value
end

local function getPlayerData()
    local data = QBCore.Functions.GetPlayerData()
    if data and next(data) then
        PlayerData = data
    end
    return PlayerData
end

local function getVoiceMode()
    local proximity = LocalPlayer.state.proximity

    if proximity and proximity.mode then
        if proximity.mode == 1 then return 'WHISPER' end
        if proximity.mode == 2 then return 'NORMAL' end
        if proximity.mode == 3 then return 'SHOUT' end
    end

    return 'NORMAL'
end

local function getRadioChannel()
    local radio = LocalPlayer.state.radioChannel
    if radio == nil then
        radio = LocalPlayer.state.radio
    end

    return tonumber(radio) or 0
end

local function sendPlayerInfo()
    local data = getPlayerData()
    local metadata = data.metadata or {}
    local money = data.money or {}
    local job = data.job or {}
    local gang = data.gang or {}

    lastNeeds.hunger = clamp(metadata.hunger or lastNeeds.hunger, 0, 100)
    lastNeeds.thirst = clamp(metadata.thirst or lastNeeds.thirst, 0, 100)
    lastNeeds.stress = clamp(metadata.stress or lastNeeds.stress, 0, 100)

    local jobGrade = ''
    if job.grade then
        if type(job.grade) == 'table' then
            jobGrade = job.grade.name or job.grade.level or ''
        else
            jobGrade = job.grade
        end
    end

    SendNUIMessage({
        action = 'playerInfo',
        id = GetPlayerServerId(PlayerId()),
        cash = tonumber(money.cash) or 0,
        bank = tonumber(money.bank) or 0,
        job = job.label or job.name or 'Civilian',
        grade = jobGrade,
        gang = gang.label or gang.name or 'No Gang',
        hunger = lastNeeds.hunger,
        thirst = lastNeeds.thirst,
        stress = lastNeeds.stress,
        showLogo = Config.ShowLogo
    })
end

local function sendStatus()
    local ped = PlayerPedId()
    if not DoesEntityExist(ped) then return end

    local health = clamp(GetEntityHealth(ped) - 100, 0, 100)
    local armor = clamp(GetPedArmour(ped), 0, 100)
    local stamina = clamp(GetPlayerSprintStaminaRemaining(PlayerId()), 0, 100)

    SendNUIMessage({
        action = 'status',
        health = health,
        armor = armor,
        stamina = stamina,
        talking = NetworkIsPlayerTalking(PlayerId()),
        voice = getVoiceMode(),
        radio = getRadioChannel()
    })

    local vehicle = GetVehiclePedIsIn(ped, false)

    if vehicle ~= 0 then
        local speed = math.floor(GetEntitySpeed(vehicle) * 3.6 + 0.5)
        local fuel = clamp(GetVehicleFuelLevel(vehicle), 0, 100)
        local engine = clamp(GetVehicleEngineHealth(vehicle) / 10.0, 0, 100)
        local gear = GetVehicleCurrentGear(vehicle)
        local rpm = clamp(GetVehicleCurrentRpm(vehicle) * 100.0, 0, 100)

        SendNUIMessage({
            action = 'vehicle',
            visible = true,
            speed = speed,
            fuel = fuel,
            engine = engine,
            gear = gear,
            rpm = rpm,
            unit = Config.SpeedUnit
        })
    else
        SendNUIMessage({
            action = 'vehicle',
            visible = false
        })
    end
end

-- Status real-time.
CreateThread(function()
    while true do
        if hudVisible then
            sendStatus()
            Wait(200)
        else
            Wait(1000)
        end
    end
end)

-- Player data / money / job / metadata.
CreateThread(function()
    Wait(1500)
    sendPlayerInfo()

    while true do
        if hudVisible then
            sendPlayerInfo()
            TriggerServerEvent('gcr-hud:server:requestOnline')
        end

        Wait(Config.OnlineRefresh)
    end
end)

-- Damage saat hunger / thirst habis (opsional).
CreateThread(function()
    while true do
        Wait(Config.ZeroNeedsDamage.Interval)

        if Config.ZeroNeedsDamage.Enabled then
            if lastNeeds.hunger <= 0 or lastNeeds.thirst <= 0 then
                local ped = PlayerPedId()
                local health = GetEntityHealth(ped)

                if health > 101 then
                    SetEntityHealth(ped, math.max(101, health - Config.ZeroNeedsDamage.Damage))
                end
            end
        end
    end
end)

RegisterNetEvent('gcr-hud:client:setOnline', function(count)
    SendNUIMessage({
        action = 'online',
        count = tonumber(count) or 0
    })
end)

RegisterNetEvent('gcr-hud:client:updateNeeds', function(hunger, thirst)
    lastNeeds.hunger = clamp(hunger, 0, 100)
    lastNeeds.thirst = clamp(thirst, 0, 100)

    SendNUIMessage({
        action = 'needs',
        hunger = lastNeeds.hunger,
        thirst = lastNeeds.thirst
    })
end)

-- Kompatibilitas dengan event HUD QBCore yang umum.
RegisterNetEvent('hud:client:UpdateNeeds', function(hunger, thirst)
    lastNeeds.hunger = clamp(hunger, 0, 100)
    lastNeeds.thirst = clamp(thirst, 0, 100)

    SendNUIMessage({
        action = 'needs',
        hunger = lastNeeds.hunger,
        thirst = lastNeeds.thirst
    })
end)

RegisterNetEvent('hud:client:UpdateStress', function(stress)
    lastNeeds.stress = clamp(stress, 0, 100)

    SendNUIMessage({
        action = 'stress',
        stress = lastNeeds.stress
    })
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData() or {}
    hudVisible = true
    SendNUIMessage({ action = 'show' })
    sendPlayerInfo()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
    SendNUIMessage({ action = 'hide' })
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(job)
    PlayerData.job = job
    sendPlayerInfo()
end)

RegisterNetEvent('QBCore:Client:OnGangUpdate', function(gang)
    PlayerData.gang = gang
    sendPlayerInfo()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    PlayerData = data or {}
    sendPlayerInfo()
end)

RegisterCommand('togglehud', function()
    hudVisible = not hudVisible
    SendNUIMessage({
        action = hudVisible and 'show' or 'hide'
    })
end, false)

RegisterKeyMapping('togglehud', 'Toggle Grand Country HUD', 'keyboard', Config.ToggleKey)
