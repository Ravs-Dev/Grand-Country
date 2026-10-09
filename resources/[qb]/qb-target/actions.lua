local QBCore = exports['qb-core']:GetCoreObject()

-- CreateThread(function()
--     exports['RespectTarget']:AddGlobalPlayer({
--         options = {
--             ["Police"] = {
--                 icon = 'fas fa-fist-raised',
--                 label = 'إجراءات الشرطة',
--                 action = function(entity)
--                     local playerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
--                     TriggerEvent('RespectPoliceJob:client:openPoliceActions', playerId)
--                 end,
--                 canInteract = function(entity, distance, data)
--                     if IsPedAPlayer(entity) and not QBCore.Functions.GetPlayerData().metadata["isdead"] and not QBCore.Functions.GetPlayerData().metadata["inlaststand"] and not IsPedInAnyVehicle(PlayerPedId(), false) then return true end
--                     return false
--                 end,
--                 job = 'police',
--             },
--         },
--         distance = 1.5,
--     })
-- end)

-- exports["RespectTarget"]:AddTargetBone({ "boot" }, {
--     options = {
--         {
--             icon = "fa-solid fa-car-rear",
--             label = locale('target_remove_from_trunk'),
--             canInteract = function(entity, distance, coords, name)
--                 if inTrunk then return end
--                 if not carryingEntity then return end

--                 if GetVehicleDoorLockStatus(entity) > 1 then return end
--                 if IsVehicleDoorDamaged(entity, 5) then return end
--                 return #(GetEntityCoords(PlayerPedId()) - GetEntityBonePosition_2(entity, GetEntityBoneIndexByName(entity, "boot"))) <
--                     0.9
--             end,
--             action = function(data)
--                 removePlayerFromTrunk(data)
--             end
--         },
--         {
--             icon = "fa-solid fa-car-rear",
--             label = locale('target_put_person_in_trunk'),
--             canInteract = function(entity, distance, coords, name)
--                 if inTrunk then return end
--                 if not carrying then return end

--                 if GetVehicleDoorLockStatus(entity) > 1 then return end
--                 if IsVehicleDoorDamaged(entity, 5) then return end
--                 return #(GetEntityCoords(PlayerPedId()) - GetEntityBonePosition_2(entity, GetEntityBoneIndexByName(entity, "boot"))) <
--                     0.9
--             end,
--             action = function(data)
--                 hidePlayer(data)
--             end
--         },
--         {
--             icon = "fa-solid fa-car-rear",
--             label = locale('target_hide_in_trunk'),
--             canInteract = function(entity, distance, coords, name)
--                 if inTrunk then return end
--                 if carrying then return end
--                 if beingCarried then return end
--                 if putInSomeoneTrunk then return end

--                 if GetVehicleDoorLockStatus(entity) > 1 then return end
--                 if IsVehicleDoorDamaged(entity, 5) then return end
--                 return #(GetEntityCoords(PlayerPedId()) - GetEntityBonePosition_2(entity, GetEntityBoneIndexByName(entity, "boot"))) <
--                     0.9
--             end,
--             action = function(data)
--                 local playerPedId = cache.ped

--                 hide(playerPedId, data)
--             end
--         },
--         {
--             icon = "fa-solid fa-car-rear",
--             label = locale('target_leave_trunk'),
--             canInteract = function(entity, distance, coords, name)
--                 if not inTrunk then return end
--                 if carrying then return end
--                 if putInSomeoneTrunk then return end

--                 if GetVehicleDoorLockStatus(entity) > 1 then return end
--                 if IsVehicleDoorDamaged(entity, 5) then return end
--                 return #(GetEntityCoords(PlayerPedId()) - GetEntityBonePosition_2(entity, GetEntityBoneIndexByName(entity, "boot"))) <
--                     0.9
--             end,
--             action = function(data)
--                 local playerPedId = cache.ped

--                 leaveTrunk(playerPedId, data)
--             end
--         },
--     },

--     distance = 1.0
-- })

RegisterNetEvent('RespectTarget:client:payAnimation', function()
    RequestAnimDict('mp_common')
    while not HasAnimDictLoaded('mp_common') do
        Citizen.Wait(1)
    end

    TaskPlayAnim(PlayerPedId(), "mp_common", "givetake2_a", 8.0, 1.0, -1, 50, 0, false, false, false)
    Wait(3500)
    ClearPedTasks(PlayerPedId())
end)

-- flip vehicle
RegisterNetEvent("RespectTarget:client:flipVehicle", function(vehicle)
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)

    if IsPedSittingInAnyVehicle(playerPed) then
        QBCore.Functions.Notify("لا يمكنك قلب المركبة وانت داخل مركبة", "error")
        ClearPedTasks(playerPed)
        return
    end

    if vehicle and DoesEntityExist(vehicle) then
        local busy = exports["RespectHud"]:isDoingSomething()
        if busy then
            return TriggerEvent('QBCore:Notify', 'لا يمكنك فعل شيء الان', 'error', 5000)
        end

        QBCore.Functions.Progressbar("flipingCar", "جارٍ قلب المركبة", 12000, "fa-solid fa-rotate", false,
            true, {
                disableMovement = true,
                disableCarMovement = true,
                disableMouse = false,
                disableCombat = true
            }, {
                task = "CODE_HUMAN_MEDIC_TEND_TO_DEAD"
            }, {}, {}, function()
                ClearPedTasks(playerPed)
                FreezeEntityPosition(playerPed, false)
                local vehicleCoords = GetEntityCoords(vehicle)
                SetEntityCoords(vehicle, vehicleCoords.x + 0.5, vehicleCoords.y + 0.5, vehicleCoords.z + 1)
                Wait(200)
                SetEntityRotation(vehicle, GetEntityRotation(playerPed, 2), 2)
                Wait(500)
                SetVehicleOnGroundProperly(vehicle)
                QBCore.Functions.Notify("تم قلب المركبة بنجاح", "success")
            end, function()
                FreezeEntityPosition(playerPed, false)
                ClearPedTasks(playerPed)
            end)
    else
        QBCore.Functions.Notify("لا توجد مركبة قريبة", "error")
    end
end)

RegisterNetEvent('RespectAmbulance:client:putInVehicle', function(vehid)
    local ped = PlayerPedId()
    local vehicle = NetworkGetEntityFromNetworkId(vehid)

    if DoesEntityExist(vehicle) then
        local closestSeat = -1
        local closestDistance = math.huge

        -- print(GetEntityModel(vehicle), rtfordambo, rtfreightliner, GetEntityModel(vehicle) == rtfordambo,
            -- GetEntityModel(vehicle) == rtfreightliner)
        if (GetEntityModel(vehicle) == rtfordambo or GetEntityModel(vehicle) == rtfreightliner) then
            for i = 2, GetVehicleMaxNumberOfPassengers(vehicle) - 1 do
                -- print(i, i == -1)
                if i == -1 or not IsVehicleSeatFree(vehicle, i) then
                    goto continue
                end

                local seatPos = GetEntityCoords(vehicle)
                local pedPos = GetEntityCoords(ped)
                local dist = Vdist(seatPos.x, seatPos.y, seatPos.z, pedPos.x, pedPos.y, pedPos.z)

                if dist < closestDistance then
                    closestDistance = dist
                    closestSeat = i
                end

                ::continue::
            end
        else
            for i = 0, GetVehicleMaxNumberOfPassengers(vehicle) - 1 do
                -- print(i, i == -1)
                if i == -1 or not IsVehicleSeatFree(vehicle, i) then
                    goto continue
                end

                local seatPos = GetEntityCoords(vehicle)
                local pedPos = GetEntityCoords(ped)
                local dist = Vdist(seatPos.x, seatPos.y, seatPos.z, pedPos.x, pedPos.y, pedPos.z)

                if dist < closestDistance then
                    closestDistance = dist
                    closestSeat = i
                end

                ::continue::
            end
        end

        if closestSeat ~= -1 then
            ClearPedTasks(ped)
            DetachEntity(ped, true, false)
            Citizen.Wait(100)

            if QBCore.Functions.GetPlayerData().metadata["isdead"] then
                SetPedIntoVehicle(ped, vehicle, closestSeat)
            else
                TaskEnterVehicle(ped, vehicle, -1, closestSeat, 2, 1, 0)
            end
        end
    end
end)

RegisterNetEvent('RespectAmbulance:client:getOutVehicle', function()
    TaskLeaveVehicle(PlayerPedId(), GetVehiclePedIsIn(PlayerPedId(), false), 16)
    if QBCore.Functions.GetPlayerData().metadata["isdead"] then
        NetworkResurrectLocalPlayer(GetEntityCoords(PlayerPedId()).x + 2.0, GetEntityCoords(PlayerPedId()).y + 2.0,
            GetEntityCoords(PlayerPedId()).z, true, false)
        Wait(1000)
        TaskLeaveVehicle(PlayerPedId(), GetVehiclePedIsIn(PlayerPedId(), false), 16)
    end
end)