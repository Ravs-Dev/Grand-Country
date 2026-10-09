Config = {}

-- Keybind
Config.Keybind = 'F1'
-- true  = press once to open, press F1/Escape again to close
-- false = hold F1 to keep the menu open
Config.Toggle = true
Config.UseWhileWalking = true
Config.DisableWhenDead = true
Config.Debug = false

-- UI theme sent to NUI. Change these if you want another GCR palette.
Config.Theme = {
    accent = '#ff7a18',
    accentSoft = 'rgba(255, 122, 24, 0.20)',
    panel = 'rgba(13, 15, 20, 0.94)',
    panelSoft = 'rgba(20, 23, 30, 0.90)',
    text = '#f5f7fb',
    muted = '#9299a7'
}

-- Base menu. Vehicle and job menus are built dynamically in client/main.lua.
-- Supported leaf fields:
-- type = 'client' | 'server' | 'command'
-- event = event/command name
-- args = optional argument
-- shouldClose = true/false
-- requiredResource = only show when resource is started
Config.MenuItems = {
    {
        id = 'player',
        title = 'Player',
        description = 'Quick character actions',
        icon = 'user',
        items = {
            {
                id = 'handsup',
                title = 'Hands Up',
                description = 'Toggle hands-up animation',
                icon = 'hands',
                action = 'emote:handsup',
                shouldClose = true
            },
            {
                id = 'point',
                title = 'Point',
                description = 'Toggle pointing',
                icon = 'point',
                action = 'emote:point',
                shouldClose = true
            },
            {
                id = 'crossarms',
                title = 'Cross Arms',
                description = 'Cross your arms',
                icon = 'person',
                action = 'emote:crossarms',
                shouldClose = true
            },
            {
                id = 'salute',
                title = 'Salute',
                description = 'Play salute animation',
                icon = 'salute',
                action = 'emote:salute',
                shouldClose = true
            },
            {
                id = 'cancelanim',
                title = 'Stop Animation',
                description = 'Clear current animation',
                icon = 'x',
                action = 'emote:cancel',
                shouldClose = true
            }
        }
    },
    {
        id = 'appearance',
        title = 'Appearance',
        description = 'Outfits and saved appearance',
        icon = 'shirt',
        requiredResource = 'illenium-appearance',
        items = {
            {
                id = 'outfits',
                title = 'Outfits',
                description = 'Open saved outfit menu',
                icon = 'shirt',
                type = 'client',
                event = 'illenium-appearance:client:openOutfitMenu',
                shouldClose = true
            },
            {
                id = 'reloadskin',
                title = 'Reload Skin',
                description = 'Reload your saved appearance',
                icon = 'refresh',
                type = 'client',
                event = 'illenium-appearance:client:reloadSkin',
                shouldClose = true
            }
        }
    },
    {
        id = 'property',
        title = 'Property',
        description = 'House interactions',
        icon = 'house',
        requiredResource = 'qb-houses',
        items = {
            {
                id = 'givehousekey',
                title = 'Give House Key',
                icon = 'key',
                type = 'client',
                event = 'qb-houses:client:giveHouseKey',
                shouldClose = true
            },
            {
                id = 'removehousekey',
                title = 'Remove House Key',
                icon = 'key',
                type = 'client',
                event = 'qb-houses:client:removeHouseKey',
                shouldClose = true
            },
            {
                id = 'togglehouse',
                title = 'Toggle House Lock',
                icon = 'lock',
                type = 'client',
                event = 'qb-houses:client:toggleDoorlock',
                shouldClose = true
            },
            {
                id = 'decoratehouse',
                title = 'Decorate House',
                icon = 'house',
                type = 'client',
                event = 'qb-houses:client:decorate',
                shouldClose = true
            }
        }
    }
}

-- Standard QBCore job actions. They only appear for the matching job and when
-- the required resource is running.
Config.JobInteractions = {
    police = {
        title = 'Police',
        icon = 'badge',
        requiredResource = 'qb-policejob',
        onDuty = true,
        items = {
            {
                id = 'police_emergency',
                title = 'Emergency Button',
                icon = 'bell',
                type = 'client',
                event = 'police:client:SendPoliceEmergencyAlert',
                shouldClose = true
            },
            {
                id = 'police_cuff',
                title = 'Cuff',
                icon = 'link',
                type = 'client',
                event = 'police:client:CuffPlayerSoft',
                shouldClose = true
            },
            {
                id = 'police_escort',
                title = 'Escort',
                icon = 'users',
                type = 'client',
                event = 'police:client:EscortPlayer',
                shouldClose = true
            },
            {
                id = 'police_putvehicle',
                title = 'Put In Vehicle',
                icon = 'car',
                type = 'client',
                event = 'police:client:PutPlayerInVehicle',
                shouldClose = true
            },
            {
                id = 'police_outvehicle',
                title = 'Take Out Vehicle',
                icon = 'car',
                type = 'client',
                event = 'police:client:SetPlayerOutVehicle',
                shouldClose = true
            },
            {
                id = 'police_removeobject',
                title = 'Remove Object',
                icon = 'trash',
                type = 'client',
                event = 'police:client:deleteObject',
                shouldClose = true
            }
        }
    },
    ambulance = {
        title = 'EMS',
        icon = 'heart',
        requiredResource = 'qb-ambulancejob',
        onDuty = true,
        items = {
            {
                id = 'ems_status',
                title = 'Check Status',
                icon = 'heart',
                type = 'client',
                event = 'hospital:client:CheckStatus',
                shouldClose = true
            },
            {
                id = 'ems_revive',
                title = 'Revive',
                icon = 'plus',
                type = 'client',
                event = 'hospital:client:RevivePlayer',
                shouldClose = true
            },
            {
                id = 'ems_treat',
                title = 'Treat Wounds',
                icon = 'medkit',
                type = 'client',
                event = 'hospital:client:TreatWounds',
                shouldClose = true
            },
            {
                id = 'ems_escort',
                title = 'Escort',
                icon = 'users',
                type = 'client',
                event = 'police:client:EscortPlayer',
                shouldClose = true
            }
        }
    },
    taxi = {
        title = 'Taxi',
        icon = 'taxi',
        requiredResource = 'qb-taxi',
        items = {
            {
                id = 'taxi_meter',
                title = 'Show / Hide Meter',
                icon = 'meter',
                type = 'client',
                event = 'qb-taxi:client:toggleMeter',
                shouldClose = false
            },
            {
                id = 'taxi_startmeter',
                title = 'Start / Stop Meter',
                icon = 'play',
                type = 'client',
                event = 'qb-taxi:client:enableMeter',
                shouldClose = true
            },
            {
                id = 'taxi_npc',
                title = 'NPC Mission',
                icon = 'user',
                type = 'client',
                event = 'qb-taxi:client:DoTaxiNpc',
                shouldClose = true
            }
        }
    },
    tow = {
        title = 'Tow',
        icon = 'truck',
        requiredResource = 'qb-towjob',
        items = {
            {
                id = 'tow_vehicle',
                title = 'Tow Vehicle',
                icon = 'truck',
                type = 'client',
                event = 'qb-tow:client:TowVehicle',
                shouldClose = true
            }
        }
    },
    mechanic = {
        title = 'Mechanic',
        icon = 'wrench',
        items = {
            {
                id = 'mechanic_tow',
                title = 'Tow Vehicle',
                icon = 'truck',
                type = 'client',
                event = 'qb-tow:client:TowVehicle',
                requiredResource = 'qb-towjob',
                shouldClose = true
            }
        }
    }
}

Config.Vehicle = {
    MaxExtras = 20,
    ShowEngine = true,
    ShowLocks = true,
    ShowDoors = true,
    ShowWindows = true,
    ShowSeats = true,
    ShowExtras = true
}
