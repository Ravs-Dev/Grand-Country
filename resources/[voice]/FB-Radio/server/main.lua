local channels = {}
local jammer = {}
local batteryData = {}
local spawnedDefaultJammer = false

RegisterNetEvent('FB-Radio:server:consumeBattery', function(data)
    for i=1, #data do
        local id = data[i]
        if not batteryData[id] then batteryData[id] = 100 end
        local battery = batteryData[id] - Shared.Battery.consume
        batteryData[id] = math.max(battery, 0)
        if batteryData[id] == 0 then
            TriggerClientEvent('FB-Radio:client:nocharge', source)
        end
    end
end)

RegisterNetEvent('FB-Radio:server:rechargeBattery', function()
    local src = source
    local player = Framework.core.GetPlayer(src)
    for i=1, #Shared.RadioItem do
        local item = player.getItem(Shared.RadioItem[i])
        if item then
            local id = item.metadata?.radioId or false
            if not id then return end
            batteryData[id] = 100
            player.removeItem('radiocell', 1)
            break
        end
    end
end)

RegisterNetEvent('FB-Radio:server:spawnobject', function(data)
    local src = source
	CreateThread(function()
		local entity = CreateObject(joaat(Shared.Jammer.model), data.coords.x, data.coords.y, data.coords.z, true, true, false)
		while not DoesEntityExist(entity) do Wait(50) end
		SetEntityHeading(entity, data.coords.w)
        local netobj = NetworkGetNetworkIdFromEntity(entity)
        if data.canRemove then
            local player = Framework.core.GetPlayer(src)
            player.removeItem('jammer', 1)
        end
        TriggerClientEvent('FB-Radio:client:syncobject', -1, {
            enable = true,
            object = netobj,
            coords = data.coords,
            id = data.id,
            range = data.range or Shared.Jammer.range.default,
            allowedChannels = data.allowedChannels or {},
            canRemove = data.canRemove,
            canDamage = data.canDamage
        })
        jammer[#jammer+1] = {
            enable = true,
            entity = entity,
            id = data.id,
            coords = data.coords,
            range = data.range or Shared.Jammer.range.default,
            allowedChannels = data.allowedChannels or {},
            canRemove = data.canRemove,
            canDamage = data.canDamage
        }
	end)
end)

RegisterNetEvent('FB-Radio:server:togglejammer', function(id)
    for i=1, #jammer do
        local entity = jammer[i]
        if entity.id == id then
            jammer[i].enable = not jammer[i].enable
            TriggerClientEvent('FB-Radio:client:togglejammer', -1, id, jammer[i].enable)
            break
        end
    end
end)

RegisterNetEvent('FB-Radio:server:removejammer', function(id, isDamaged)
    local src = source
	CreateThread(function()
        for i=1, #jammer do
            local entity = jammer[i]
            if entity.id == id then
                DeleteEntity(entity.entity)
                TriggerClientEvent('FB-Radio:client:removejammer', -1, id)
                table.remove(jammer, i)
                if not isDamaged then
                    local player = Framework.core.GetPlayer(src)
                    player.addItem('jammer', 1)
                end
                break
            end
        end
	end)
end)

RegisterNetEvent('FB-Radio:server:changeJammerRange', function(id, range)
    for i=1, #jammer do
        local entity = jammer[i]
        if entity.id == id then
            jammer[i].range = range
            TriggerClientEvent('FB-Radio:client:changeJammerRange', -1, id, range)
            break
        end
    end
end)


RegisterNetEvent('FB-Radio:server:removeallowedchannel', function(id, allowedChannels)
    for i=1, #jammer do
        local entity = jammer[i]
        if entity.id == id then
            jammer[i].allowedChannels = allowedChannels
            TriggerClientEvent('FB-Radio:client:removeallowedchannel', -1, id, allowedChannels)
            break
        end
    end
end)

RegisterNetEvent('FB-Radio:server:addallowedchannel', function(id, allowedChannels)
    for i=1, #jammer do
        local entity = jammer[i]
        if entity.id == id then
            jammer[i].allowedChannels = allowedChannels
            TriggerClientEvent('FB-Radio:client:addallowedchannel', -1, id, allowedChannels)
            break
        end
    end
end)

RegisterNetEvent('FB-Radio:server:addToRadioChannel', function(channel, username)
    local src = source
    if not channels[channel] then
        channels[channel] = {}
    end
    channels[channel][tostring(src)] = {name = username, isTalking = false}
    TriggerClientEvent('FB-Radio:client:radioListUpdate', -1, channels[channel], channel)
end)

RegisterNetEvent('FB-Radio:server:changeMetaRadio', function(channel)
    local src = source
    channel = normalizeChannel(channel) or 0
    setPlayerRadioMeta(src, channel)
end)

RegisterNetEvent('FB-Radio:server:removeFromRadioChannel', function(channel)
    local src = source

    if not channels[channel] then return end
    channels[channel][tostring(src)] = nil
    TriggerClientEvent('FB-Radio:client:radioListUpdate', -1, channels[channel], channel)
end)

AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then return end
    for i=1, #jammer do
        DeleteEntity(jammer[i].entity)
    end
    jammer = {}
    SaveResourceFile(GetCurrentResourceName(), 'battery.json', json.encode(batteryData), -1)
end)

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then return end
    batteryData = json.decode(LoadResourceFile(GetCurrentResourceName(), 'battery.json')) or {}
end)

AddEventHandler("playerDropped", function()
    local plyid = source
    for id, channel in pairs (channels) do
        if channel[tostring(plyid)] then
            channels[id][tostring(plyid)] = nil
            TriggerClientEvent('FB-Radio:client:radioListUpdate', -1, channels[id], id)
            break
        end
    end
end)

RegisterNetEvent("FB-Radio:server:createdefaultjammer", function()
    if spawnedDefaultJammer then return end
    for i=1, #Shared.Jammer.default do
        local data = Shared.Jammer.default[i]
        TriggerEvent('FB-Radio:server:spawnobject', {
            coords = data.coords,
            id = data.id,
            range = data.range,
            allowedChannels = data.allowedChannels,
            canRemove = false,
            canDamage = data.canDamage
        })
    end
    spawnedDefaultJammer = true
end)

local function SetRadioData(src, slot)
    local player = Framework.core.GetPlayer(src)
    local radioId = player.id .. math.random(1000, 9999)
    if Shared.Inventory == 'ox' then
        exports.ox_inventory:SetMetadata(src, slot, { radioId = radioId })
        return radioId
    elseif Shared.Inventory == 'qb' or Shared.Inventory == 'ps' then
        local items = player.items
        local item = items[slot]
        if item  then
            item.info = item.info or {}
            item.info.radioId = radioId
            local invResourceName = exports.bl_bridge:getFramework('inventory')
            exports[invResourceName]:SetInventory(src, items)
            return radioId
        end
        return false
    elseif Shared.Inventory == 'qs' then
        exports['qs-inventory']:SetItemMetadata(src, slot, { radioId = radioId })
        return radioId
    else
        return false
    end
end

lib.callback.register('FB-Radio:server:getradiodata', function(src)
    return 100, nil
end)


lib.callback.register('FB-Radio:server:getbatterydata', function(source)
    if not Shared.Inventory or not Shared.Battery.state then return 100 end
    local battery = 100
    local player = Framework.core.GetPlayer(source)
    for _, slotData in pairs(player.items) do
        if slotData and lib.table.contains(Shared.RadioItem, slotData.name) then
            local item = slotData
            local id = false
            if not item.metadata?.radioId then
                id = SetRadioData(source, item.slot)
            else
                id = item.metadata?.radioId
            end
            battery = id and batteryData[id] or 100
            break
        end
    end
    return battery
end)

lib.callback.register('FB-Radio:server:getjammer', function()
    return jammer
end)

if Shared.UseCommand or not Shared.Inventory then
    if not Shared.Ready then return end
    lib.addCommand('radio', {
        help = 'Open Radio Menu',
        params = {},
    }, function(source)
        TriggerClientEvent('FB-Radio:client:use', source, 100)
    end)
    lib.addCommand('jammer', {
        help = 'Setup Jammer',
        params = {},
    }, function(source)
        TriggerClientEvent('FB-Radio:client:usejammer', source)
    end)
    lib.addCommand('rechargeradio', {
        help = 'Recharge Radio Battery',
        params = {},
    }, function(source)
        TriggerClientEvent('FB-Radio:client:recharge', source)
    end)
end

lib.addCommand('remradiodata', {
    help = 'Remove Radio Data',
    params = {},
}, function(source)
    TriggerClientEvent('FB-Radio:client:removedata', source)
end)

lib.versionCheck('SOH69/FB-Radio')

if Shared.Ready then
    for i=1, #Shared.RadioItem do
        Framework.core.RegisterUsableItem(Shared.RadioItem[i], function(source)
            TriggerClientEvent('FB-Radio:client:use', source)
        end)
    end

    if Shared.Jammer.state then
        Framework.core.RegisterUsableItem('jammer', function(source)
            TriggerClientEvent('FB-Radio:client:usejammer', source)
        end)
    end

    if Shared.Battery.state then
        Framework.core.RegisterUsableItem('radiocell', function(source)
            TriggerClientEvent('FB-Radio:client:recharge', source)
        end)
    end
else
    return error('Cannot Start Resource, MISSING DEPENDENCIES', 0)
end

local QBCore = exports['qb-core']:GetCoreObject()

local PlayersRadio = {}
local function Contains(tbl, val)
    if not tbl then return false end
    for _, v in pairs(tbl) do
        if v == val then return true end
    end
    return false
end

local function GetPlayerGangName(Player)
    if not Player then return nil end
    local g = Player.PlayerData and Player.PlayerData.gang
    if g and g.name then return g.name end
    return nil
end

local function GetPlayerJob(Player)
    if not Player then return nil end
    local j = Player.PlayerData and Player.PlayerData.job
    if not j then return nil end
    return j.name, j.onduty, j.grade
end

local function HasExtraFrequencies(src)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return false end

    if exports['RespectInventory'] and exports['RespectInventory'].HasItem then
        local ok, res = pcall(function()
            return exports['RespectInventory']:HasItem(src, "extraradio", 1)
        end)
        if ok then return res == true end
    end

    local item = Player.Functions.GetItemByName("extraradio")
    if item and item.amount and item.amount >= 1 then
        return true
    end

    return false
end

local function ValidateChannel(src, channel)
    if not channel then
        return false, 'invalid'
    end

    local num = tonumber(channel)
    if not num then
        return false, 'invalid'
    end

    local ch = math.floor(num)
    if ch < 1 then
        return false, 'invalid'
    end

    if Shared and Shared.MaxFrequency and ch > Shared.MaxFrequency then
        local hasExtra = HasExtraFrequencies(src)
        if (not hasExtra) or ch > 1000 then
            return false, 'invalid'
        end
    end

    if Shared and Shared.RestrictedChannels and Shared.RestrictedChannels[ch] then
        local rule = Shared.RestrictedChannels[ch]
        local rType = rule.type
        local names = rule.name

        local Player = QBCore.Functions.GetPlayer(src)
        if not Player then
            return false, 'restricted'
        end

        local jobName, onDuty, grade = GetPlayerJob(Player)
        local gangName = GetPlayerGangName(Player)

        if ch < 9 and jobName == 'justice' then
            local gLevel = nil
            if grade and grade.level ~= nil then gLevel = grade.level end
            if gLevel and gLevel <= 6 then
                return false, 'restricted'
            end
        end

        if rType == 'job' then
            if jobName and Contains(names, jobName) then
                return true, 'ok'
            end
            return false, 'restricted'
        elseif rType == 'gang' then
            if gangName and Contains(names, gangName) then
                return true, 'ok'
            end
            return false, 'restricted'
        else
            return false, 'restricted'
        end
    end

    return true, 'ok'
end

QBCore.Functions.CreateCallback('FB-Radio:server:canJoinChannel', function(source, cb, channel)
    local ok, reason = ValidateChannel(source, channel)
    cb(ok, reason)
end)

RegisterNetEvent('FB-Radio:server:setRadioData', function(channel, isOnRadio)
    local src = source
    local ok, reason = ValidateChannel(src, channel)

    if not ok then
        TriggerClientEvent('FB-Radio:client:joinDenied', src, channel, reason)
        return
    end

    PlayersRadio[src] = PlayersRadio[src] or {}
    PlayersRadio[src].channel = math.floor(tonumber(channel))
    PlayersRadio[src].isOnRadio = isOnRadio == true

    TriggerClientEvent('FB-Radio:client:syncRadioData', -1, src, PlayersRadio[src])
end)

RegisterNetEvent('FB-Radio:server:clearRadioData', function()
    local src = source
    PlayersRadio[src] = nil
    TriggerClientEvent('FB-Radio:client:syncRadioData', -1, src, nil)
end)

QBCore.Functions.CreateCallback('FB-Radio:server:getAllRadioData', function(source, cb)
    cb(PlayersRadio)
end)

AddEventHandler('playerDropped', function()
    local src = source
    PlayersRadio[src] = nil
    TriggerClientEvent('FB-Radio:client:syncRadioData', -1, src, nil)
end)

RegisterNetEvent('QBCore:Server:OnPlayerUnload', function(src)
    local id = src or source
    PlayersRadio[id] = nil
    TriggerClientEvent('FB-Radio:client:syncRadioData', -1, id, nil)
end)