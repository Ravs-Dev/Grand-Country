local QBCore = exports['qb-core']:GetCoreObject()

local PlayerData = {}
local hudVisible = true

local lastNeeds = {
    hunger = 100,
    thirst = 100,
    stress = 0
}

-- ============================================================
-- HELPERS
-- ============================================================

local function clamp(value, minValue, maxValue)
    value = tonumber(value) or minValue

    if value < minValue then
        return minValue
    end

    if value > maxValue then
        return maxValue
    end

    return value
end

local function round(value)
    return math.floor((tonumber(value) or 0) + 0.5)
end

local function getPlayerData()
    local data = QBCore.Functions.GetPlayerData()

    if type(data) == 'table' and next(data) ~= nil then
        PlayerData = data
    end

    return PlayerData
end

-- ============================================================
-- HEALTH
--
-- GTA/FiveM biasanya:
-- internal 200 = HUD 100
-- internal 150 = HUD 50
-- internal 100 = HUD 0
--
-- Kalau max health diubah resource lain, fungsi ini tetap
-- menghitung persentase berdasarkan max health saat itu.
-- ============================================================

local function getHealthPercent(ped)
    if not ped or ped == 0 or not DoesEntityExist(ped) then
        return 0
    end

    if IsEntityDead(ped) then
        return 0
    end

    local currentHealth = tonumber(GetEntityHealth(ped)) or 0
    local maxHealth = tonumber(GetEntityMaxHealth(ped)) or 200

    if maxHealth > 100 then
        local health = ((currentHealth - 100) / (maxHealth - 100)) * 100.0
        return clamp(round(health), 0, 100)
    end

    return clamp(round(currentHealth), 0, 100)
end

-- ============================================================
-- VOICE / RADIO
-- ============================================================

local function getVoiceMode()
    local state = LocalPlayer and LocalPlayer.state
    if not state then
        return 'NORMAL'
    end

    local proximity = state.proximity

    if type(proximity) == 'table' then
        local mode = proximity.mode

        if type(mode) == 'string' then
            local upper = string.upper(mode)

            if upper == 'WHISPER' or upper == 'NORMAL' or upper == 'SHOUT' then
                return upper
            end
        end

        mode = tonumber(mode)

        if mode == 1 then
            return 'WHISPER'
        elseif mode == 2 then
            return 'NORMAL'
        elseif mode == 3 then
            return 'SHOUT'
        end

        -- Fallback pma-voice berdasarkan jarak proximity.
        local distance = tonumber(proximity.distance)

        if distance then
            if distance <= 3.5 then
                return 'WHISPER'
            elseif distance <= 10.0 then
                return 'NORMAL'
            else
                return 'SHOUT'
            end
        end
    end

    return 'NORMAL'
end

local function getRadioChannel()
    local state = LocalPlayer and LocalPlayer.state

    if not state then
        return 0
    end

    local radio = state.radioChannel

    if radio == nil then
        radio = state.radio
    end

    return tonumber(radio) or 0
end

-- ============================================================
-- FUEL
-- ============================================================

local function getFuelLevel(vehicle)
    if not vehicle or vehicle == 0 or not DoesEntityExist(vehicle) then
        return 0
    end

    if Config.UseLegacyFuel and GetResourceState('LegacyFuel') == 'started' then
        local ok, fuel = pcall(function()
            return exports['LegacyFuel']:GetFuel(vehicle)
        end)

        if ok and fuel ~= nil then
            return clamp(fuel, 0, 100)
        end
    end

    return clamp(GetVehicleFuelLevel(vehicle), 0, 100)
end

-- ============================================================
-- PLAYER INFO
-- ============================================================

local function sendPlayerInfo()
    local data = getPlayerData()

    if type(data) ~= 'table' then
        return
    end

    local metadata = data.metadata or {}
    local money = data.money or {}
    local job = data.job or {}
    local gang = data.gang or {}

    if metadata.hunger ~= nil then
        lastNeeds.hunger = clamp(metadata.hunger, 0, 100)
    end

    if metadata.thirst ~= nil then
        lastNeeds.thirst = clamp(metadata.thirst, 0, 100)
    end

    if metadata.stress ~= nil then
        lastNeeds.stress = clamp(metadata.stress, 0, 100)
    end

    local jobGrade = ''

    if type(job.grade) == 'table' then
        jobGrade = job.grade.name or job.grade.level or ''
    elseif job.grade ~= nil then
        jobGrade = job.grade
    end

    SendNUIMessage({
        action = 'playerInfo',

        id = GetPlayerServerId(PlayerId()),

        cash = tonumber(money.cash) or 0,
        bank = tonumber(money.bank) or 0,

        job = job.label or job.name or 'Civilian',
        grade = jobGrade,

        gang = gang.label or gang.name or 'No Gang',

        hunger = round(lastNeeds.hunger),
        thirst = round(lastNeeds.thirst),
        stress = round(lastNeeds.stress),

        showLogo = Config.ShowLogo
    })
end

-- ============================================================
-- STATUS / DAMAGE / VEHICLE
-- ============================================================

local function sendStatus()
    local playerId = PlayerId()

    if not NetworkIsPlayerActive(playerId) then
        return
    end

    local ped = PlayerPedId()

    if not ped or ped == 0 or not DoesEntityExist(ped) then
        return
    end

    local health = getHealthPercent(ped)
    local armor = clamp(GetPedArmour(ped), 0, 100)
    local stamina = clamp(GetPlayerSprintStaminaRemaining(playerId), 0, 100)

    SendNUIMessage({
        action = 'status',

        health = round(health),
        armor = round(armor),
        stamina = round(stamina),

        talking = NetworkIsPlayerTalking(playerId),
        voice = getVoiceMode(),
        radio = getRadioChannel()
    })

    local vehicle = GetVehiclePedIsIn(ped, false)

    if vehicle and vehicle ~= 0 and DoesEntityExist(vehicle) then
        local multiplier = Config.SpeedUnit == 'MPH' and 2.236936 or 3.6

        local speed = round(GetEntitySpeed(vehicle) * multiplier)
        local fuel = round(getFuelLevel(vehicle))
        local engine = clamp(GetVehicleEngineHealth(vehicle) / 10.0, 0, 100)
        local gear = tonumber(GetVehicleCurrentGear(vehicle)) or 0
        local rpm = clamp((tonumber(GetVehicleCurrentRpm(vehicle)) or 0) * 100.0, 0, 100)

        local state = LocalPlayer and LocalPlayer.state
        local beltValue = state and (state.seatbelt ~= nil and state.seatbelt or state.seatBelt)
        if beltValue == nil and state then beltValue = state.belt end

        local belt = beltValue == true
            or beltValue == 1
            or beltValue == '1'
            or beltValue == 'true'

        SendNUIMessage({
            action = 'vehicle',
            visible = true,

            speed = speed,
            fuel = fuel,
            engine = round(engine),
            gear = gear,
            rpm = round(rpm),
            belt = belt,

            unit = Config.SpeedUnit
        })
    else
        SendNUIMessage({
            action = 'vehicle',
            visible = false
        })
    end
end

-- ============================================================
-- REALTIME STATUS
-- ============================================================

CreateThread(function()
    while true do
        if hudVisible then
            sendStatus()
            Wait(Config.StatusRefresh or 150)
        else
            Wait(1000)
        end
    end
end)

-- ============================================================
-- PLAYER INFO / ONLINE
-- ============================================================

CreateThread(function()
    Wait(1500)

    sendPlayerInfo()
    TriggerServerEvent('gcr-hud:server:requestOnline')

    local lastOnlineRequest = 0

    while true do
        if hudVisible then
            sendPlayerInfo()

            local now = GetGameTimer()

            if now - lastOnlineRequest >= (Config.OnlineRefresh or 5000) then
                TriggerServerEvent('gcr-hud:server:requestOnline')
                lastOnlineRequest = now
            end
        end

        Wait(Config.PlayerInfoRefresh or 3000)
    end
end)

-- ============================================================
-- PVP / DAMAGE SUPPORT
--
-- Ini membantu pukulan dan tembakan antar-player bekerja.
-- Damage jatuh dan tabrakan tetap memakai sistem GTA/FiveM.
--
-- Tidak memaksa GetPlayerInvincible() menjadi false karena
-- bisa bentrok dengan admin mode / EMS / spawn protection.
-- ============================================================

CreateThread(function()
    while true do
        if Config.EnablePvpDamage then
            local ped = PlayerPedId()

            if ped ~= 0 and DoesEntityExist(ped) then
                SetCanAttackFriendly(ped, true, false)
                NetworkSetFriendlyFireOption(true)
            end
        end

        Wait(2000)
    end
end)

-- ============================================================
-- ZERO NEEDS DAMAGE (OPTIONAL)
-- ============================================================

CreateThread(function()
    while true do
        local settings = Config.ZeroNeedsDamage or {}
        local interval = tonumber(settings.Interval) or 10000

        if interval < 1000 then
            interval = 1000
        end

        Wait(interval)

        if settings.Enabled then
            if lastNeeds.hunger <= 0 or lastNeeds.thirst <= 0 then
                local ped = PlayerPedId()

                if ped ~= 0 and DoesEntityExist(ped) and not IsEntityDead(ped) then
                    local current = GetEntityHealth(ped)
                    local damage = tonumber(settings.Damage) or 5

                    if current > 101 then
                        SetEntityHealth(ped, math.max(101, current - damage))
                    end
                end
            end
        end
    end
end)

-- ============================================================
-- EVENTS
-- ============================================================

RegisterNetEvent('gcr-hud:client:setOnline', function(count)
    SendNUIMessage({
        action = 'online',
        count = tonumber(count) or 0
    })
end)

local function updateNeeds(hunger, thirst)
    lastNeeds.hunger = clamp(hunger, 0, 100)
    lastNeeds.thirst = clamp(thirst, 0, 100)

    PlayerData.metadata = PlayerData.metadata or {}
    PlayerData.metadata.hunger = lastNeeds.hunger
    PlayerData.metadata.thirst = lastNeeds.thirst

    SendNUIMessage({
        action = 'needs',
        hunger = round(lastNeeds.hunger),
        thirst = round(lastNeeds.thirst)
    })
end

RegisterNetEvent('gcr-hud:client:updateNeeds', function(hunger, thirst)
    updateNeeds(hunger, thirst)
end)

-- Kompatibel dengan qb-hud / qb-core event umum.
RegisterNetEvent('hud:client:UpdateNeeds', function(hunger, thirst)
    updateNeeds(hunger, thirst)
end)

RegisterNetEvent('hud:client:UpdateStress', function(stress)
    lastNeeds.stress = clamp(stress, 0, 100)

    PlayerData.metadata = PlayerData.metadata or {}
    PlayerData.metadata.stress = lastNeeds.stress

    SendNUIMessage({
        action = 'stress',
        stress = round(lastNeeds.stress)
    })
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData() or {}
    hudVisible = true

    SendNUIMessage({
        action = 'show'
    })

    Wait(500)

    sendPlayerInfo()
    sendStatus()

    TriggerServerEvent('gcr-hud:server:requestOnline')
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}

    lastNeeds.hunger = 100
    lastNeeds.thirst = 100
    lastNeeds.stress = 0

    SendNUIMessage({
        action = 'hide'
    })
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(job)
    PlayerData.job = job or {}
    sendPlayerInfo()
end)

RegisterNetEvent('QBCore:Client:OnGangUpdate', function(gang)
    PlayerData.gang = gang or {}
    sendPlayerInfo()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    if type(data) ~= 'table' then
        return
    end

    PlayerData = data
    sendPlayerInfo()
end)

-- ============================================================
-- HUD TOGGLE
-- ============================================================

RegisterCommand('togglehud', function()
    hudVisible = not hudVisible

    SendNUIMessage({
        action = hudVisible and 'show' or 'hide'
    })
end, false)

RegisterKeyMapping(
    'togglehud',
    'Toggle Grand Country HUD',
    'keyboard',
    Config.ToggleKey or 'F10'
)

-- ============================================================
-- DEBUG HEALTH
--
-- F8 -> checkhp
--
-- Kalau setelah jatuh / ditabrak / ditembak health internal
-- tetap 200 atau Invincible = true, berarti ada resource lain
-- seperti God Mode / spawn protection yang menahan damage.
-- ============================================================

RegisterCommand('checkhp', function()
    local ped = PlayerPedId()

    if ped == 0 or not DoesEntityExist(ped) then
        print('^1[GCR HUD] Ped tidak ditemukan.^7')
        return
    end

    print('^3========== GCR HEALTH DEBUG ==========^7')
    print('Internal Health :', GetEntityHealth(ped))
    print('Max Health      :', GetEntityMaxHealth(ped))
    print('HUD Health      :', getHealthPercent(ped))
    print('Armor           :', GetPedArmour(ped))
    print('Invincible      :', GetPlayerInvincible(PlayerId()))
    print('^3======================================^7')
end, false)
