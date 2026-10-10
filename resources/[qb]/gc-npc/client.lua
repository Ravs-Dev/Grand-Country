local Zones = {
    {
        name = 'Legion Square',
        coords = vector3(195.0, -933.0, 30.0),
        radius = 250.0,
        density = 0.25
    },
    {
        name = 'Pillbox Hospital',
        coords = vector3(299.0, -584.0, 43.0),
        radius = 180.0,
        density = 0.20
    },
    {
        name = 'Sandy Shores',
        coords = vector3(1850.0, 3680.0, 34.0),
        radius = 500.0,
        density = 0.35
    },
    {
        name = 'Paleto Bay',
        coords = vector3(-110.0, 6450.0, 31.0),
        radius = 500.0,
        density = 0.30
    }
}

local DefaultDensity = 0.02
local CurrentDensity = DefaultDensity

CreateThread(function()
    while true do
        local coords = GetEntityCoords(PlayerPedId())
        local density = DefaultDensity

        for _, zone in ipairs(Zones) do
            local distance = #(coords - zone.coords)

            if distance <= zone.radius then
                density = zone.density
                break
            end
        end

        CurrentDensity = density

        Wait(1000)
    end
end)

CreateThread(function()
    while true do
        local density = CurrentDensity

        SetPedDensityMultiplierThisFrame(density)
        SetScenarioPedDensityMultiplierThisFrame(density, density)
        SetVehicleDensityMultiplierThisFrame(density)
        SetRandomVehicleDensityMultiplierThisFrame(density)
        SetParkedVehicleDensityMultiplierThisFrame(density)

        Wait(0)
    end
end)