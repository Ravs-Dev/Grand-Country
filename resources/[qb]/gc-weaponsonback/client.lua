local QBCore = exports['qb-core']:GetCoreObject()
local objects = {}
local loaded = false
local lastPed = 0

local function debugLog(...)
    if Config.Debug then print('[weaponsonback]', ...) end
end

local function deleteProp(key)
    local record = objects[key]
    if not record then return end
    if record.entity and DoesEntityExist(record.entity) then
        SetEntityAsMissionEntity(record.entity, true, true)
        DeleteObject(record.entity)
        if DoesEntityExist(record.entity) then DeleteEntity(record.entity) end
    end
    objects[key] = nil
end

local function clearAll()
    local keys = {}
    for k in pairs(objects) do keys[#keys + 1] = k end
    for _, k in ipairs(keys) do deleteProp(k) end
end

local function makeProp(ped, key, item, slotName)
    local slot = Config.Slots[slotName]
    if not slot then return false end
    local hash = joaat(item.model)
    if not IsModelInCdimage(hash) or not IsModelValid(hash) then
        debugLog('Invalid model for', key, item.model)
        return false
    end

    RequestModel(hash)
    local deadline = GetGameTimer() + 2000
    while not HasModelLoaded(hash) and GetGameTimer() < deadline do Wait(0) end
    if not HasModelLoaded(hash) then
        debugLog('Model timed out', key)
        return false
    end

    if not DoesEntityExist(ped) or not loaded then
        SetModelAsNoLongerNeeded(hash)
        return false
    end

    local at = GetEntityCoords(ped)
    -- Networked object: other players can see the player's stowed item.
    local entity = CreateObject(hash, at.x, at.y, at.z, true, true, false)
    SetModelAsNoLongerNeeded(hash)
    if not entity or entity == 0 or not DoesEntityExist(entity) then return false end

    SetEntityCollision(entity, false, false)
    SetEntityCompletelyDisableCollision(entity, true, false)
    SetEntityAsMissionEntity(entity, true, true)
    AttachEntityToEntity(entity, ped, GetPedBoneIndex(ped, slot.bone),
        slot.pos.x, slot.pos.y, slot.pos.z,
        slot.rot.x, slot.rot.y, slot.rot.z,
        false, false, false, false, 2, true)

    objects[key] = { entity = entity, ped = ped, slot = slotName }
    return true
end

local function getPlayerItems()
    local playerData = QBCore.Functions.GetPlayerData()
    if not playerData then return nil end
    return playerData.items or {}
end

local function reconcile()
    local ped = PlayerPedId()
    if ped == 0 or not DoesEntityExist(ped) then
        clearAll()
        return
    end
    if lastPed ~= ped then
        clearAll()
        lastPed = ped
    end

    if not loaded or IsEntityDead(ped) or (Config.HideInVehicles and IsPedInAnyVehicle(ped, false)) then
        clearAll()
        return
    end

    local items = getPlayerItems()
    if not items then clearAll() return end

    local selected = GetSelectedPedWeapon(ped)
    local needed = {}
    local occupied = {}

    -- QBCore items: inventory is authoritative. Do not display removed items.
    -- The selected ped equipment is never also shown as a cosmetic model.
    for _, inv in pairs(items) do
        if type(inv) == 'table' and type(inv.name) == 'string' and (tonumber(inv.amount) or 0) > 0 then
            local name = inv.name:lower()
            local def = Config.Items[name]
            if def and joaat(name:upper()) ~= selected and not needed[name] then
                local preferred = def.slot
                local slot = preferred
                if occupied[slot] then
                    if slot == 'back' and not occupied.back2 then slot = 'back2'
                    elseif slot == 'hip' and not occupied.hip2 then slot = 'hip2'
                    else slot = nil end
                end
                if slot and Config.Slots[slot] then
                    occupied[slot] = true
                    needed[name] = { def = def, slot = slot }
                end
            end
        end
    end

    for key, record in pairs(objects) do
        local need = needed[key]
        if not need or record.slot ~= need.slot or record.ped ~= ped
            or not DoesEntityExist(record.entity) or not IsEntityAttachedToEntity(record.entity, ped) then
            deleteProp(key)
        end
    end

    for key, need in pairs(needed) do
        if not objects[key] then makeProp(ped, key, need.def, need.slot) end
    end
end

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    loaded = true
    clearAll()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    loaded = false
    clearAll()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    -- Keep props in sync promptly when qb-inventory alters item counts.
    if data and data.citizenid then loaded = true end
end)

CreateThread(function()
    Wait(1000)
    local data = QBCore.Functions.GetPlayerData()
    loaded = data and data.citizenid ~= nil or false
    while true do
        reconcile()
        Wait(math.max(100, tonumber(Config.UpdateInterval) or 300))
    end
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then clearAll() end
end)
