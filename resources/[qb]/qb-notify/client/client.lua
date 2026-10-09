-- function Notify(title, content, timeout, type, position, tag)
--     SendNUIMessage({
-- 		action = 'createNotify',
-- 		content = content,
-- 		timeout = timeout,
-- 		type = type,
-- 		position = position,
--         tag = tag,
-- 	})
-- end

function Notify(title, content, timeout, type, position, tag)
    SendNUIMessage({
        action = 'createNotify',
        data = {
            title = title,
            content = content,
            timeout = timeout,
            type = type,
            position = position,
            tag = tag,
        }
    })
end

RegisterNetEvent("xs:notify")
AddEventHandler("xs:notify", function(title, content, timeout, type, position, tag)
    Notify(title, content, timeout, type, position, tag)
    print("success", title, content, timeout, type, position, tag)
end)

RegisterCommand('success123', function()
    TriggerEvent("xs:notify", "It works!", "This notify works!", 5000, 3, 3, 'server')
end)

-- RegisterCommand("success123", function(source, args, rawCommand)
--     TriggerEvent("xs:notify", "It works!", "This notify works!", 5000, 'success', 3, 'server')
--     print("success")
-- end, true) 

-- Client-side command
RegisterCommand("success1234", function(source, args, rawCommand)
    -- When the command is executed, trigger a server event named 'xs:notify'
    TriggerServerEvent("xs:notify", "It works!", "This notify works!", 5000, 0, 3, 'server')
    
    -- Print a message to the client's console
    print("serversided")
end)

-- command to execute an event every 10 secs

RegisterCommand("cl", function(source, args, rawCommand)
    TriggerEvent("xs:notify", "ERROR", "Testing this notification for the YouTube Video! Purchase this script on our tebex.", 4000, 0, 3, 'XSTUDIOS')
    Wait(4000)
    TriggerEvent("xs:notify", "SUCCESS", "Testing this notification for the YouTube Video! Purchase this script on our tebex.", 4000, 1, 3, 'XSTUDIOS')
    Wait(4000)
    TriggerEvent("xs:notify", "WARNING", "Testing this notification for the YouTube Video! Purchase this script on our tebex.", 4000, 2, 3, 'XSTUDIOS')
    Wait(4000)
    TriggerEvent("xs:notify", "INFORMATION", "Testing this notification for the YouTube Video! Purchase this script on our tebex.", 4000, 3, 3, 'XSTUDIOS')
    Wait(4000)
end)