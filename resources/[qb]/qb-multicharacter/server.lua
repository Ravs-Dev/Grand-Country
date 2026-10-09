local QBCore = exports['qb-core']:GetCoreObject()
local preloaded = {}
local pending = {}
local function decode(value)
    if type(value) == 'table' then return value end
    if type(value) ~= 'string' then return {} end
    local ok, data = pcall(json.decode, value)
    return (ok and type(data) == 'table') and data or {}
end
local function licenseOf(src)
    return QBCore.Functions.GetIdentifier(src, 'license')
end
local function maxSlots(src)
    local id = licenseOf(src)
    for _, v in ipairs(Config.PlayersNumberOfCharacters) do
        if v.license == id then return math.max(1, math.min(10, tonumber(v.numberOfChars) or 5)) end
    end
    return math.max(1, math.min(10, Config.DefaultNumberOfCharacters))
end
local function owns(src, citizenid)
    if type(citizenid) ~= 'string' or citizenid == '' then return false end
    return (MySQL.scalar.await('SELECT COUNT(*) FROM players WHERE citizenid = ? AND license = ?', {citizenid, licenseOf(src)}) or 0) > 0
end
local function notify(src, message, level)
    TriggerClientEvent('QBCore:Notify', src, message, level or 'error')
end
local function sendChars(src)
    local lic = licenseOf(src)
    if not lic then return end
    local rows = MySQL.query.await('SELECT citizenid,cid,charinfo,money,job,position FROM players WHERE license = ? ORDER BY cid ASC', {lic}) or {}
    for _, r in ipairs(rows) do
        r.charinfo = decode(r.charinfo)
        r.money = decode(r.money)
        r.job = decode(r.job)
    end
    TriggerClientEvent('gcr-multicharacter:client:characters', src, rows, maxSlots(src), Config.EnableDeleteButton)
end
QBCore.Functions.CreateCallback('gcr-multicharacter:server:getCharacters', function(src, cb)
    local lic = licenseOf(src)
    if not lic then cb({}, maxSlots(src), Config.EnableDeleteButton); return end
    local rows = MySQL.query.await('SELECT citizenid,cid,charinfo,money,job,position FROM players WHERE license = ? ORDER BY cid ASC', {lic}) or {}
    for _, r in ipairs(rows) do
        r.charinfo = decode(r.charinfo)
        r.money = decode(r.money)
        r.job = decode(r.job)
    end
    cb(rows, maxSlots(src), Config.EnableDeleteButton)
end)
QBCore.Functions.CreateCallback('gcr-multicharacter:server:getSkin', function(src, cb, citizenid)
    if not owns(src, citizenid) then cb(nil, nil); return end
    local rows = MySQL.query.await('SELECT model,skin FROM playerskins WHERE citizenid = ? ORDER BY active DESC, id DESC LIMIT 1', {citizenid}) or {}
    cb(rows[1] and rows[1].model or nil, rows[1] and rows[1].skin or nil)
end)
AddEventHandler('QBCore:Server:PlayerLoaded', function(Player)
    if Player and Player.PlayerData then preloaded[Player.PlayerData.source] = true end
end)
AddEventHandler('QBCore:Server:OnPlayerUnload', function(src) preloaded[src] = nil end)
AddEventHandler('playerDropped', function() preloaded[source] = nil; pending[source] = nil end)
local function waitLoad(src)
    local t = GetGameTimer() + 12000
    while not preloaded[src] and GetGameTimer() < t do Wait(100) end
end
local function loadHouses(src)
    if GetResourceState('qb-houses') ~= 'started' then return end
    local houseGarages, houses = {}, {}
    local ok, rows = pcall(function() return MySQL.query.await('SELECT * FROM houselocations', {}) end)
    if not ok then return end
    for _, h in ipairs(rows or {}) do
        local garage = decode(h.garage)
        houses[h.name] = {coords = decode(h.coords), owned = tonumber(h.owned) == 1, price = h.price,
            locked = true, adress = h.label, tier = h.tier, garage = garage, decorations = {}}
        houseGarages[h.name] = {label = h.label, takeVehicle = garage}
    end
    TriggerClientEvent('qb-garages:client:houseGarageConfig', src, houseGarages)
    TriggerClientEvent('qb-houses:client:setHouseConfig', src, houses)
end
local function starterItems(src)
    local p = QBCore.Functions.GetPlayer(src)
    if not p then return end
    local items = (QBCore.Shared and QBCore.Shared.StarterItems) or {}
    for _, v in pairs(items) do
        local meta = {}
        if v.item == 'id_card' then
            local i = p.PlayerData.charinfo
            meta = {citizenid = p.PlayerData.citizenid, firstname = i.firstname, lastname = i.lastname,
                birthdate = i.birthdate, gender = i.gender, nationality = i.nationality}
        elseif v.item == 'driver_license' then
            local i = p.PlayerData.charinfo
            meta = {firstname = i.firstname, lastname = i.lastname, birthdate = i.birthdate, type = 'Class C Driver License'}
        end
        if GetResourceState('qb-inventory') == 'started' then
            exports['qb-inventory']:AddItem(src, v.item, v.amount, false, meta, 'gcr-multicharacter:starter')
        end
    end
end
local function launchSpawn(src, data, isNew)
    QBCore.Commands.Refresh(src)
    loadHouses(src)
    if isNew and GetResourceState('qb-apartments') == 'started' then
        TriggerClientEvent('gcr-multicharacter:client:finish', src, 'apartment', data, true)
    elseif Config.SkipSelection and not isNew then
        TriggerClientEvent('gcr-multicharacter:client:finish', src, 'last', data, false)
    elseif GetResourceState('qb-spawn') == 'started' then
        TriggerClientEvent('gcr-multicharacter:client:finish', src, 'spawn', data, isNew)
    else
        TriggerClientEvent('gcr-multicharacter:client:finish', src, 'default', data, isNew)
    end
    if isNew then starterItems(src) end
end
RegisterNetEvent('gcr-multicharacter:server:select', function(citizenid)
    local src = source
    if pending[src] or not owns(src, citizenid) then notify(src, 'Character not found.'); return end
    pending[src] = true
    if QBCore.Player.Login(src, citizenid) then
        waitLoad(src)
        local p = QBCore.Functions.GetPlayer(src)
        launchSpawn(src, p and p.PlayerData or {}, false)
    else
        notify(src, 'Could not load character.'); sendChars(src)
    end
    pending[src] = nil
end)
RegisterNetEvent('gcr-multicharacter:server:create', function(data)
    local src = source
    if pending[src] or type(data) ~= 'table' then return end
    local firstname = tostring(data.firstname or ''):sub(1,32)
    local lastname = tostring(data.lastname or ''):sub(1,32)
    local birthdate = tostring(data.birthdate or ''):sub(1,16)
    local nationality = tostring(data.nationality or ''):sub(1,32)
    local gender = tonumber(data.gender)
    if not firstname:match('^[%a%s%-]+$') or not lastname:match('^[%a%s%-]+$') or
       #firstname < 2 or #lastname < 2 or not birthdate:match('^%d%d%d%d%-%d%d%-%d%d$') or
       #nationality < 2 or (gender ~= 0 and gender ~= 1) then
        notify(src, 'Check character information.'); return
    end
    local id = licenseOf(src)
    if not id then return end
    local slots = maxSlots(src)
    local rows = MySQL.query.await('SELECT cid FROM players WHERE license = ?', {id}) or {}
    if #rows >= slots then notify(src, 'All character slots are occupied.'); return end
    local used = {}
    for _, r in ipairs(rows) do used[tonumber(r.cid)] = true end
    local slot
    for i=1, slots do if not used[i] then slot = i; break end end
    if not slot then return end
    pending[src] = true
    local newData = {cid = slot, charinfo = {firstname = firstname, lastname = lastname,
        birthdate = birthdate, nationality = nationality, gender = gender}}
    if QBCore.Player.Login(src, false, newData) then
        waitLoad(src)
        local p = QBCore.Functions.GetPlayer(src)
        launchSpawn(src, p and p.PlayerData or newData, true)
    else
        notify(src, 'Could not create character.'); sendChars(src)
    end
    pending[src] = nil
end)
RegisterNetEvent('gcr-multicharacter:server:delete', function(citizenid)
    local src = source
    if pending[src] or not Config.EnableDeleteButton or not owns(src, citizenid) then return end
    QBCore.Player.DeleteCharacter(src, citizenid)
    sendChars(src)
end)
RegisterNetEvent('gcr-multicharacter:server:disconnect', function()
    DropPlayer(source, 'Disconnected from character menu')
end)
QBCore.Commands.Add('logout', 'Return to character selection', {}, false, function(src)
    QBCore.Player.Logout(src)
    TriggerClientEvent('qb-multicharacter:client:chooseChar', src)
end, 'admin')
