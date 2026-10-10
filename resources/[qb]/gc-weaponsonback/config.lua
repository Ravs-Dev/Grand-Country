Config = {}

-- How often to reconcile inventory, current equipment and the visual props.
Config.UpdateInterval = 300
Config.HideInVehicles = false
Config.Debug = false

-- Bone 24816 = upper spine, 11816 = pelvis. Position and rotation are relative to the bone.
Config.Slots = {
    back = { bone = 24816, pos = vec3(0.13, -0.17, 0.03), rot = vec3(0.0, 170.0, 0.0) },
    back2 = { bone = 24816, pos = vec3(-0.13, -0.17, 0.03), rot = vec3(0.0, 190.0, 0.0) },
    hip = { bone = 11816, pos = vec3(0.12, 0.04, 0.04), rot = vec3(-75.0, 0.0, 5.0) },
    hip2 = { bone = 11816, pos = vec3(-0.12, 0.04, 0.04), rot = vec3(-75.0, 0.0, -5.0) },
}

-- Priority follows inventory order. The first eligible item gets its preferred slot;
-- the second long item may use back2. Two visual props never occupy the same slot.
-- Extend this map for additional custom items after confirming their model names.
Config.Items = {
    weapon_pistol = { model = 'w_pi_pistol', slot = 'hip' },
    weapon_combatpistol = { model = 'w_pi_combatpistol', slot = 'hip' },
    weapon_pistol50 = { model = 'w_pi_pistol50', slot = 'hip' },
    weapon_heavypistol = { model = 'w_pi_heavypistol', slot = 'hip' },
    weapon_vintagepistol = { model = 'w_pi_vintage_pistol', slot = 'hip' },
    weapon_snspistol = { model = 'w_pi_sns_pistol', slot = 'hip' },
    weapon_smg = { model = 'w_sb_smg', slot = 'back' },
    weapon_assaultsmg = { model = 'w_sb_assaultsmg', slot = 'back' },
    weapon_microsmg = { model = 'w_sb_microsmg', slot = 'back' },
    weapon_carbinerifle = { model = 'w_ar_carbinerifle', slot = 'back' },
    weapon_assaultrifle = { model = 'w_ar_assaultrifle', slot = 'back' },
    weapon_specialcarbine = { model = 'w_ar_specialcarbine', slot = 'back' },
    weapon_bullpuprifle = { model = 'w_ar_bullpuprifle', slot = 'back' },
    weapon_advancedrifle = { model = 'w_ar_advancedrifle', slot = 'back' },
    weapon_pumpshotgun = { model = 'w_sg_pumpshotgun', slot = 'back' },
    weapon_sawnoffshotgun = { model = 'w_sg_sawnoff', slot = 'back' },
    weapon_bullpupshotgun = { model = 'w_sg_bullpupshotgun', slot = 'back' },
    weapon_sniperrifle = { model = 'w_sr_sniperrifle', slot = 'back' },
    weapon_heavysniper = { model = 'w_sr_heavysniper', slot = 'back' },
    weapon_bat = { model = 'w_me_bat', slot = 'back' },
    weapon_crowbar = { model = 'w_me_crowbar', slot = 'back' },
}
