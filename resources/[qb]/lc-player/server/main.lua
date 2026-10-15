local QBCore = exports['qb-core']:GetCoreObject()
local partners = {}
local cooldowns = {}

local function notify(id, msg, type)
    TriggerClientEvent('lcrp-interactions:client:notify',id,msg,type or 'primary')
end
local function validPair(a,b)
    a=tonumber(a);b=tonumber(b)
    if not a or not b or a==b or a<1 or b<1 then return false end
    if not QBCore.Functions.GetPlayer(a) or not QBCore.Functions.GetPlayer(b) then return false end
    local pa,pb=GetPlayerPed(a),GetPlayerPed(b)
    if pa==0 or pb==0 then return false end
    return #(GetEntityCoords(pa)-GetEntityCoords(pb)) <= 3.0
end
local function allowed(source)
    local now=GetGameTimer()
    if cooldowns[source] and now-cooldowns[source]<900 then return false end
    cooldowns[source]=now
    return true
end
local function stopCarry(source)
    local peer=partners[source]
    if not peer then return end
    partners[source]=nil
    if partners[peer]==source then partners[peer]=nil end
    TriggerClientEvent('lcrp-interactions:client:carryStop',source)
    TriggerClientEvent('lcrp-interactions:client:carryStop',peer)
end
RegisterNetEvent('lcrp-interactions:server:giveCash',function(target,amount)
    local src=source
    amount=tonumber(amount)
    if not allowed(src) or not validPair(src,target) then return end
    if not amount or amount~=math.floor(amount) or amount<1 or amount>1000000 then return notify(src,'Jumlah tidak valid (maksimal $1.000.000).','error') end
    local giver=QBCore.Functions.GetPlayer(src)
    local receiver=QBCore.Functions.GetPlayer(tonumber(target))
    if not giver or not receiver then return end
    if not giver.Functions.RemoveMoney('cash',amount,'lcrp-give-cash') then return notify(src,'Uang cash tidak cukup.','error') end
    if not receiver.Functions.AddMoney('cash',amount,'lcrp-receive-cash') then
        giver.Functions.AddMoney('cash',amount,'lcrp-give-cash-refund')
        return notify(src,'Transfer gagal; uang dikembalikan.','error')
    end
    notify(src,('Kamu memberi $%s cash.'):format(amount),'success')
    notify(tonumber(target),('Kamu menerima $%s cash.'):format(amount),'success')
end)
RegisterNetEvent('lcrp-interactions:server:sharePhone',function(target)
    local src=source
    if not allowed(src) or not validPair(src,target) then return end
    local sender=QBCore.Functions.GetPlayer(src)
    if not sender then return end
    local charinfo=sender.PlayerData.charinfo or {}
    local phone=charinfo.phone
    if not phone or tostring(phone)=='' then return notify(src,'Karakter kamu belum memiliki nomor HP.','error') end
    local name=('%s %s'):format(charinfo.firstname or 'Unknown',charinfo.lastname or '')
    notify(tonumber(target),('Nomor HP %s: %s'):format(name,phone),'success')
    notify(src,'Nomor HP berhasil dibagikan.','success')
end)
RegisterNetEvent('lcrp-interactions:server:toggleCarry',function(target)
    local src=source
    target=tonumber(target)
    if not allowed(src) then return end
    if partners[src] then return stopCarry(src) end
    if not validPair(src,target) then return notify(src,'Player harus berada di dekatmu.','error') end
    if partners[target] then return notify(src,'Player sedang digendong atau menggendong.','error') end
    if GetEntityHealth(GetPlayerPed(src)) <= 0 or GetEntityHealth(GetPlayerPed(target)) <= 0 then return end
    partners[src],partners[target]=target,src
    TriggerClientEvent('lcrp-interactions:client:carryStart',src,target,'carrier')
    TriggerClientEvent('lcrp-interactions:client:carryStart',target,src,'carried')
end)
RegisterNetEvent('lcrp-interactions:server:stopCarry',function()
    stopCarry(source)
end)
AddEventHandler('playerDropped',function()
    stopCarry(source)
    cooldowns[source]=nil
end)
