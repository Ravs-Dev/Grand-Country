# GCR qb-radialmenu

IME-inspired radial UI for Grand Country Roleplay, built as a drop-in QBCore `qb-radialmenu` replacement.

## Install

1. Back up your current `resources/[qb]/qb-radialmenu`.
2. Replace it with this folder, keeping the folder name exactly `qb-radialmenu`.
3. Restart the server or run `restart qb-radialmenu` from the server console.
4. Open the menu with **F1**. Players can remap the key from FiveM key bindings.

If your `server.cfg` already has `ensure [qb]`, no additional `ensure qb-radialmenu` line is required.

## Included

- IME-like center circle + small square radial buttons.
- Orange GCR theme.
- Nested submenus with center-click/backspace navigation.
- Vehicle engine, door locks, doors, windows, seats, and detected extras.
- Self-contained quick animations.
- Illenium Appearance outfit/reload integration when the resource is running.
- QBCore property actions when `qb-houses` is running.
- Police, EMS, taxi, tow, and mechanic menus when matching resources/jobs are available.
- `AddOption` and `RemoveOption` exports for compatibility with resources that add radial items dynamically.
- No external web/CDN dependency for the NUI icons.

## Important config

Edit `config.lua`:

- `Config.Keybind` - default `F1`
- `Config.Toggle` - press mode vs hold mode
- `Config.Theme` - GCR colors
- `Config.MenuItems` - general radial items
- `Config.JobInteractions` - job-specific actions
- `Config.Vehicle` - enable/disable vehicle menu groups

## Dynamic option example

```lua
local id = exports['qb-radialmenu']:AddOption({
    id = 'my_option',
    title = 'My Option',
    icon = 'user',
    type = 'client',
    event = 'my-resource:client:doThing',
    shouldClose = true
})

exports['qb-radialmenu']:RemoveOption(id)
```

## Notes

Job events are standard QBCore-style events. If your server uses renamed/custom job resources, update the corresponding `event` and `requiredResource` fields in `config.lua`.
