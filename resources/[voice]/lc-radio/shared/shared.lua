---@type number
Shared.MaxFrequency = 500.00 -- Max Limit of Radio Channel

---@class Jammer
---@field state boolean
---@field model string
---@field permission string[]
---@field default table
---@field range table

---@type Jammer
Shared.Jammer = {
    state = true, -- to use jammer system or not
    model = 'sm_prop_smug_jammer', -- prop to spawn for jammer
    permission = {"police"}, -- permission how can setup jammer (job/gang)
    default = {}, -- default jammer setup location
    range = {
        min = 10.0,
        max = 100.0,
        step = 5.0,
        default = 30.0
    }
}

---@type string[]
Shared.RadioItem = {
    'radio'
}

---@class Battery
---@field state boolean
---@field consume number
---@field depletionTime number

---@type Battery
Shared.Battery = {
    state = false, -- to use battery system or not
    consume = 1, -- battery consume rate
    depletionTime = 1, -- in minute, every 1 minute battery will decrease by consume value
}

---@type [string]: string
Shared.RadioNames = {
    ["1"] = "موجة", -- channel value 1
    ["1.%"] = "موجة", -- channel value 1.%%%% string formatter
    ["2"] = "موجة",
    ["2.%"] = "موجة",
    ["3"] = "موجة",
    ["3.%"] = "موجة",
    ["4"] = "موجة",
    ["4.%"] = "موجة",
    ["5"] = "موجة",
    ["5.%"] = "موجة",
    ["6"] = "موجة",
    ["6.%"] = "موجة",
    ["7"] = "موجة",
    ["7.%"] = "موجة",
    ["8"] = "موجة",
    ["8.%"] = "موجة",
    ["9"] = "موجة",
    ["9.%"] = "موجة",
    ["10"] = "موجة",
    ["10.%"] = "موجة",
    ["420"] = "Ballas CH#1",
    ["420.%"] = "Ballas CH#1",
    ["421"] = "LostMC CH#1",
    ["421.%"] = "LostMC CH#1",
    ["422"] = "Vagos CH#1",
    ["422.%"] = "Vagos CH#1",
}

Shared.RestrictedChannels = {
    [1] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [2] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [3] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [4] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [5] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [6] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [7] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [8] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [9] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [10] = { -- channel id
        type = 'job', -- job/gang
        name = {"police", "losarmy", "ambulance", "justice"}
    },
    [12] = {type = 'job', name = {"losarmy"}},
    [13] = {type = 'job', name = {"losarmy"}},
    [14] = {type = 'job', name = {"losarmy"}},
    [15] = {type = 'job', name = {"police","losarmy"}},
    [11] = {type = 'job', name = {"poletoarmy"}},
    [22] = {type = 'job', name = {"poletoarmy"}},
    [33] = {type = 'job', name = {"poletopolice","poletoarmy"}},
    [44] = {type = 'job', name = {"poletopolice","poletoarmy"}},
    [55] = {type = 'job', name = {"poletopolice","poletoarmy"}},
    [66] = {type = 'job', name = {"poletopolice","poletoarmy"}},
    [420] = { -- channel id
        type = 'gang', -- job/gang
        name = {"ballas"}
    },
    [421] = { -- channel id
        type = 'gang', -- job/gang
        name = {"lostmc"}
    },
    [422] = {
        type = 'gang', -- job/gang
        name = {"vagos"}
    },
}

lib.locale()