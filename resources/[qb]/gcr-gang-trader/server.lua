local QBCore = exports['qb-core']:GetCoreObject()
local cooldowns = {}

local function notify(src, msg, kind)
    TriggerClientEvent('gcr-gang-trader:client:notify', src, msg, kind)
end

RegisterNetEvent('gcr-gang-trader:server:exchange', function()
    local src = source
    local player = QBCore.Functions.GetPlayer(src)
    if not player then return end
    local gang = player.PlayerData.gang and player.PlayerData.gang.name
    if not gang or gang == 'none' or gang == 'unaffiliated'
       or (next(Config.AllowedGangs) and not Config.AllowedGangs[gang]) then
        return notify(src, 'Hanya anggota gang yang bisa bertukar.', 'error')
    end
    local ped = GetPlayerPed(src)
    if ped == 0 or #(GetEntityCoords(ped) - vector3(Config.NPC.coords.x, Config.NPC.coords.y, Config.NPC.coords.z)) > Config.MaxDistance then
        return notify(src, 'Terlalu jauh dari NPC.', 'error')
    end
    local now = os.time()
    if cooldowns[src] and now - cooldowns[src] < Config.CooldownSeconds then return end
    cooldowns[src] = now

    local item = player.Functions.GetItemByName(Config.RequiredItem)
    if not item or item.amount < Config.AmountPerTrade then
        return notify(src, 'Paket RP kamu tidak cukup.', 'error')
    end
    if not exports['qb-inventory']:RemoveItem(src, Config.RequiredItem, Config.AmountPerTrade, false, 'gcr-gang-trader-exchange') then
        return notify(src, 'Gagal mengambil paket.', 'error')
    end
    if not exports['qb-inventory']:AddItem(src, Config.RewardItem, Config.RewardPerTrade, false, false, 'gcr-gang-trader-reward') then
        -- Best-effort rollback; alert admin if inventory is full on rollback.
        if not exports['qb-inventory']:AddItem(src, Config.RequiredItem, Config.AmountPerTrade, false, false, 'gcr-gang-trader-rollback') then
            print(('[gcr-gang-trader] WARNING rollback failed for player %s'):format(src))
        end
        return notify(src, 'Inventory penuh. Tukar gagal.', 'error')
    end
    notify(src, ('Berhasil tukar %s paket menjadi %s token merah.'):format(Config.AmountPerTrade, Config.RewardPerTrade), 'success')
end)

AddEventHandler('playerDropped', function()
    cooldowns[source] = nil
end)
