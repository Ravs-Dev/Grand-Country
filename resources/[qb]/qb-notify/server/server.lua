-- Server-side event handler for 'xs:notify'
AddEventHandler("xs:notify", function(title, content, timeout, type, position, tag)
    -- When the event is triggered, send the event to all connected clients
    TriggerClientEvent("xs:notify", -1, title, content, timeout, type, position, tag)

    -- Print a message to the server console
    print("success", title, content, timeout, type, position, tag)
end)

-- Server-side command
RegisterCommand('success123server', function(source, args, rawCommand)
    -- When the command is executed, trigger the local event 'xs:notify'
    TriggerEvent("xs:notify", "It works!", "This notify works!", 5000, 0, 3, 'server')
end)

-- Server-side command
RegisterCommand('success123server', function(source, args, rawCommand)
    TriggerClientEvent("xs:notify", -1, title, content, timeout, type, position, tag)
end)