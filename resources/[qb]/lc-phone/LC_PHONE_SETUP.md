# LC Phone for LineCity Roleplay (QBCore)

## Installation
**Important:** Keep the old `sky_phone_*` database tables and internal `sky_phone:*` events. Changing them globally will break this resource.
1. Back up your old phone folder and SQL database first.
2. Rename/remove the active sky_phone folder and put `lc-phone` into `resources/[standalone]/lc-phone` (or another ensured group). Do **not** start both versions.
3. In server.cfg use `ensure oxmysql` before `ensure lc-phone`. Remove `ensure sky_phone`. Keep `qb-core` and your inventory running first.
4. Update resources that directly call `exports["sky_phone"]` or reference the old resource name, or use the appropriate provided compatibility API (lb-phone, etc.). Internal `sky_phone:*` events and database tables are intentionally **not renamed** to preserve data and integration compatibility.
5. Existing SQL rows are retained. This ZIP includes the original resource and these modifications; take a DB backup before installing.

## Changes
- Physical SIM cards disabled (`Config.Sim.Enabled=false`); numbers are automatically created when players initialize their devices. This is a virtual internal number, not an inventory SIM.
- Persistent per-character phone (`Config.Phone.Unique=false`). A `phone` inventory item is still required by the original script.
- Full 4-bar cell service everywhere (`Config.CellTowers.Enabled=false`) as soon as the phone loads.
- Configurator override disabled (`Config.PhoneConfigurator.Enabled=false`): settings now come from `config/config.lua` and `config/media.lua`, not `/phonepanel`. Admin panel remains available for its other functions.
- Built-in camera app remains enabled. Opening the camera needs no phonepanel activation. Capturing works; uploading/sharing media externally can still require setting up a media provider (e.g. FiveManage) in `config/media.lua`. No API keys are included.
- `/gccontact [citizenid or online server ID] [name]` lets QBCore users add contacts by character ID. The target character needs to have initialized their phone to receive an automatic number. Existing phone-number contacts remain supported; server contacts save accepts citizenid too.
- User-facing phone device name set to LC Phone. Resource folder and manifest display name changed; some existing internal `sky_phone` identifiers and NUI assets remain to avoid breaking functionality.

## Examples
`/gccontact ABC12345 Budi`
`/gccontact 17 Rina` (player ID 17 must be online)

## Important
This is a compatibility-focused conversion, **not** a pixel-perfect recreation of a third-party paid iPhone UI. Test calls, messages, camera upload, and existing contacts on a staging server first.

## FIX 2026-10-14: Inventory initialization
- Explicitly configure `Config.Bridge.Framework = "qb"` and `Config.Bridge.Inventory = "qb"`.
- The manifest now declares required `oxmysql`, `qb-core`, and `qb-inventory` dependencies.
- Also put resources in this order in your server.cfg: `ensure oxmysql`, `ensure qb-core`, `ensure qb-inventory`, then `ensure lc-phone`. Avoid an earlier `ensure lc-phone`.
- For phone administrative ACE operations, before `ensure lc-phone`: `add_ace resource.lc-phone command.add_ace allow` and `add_ace resource.lc-phone command.remove_ace allow`.
- This patch is based on observed server logs; it cannot fix missing tables in unrelated resources, missing FiveManage token, or hosting permissions.
- Database tables keep the `sky_phone_*` prefix intentionally. Do not rename/drop existing tables.

## Phone item cannot be used
- Verify `qb-core/shared/items.lua` defines `phone` (with `useable = true`) and `qb-inventory` is running before `lc-phone`.
- Restart qb-core, qb-inventory and lc-phone in dependency order (prefer a server restart); ensure the item exists in the player's inventory.
- Example item definition **only if missing** (do not create duplicate entries):
```lua
phone = { name = 'phone', label = 'LC Phone', weight = 200, type = 'item', image = 'phone.png', unique = false, useable = true, shouldClose = true, combinable = nil, description = 'LineCity mobile phone' },
```
- If using another inventory or renamed phone item, configure matching adapter and `Config.Phone.Item` first.
- If a phone command works but the item does not, check usable item registration conflicts with another phone resource. Never run sky_phone/gc-phone/lc-phone together.

## Apps and camera
- Apps that depend on other services or resources cannot be made functional just by toggling Config.Apps. Garage, banking, housing, jobs, voice/radio and external media integrations require compatible provider setup.
- Camera uploads explicitly require FiveManage media token configured in `config/media.lua` (server-only). Without it the upload fails `missing_config`, although preview/camera opens. This package does not contain any token or replace the media backend.
- Some internet-enabled apps may need separate API keys or backend resources. Use the console and F8 to identify their actual failure.
