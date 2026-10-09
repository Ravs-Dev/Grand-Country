local function exportHandler(exportName, func)
    AddEventHandler(('__cfx_export_RespectTarget_%s'):format(exportName), function(setCB)
        setCB(func)
    end)
end

---@param options table
---@return table
local function convert(options)
    local distance = options.distance
    options = options.options

    -- People may pass options as a hashmap (or mixed, even)
    for k, v in pairs(options) do
        if type(k) ~= 'number' then
            table.insert(options, v)
        end
    end

    for id, v in pairs(options) do
        if type(id) ~= 'number' then
            options[id] = nil
            goto continue
        end

        v.onSelect = v.action
        v.distance = v.distance or distance
        v.name = v.name or v.label
        v.groups = v.job
        v.items = v.item or v.required_item

        if v.event and v.type and v.type ~= 'client' then
            if v.type == 'server' then
                v.serverEvent = v.event
            elseif v.type == 'command' then
                v.command = v.event
            end

            v.event = nil
            v.type = nil
        end

        v.action = nil
        v.job = nil
        v.item = nil
        v.required_item = nil
        v.qtarget = true

        ::continue::
    end

    return options
end

local api = require 'client.api'

exportHandler('AddBoxZone', function(name, center, length, width, options, targetoptions)
    local z = center.z - 1

    if not options.minZ then
        options.minZ = -100
    end

    if not options.maxZ then
        options.maxZ = 800
    end

    if not options.useZ then
        z = z + math.abs(options.maxZ - options.minZ) / 2
        center = vec3(center.x, center.y, z)
    end

    return api.addBoxZone({
        name = name,
        coords = center,
        size = vec3(width, length,
            (options.useZ or not options.maxZ) and center.z or math.abs(options.maxZ - options.minZ)),
        debug = options.debugPoly,
        rotation = options.heading,
        options = convert(targetoptions)
    })
end)

exportHandler('AddPolyZone', function(name, points, options, targetoptions)
    local newPoints = table.create(#points, 0)
    local thickness = math.abs(options.maxZ - options.minZ)

    for i = 1, #points do
        local point = points[i]
        newPoints[i] = vec3(point.x, point.y, options.maxZ - (thickness / 2))
    end

    return api.addPolyZone({
        name = name,
        points = newPoints,
        thickness = thickness,
        debug = options.debugPoly,
        options = convert(targetoptions)
    })
end)

exportHandler('AddCircleZone', function(name, center, radius, options, targetoptions)
    return api.addSphereZone({
        name = name,
        coords = center,
        radius = radius,
        debug = options.debugPoly,
        options = convert(targetoptions)
    })
end)

exportHandler('RemoveZone', function(id)
    api.removeZone(id, true)
end)

exportHandler('AddTargetBone', function(bones, options)
    if type(bones) ~= 'table' then
        bones = {bones}
    end
    options = convert(options)

    for _, v in pairs(options) do
        v.bones = bones
    end

    exports.gc_target:addGlobalVehicle(options)
end)

exportHandler('AddTargetEntity', function(entities, options)
    if type(entities) ~= 'table' then
        entities = {entities}
    end
    options = convert(options)

    for i = 1, #entities do
        local entity = entities[i]

        if NetworkGetEntityIsNetworked(entity) then
            api.addEntity(NetworkGetNetworkIdFromEntity(entity), options)
        else
            api.addLocalEntity(entity, options)
        end
    end
end)

exportHandler('RemoveTargetEntity', function(entities, labels)
    if type(entities) ~= 'table' then
        entities = {entities}
    end

    for i = 1, #entities do
        local entity = entities[i]

        if NetworkGetEntityIsNetworked(entity) then
            api.removeEntity(NetworkGetNetworkIdFromEntity(entity), labels)
        else
            api.removeLocalEntity(entity, labels)
        end
    end
end)

exportHandler('AddTargetModel', function(models, options)
    api.addModel(models, convert(options))
end)

exportHandler('RemoveTargetModel', function(models, labels)
    api.removeModel(models, labels)
end)

exportHandler('Ped', function(options)
    api.addGlobalPed(convert(options))
end)

exportHandler('AddGlobalPed', function(options)
    api.addGlobalPed(convert(options))
end)

exportHandler('RemovePed', function(labels)
    api.removeGlobalPed(labels)
end)

exportHandler('Vehicle', function(options)
    api.addGlobalVehicle(convert(options))
end)

exportHandler('AddGlobalVehicle', function(options)
    api.addGlobalVehicle(convert(options))
end)

exportHandler('RemoveVehicle', function(labels)
    api.removeGlobalVehicle(labels)
end)

exportHandler('Object', function(options)
    api.addGlobalObject(convert(options))
end)

exportHandler('AddGlobalObject', function(options)
    api.addGlobalObject(convert(options))
end)

exportHandler('RemoveObject', function(labels)
    api.removeGlobalObject(labels)
end)

exportHandler('Player', function(options)
    api.addGlobalPlayer(convert(options))
end)

exportHandler('AddGlobalPlayer', function(options)
    api.addGlobalPlayer(convert(options))
end)

exportHandler('RemovePlayer', function(labels)
    api.removeGlobalPlayer(labels)
end)

-- //

CreateThread(function()
    if type(Respect.CircleZones) == 'table' and next(Respect.CircleZones) ~= nil then
        for _, v in pairs(Respect.CircleZones) do
            api.addSphereZone({
                name = v.name,
                coords = v.coords,
                radius = v.radius,
                debug = v.debugPoly,
                options = convert(v)
            })
        end
    end

    if type(Respect.BoxZones) == 'table' and next(Respect.BoxZones) ~= nil then
        for _, v in pairs(Respect.BoxZones) do
            local z = v.coords.z

            if not v.minZ then
                v.minZ = -100
            end

            if not v.maxZ then
                v.maxZ = 800
            end

            if not v.useZ then
                z = z + math.abs(v.maxZ - v.minZ) / 2
                v.coords = vec3(v.coords.x, v.coords.y, z)
            end

            api.addBoxZone({
                name = v.name,
                coords = v.coords,
                size = vec3(
                    v.length,
                    v.width,
                    (v.useZ or not v.maxZ) and v.coords.z or math.abs(v.maxZ - v.minZ)
                ),
                debug = v.debugPoly,
                rotation = v.heading,
                options = convert(v)
            })
        end
    end

    if table.type(Respect.PolyZones) ~= 'empty' then
        for _, v in pairs(Respect.PolyZones) do
            local newPoints = table.create(#v.points, 0)
            local thickness = math.abs(v.maxZ - v.minZ)

            for i = 1, #v.points do
                local point = v.points[i]
                newPoints[i] = vec3(point.x, point.y, v.maxZ - (thickness / 2))
            end

            api.addPolyZone({
                name = v.name,
                points = newPoints,
                thickness = thickness,
                debug = v.debugPoly,
                options = convert(v)
            })
        end
    end

    if table.type(Respect.TargetBones) ~= 'empty' then
        for _, v in pairs(Respect.TargetBones) do
            if type(v.bones) ~= 'table' then
                v.bones = {v.bones}
            end

            v.options = convert(v)

            for _, xv in pairs(v.options) do
                xv.bones = v.bones
            end

            -- print(v.options)
            exports.gc_target:addGlobalVehicle(v.options)
        end
    end

    if table.type(Respect.TargetModels) ~= 'empty' then
        for _, v in pairs(Respect.TargetModels) do
            api.addModel(v.models, convert(v.options))
        end
    end

    if table.type(Respect.GlobalPedOptions) ~= 'empty' then
        api.addGlobalPed(convert(Respect.GlobalObjectOptions))
    end

    if table.type(Respect.GlobalVehicleOptions) ~= 'empty' then
        api.addGlobalVehicle(convert(Respect.GlobalObjectOptions))
    end

    if table.type(Respect.GlobalObjectOptions) ~= 'empty' then
        api.addGlobalObject(convert(Respect.GlobalObjectOptions))
    end

    if table.type(Respect.GlobalPlayerOptions) ~= 'empty' then
        api.addGlobalPlayer(convert(Respect.GlobalPlayerOptions))
    end
end)
