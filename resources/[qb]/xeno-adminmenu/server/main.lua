
DebugLog('^2[xeno-adminmenu] Server backend loaded successfully.^0')

RegisterNetEvent('xeno-adminmenu:server:RequestDashboardStats', function()
    local src = source
    if not IsPlayerAdmin(src) then 
        DebugLog('^3[xeno-adminmenu] WARNING: Player '..src..' is NOT recognized as admin by QBCore/ACE, but sending stats anyway for testing!^0')
        
    end
    
    local players = GetPlayers()
    local onlinePlayers = #players
    local maxPlayers = GetConvarInt('sv_maxclients', 48)
    
    TriggerEvent('xeno-adminmenu:server:RefreshWarns')
    
    local activeAdmins = 0
    local totalPing = 0
    
    for i=1, onlinePlayers do
        local player = tonumber(players[i])
        if player then
            if IsPlayerAdmin(player) then
                activeAdmins = activeAdmins + 1
            end
            local ping = GetPlayerPing(players[i])
            if ping then
                totalPing = totalPing + ping
            end
        end
    end
    
    local averagePing = 0
    if onlinePlayers > 0 then
        averagePing = math.floor(totalPing / onlinePlayers)
    end
    
    local numResources = GetNumResources()
    local mapResources = 0
    for i=0, numResources-1 do
        local res = GetResourceByFindIndex(i)
        if GetResourceState(res) == 'started' then
            mapResources = mapResources + 1
        end
    end
    
    DebugLog('^2[xeno-adminmenu] Fetching total economy...^0')
    local totalMoney = GetTotalEconomy()
    DebugLog('^2[xeno-adminmenu] Total economy: '..tostring(totalMoney)..'^0')
    
    DebugLog('^2[xeno-adminmenu] Fetching richest player...^0')
    local richestPlayer = GetRichestPlayer()
    DebugLog('^2[xeno-adminmenu] Richest player: '..tostring(richestPlayer)..'^0')
    
    local function formatMoney(amount)
        local formatted = tostring(math.floor(amount))
        while true do  
            formatted, k = string.gsub(formatted, "^(-?%d+)(%d%d%d)", '%1,%2')
            if (k==0) then
                break
            end
        end
        return formatted
    end
    
    local sName = GetConvar('sv_projectName', GetConvar('sv_hostname', 'Unknown Server'))
    local serverName = string.gsub(sName, "%^%d", "")
    
    local uptimeSeconds = math.floor(GetGameTimer() / 1000)
    local uptimeMinutes = math.floor(uptimeSeconds / 60)
    local serverUptime = uptimeMinutes .. 'm'
    if uptimeMinutes >= 60 then
        serverUptime = math.floor(uptimeMinutes / 60) .. 'h ' .. (uptimeMinutes % 60) .. 'm'
    end
    
    TriggerClientEvent('xeno-adminmenu:client:ReceiveDashboardStats', src, {
        onlinePlayers = onlinePlayers,
        activeAdmins = activeAdmins,
        maxPlayers = maxPlayers,
        averagePing = averagePing,
        mapResources = mapResources,
        totalMoney = formatMoney(totalMoney),
        richestPlayer = richestPlayer,
        serverName = serverName,
        serverUptime = serverUptime
    })
end)