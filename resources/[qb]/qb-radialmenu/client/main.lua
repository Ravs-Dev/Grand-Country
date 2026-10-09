local QBCore = exports['qb-core']:GetCoreObject()

local PlayerData = {}
local radialOpen = false
local actionMap = {}
local dynamicOptions = {}
local optionCounter = 0
local handsUp = false
local pointing = false
local activeAnim = nil
local windowStates = {}

local function debugPrint(...)
    if Config.Debug then
        print('^3[qb-radialmenu:gcr]^7', ...)
    end
end

local function deepCopy(value)
    if type(value) ~= 'table' then return value end
    local copy = {}
    for k, v in pairs(value) do
        copy[deepCopy(k)] = deepCopy(v)
    end
    return copy
end

local function resourceStarted(name)
    if not name or name == '' then return true end
    local state = GetResourceState(name)
    return state == 'started' or state == 'starting'
end

local function getPlayerData()
    local data = QBCore.Functions.GetPlayerData()
    if data and data.citizenid then
        PlayerData = data
    end
    return PlayerData
end

local function isPlayerDead()
    if not Config.DisableWhenDead then return false end
    local data = getPlayerData()
    local meta = data.metadata or {}
    return meta.isdead == true or meta.inlaststand == true or IsEntityDead(PlayerPedId())
end

local function canOpenRadial()
    if radialOpen then return true end
    if IsPauseMenuActive() then return false end
    if isPlayerDead() then return false end

    local data = getPlayerData()
    if not data or not data.citizenid then
        return false
    end

    return true
end

local function notify(message, kind)
    if QBCore and QBCore.Functions and QBCore.Functions.Notify then
        QBCore.Functions.Notify(message, kind or 'primary')
    end
end

local function requestControl(entity)
    if entity == 0 or not DoesEntityExist(entity) then return false end
    if NetworkHasControlOfEntity(entity) then return true end

    NetworkRequestControlOfEntity(entity)
    local timeout = GetGameTimer() + 600
    while not NetworkHasControlOfEntity(entity) and GetGameTimer() < timeout do
        Wait(0)
        NetworkRequestControlOfEntity(entity)
    end
    return NetworkHasControlOfEntity(entity)
end

local function requestAnimDict(dict)
    if HasAnimDictLoaded(dict) then return true end
    RequestAnimDict(dict)
    local timeout = GetGameTimer() + 2500
    while not HasAnimDictLoaded(dict) and GetGameTimer() < timeout do
        Wait(10)
    end
    return HasAnimDictLoaded(dict)
end

local function stopPointing()
    if not pointing then return end
    local ped = PlayerPedId()
    RequestTaskMoveNetworkStateTransition(ped, 'Stop')
    SetPedCurrentWeaponVisible(ped, true, true, true, true)
    pointing = false
end

local function cancelAnimation()
    local ped = PlayerPedId()
    handsUp = false
    stopPointing()
    activeAnim = nil
    ClearPedSecondaryTask(ped)
    ClearPedTasks(ped)
end

local function toggleHandsUp()
    local ped = PlayerPedId()
    stopPointing()

    if handsUp then
        handsUp = false
        ClearPedSecondaryTask(ped)
        return
    end

    if requestAnimDict('random@mugging3') then
        handsUp = true
        activeAnim = 'handsup'
        TaskPlayAnim(ped, 'random@mugging3', 'handsup_standing_base', 3.0, -3.0, -1, 49, 0.0, false, false, false)
    end
end

local function togglePointing()
    local ped = PlayerPedId()
    if pointing then
        stopPointing()
        return
    end

    handsUp = false
    ClearPedSecondaryTask(ped)

    RequestAnimDict('anim@mp_point')
    local timeout = GetGameTimer() + 2500
    while not HasAnimDictLoaded('anim@mp_point') and GetGameTimer() < timeout do
        Wait(10)
    end
    if not HasAnimDictLoaded('anim@mp_point') then return end

    SetPedCurrentWeaponVisible(ped, false, true, true, true)
    SetPedConfigFlag(ped, 36, true)
    Citizen.InvokeNative(0x2D537BA194896636, ped, 'task_mp_pointing', 0.5, 0, 'anim@mp_point', 24)
    RemoveAnimDict('anim@mp_point')
    pointing = true
    activeAnim = 'point'
end

local function playSimpleAnim(dict, anim, flag)
    local ped = PlayerPedId()
    handsUp = false
    stopPointing()
    ClearPedSecondaryTask(ped)
    if requestAnimDict(dict) then
        TaskPlayAnim(ped, dict, anim, 3.0, 3.0, -1, flag or 49, 0.0, false, false, false)
        activeAnim = anim
    end
end

local function getCurrentVehicle()
    local ped = PlayerPedId()
    if not IsPedInAnyVehicle(ped, false) then return 0 end
    return GetVehiclePedIsIn(ped, false)
end

local function isDriver(vehicle)
    return vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == PlayerPedId()
end

local function vehicleEngine()
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    if not isDriver(vehicle) then
        notify('You must be in the driver seat.', 'error')
        return
    end
    requestControl(vehicle)
    local running = GetIsVehicleEngineRunning(vehicle)
    SetVehicleEngineOn(vehicle, not running, false, true)
end

local function vehicleLock()
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    if not isDriver(vehicle) then
        notify('You must be in the driver seat.', 'error')
        return
    end
    requestControl(vehicle)
    local status = GetVehicleDoorLockStatus(vehicle)
    if status == 1 or status == 0 then
        SetVehicleDoorsLocked(vehicle, 2)
        notify('Vehicle doors locked.', 'success')
    else
        SetVehicleDoorsLocked(vehicle, 1)
        notify('Vehicle doors unlocked.', 'success')
    end
end

local function vehicleDoor(door)
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    requestControl(vehicle)

    door = tonumber(door)
    if not door then return end
    if GetVehicleDoorAngleRatio(vehicle, door) > 0.05 then
        SetVehicleDoorShut(vehicle, door, false)
    else
        SetVehicleDoorOpen(vehicle, door, false, false)
    end
end

local function vehicleWindow(window)
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    requestControl(vehicle)

    window = tonumber(window)
    if not window then return end

    -- FiveM does not expose a reliable per-window "is down" getter, so we
    -- remember the state locally for each vehicle network id.
    local netId = NetworkGetNetworkIdFromEntity(vehicle)
    windowStates[netId] = windowStates[netId] or {}
    windowStates[netId][window] = not (windowStates[netId][window] or false)
    local lowered = windowStates[netId][window]

    if lowered then
        RollDownWindow(vehicle, window)
    else
        RollUpWindow(vehicle, window)
    end
end

local function vehicleSeat(seat)
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    seat = tonumber(seat)
    if seat == nil then return end

    local occupant = GetPedInVehicleSeat(vehicle, seat)
    if occupant ~= 0 and occupant ~= PlayerPedId() then
        notify('That seat is occupied.', 'error')
        return
    end

    SetPedIntoVehicle(PlayerPedId(), vehicle, seat)
end

local function vehicleExtra(extra)
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return end
    extra = tonumber(extra)
    if not extra or not DoesExtraExist(vehicle, extra) then return end

    requestControl(vehicle)
    local enabled = IsVehicleExtraTurnedOn(vehicle, extra)
    -- SET_VEHICLE_EXTRA third argument is "disable".
    SetVehicleExtra(vehicle, extra, enabled)
end

local function executeInternalAction(action, args)
    if action == 'emote:handsup' then
        toggleHandsUp()
    elseif action == 'emote:point' then
        togglePointing()
    elseif action == 'emote:crossarms' then
        playSimpleAnim('amb@world_human_hang_out_street@male_c@idle_a', 'idle_b', 49)
    elseif action == 'emote:salute' then
        playSimpleAnim('anim@mp_player_intcelebrationmale@salute', 'salute', 49)
    elseif action == 'emote:cancel' then
        cancelAnimation()
    elseif action == 'vehicle:engine' then
        vehicleEngine()
    elseif action == 'vehicle:lock' then
        vehicleLock()
    elseif action == 'vehicle:door' then
        vehicleDoor(args and args.door)
    elseif action == 'vehicle:window' then
        vehicleWindow(args and args.window)
    elseif action == 'vehicle:seat' then
        vehicleSeat(args and args.seat)
    elseif action == 'vehicle:extra' then
        vehicleExtra(args and args.extra)
    else
        debugPrint('Unknown internal action:', action)
    end
end

local function itemVisible(item)
    if item.requiredResource and not resourceStarted(item.requiredResource) then
        return false
    end

    if item.job then
        local data = getPlayerData()
        if not data.job or data.job.name ~= item.job then return false end
    end

    if item.onDuty ~= nil then
        local data = getPlayerData()
        if not data.job or data.job.onduty ~= item.onDuty then return false end
    end

    if item.vehicleOnly and getCurrentVehicle() == 0 then return false end
    if item.driverOnly and not isDriver(getCurrentVehicle()) then return false end
    if item.onFootOnly and getCurrentVehicle() ~= 0 then return false end

    return true
end

local function buildVehicleMenu()
    local vehicle = getCurrentVehicle()
    if vehicle == 0 then return nil end

    local menu = {
        id = 'vehicle',
        title = 'Vehicle',
        description = 'Vehicle controls',
        icon = 'car',
        items = {}
    }

    if Config.Vehicle.ShowEngine then
        menu.items[#menu.items + 1] = {
            id = 'vehicle_engine', title = 'Engine', icon = 'engine',
            description = 'Start / stop engine', action = 'vehicle:engine', shouldClose = false
        }
    end

    if Config.Vehicle.ShowLocks then
        menu.items[#menu.items + 1] = {
            id = 'vehicle_lock', title = 'Door Lock', icon = 'lock',
            description = 'Lock / unlock vehicle', action = 'vehicle:lock', shouldClose = false
        }
    end

    if Config.Vehicle.ShowDoors then
        menu.items[#menu.items + 1] = {
            id = 'vehicle_doors', title = 'Doors', icon = 'door', items = {
                { id = 'door_fl', title = 'Front Left', icon = 'door', action = 'vehicle:door', args = { door = 0 }, shouldClose = false },
                { id = 'door_fr', title = 'Front Right', icon = 'door', action = 'vehicle:door', args = { door = 1 }, shouldClose = false },
                { id = 'door_rl', title = 'Rear Left', icon = 'door', action = 'vehicle:door', args = { door = 2 }, shouldClose = false },
                { id = 'door_rr', title = 'Rear Right', icon = 'door', action = 'vehicle:door', args = { door = 3 }, shouldClose = false },
                { id = 'door_hood', title = 'Hood', icon = 'engine', action = 'vehicle:door', args = { door = 4 }, shouldClose = false },
                { id = 'door_trunk', title = 'Trunk', icon = 'box', action = 'vehicle:door', args = { door = 5 }, shouldClose = false }
            }
        }
    end

    if Config.Vehicle.ShowWindows then
        menu.items[#menu.items + 1] = {
            id = 'vehicle_windows', title = 'Windows', icon = 'window', items = {
                { id = 'window_fl', title = 'Front Left', icon = 'window', action = 'vehicle:window', args = { window = 0 }, shouldClose = false },
                { id = 'window_fr', title = 'Front Right', icon = 'window', action = 'vehicle:window', args = { window = 1 }, shouldClose = false },
                { id = 'window_rl', title = 'Rear Left', icon = 'window', action = 'vehicle:window', args = { window = 2 }, shouldClose = false },
                { id = 'window_rr', title = 'Rear Right', icon = 'window', action = 'vehicle:window', args = { window = 3 }, shouldClose = false }
            }
        }
    end

    if Config.Vehicle.ShowSeats then
        local seats = { id = 'vehicle_seats', title = 'Seats', icon = 'seat', items = {} }
        local maxPassengers = GetVehicleMaxNumberOfPassengers(vehicle)
        for seat = -1, maxPassengers - 1 do
            local occupant = GetPedInVehicleSeat(vehicle, seat)
            if occupant == 0 or occupant == PlayerPedId() then
                local label = seat == -1 and 'Driver' or ('Seat %s'):format(seat + 2)
                seats.items[#seats.items + 1] = {
                    id = ('seat_%s'):format(seat),
                    title = label,
                    icon = 'seat',
                    action = 'vehicle:seat',
                    args = { seat = seat },
                    shouldClose = true
                }
            end
        end
        if #seats.items > 0 then menu.items[#menu.items + 1] = seats end
    end

    if Config.Vehicle.ShowExtras then
        local extras = { id = 'vehicle_extras', title = 'Extras', icon = 'plus', items = {} }
        for extra = 1, Config.Vehicle.MaxExtras do
            if DoesExtraExist(vehicle, extra) then
                local enabled = IsVehicleExtraTurnedOn(vehicle, extra)
                extras.items[#extras.items + 1] = {
                    id = ('extra_%s'):format(extra),
                    title = ('Extra %s %s'):format(extra, enabled and 'ON' or 'OFF'),
                    description = 'Toggle vehicle extra',
                    icon = enabled and 'check' or 'plus',
                    action = 'vehicle:extra',
                    args = { extra = extra },
                    shouldClose = false
                }
            end
        end
        if #extras.items > 0 then menu.items[#menu.items + 1] = extras end
    end

    return menu
end

local function buildJobMenu()
    local data = getPlayerData()
    local job = data.job
    if not job or not job.name then return nil end

    local cfg = Config.JobInteractions[job.name]
    if not cfg then return nil end
    if cfg.requiredResource and not resourceStarted(cfg.requiredResource) then return nil end
    if cfg.onDuty ~= nil and job.onduty ~= cfg.onDuty then return nil end

    local menu = deepCopy(cfg)
    menu.id = 'job_' .. job.name
    menu.description = job.label or job.name
    menu.requiredResource = nil
    menu.onDuty = nil
    return menu
end

local function getDynamicItems()
    local items = {}
    for _, option in pairs(dynamicOptions) do
        items[#items + 1] = deepCopy(option)
    end
    table.sort(items, function(a, b)
        return tostring(a.id or '') < tostring(b.id or '')
    end)
    return items
end

local function sanitizeItems(items, parentPath)
    local output = {}

    for index, item in ipairs(items or {}) do
        if itemVisible(item) then
            local path = ('%s.%s'):format(parentPath or 'root', item.id or index)
            local uiItem = {
                id = tostring(item.id or path),
                title = item.title or 'Option',
                description = item.description or '',
                icon = item.icon or 'dot'
            }

            if item.items and #item.items > 0 then
                local childItems = sanitizeItems(item.items, path)
                if #childItems > 0 then
                    uiItem.items = childItems
                    output[#output + 1] = uiItem
                end
            else
                actionMap[path] = item
                uiItem.actionId = path
                output[#output + 1] = uiItem
            end
        end
    end

    return output
end

local function buildMenu()
    actionMap = {}

    local items = deepCopy(Config.MenuItems)

    local vehicleMenu = buildVehicleMenu()
    if vehicleMenu and #vehicleMenu.items > 0 then
        items[#items + 1] = vehicleMenu
    end

    local jobMenu = buildJobMenu()
    if jobMenu and jobMenu.items and #jobMenu.items > 0 then
        items[#items + 1] = jobMenu
    end

    local dynamic = getDynamicItems()
    for _, item in ipairs(dynamic) do
        items[#items + 1] = item
    end

    return sanitizeItems(items, 'root')
end

local function closeRadial()
    if not radialOpen then return end
    radialOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({ action = 'close' })
end

local function openRadial()
    if radialOpen or not canOpenRadial() then return end

    local items = buildMenu()
    if #items == 0 then return end

    radialOpen = true
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(Config.UseWhileWalking == true)
    SendNUIMessage({
        action = 'open',
        items = items,
        theme = Config.Theme
    })
end

local function toggleRadial()
    if radialOpen then
        closeRadial()
    else
        openRadial()
    end
end

local function executeMenuItem(item)
    if not item then return end

    if item.action then
        executeInternalAction(item.action, item.args)
        return
    end

    if item.type == 'server' then
        if item.args ~= nil then
            TriggerServerEvent(item.event, item.args)
        else
            TriggerServerEvent(item.event)
        end
    elseif item.type == 'command' then
        if item.args ~= nil then
            ExecuteCommand(('%s %s'):format(item.event, tostring(item.args)))
        else
            ExecuteCommand(item.event)
        end
    else
        if item.args ~= nil then
            TriggerEvent(item.event, item.args)
        else
            TriggerEvent(item.event)
        end
    end
end

RegisterNUICallback('close', function(_, cb)
    closeRadial()
    cb({ ok = true })
end)

RegisterNUICallback('select', function(data, cb)
    local actionId = data and data.actionId
    local item = actionId and actionMap[actionId] or nil

    if not item then
        cb({ ok = false, error = 'invalid_action' })
        return
    end

    executeMenuItem(item)

    if item.shouldClose ~= false then
        closeRadial()
    else
        -- Refresh dynamic labels such as extras after the action.
        Wait(50)
        local items = buildMenu()
        SendNUIMessage({ action = 'refresh', items = items })
    end

    cb({ ok = true })
end)

RegisterCommand('+radialmenu', function()
    if Config.Toggle then
        toggleRadial()
    else
        openRadial()
    end
end, false)

RegisterCommand('-radialmenu', function()
    if not Config.Toggle then
        closeRadial()
    end
end, false)

RegisterKeyMapping('+radialmenu', 'Open GCR radial menu', 'keyboard', Config.Keybind)

RegisterCommand('radialmenu', function()
    toggleRadial()
end, false)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
    closeRadial()
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(data)
    PlayerData = data or {}
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(job)
    PlayerData.job = job
end)

RegisterNetEvent('QBCore:Client:SetDuty', function(duty)
    if PlayerData.job then PlayerData.job.onduty = duty end
end)

-- Compatibility events for resources/configs that expect qb-radialmenu names.
RegisterNetEvent('qb-radialmenu:client:setExtra', function(data)
    local extra = type(data) == 'table' and (data.extra or data.id) or data
    vehicleExtra(extra)
end)

RegisterNetEvent('qb-radialmenu:client:openDoor', function(data)
    local door = type(data) == 'table' and (data.door or data.id) or data
    vehicleDoor(door)
end)

RegisterNetEvent('qb-radialmenu:client:ChangeSeat', function(data)
    local seat = type(data) == 'table' and (data.seat or data.id) or data
    vehicleSeat(seat)
end)

RegisterNetEvent('qb-radialmenu:client:ToggleEngine', vehicleEngine)
RegisterNetEvent('qb-radialmenu:client:ToggleVehicleLock', vehicleLock)

-- Standard dynamic option API used by several QBCore resources and
-- illenium-appearance when radial integration is enabled.
local function addOption(data, id)
    if type(data) ~= 'table' then return nil end

    optionCounter = optionCounter + 1
    local option = deepCopy(data)
    local optionId = tostring(id or option.id or ('dynamic_%s'):format(optionCounter))
    option.id = optionId
    dynamicOptions[optionId] = option
    debugPrint('Added dynamic option:', optionId)
    return optionId
end

local function removeOption(id)
    id = tostring(id or '')
    if dynamicOptions[id] then
        dynamicOptions[id] = nil
        debugPrint('Removed dynamic option:', id)
        return true
    end
    return false
end

exports('AddOption', addOption)
exports('RemoveOption', removeOption)
exports('GetRadialItems', function()
    return deepCopy(dynamicOptions)
end)
exports('IsRadialOpen', function()
    return radialOpen
end)

CreateThread(function()
    Wait(1000)
    PlayerData = QBCore.Functions.GetPlayerData()
end)

CreateThread(function()
    while true do
        if radialOpen then
            -- Keep movement available when configured, but stop accidental gameplay
            -- actions while the mouse is being used on the NUI.
            DisableControlAction(0, 24, true)  -- attack
            DisableControlAction(0, 25, true)  -- aim
            DisableControlAction(0, 37, true)  -- weapon wheel
            DisableControlAction(0, 44, true)  -- cover
            DisableControlAction(0, 140, true) -- melee light
            DisableControlAction(0, 141, true) -- melee heavy
            DisableControlAction(0, 142, true) -- melee alternate
            DisablePlayerFiring(PlayerId(), true)
            Wait(0)
        else
            Wait(250)
        end
    end
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
    end
end)
