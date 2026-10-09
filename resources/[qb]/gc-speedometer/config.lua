Config = {}

-- ============================================================
-- GRAND COUNTRY ROLEPLAY - GCR HUD
-- ============================================================

-- Hide / show HUD
Config.ToggleKey = 'F10'

-- Logo kanan atas
Config.ShowLogo = true

-- Interval update
Config.StatusRefresh = 150        -- health/armor/stamina/vehicle
Config.PlayerInfoRefresh = 3000   -- money/job/gang/metadata
Config.OnlineRefresh = 5000       -- player online

-- Speedometer
Config.SpeedUnit = 'KM/H'         -- 'KM/H' atau 'MPH'

-- Mengizinkan damage antar-player untuk pukulan / tembakan.
-- Tidak mematikan God Mode / invincibility admin secara paksa.
Config.EnablePvpDamage = true

-- Jika LegacyFuel aktif, HUD akan mencoba membacanya.
-- Kalau tidak aktif, otomatis memakai GetVehicleFuelLevel().
Config.UseLegacyFuel = true

-- ============================================================
-- HUNGER / THIRST
-- ============================================================
-- Aktifkan fallback ini kalau hunger / thirst di server kamu
-- tidak berkurang sendiri.
--
-- PENTING:
-- Jika qb-core kamu SUDAH punya needs decay sendiri,
-- ubah Enabled = false supaya tidak turun dua kali.
-- ============================================================

Config.NeedsDecay = {
    Enabled = true,
    Interval = 60000,       -- 60 detik
    HungerDecrease = 0.8,
    ThirstDecrease = 1.0
}

-- ============================================================
-- DAMAGE KETIKA HUNGER / THIRST = 0
-- ============================================================
-- Default dimatikan. Bisa diaktifkan kalau diperlukan.
-- ============================================================

Config.ZeroNeedsDamage = {
    Enabled = false,
    Damage = 5,
    Interval = 10000
}

-- Debug tambahan
Config.Debug = false
