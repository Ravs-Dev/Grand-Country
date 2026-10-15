local QBCore = exports['qb-core']:GetCoreObject()
local carrying, carried, otherPlayer = false, false, nil
local animDict = 'missfinale_c2mcs_1'

local function notify(message, kind)
    QBCore.Functions.Notify(message, kind or 'primary', 4500)
end

local function getServerId(entity)
    if not entity or not DoesEntityExist(entity) or not IsPedAPlayer(entity) then return nil end
    local index = NetworkGetPlayerIndexFromPed(entity)
    if index == -1 then return nil end
    local id = GetPlayerServerId(index)
    if id == GetPlayerServerId(PlayerId()) then return nil end
    return id
end

local function canInteract(entity)
    local id = getServerId(entity)
    return id ~= nil and #(GetEntityCoords(PlayerPedId()) - GetEntityCoords(entity)) <= 2.5
end

local function loadAnim(dict)
    RequestAnimDict(dict)
    local untilTime = GetGameTimer() + 3000
    while not HasAnimDictLoaded(dict) and GetGameTimer() < untilTime do Wait(0) end
    return HasAnimDictLoaded(dict)
end

RegisterNetEvent('lcrp-interactions:client:notify', notify)

RegisterNetEvent('lcrp-interactions:client:carryStart', function(targetId, role)
    if carrying or carried then return end
    local ped = PlayerPedId()
    if IsPedInAnyVehicle(ped, false) or IsEntityDead(ped) then return end
    local playerIndex = GetPlayerFromServerId(targetId)
    if playerIndex == -1 then return end
    local otherPed = GetPlayerPed(playerIndex)
    if not DoesEntityExist(otherPed) then return end
    if role == 'carrier' then
        carrying = true
        otherPlayer = targetId
        loadAnim('missfinale_c2mcs_1')
        TaskPlayAnim(ped,'missfinale_c2mcs_1','fin_c2_mcs_1_camman',8.0,-8.0,-1,49,0,false,false,false)
    else
        carried = true
        otherPlayer = targetId
        loadAnim('nm')
        AttachEntityToEntity(ped,otherPed,0,0.15,-0.25,0.68,0.0,0.0,180.0,false,false,false,false,2,false)
        TaskPlayAnim(ped,'nm','firemans_carry',8.0,-8.0,-1,33,0,false,false,false)
    end
end)

local function stopCarry()
    if carrying or carried then
        DetachEntity(PlayerPedId(), true, false)
        ClearPedSecondaryTask(PlayerPedId())
        ClearPedTasks(PlayerPedId())
    end
    carrying,carried,otherPlayer=false,false,nil
end

RegisterNetEvent('lcrp-interactions:client:carryStop', stopCarry)

CreateThread(function()
    while true do
        Wait(700)
        if carrying or carried then
            local ped=PlayerPedId()
            if IsEntityDead(ped) or IsPedInAnyVehicle(ped,false) or (carried and (not IsEntityAttached(ped))) then
                TriggerServerEvent('lcrp-interactions:server:stopCarry')
                stopCarry()
            elseif carrying and not IsEntityPlayingAnim(ped,animDict,'fin_c2_mcs_1_camman',3) then
                if loadAnim(animDict) then TaskPlayAnim(ped,animDict,'fin_c2_mcs_1_camman',8.0,-8.0,-1,49,0,false,false,false) end
            end
        end
    end
end)

RegisterCommand('stopcarry', function()
    if carrying or carried then TriggerServerEvent('lcrp-interactions:server:stopCarry') end
end, false)

CreateThread(function()
    while GetResourceState('ox_target') ~= 'started' do Wait(500) end
    exports.ox_target:addGlobalPlayer({
        {
            name='lcrp_give_cash', icon='fa-solid fa-money-bill-transfer', label='Give Cash', distance=2.5,
            canInteract=function(entity) return canInteract(entity) end,
            onSelect=function(data)
                local target=getServerId(data.entity)
                if not target then return end
                local result=GetOnscreenKeyboardResult
                AddTextEntry('LCRP_CASH_AMOUNT','Cash amount ($)')
                DisplayOnscreenKeyboard(1,'LCRP_CASH_AMOUNT','','','','','',10)
                while UpdateOnscreenKeyboard()==0 do Wait(0) end
                if UpdateOnscreenKeyboard()~=1 then return end
                local value=tonumber(result())
                if not value or value <= 0 or value ~= math.floor(value) then return notify('Masukkan jumlah uang yang valid.','error') end
                TriggerServerEvent('lcrp-interactions:server:giveCash',target,value)
            end
        },
        {
            name='lcrp_share_phone',icon='fa-solid fa-phone',label='Share Phone Number',distance=2.5,
            canInteract=function(entity) return canInteract(entity) end,
            onSelect=function(data)
                local target=getServerId(data.entity)
                if target then TriggerServerEvent('lcrp-interactions:server:sharePhone',target) end
            end
        },
        {
            name='lcrp_carry',icon='fa-solid fa-people-carry-box',label='Carry / Stop Carry',distance=2.5,
            canInteract=function(entity) return canInteract(entity) end,
            onSelect=function(data)
                local target=getServerId(data.entity)
                if target then TriggerServerEvent('lcrp-interactions:server:toggleCarry',target) end
            end
        }
    })
end)
