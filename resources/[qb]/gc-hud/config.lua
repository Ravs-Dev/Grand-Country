Config = {}

Config.ServerName = 'Grand Country Roleplay'

-- HUD refresh. Health/stamina are sampled fast enough to react to falls/vehicle impacts.
Config.RefreshRate = 100
Config.PlayerCountRefresh = 10000

-- Minimap hidden during gameplay; visible while ESC/pause menu is open.
Config.HideMinimapInGameplay = true

-- Optional vehicle HUD.
Config.ShowVehicleHud = true
Config.SpeedUnit = 'KM/H' -- 'KM/H' or 'MPH'

-- Body injury detector.
Config.EnableBodyInjury = true
Config.SaveInjuriesToMetadata = true
Config.PersistInjuries = true
Config.InjuryDisplayTime = 120000
Config.ClearInjuriesOnRevive = true

-- QBCore needs tick.
-- IMPORTANT: this resource replaces the original qb-hud loop that normally calls
-- QBCore:UpdatePlayer. Without this, hunger/thirst can appear stuck.
Config.EnableNeedsTick = true
Config.NeedsTickMs = 45000 -- 45 seconds. Use 60000 if you want slower hunger/thirst.

-- Damage watchdog.
-- Keeps normal RP players damageable so falls/vehicle impacts are not ignored if
-- another resource accidentally leaves invincibility enabled.
-- It is skipped while dead/in-last-stand and when common godmode statebags are true.
Config.EnsurePlayerDamageable = true
Config.DamageableCheckMs = 1500

-- If your admin/godmode resource does NOT expose a statebag such as godmode/invincible,
-- set this false so this HUD does not override that admin feature.
Config.RespectGodmodeStatebags = true

-- Hunger/thirst zero effects. This is intentionally lightweight.
Config.EnableZeroNeedsHealthLoss = false
Config.ZeroNeedsCheckMs = 5000
Config.ZeroNeedsHealthLoss = 1

Config.DefaultJob = 'Civilian - Freelancer'
Config.DefaultGang = 'No Gang - Unaffiliated'
