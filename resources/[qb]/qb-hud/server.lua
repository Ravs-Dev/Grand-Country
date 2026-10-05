local QBCore = exports['qb-core']:GetCoreObject()

local function clamp(value, minValue, maxValue)
    value = tonumber(value) or 0
    if value < minValue then return minValue end
    if value > maxValue then return maxValue end
    return value
end

local function sanitizeInjuries(data)
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

QBCore.Functions.CreateCallback('gcr-hud:server:getPlayerCount', function(_, cb)
    cb(#GetPlayers())
end)

RegisterNetEvent('gcr-hud:server:setInjuries', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    Player.Functions.SetMetaData('injuries', sanitizeInjuries(data))
end)

local function gainStress(src, amount)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local metadata = Player.PlayerData.metadata or {}
    local current = tonumber(metadata.stress) or 0
    local value = math.floor(clamp(current + math.abs(tonumber(amount) or 0), 0, 100))

    Player.Functions.SetMetaData('stress', value)
    TriggerClientEvent('hud:client:UpdateStress', src, value)
end

local function relieveStress(src, amount)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end

    local metadata = Player.PlayerData.metadata or {}
    local current = tonumber(metadata.stress) or 0
    local value = math.floor(clamp(current - math.abs(tonumber(amount) or 0), 0, 100))

    Player.Functions.SetMetaData('stress', value)
    TriggerClientEvent('hud:client:UpdateStress', src, value)
end

-- Standard qb-hud compatible event names.
RegisterNetEvent('hud:server:GainStress', function(amount)
    gainStress(source, amount)
end)

RegisterNetEvent('hud:server:RelieveStress', function(amount)
    relieveStress(source, amount)
end)

-- GCR aliases, useful for your own resources.
RegisterNetEvent('gcr-hud:server:GainStress', function(amount)
    gainStress(source, amount)
end)

RegisterNetEvent('gcr-hud:server:RelieveStress', function(amount)
    relieveStress(source, amount)
end)
