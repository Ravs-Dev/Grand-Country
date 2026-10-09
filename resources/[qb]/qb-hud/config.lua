Config = {}

Config.ServerName = 'Grand Country Roleplay'

-- HUD refresh. 150-250ms is smooth enough without wasting resources.
Config.RefreshRate = 200
Config.PlayerCountRefresh = 10000

-- Minimap hidden during normal gameplay; it is shown while ESC/pause menu is open.
Config.HideMinimapInGameplay = true

-- Optional vehicle HUD at the bottom center.
Config.ShowVehicleHud = true

-- Injury detector.
Config.EnableBodyInjury = true
Config.SaveInjuriesToMetadata = true

-- true  = red body parts stay red until revive/heal command clears them.
-- false = they automatically clear after InjuryDisplayTime milliseconds.
Config.PersistInjuries = true
Config.InjuryDisplayTime = 120000
Config.ClearInjuriesOnRevive = true

Config.DefaultJob = 'Civilian - Freelancer'
Config.DefaultGang = 'No Gang - Unaffiliated'
