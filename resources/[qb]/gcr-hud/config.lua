Config = {}

-- Tombol untuk hide/show HUD.
Config.ToggleKey = 'F10'

-- Tampilkan logo kanan atas.
Config.ShowLogo = true

-- Jika qb-core / resource lain kamu SUDAH menurunkan hunger & thirst,
-- ubah Enabled menjadi false supaya tidak turun dua kali.
Config.NeedsDecay = {
    Enabled = true,
    Interval = 60000, -- 60 detik
    HungerDecrease = 0.8,
    ThirstDecrease = 1.0
}

-- Opsional: damage saat hunger/thirst 0.
Config.ZeroNeedsDamage = {
    Enabled = false,
    Damage = 5,
    Interval = 10000
}

-- Update online players.
Config.OnlineRefresh = 5000

-- Unit kecepatan.
Config.SpeedUnit = 'KM/H'
