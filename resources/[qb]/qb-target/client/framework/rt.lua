local QBCore, RTCore = exports['qb-core']:GetCoreObject(), exports['qb-core']:GetCoreObject()
local utils = require 'client.utils'

-- RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
--     PlayerData = QBCore.Functions.GetPlayerData()
--     SpawnPeds()
-- end)

-- RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
--     PlayerData = {}
--     DeletePeds()
-- end)

-- RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
--     PlayerData.job = JobInfo
-- end)

-- RegisterNetEvent('QBCore:Client:OnGangUpdate', function(GangInfo)
--     PlayerData.gang = GangInfo
-- end)

-- RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
--     PlayerData = val
-- end)

---@diagnostic disable-next-line: duplicate-set-field
function utils.hasPlayerGotGroup(filter)
    local PlayerData = QBCore.Functions.GetPlayerData()

    if type(filter) == 'table' then
        filter = filter[PlayerData.job.name]
        if filter and PlayerData.job.grade.level >= filter then
            return true
        end
    elseif filter == 'all' or filter == PlayerData.job.name then
        return true
    end
    return false
end

function utils.hasPlayerGotItems(filter, hasAny)
    if not filter then return false end

    local _type = type(filter)

    if _type == 'string' then
        return QBCore.Functions.HasItem(filter)
    elseif _type == 'table' then
        for _, item in pairs(filter) do
            local hasItem = false

            if type(item) == 'string' then
                hasItem = QBCore.Functions.HasItem(item)
            elseif type(item) == 'table' then
                for name, amount in pairs(item) do
                    hasItem = QBCore.Functions.HasItem(name, amount)
                end
            end

            if hasAny and hasItem then
                return true
            elseif not hasAny and not hasItem then
                return false
            end
        end
    end

    return not hasAny
end