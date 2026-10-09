local QBCore = exports['qb-core']:GetCoreObject()
local npc

CreateThread(function()
    local hash = joaat(Config.NPC.model)
    RequestModel(hash)
    while not HasModelLoaded(hash) do Wait(100) end
    local c = Config.NPC.coords
    npc = CreatePed(4, hash, c.x, c.y, c.z - 1.0, c.w, false, true)
    SetEntityInvincible(npc, true)
    FreezeEntityPosition(npc, true)
    SetBlockingOfNonTemporaryEvents(npc, true)
    TaskStartScenarioInPlace(npc, 'WORLD_HUMAN_CLIPBOARD', 0, true)
    SetModelAsNoLongerNeeded(hash)

    exports['qb-target']:AddTargetEntity(npc, {
        options = {{
            icon = 'fas fa-box-open',
            label = 'Tukar Paket RP',
            action = function()
                TriggerServerEvent('gcr-gang-trader:server:exchange')
            end,
            canInteract = function()
                local data = QBCore.Functions.GetPlayerData()
                local gang = data.gang and data.gang.name
                return gang ~= nil and gang ~= 'none' and gang ~= 'unaffiliated'
                    and (not next(Config.AllowedGangs) or Config.AllowedGangs[gang] == true)
            end
        }},
        distance = 2.0
    })
end)

RegisterNetEvent('gcr-gang-trader:client:notify', function(message, kind)
    QBCore.Functions.Notify(message, kind or 'primary')
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() and npc and DoesEntityExist(npc) then
        DeleteEntity(npc)
    end
end)
