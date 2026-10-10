# weaponsonback - GCR replacement (QBCore)

This is a **new complete replacement resource**, not a patched copy of the
original Grand-Country GitHub folder (the original source was unavailable).

## Installation

1. Back up your existing `weaponsonback` folder.
2. Replace ONLY that resource folder with this complete folder.
3. Ensure `qb-core` and `qb-inventory` start before this resource.
4. Add `ensure weaponsonback` to `server.cfg` (once only).
5. Restart your server; test each item for displaying, equipping and putting away.

## Expected display

- Owned item, not equipped: visual model on back/hip.
- Currently selected/equipped: corresponding back/hip visual disappears.
- Deselected/holstered while item remains: visual model reappears.
- Item removed: visual model disappears.
- On character switching, death or resource shutdown: clean up visual objects.

## Notes

The resource changes cosmetic display ONLY; it does not equip or unequip items.
Your `qb-inventory` / weapon-use handler controls the actual use toggle. If a
second click doesn't unequip, that must be fixed in the weapon use handler.
More than two weapons assigned to a category will not all be shown (2 back +
2 hip slots). Change `Config.Items` to customize models or placement.

Not runtime-tested on your actual FiveM server; client/model/inventory variants
may need adjustment. Never run another weapons-on-back resource concurrently.
