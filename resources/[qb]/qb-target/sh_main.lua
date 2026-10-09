QBCore, QBCore = exports['qb-core']:GetCoreObject(), exports['qb-core']:GetCoreObject()

Respect = {}


Respect.BoxZones = {
	["MRPD_WHITE_BOARD"] = {
		name = "MRPD_WHITE_BOARD",
		coords = vector3(470.2527, -1021.3130, 30.3091),
		length = 1.0,
		width = 1,
		heading = 0,
		debugPoly = false,
		minZ = 28.9,
		maxZ = 32.3,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				canInteract = function(entity, distance, data)
					-- if exports['RespectMicrophone']:currentMicrophone() then
					return true
					-- else
					-- 	return false
					-- end
				end,
			},
			-- {
			-- 	action = function ()
			-- 		TriggerEvent('RespectProjector:client:project', 'mrpd')
			-- 	end,
			-- 	icon = 'fas fa-display',
			-- 	label = 'استخدام الشاشة',
			-- },
			-- {
			-- 	action = function ()
			-- 		TriggerEvent('RespectProjector:client:project-clear', 'mrpd')
			-- 	end,
			-- 	icon = 'fas fa-power-off',
			-- 	label = 'اطفاء الشاشة',
			-- },
			-- {
			--   event = 'RespectProjector:client:next',
			--   icon = 'fas fa-caret-right',
			--   label = 'التالي الشاشة',
			-- },
			-- {
			--   event = 'RespectProjector:client:previous',
			--   icon = 'fas fa-caret-left',
			--   label = 'السابق الشاشة',
			-- },
		},
		distance = 2.5
	},
	["justice1"] = {
		name = "justice1",
		coords = vector3(208.34, -410.01, 45.33),
		length = 2.0,
		width = 2.0,
		heading = 340,
		debugPoly = false,
		minZ = 45.13,
		maxZ = 49.13,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["justice2"] = {
		name = "justice2",
		coords = vector3(207.1282, -406.5503, 45.3565),
		length = 1.0,
		width = 1.0,
		heading = 340,
		debugPoly = false,
		minZ = 44.53,
		maxZ = 48.53,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["justice3"] = {
		name = "justice3",
		coords = vector3(205.2160, -408.8826, 45.8363),
		length = 2.0,
		width = 2.0,
		heading = 340,
		debugPoly = false,
		minZ = 44.53,
		maxZ = 48.53,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
			-- {
			-- 	event = 'rt-judge:client:hummerone',
			-- 	icon = 'fa-solid fa-gavel',
			-- 	label = 'المطرقة 1',
			-- 	job = 'justice',
			-- 	-- canInteract = function()
			-- 	-- 	return QBCore.Functions.GetPlayerData().job.name == 'justice' and
			-- 	-- 		QBCore.Functions.GetPlayerData().job.isboss
			-- 	-- end,
			-- },
			-- {
			-- 	event = 'rt-judge:client:humeersound',
			-- 	icon = 'fa-solid fa-gavel',
			-- 	label = 'المطرقة 3',
			-- 	job = 'justice',
			-- 	-- canInteract = function()
			-- 	-- 	return QBCore.Functions.GetPlayerData().job.name == 'justice' and
			-- 	-- 		QBCore.Functions.GetPlayerData().job.isboss
			-- 	-- end,
			-- },
			-- {
			-- 	action = function ()
			-- 		TriggerEvent('RespectProjector:client:project', 'justice')
			-- 	end,
			-- 	icon = 'fas fa-display',
			-- 	label = 'استخدام الشاشة',
			-- },
			-- {
			-- 	action = function ()
			-- 		TriggerEvent('RespectProjector:client:project-clear', 'justice')
			-- 	end,
			-- 	icon = 'fas fa-power-off',
			-- 	label = 'اطفاء الشاشة',
			-- },
		},
		distance = 2.5
	},
	["justice4"] = {
		name = "justice4",
		coords = vector3(262.19, -430.17, 46.13),
		length = 2.0,
		width = 2.0,
		heading = 340,
		debugPoly = false,
		minZ = 45.13,
		maxZ = 49.13,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["justice5"] = {
		name = "justice5",
		coords = vector3(263.5315, -433.6844, 46.1836),
		length = 1.5,
		width = 1.5,
		heading = 340,
		debugPoly = false,
		minZ = 45.5,
		maxZ = 49.5,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["justice6"] = {
		name = "justice6",
		coords = vector3(264.9888, -431.1468, 47.4972),
		length = 2.0,
		width = 2.0,
		heading = 340,
		debugPoly = false,
		minZ = 44.53,
		maxZ = 48.53,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
			-- {
			-- 	event = 'rt-judge:client:hummerone',
			-- 	icon = 'fa-solid fa-gavel',
			-- 	label = 'المطرقة 1',
			-- 	job = 'justice',
			-- 	-- canInteract = function()
			-- 	-- 	return QBCore.Functions.GetPlayerData().job.name == 'justice' and
			-- 	-- 		QBCore.Functions.GetPlayerData().job.isboss
			-- 	-- end,
			-- },
			-- {
			-- 	event = 'rt-judge:client:humeersound',
			-- 	icon = 'fa-solid fa-gavel',
			-- 	label = 'المطرقة 3',
			-- 	job = 'justice',
			-- 	-- canInteract = function()
			-- 	-- 	return QBCore.Functions.GetPlayerData().job.name == 'justice' and
			-- 	-- 		QBCore.Functions.GetPlayerData().job.isboss
			-- 	-- end,
			-- },
		},
		distance = 2.5
	},
	["justice7"] = {
		name = "justice7",
		coords = vector3(265.1772, -429.0726, 47.2110),
		length = 1.25,
		width = 1.25,
		heading = 250,
		debugPoly = false,
		minZ = 46.53,
		maxZ = 48.80,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["justice8"] = {
		name = "justice8",
		coords = vector3(205.5609, -411.1393, 46.7344),
		length = 1.25,
		width = 1.25,
		heading = 66,
		debugPoly = false,
		minZ = 46.53,
		maxZ = 48.80,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["army33333"] = {
		name = "army33333",
		coords = vector3(-2120.78, 3060.3, 32.81),
		length = 0.8,
		width = 0.8,
		heading = 330,
		debugPoly = false,
		minZ = 31.81,
		maxZ = 33.21,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
				-- canInteract = function(entity, distance, data)
				-- 	-- if exports['RespectMicrophone']:currentMicrophone() then
				-- 		return true
				-- 	-- else
				-- 	-- 	return false
				-- 	-- end
				-- end,
			},
		},
		distance = 2.5
	},
	["DRB7H"] = {
		name = "DRB7H",
		coords = vector3(-2248.6970, 270.7292, 170.4514),
		length = 1.25,
		width = 1.25,
		heading = 25,
		debugPoly = false,
		minZ = 175.0,
		maxZ = 170.0,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
			},
		},
		distance = 3.0
	},
	["SA95_Stage"] = {
		name = "SA95_Stage",
		coords = vector3(194.1774, 1164.6825, 215.0),
		length = 8.5,
		width = 8.5,
		heading = 100,
		debugPoly = false,
		minZ = 215.0,
		maxZ = 235.0,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
			},
		},
		distance = 3.0
	},
	["SA95_Stage_HOF"] = {
		name = "SA95_Stage_HOF",
		coords = vector3(203.3481, 1166.1440, 226.3565),
		length = 1.5,
		width = 1.5,
		heading = 100,
		debugPoly = false,
		minZ = 224.0,
		maxZ = 227.0,
		options = {
			{
				type = "client",
				event = "RespectMicrophone:client:toggleMicrophone",
				icon = "fas fa-microphone",
				label = "استعمال الميكروفون",
			},
		},
		distance = 3.0
	},
}

Respect.CircleZones = {

}
	

Respect.PolyZones = {

}


Respect.TargetBones = {
	["all"] = {
		bones = {
			'door_dside_f', 'door_pside_f', 'wheel_lf', 'wheel_rf', 'bonnet', 'boot'
		},
		
		options = {
			{
				type = "client",
				event = "cdn-fuel:client:SendMenuToServer",
				icon = "fas fa-gas-pump",
				label = "Insert Nozzle",
				canInteract = function() return Allowrefuel end
			},

			{
				type = "client",
				action = function()
					TriggerEvent('cdn-fuel:client:electric:RefuelMenu')
				end,
				icon = "fas fa-bolt",
				label = "Insert Electric Nozzle",
				canInteract = function() return AllowElectricRefuel end
			},


			{
				icon = "fa-solid fa-rotate",
				label = "قلب المركبة",
				action = function(entity)
					TriggerEvent('RespectTarget:client:flipVehicle', entity)
				end,
				distance = 2.0,
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					if not QBCore.Functions.GetPlayerData().metadata["isdead"] then
						if IsEntityAVehicle(entity) and math.abs(GetEntityRoll(entity)) > 75 then
							return true
						end
					end
					return false
				end,
			},
						-- {
			-- 	type = "client",
			-- 	event = "FB-Jobs:garbage:client:DeliverPackage",
			-- 	icon = 'fa-solid fa-trash',
			-- 	label = "وضع كيس القمامه",
			-- 	canInteract = function(entity)
			-- 		if not exports['FB-Jobs']:GarbageDoinJob() then
			-- 			return false
			-- 		end
			-- 		if not exports['FB-Jobs']:GarbageCachedNet() then
			-- 			return false
			-- 		end
			-- 		if not exports['FB-Jobs']:GarbageProp() then
			-- 			return false
			-- 		end
			-- 		if GetVehicleEngineHealth(entity) <= 0 then
			-- 			return false
			-- 		end
			-- 		if entity ~= exports['FB-Jobs']:GarbageCachedNet() then
			-- 			return false
			-- 		end
			-- 		if #(GetEntityCoords(PlayerPedId()) - vector3(exports['FB-Jobs']:GarbageCurLocation().x, exports['FB-Jobs']:GarbageCurLocation().y, exports['FB-Jobs']:GarbageCurLocation().z)) > 200.0 and not QBCore.Functions.GetPlayerData().metadata["isdead"] then
			-- 			return false
			-- 		end
			-- 		return true
			-- 	end,
			-- },
			-- {
			-- 	type = "client",
			-- 	event = "FB-Jobs:client:recycler:putMaterials",
			-- 	icon = 'fa-solid fa-trash',
			-- 	label = "وضع الاوراق",
			-- 	canInteract = function(entity)
			-- 		if not exports['FB-Jobs']:isCollectingMaterials() then
			-- 			return false
			-- 		end
			-- 		if not exports['FB-Jobs']:recyclerJobVehicle() then
			-- 			return false
			-- 		end
			-- 		if not exports['FB-Jobs']:hasCollectingMaterialsProp() then
			-- 			return false
			-- 		end
			-- 		if GetVehicleEngineHealth(entity) <= 0 then
			-- 			return false
			-- 		end
			-- 		if entity ~= exports['FB-Jobs']:recyclerJobVehicle() then
			-- 			return false
			-- 		end
			-- 		if QBCore.Functions.GetPlayerData().metadata["isdead"] then
			-- 			return false
			-- 		end
			-- 		return true
			-- 	end,
			-- },
			{
				label = 'دفع المركبة',
				icon = 'fas fa-hand-paper',
				distance = 2.0,
				canInteract = function(entity, distance, coords, name)
					if exports['gs_vehiclepush']:isPushing() then
						return false
					end

					if exports['FBScripts']:inTrunk() then return false end
					--     if NetworkGetEntityIsNetworked(entity) then
					--         return false
					--     end

					--     local ped = PlayerPedId()
					--     local distanceFront, distanceBack = exports['gs_vehiclepush']:IsPlayerInFrontOrBack(ped, entity)

					--     if (distanceFront > 1.2) and (distanceBack > 1.2) then
					--         return false
					--     end
					return not QBCore.Functions.GetPlayerData().metadata["isdead"] and
					exports['gs_vehiclepush']:IsVehiclePushable(entity) and not exports["RespectHud"]:isDoingSomething() and
					not exports['FB-Jobs']:startDelivery()
					-- and not exports['RespectFuel']:HoldingNozzle()
				end,
				action = function(entity)
					local ped = PlayerPedId()
					local distanceFront, distanceBack, isVehicleInFront = exports['gs_vehiclepush']
					:IsPlayerInFrontOrBack(ped, entity)
					exports['gs_vehiclepush']:setPushing(true)
					exports['gs_vehiclepush']:StartPushingVehicle(entity, isVehicleInFront)
				end
			},
			{
				label = 'ايقاف دفع المركبة',
				icon = 'fas fa-hand-paper',
				distance = 2.0,
				canInteract = function(entity, distance, coords, name)
					if exports['FBScripts']:inTrunk() then return false end
					return exports['gs_vehiclepush']:isPushing()
				end,
				action = function(data)
					exports['gs_vehiclepush']:setPushing(false)
				end
			},
						{
				type = "client",
				event = "client:scrapcity:deleiveryObject",
				icon = 'fa-solid fa-trash',
				label = "وضع الغرض",
				canInteract = function(entity)
					if not exports['FB-Jobs']:startDelivery() then
						return false
					end
					if not exports['FB-Jobs']:recyclerJobVehicle() then
						return false
					end
					if not exports['FB-Jobs']:attachProp() then
						return false
					end
					if GetVehicleEngineHealth(entity) <= 0 then
						return false
					end
					if entity ~= exports['FB-Jobs']:recyclerJobVehicle() then
						return false
					end
					if exports['FBScripts']:inTrunk() then return false end
					if QBCore.Functions.GetPlayerData().metadata["isdead"] then
						return false
					end
					return true
				end,
			},
			{
				label = ' وضع القلص اول',
				icon = 'fa-solid fa-lasso',
				distance = 2.0,
				item = 'towing_rope',
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					return not exports['rt-towing']:firstcar()
						and not exports['FB-Jobs']:startDelivery()
					-- and not exports['RespectFuel']:HoldingNozzle()
				end,
				action = function(entity)
					TriggerEvent('tow:front', entity)
				end,
			},
			{
				label = ' وضع القلص ثاني',
				icon = 'fa-solid fa-lasso',
				item = 'towing_rope',
				distance = 2.0,
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					return exports['rt-towing']:secondcar()
						and not exports['FB-Jobs']:startDelivery()
					-- and not exports['RespectFuel']:HoldingNozzle()
				end,
				action = function(entity)
					TriggerEvent('tow:ConnectRear', entity)
				end,
			},
			{
				label = 'ازالة القلص',
				icon = 'fa-solid fa-lasso',
				item = 'towing_rope',
				distance = 2.0,
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					return exports['rt-towing']:check()
						and not exports['FB-Jobs']:startDelivery()
					-- and not exports['RespectFuel']:HoldingNozzle()
				end,
				action = function(entity)
					TriggerEvent('tow:DetachRope', entity)
				end,
			},
			{
				event = 'RespectEMS:toggleStretcher',
				icon = 'fa-solid fa-stretcher',
				label = 'استخراج النقالة',
				distance = 2.0,
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					-- print('test2', exports['rt-ambulance']:IsVehicleAmbulance(entity), not exports['rt-ambulance']:IsVehicleAmbulance(entity), exports['rt-ambulance']:MovingStretcher())
					if not exports['rt-ambulance']:IsVehicleAmbulance(entity) or exports['rt-ambulance']:MovingStretcher() then return false end
					local alreadyDeployed = exports['rt-ambulance']:HasAmbulanceSpawnedStretcher(VehToNet(entity))
					local stretcherInside = exports['rt-ambulance']:GetStretcherInVehicle(entity)
					-- print('test', not alreadyDeployed, stretcherInside, not exports['FB-Jobs']:startDelivery())
					return (not alreadyDeployed or stretcherInside) and not exports['FB-Jobs']:startDelivery()
					-- and not exports['RespectFuel']:HoldingNozzle()
				end,
				job = 'ambulance',
			},
			{
				event = 'RespectEMS:stretcherInVehicle',
				icon = 'fa-solid fa-stretcher',
				label = 'ارجاع النقالة',
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					-- if not exports['rt-ambulance']:IsVehicleAmbulance(entity) or not IsNearTrunk(entity) then return false end
					if not exports['rt-ambulance']:IsVehicleAmbulance(entity) then return false end
					local stretcherInside = exports['rt-ambulance']:GetStretcherInVehicle(entity)
					if stretcherInside then return false end
					if exports['rt-ambulance']:MovingStretcher() then return true end
					if not exports['rt-ambulance']:GetClosestStretcher(3.0) then return false end
					return true
				end,
				job = 'ambulance',
			},



						{
				type = "client",
				action = function(entity)
					if (exports['RespectFuel']:inGasStation() or exports['RespectFuel']:drb7hCar3()) and not exports['RespectFuel']:isReFullingVehicle() then
						TriggerEvent('RespectFuel:client:RefuelMenu', nil, entity)
					elseif exports['RespectFuel']:isReFullingVehicle() then
						TriggerEvent('RespectFuel:client:startReFuelVehicle', entity)
					elseif not exports['RespectFuel']:isReFullingVehicle() then
						TriggerEvent('RespectFuel:client:electric:RefuelMenu')
					end
				end,
				icon = "fas fa-gas-pump",
				label = 'وضع الخرطوم',
				canInteract = function(entity)
					-- if exports['RespectFuel']:inGasStation() or exports['RespectFuel']:IsHoldingElectricNozzle() then
					if not exports['RespectFuel']:drb7hCar2(entity) then
						return false
					end

					if exports['RespectFuel']:drb7hCar3() then
						return true
					end

					if exports['RespectFuel']:isReFullingVehicle() then
						if exports['RespectFuel']:isReFullingVehicle() and not exports['RespectFuel']:inGasStation() and exports['RespectFuel']:isNearRefuelPumper() then
							return true
						end
					else
						if exports['RespectFuel']:inGasStation() or exports['RespectFuel']:isReFullingVehicle() then
							return true
						end
					end
				end
			},

			{
				type = "client",
				action = function(entity)
					TriggerEvent('RespectFuel:client:startDrb7hReFuelVehicle', entity)
				end,
				icon = "fas fa-gas-pump",
				label = 'سحب الخرطوم',
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					return exports['RespectFuel']:drb7hCar(entity) and
					not QBCore.Functions.GetPlayerData().metadata["isdead"] and GetVehicleEngineHealth(entity) > 0 and
					not exports['RespectFuel']:drb7hCar3() and not exports['RespectFuel']:drb7hCar4()
				end,
				distance = 1.3,
			},

			{
				type = "client",
				action = function(entity)
					TriggerEvent('RespectFuel:client:startDrb7hReFuelVehicle', entity)
				end,
				icon = "fas fa-gas-pump",
				label = 'ارجاع الخرطوم',
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					return exports['RespectFuel']:drb7hCar(entity) and
					not QBCore.Functions.GetPlayerData().metadata["isdead"] and GetVehicleEngineHealth(entity) > 0 and
					exports['RespectFuel']:drb7hCar3() and not exports['RespectFuel']:drb7hCar2(entity)
				end,
				distance = 1.3,
			},


						{
				icon = "fa-solid fa-fire-flame-simple",
				label = "تعبئة المركبة",
				distance = 2.0,
				action = function(entity)
					QBCore.Functions.TriggerCallback('RespectFuel:jerrycan:refuelmenu', function(hasitem, item)
						-- print(hasitem, item, 'hasitem, item')
						if hasitem then
							TriggerEvent('RespectFuel:jerrycan:refuelmenu', item)
						end
					end, 'weapon_petrolcan')
				end,
				canInteract = function(entity)
					if exports['FBScripts']:inTrunk() then return false end
					if not QBCore.Functions.GetPlayerData().metadata["isdead"] then
						if GetSelectedPedWeapon(PlayerPedId()) == GetHashKey("weapon_petrolcan") then
							return true
						end
					end
					return false
				end,
			},



			-- {
			-- 	type = "client",
			-- 	action = function()
			-- 	end,
			-- 	label = 'وضع الخرطوم',
			-- 	canInteract = function()
			-- 		print(exports['RespectFuel']:IsHoldingElectricNozzle(), "exports['RespectFuel']:IsHoldingElectricNozzle()")
			-- 		if exports['RespectFuel']:IsHoldingElectricNozzle() then
			-- 			return true
			-- 		else
			-- 			return false
			-- 		end
			-- 	end
			-- },




			-- {
			-- 	type = "client",
			-- 	action = function()
			-- 	end,
			-- 	label = 'وضع الخرطوم',
			-- 	canInteract = function()
			-- 		print(exports['cdn-fuel']:IsHoldingElectricNozzle(), "exports['cdn-fuel']:IsHoldingElectricNozzle()")
			-- 		if exports['cdn-fuel']:IsHoldingElectricNozzle() then
			-- 			return true
			-- 		else
			-- 			return false
			-- 		end
			-- 	end
			-- },
		},
	},
}


Respect.TargetModels = {

}

Respect.GlobalPedOptions = {

}

Respect.GlobalVehicleOptions = {

}

Respect.GlobalObjectOptions = {

}


Respect.GlobalPlayerOptions = {
    options = {
--         {
-- 			icon = "fa-solid fa-hand-holding-dollar",
-- 			label = "اعطاء مبلغ",
-- 			canInteract = function(entity)
-- 				if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] then
-- 					return true
-- 				end
-- 				return false
-- 			end,
-- 			action = function(entity)
-- 				local input = lib.inputDialog('اعطاء مبلغ', {
-- 					{ type = 'number', label = 'المبلغ', required = true, },
-- 				})
-- 				if not input then return end

-- 				if IsEntityPlayingAnim(PlayerPedId(), 'random@mugging3', 'handsup_standing_base', 3) or IsEntityPlayingAnim(PlayerPedId(), "dead", "dead_a", 3) then return end
-- 				TriggerServerEvent('RespectTarget:server:giveCash',
-- 					GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)), input[1])
-- 			end,
-- 		},

		-- {
		-- 	icon = "fa-solid fa-sack-dollar",
		-- 	label = "سرقة الكاش",
		-- 	canInteract = function(entity)
		-- 		local Data = QBCore.Functions.GetPlayerData()
		
		-- 		if not IsPedInAnyVehicle(PlayerPedId()) and not Data.metadata["isdead"] then
		-- 			if (
		-- 				IsEntityPlayingAnim(entity, 'random@mugging3', 'handsup_standing_base', 3) or
		-- 				IsEntityPlayingAnim(entity, 'mp_arrest_paired', 'crook_p2_back_right', 3) or
		-- 				IsEntityPlayingAnim(entity, 'anim@move_m@prisoner_cuffed', 'idle', 3) or
		-- 				IsEntityPlayingAnim(entity, 'mp_arresting', 'idle', 3) or
		-- 				IsEntityPlayingAnim(entity, "dead", "dead_a", 3) or
		-- 				IsEntityPlayingAnim(entity, "missarmenian2", "drunk_loop", 3)
		-- 			) then
		-- 				return true
		-- 			end
		-- 		end
		
		-- 		return false
		-- 	end,
		-- 	action = function(entity)
		-- 		local busy = exports["RespectHud"]:isDoingSomething()
		-- 		if busy then 
		-- 			return TriggerEvent('QBCore:Notify', 'لا يمكنك فعل شيء الان', 'error', 5000) 
		-- 		end
		
		-- 		QBCore.Functions.Progressbar(
		-- 			"robberyPlayerCash",
		-- 			"جاري سرقة كاش الشخص",
		-- 			math.random(5000, 10000),
		-- 			'fa-solid fa-user-ninja',
		-- 			false,
		-- 			true,
		-- 			{
		-- 				disableMovement = true,
		-- 				disableCarMovement = true,
		-- 				disableMouse = false,
		-- 				disableCombat = true,
		-- 			},
		-- 			{
		-- 				animDict = "random@shop_robbery",
		-- 				anim = "robbery_action_b",
		-- 				flags = 49,
		-- 			},
		-- 			{},
		-- 			{},
		-- 			function() -- Done
		-- 				TriggerEvent('RespectEvidence:client:addEvidence')
		-- 				TriggerServerEvent('RespectTarget:server:stealCash', GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
		-- 			end
		-- 		)
		-- 	end,
		-- },
		

	{
		icon = "fa-solid fa-magnifying-glass",
		label = "تفتيش كامل",
		canInteract = function(entity)
			if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] and QBCore.Functions.GetPlayerData().job.onduty and QBCore.Functions.GetPlayerData().job.name == "police" then
				return true
			end
			return false
		end,
		action = function(entity)
			TriggerEvent("FB-PoliceJob:client:tfteshKaml", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
		end,
	}, 

	

	{
		icon = "fa-solid fa-magnifying-glass",
		label = "تفتيش كامل",
		canInteract = function(entity)
			if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] and QBCore.Functions.GetPlayerData().job.onduty and QBCore.Functions.GetPlayerData().job.name == "losarmy" then
				return true
			end
			return false
		end,
		action = function(entity)
			TriggerEvent("FB-PoliceJob:client:tfteshKaml", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
		end,
	}, 


		{
		icon = "fa-solid fa-people-robbery",
			label = "سرقة الشخص",
			canInteract = function(entity)
				local Data = QBCore.Functions.GetPlayerData()
				if not IsPedInAnyVehicle(PlayerPedId())
					and not Data.metadata["isdead"]
					and (
						IsEntityPlayingAnim(entity, 'random@mugging3', 'handsup_standing_base', 3)
						or IsEntityPlayingAnim(entity, 'mp_arrest_paired', 'crook_p2_back_right', 3)
						or IsEntityPlayingAnim(entity, 'anim@move_m@prisoner_cuffed', 'idle', 3)
						or IsEntityPlayingAnim(entity, 'mp_arresting', 'idle', 3)
						or IsEntityPlayingAnim(entity, "dead", "dead_a", 3)
						 or IsEntityPlayingAnim(entity, "mini@cpr@char_b@cpr_def", "cpr_pumpchest_idle", 3)
					or IsEntityPlayingAnim(entity, "missarmenian2", "drunk_loop", 3)
					) then
					return true
			end
			return false
			end,
			action = function(entity)
				local busy = exports["RespectHud"]:isDoingSomething()
				if busy then
					return TriggerEvent('QBCore:Notify', 'لا يمكنك فعل شيء الان', 'error', 5000)
				end

			local playerPed = PlayerPedId()
				local targetPed = entity
		    local initialCoords = GetEntityCoords(playerPed)

				QBCore.Functions.Progressbar("robberyPlayer", "جاري سرقة الشخص", 3000, 'fa-solid fa-user-ninja', false, true, {
					disableMovement = true,
					disableCarMovement = true,
					disableMouse = false,
				disableCombat = true,
				}, {
					animDict = "random@shop_robbery",
				anim = "robbery_action_b",
					flags = 49,
				}, {}, {}, function()
					TriggerEvent('RespectEvidence:client:addEvidence')
					TriggerServerEvent("inventory:server:OpenInventory", "otherplayer",
						GetPlayerServerId(NetworkGetPlayerIndexFromPed(targetPed)))
				end, function()
					TriggerEvent('QBCore:Notify', 'تم إلغاء السرقة', 'error')
				end)

				Citizen.CreateThread(function()
					local progressActive = true
					while progressActive do
						Citizen.Wait(500)
						local currentCoords = GetEntityCoords(playerPed)
						local distance = #(currentCoords - GetEntityCoords(targetPed))
						if distance > 2.5 then
							progressActive = false
					TriggerEvent("progressbar:client:cancel")
							TriggerEvent("RespectInventory:client:closeInventory")
							 TriggerEvent('QBCore:Notify', 'ابتعدت عن الشخص، تم إلغاء السرقة', 'error')
							break
						end
					end
				end)
			end,
		},
	 {
		icon = "fa-solid fa-vials",
		label = "جي اس ار",
		canInteract = function(entity)
			if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] and QBCore.Functions.GetPlayerData().job.onduty and (QBCore.Functions.GetPlayerData().job.name == "police" or QBCore.Functions.GetPlayerData().job.name == "ambulance") then
				return true
			end
			return false
		end,
		action = function(entity)
			TriggerEvent("FB-PoliceJob:client:gsr", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
		end,
	}, 
	

	 {
		icon = "fa-solid fa-magnifying-glass",
		label = "تفتيش خارجي",
		canInteract = function(entity)
			if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] and QBCore.Functions.GetPlayerData().job.onduty and QBCore.Functions.GetPlayerData().job.name == "police" then
				return true
			end
			return false
		end,
		action = function(entity)
			TriggerEvent("FB-PoliceJob:client:tftesh5arge", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
		end,
	}, 


	-- 	{
	-- 	icon = "fa-solid fa-receipt",
	-- 	label = 'استعلام الإيصالات',
	-- 	action = function(entity)
	-- 		TriggerEvent('RespectReceipts:server:getReceipts',
	-- 			GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
	-- 	end,
	-- 	canInteract = function(entity)
	-- 		local Data = QBCore.Functions.GetPlayerData()
	-- 		if not IsPedInAnyVehicle(PlayerPedId()) and not exports['FB-PoliceJob']:IsHandcuffed() and not QBCore.Functions.GetPlayerData().metadata["isdead"] and not IsPedInAnyVehicle(PlayerPedId()) and not Data.metadata["isdead"] and QBCore.Functions.GetPlayerData().job.onduty and (QBCore.Functions.GetPlayerData().job.name == "police" or (QBCore.Functions.GetPlayerData().job.name == "justice" and QBCore.Functions.GetPlayerData().job.grade.level >= 5)) then
	-- 			return true
	-- 		end
	-- 		return false
	-- 	end,
	-- },


		{
            type = "client",
            event = "fb-smallresources:Client:TakeHostage",
            canInteract = function(entity)
                if not IsPedInAnyVehicle(PlayerPedId()) and not QBCore.Functions.GetPlayerData().metadata["isdead"] then
                    return true
                end
                return false
            end,
            icon = "fa-solid fa-gun",
            label = "اخذ رهينه",
        },
    },
    distance = 2.0
}

Respect.Peds = {}
