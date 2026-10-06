local CachedGroups = {}
local CachedStaff = {}
local IsCacheReady = false


function GetGroup(groupId)
    if not IsCacheReady then return nil end
    return CachedGroups[groupId]
end


function GetStaff(identifier)
    if not IsCacheReady then return nil end
    return CachedStaff[identifier]
end


function RefreshPermissionCache()
    IsCacheReady = false
    CachedGroups = {}
    CachedStaff = {}

    local groups = MySQL.query.await('SELECT * FROM xeno_admin_groups', {})
    if groups then
        for i = 1, #groups do
            local g = groups[i]
            if type(g.permissions) == "string" and g.permissions ~= "" then
                g.permissions = json.decode(g.permissions) or {}
            else
                g.permissions = {}
            end
            CachedGroups[g.id] = g
        end
    end

    local staff = MySQL.query.await('SELECT * FROM xeno_admin_staff', {})
    if staff then
        for i = 1, #staff do
            local s = staff[i]
            if type(s.permissions) == "string" and s.permissions ~= "" then
                s.permissions = json.decode(s.permissions) or {}
            else
                s.permissions = {}
            end
            CachedStaff[s.identifier] = s
        end
    end

    IsCacheReady = true
    DebugLog('^2[xeno-adminmenu] Permission Cache Refreshed ('..#groups..' groups, '..#staff..' staff).^0')
end


function ValidateStartup()
    
    Wait(4000)
    
    local ownerGroup = MySQL.query.await('SELECT id FROM xeno_admin_groups WHERE name = ?', {'owner'})
    if not ownerGroup or #ownerGroup == 0 then
        DebugLog('^3[xeno-adminmenu] Owner group not found. Creating default owner group...^0')
        MySQL.insert.await('INSERT INTO xeno_admin_groups (name, color, description, permissions) VALUES (?, ?, ?, ?)', {
            'owner', '#ef4444', 'System Owner (Protected)', json.encode({'*'})
        })
    end

    RefreshPermissionCache()
end

CreateThread(function()
    ValidateStartup()
end)


function IsAdmin(src)
    local identifier = GetPlayerIdentifierByType(src, 'license')
    if not identifier then return false end

    local staff = GetStaff(identifier)
    if staff and staff.status == 'approved' and (staff.is_active == 1 or staff.is_active == true) and staff.group_id ~= nil then
        return true
    end
    return false
end

function HasPermission(src, permission)
    local identifier = GetPlayerIdentifierByType(src, 'license')
    if not identifier then return false end

    local staff = GetStaff(identifier)
    if not staff or staff.status ~= 'approved' or (staff.is_active ~= 1 and staff.is_active ~= true) or staff.group_id == nil then
        return false
    end

    local group = GetGroup(staff.group_id)
    if not group then return false end

    
    for _, p in ipairs(group.permissions) do
        if p == '*' or p == permission then
            return true
        end
    end

    
    for _, p in ipairs(staff.permissions) do
        if p == '*' or p == permission then
            return true
        end
    end

    return false
end


exports('IsAdmin', IsAdmin)
exports('HasPermission', HasPermission)
exports('GetStaff', GetStaff)
exports('GetGroup', GetGroup)
exports('RefreshPermissionCache', RefreshPermissionCache)


RegisterNetEvent('xeno_admin:permissionsUpdated', function()
    
    if source == '' or source == 0 then
        RefreshPermissionCache()
    end
end)
