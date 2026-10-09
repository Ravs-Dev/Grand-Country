# XS Notify Usage Guide

`xs:notify` is an event to display notifications in your FiveM server. Depending on where you trigger it, you can use it client-side or server-side.

## Client-Side Notifications

To trigger a notification on the client-side:

```lua
TriggerEvent("xs:notify", title, content, timeout, type, position, tag)
```

### Client-Side Example:
```lua
TriggerEvent("xs:notify", "It works!", "This notify works!", 5000, 0, 3, 'server')
```

## Server-Side Notifications

To send a notification from the server to all connected clients:

```lua
TriggerClientEvent("xs:notify", -1, title, content, timeout, type, position, tag)
```

### Server-Side Example:
```lua
TriggerClientEvent("xs:notify", -1, "It works!", "This notify works!", 5000, 0, 3, 'server')
```

### Notification Types:
- `0` - Error
- `1` - Success
- `2` - Warning
- `3` - Information

### Position Types:
- `0` - Middle
- `1` - Bottom
- `2` - Left
- `3` - Right

### Tags
- `tags` - You can add any text as your tag