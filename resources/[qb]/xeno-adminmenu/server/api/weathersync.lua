
if not Config.WeatherSync.Enabled then return end

local function GetState()
    return GlobalState.xenoWeather or {
        weather = Config.WeatherSync.DefaultWeather,
        hour = Config.WeatherSync.DefaultTime.hour,
        minute = Config.WeatherSync.DefaultTime.minute,
        blackout = false,
        freezeTime = false,
        dynamicWeather = Config.WeatherSync.DynamicWeather.Enabled,
        dynamicWater = false
    }
end

local function GetWeather()
    local state = GetState()
    return state.weather
end

local function SetWeather(weather)
    if not weather then return false end
    
    if _G.XenoUpdateWeatherState then
        return _G.XenoUpdateWeatherState({ weather = string.upper(weather) })
    end
    return false
end

local function GetTime()
    local state = GetState()
    return state.hour, state.minute
end

local function SetTime(hour, minute)
    if not hour then return false end
    if _G.XenoUpdateWeatherState then
        return _G.XenoUpdateWeatherState({ hour = tonumber(hour), minute = tonumber(minute) or 0 })
    end
    return false
end

local function IsBlackout()
    local state = GetState()
    return state.blackout
end

local function SetBlackout(state)
    if _G.XenoUpdateWeatherState then
        return _G.XenoUpdateWeatherState({ blackout = state })
    end
    return false
end

exports('GetWeather', GetWeather)
exports('SetWeather', SetWeather)
exports('GetTime', GetTime)
exports('SetTime', SetTime)
exports('GetState', GetState)
exports('IsBlackout', IsBlackout)
exports('SetBlackout', SetBlackout)
