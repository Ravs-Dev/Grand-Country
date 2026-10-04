local QBCore = exports['qb-core']:GetCoreObject()

local function getQBPlayers()
    if QBCore.Functions.GetQBPlayers then
        return QBCore.Functions.GetQBPlayers()
    end

    local result = {}
    if QBCore.Functions.GetPlayers then
        for _, src in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(src)
            if Player then
                result[src] = Player
            end
        end
    end

    return result
end

local function getOnlineCount()
    local count = 0
    for _ in pairs(getQBPlayers()) do
        count = count + 1
    end
    return count
end

RegisterNetEvent('gcr-hud:server:requestOnline', function()
    TriggerClientEvent('gcr-hud:client:setOnline', source, getOnlineCount())
end)

-- Fallback needs system.
-- Ini yang memastikan hunger / thirst benar-benar turun walaupun resource HUD lama dimatikan.
CreateThread(function()
    while true do
        Wait(Config.NeedsDecay.Interval)

        if Config.NeedsDecay.Enabled then
            local players = getQBPlayers()

            for _, Player in pairs(players) do
                if Player and Player.PlayerData then
                    local metadata = Player.PlayerData.metadata or {}
                    local oldHunger = tonumber(metadata.hunger) or 100.0
                    local oldThirst = tonumber(metadata.thirst) or 100.0

                    local hunger = math.max(0.0, math.min(100.0, oldHunger - Config.NeedsDecay.HungerDecrease))
                    local thirst = math.max(0.0, math.min(100.0, oldThirst - Config.NeedsDecay.ThirstDecrease))

                    Player.Functions.SetMetaData('hunger', hunger)
                    Player.Functions.SetMetaData('thirst', thirst)

                    local src = Player.PlayerData.source
                    if src then
                        TriggerClientEvent('gcr-hud:client:updateNeeds', src, hunger, thirst)
                    end
                end
            end
        end
    end
end)
