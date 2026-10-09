local QBCore = exports['qb-core']:GetCoreObject()


RegisterNetEvent('RespectTarget:server:giveCash', function(targetId, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    local Target = QBCore.Functions.GetPlayer(targetId)

    if not Player or not Target then return end

    if amount <= 0 then
        TriggerClientEvent('QBCore:Notify', src, 'المبلغ غير صحيح', 'error')
        return
    end

    local playerCash = Player.PlayerData.money.cash

    if playerCash >= amount then
        Player.Functions.RemoveMoney('cash', amount)
        Target.Functions.AddMoney('cash', amount)

        TriggerClientEvent('QBCore:Notify', src, 'تم اعطاء $' .. amount, 'success')
        TriggerClientEvent('QBCore:Notify', targetId, 'استلمت $' .. amount, 'success')

        TriggerClientEvent('RespectTarget:client:payAnimation', src)
        TriggerClientEvent('RespectTarget:client:payAnimation', targetId)
    else
        TriggerClientEvent('QBCore:Notify', src, 'ليس لديك مبلغ كافي', 'error')
    end
end)


-- RegisterNetEvent('RespectTarget:server:stealCash', function(targetId)
--     local src = source
--     local Player = QBCore.Functions.GetPlayer(src)
--     local Target = QBCore.Functions.GetPlayer(targetId)

--     if not Player or not Target then return end

--     local targetCash = Target.PlayerData.money.cash

--     if targetCash > 0 then
--         Target.Functions.RemoveMoney('cash', targetCash)
--         Player.Functions.AddMoney('cash', targetCash)

--     else
--     end
-- end)


QBCore.Functions.CreateCallback('RespectTarget:server:getPlayerInventory', function(source, cb, targetId)
    local Target = QBCore.Functions.GetPlayer(targetId)

    if Target then
        cb(Target.PlayerData.items)
    else
        cb(nil)
    end
end)


QBCore.Functions.CreateCallback('RespectTarget:server:canFlipVehicle', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player then
        cb(true)
    else
        cb(false)
    end
end)