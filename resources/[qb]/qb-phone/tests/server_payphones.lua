dofile("sky_phone/source/server/payphones.lua")

local allowed_models = {
    prop_phonebox_01a = true,
    prop_phonebox_04 = true,
}

local detected = SkyPhonePayphones.ValidateDetected(
    { model = "prop_phonebox_01a", coords = { x = 100.0, y = 200.0, z = 30.0 } },
    allowed_models,
    { x = 101.0, y = 200.0, z = 30.0 },
    3.0
)
assert(detected and detected.model == "prop_phonebox_01a", "a nearby detected booth must be accepted")
assert(detected.coords.x == 100.0, "validated booth coordinates must be preserved")

assert(
    not SkyPhonePayphones.ValidateDetected(
        { model = "not_allowed", coords = { x = 100.0, y = 200.0, z = 30.0 } },
        allowed_models,
        { x = 101.0, y = 200.0, z = 30.0 },
        3.0
    ),
    "a detected booth with a disallowed model must be rejected"
)
assert(
    not SkyPhonePayphones.ValidateDetected(
        { model = "prop_phonebox_01a", coords = { x = "100", y = 200.0, z = 30.0 } },
        allowed_models,
        { x = 101.0, y = 200.0, z = 30.0 },
        3.0
    ),
    "malformed detected booth coordinates must be rejected"
)
assert(
    not SkyPhonePayphones.ValidateDetected(
        { model = "prop_phonebox_01a", coords = { x = 100.0, y = 200.0, z = 30.0 } },
        allowed_models,
        { x = 110.0, y = 200.0, z = 30.0 },
        3.0
    ),
    "a player away from the detected booth must be rejected"
)

print("Detected payphone validation tests passed")
