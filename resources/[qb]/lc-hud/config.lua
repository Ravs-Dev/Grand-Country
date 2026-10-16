Config = {}

Config.ServerName = 'LineCity Roleplay'

-- HUD refresh. Health/stamina are sampled fast enough to react to falls/vehicle impacts.
Config.RefreshRate = 100

-- FiveM Push To Talk action. Default is N for new players.
-- IMPORTANT: this is an INPUT ACTION (249), not a hard-coded physical key.
-- If a player changes Push To Talk in FiveM Settings > Key Bindings, the HUD
-- follows that remapped key automatically. FiveM stores the player's mapping.
Config.VoicePTTControl = 249
Config.VoicePTTFallback = true
Config.PlayerCountRefresh = 10000

-- Delay after QBCore player-loaded event before showing HUD.
-- Keeps the HUD out of multicharacter/transition screens.
Config.SpawnHudDelay = 900

-- Minimap is shown only after the character has spawned.
Config.ShowMinimap = true

-- Compatibility setting from the older HUD; no longer used by the new minimap loop.
Config.HideMinimapInGameplay = false

-- Optional vehicle HUD.
Config.ShowVehicleHud = true
Config.SpeedUnit = 'KM/H' -- 'KM/H' or 'MPH'

-- Body injury detector.
Config.EnableBodyInjury = false
Config.SaveInjuriesToMetadata = false
Config.PersistInjuries = false
Config.InjuryDisplayTime = 45000
Config.InjuryMinDamage = 5
Config.ClearInjuriesOnRevive = true

-- QBCore needs tick.
-- IMPORTANT: this resource replaces the original qb-hud loop that normally calls
-- QBCore:UpdatePlayer. Without this, hunger/thirst can appear stuck.
Config.EnableNeedsTick = false
Config.NeedsTickMs = 300000 -- Kept only as a fallback; qb-core already updates needs every 5 minutes.

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
