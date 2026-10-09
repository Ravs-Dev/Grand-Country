
Config = {}

Config.DefaultNumberOfCharacters = 1
Config.PlayersNumberOfCharacters = {}
Config.EnableDeleteButton = true
Config.SkipSelection = false

Config.DefaultSpawn = vector4(-1035.71, -2731.87, 13.76, 330.0)

Config.Scene = {
    Ped = vector4(-46.40, -1758.80, 29.42, 225.0),

    Camera = vector3(-43.90, -1762.40, 30.60),
    LookAt = vector3(-46.40, -1758.80, 29.75),

    Fov = 44.0,

    Crate = true,
    CrateModel = 'prop_box_wood05a',
    CrateOffset = vector3(0.0, 0.0, -0.4),

    PedHeightOffset = 0.25,

    SitAnimDict = 'anim@amb@office@seating@male@var_a@base@',
    SitAnimName = 'base',
    AnimMovement = 1,

    Weather = 'CLEAR',
    Hour = 21,
    Minute = 30,

    CameraSway = true,
}

-- Appearance system
Config.UseQbClothing = false
Config.AppearanceResource = 'illenium-appearance'

-- Debug
Config.PreviewDebug = true

-- Interface
Config.EnablePhotoMode = true
Config.FadeTime = 650
