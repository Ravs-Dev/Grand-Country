# GCR Cinematic QB MultiCharacter

## Installation
1. Backup your existing `[qb]/qb-multicharacter` folder. Stop the server.
2. Install this folder as `resources/[qb]/qb-multicharacter` (rename if required).
3. Ensure `oxmysql`, `qb-core`, `qb-multicharacter`, `qb-spawn`, and optionally `qb-apartments`, `qb-clothing`, `qb-weathersync`, `qb-inventory` in your server.cfg in that order. Avoid running a second multicharacter resource.
4. Restart the server; no new tables are necessary if standard QBCore `players` and `playerskins` tables exist.

## Settings
- `config.lua` `Config.Scene.Ped`, `Camera`, `LookAt`: outdoor location/camera. They are **game world** positions, not an HTML wallpaper.
- `Config.Scene.Crate`, `CrateModel`, `SitAnimDict`, `SitAnimName`: sitting prop and loop.
- Camera has subtle movement; character does a seated animation if the clip exists, otherwise fallback scenario.
- `Config.DefaultNumberOfCharacters`: maximum slots; `PlayersNumberOfCharacters` override by license.
- `Config.SkipSelection`: use saved position, else qb-spawn or apartments.
- Accent is orange `--orange` in `html/style.css`; English LTR layout.

## Notes
- This is an original custom implementation and not guaranteed drop-in with modified core/spawn/clothing forks. If you use `illenium-appearance`, replace the `qb-clothing` preview event in `client.lua` and adjust its skin query.
- Preview uses playerskins; an absent skin shows default GTA Online male preview.
- The sample scene uses a city grocery lot. The exact fence/crate environment of the screenshot is not guaranteed. Set desired coordinates and tweak camera facing to match your server map.
- Forms currently accept ASCII Latin name characters and an ISO birthdate YYYY-MM-DD.
- For a new character, apartment flow requires a compatible qb-apartments spawn UI. Without it, qb-spawn is used.
- If spawn flow does not initialize because your version of qb-spawn expects a different signature, adapt the `finish` event in client.lua.
- Do not run `qb-multicharacter` alongside another multicharacter script.

## Preview troubleshooting (important)
- `client.lua` now streams scene/collision before the preview camera appears; this fixes common gray/empty-world renders.
- Saved appearance is loaded from the newest `playerskins` record (active record preferred). Standard `qb-clothing` and compatible `illenium-appearance` supported. If using `fivem-appearance` or customized clothing, provide its export/event so we can wire it in.
- Your clothing resource must **save** current skin to `playerskins` when clothes/face/outfits change. If no skin is saved, neither this nor any other preview can reconstruct the IC appearance from scratch.
- Example SQL diagnostic: `SELECT citizenid, model, active, LEFT(skin, 120) FROM playerskins WHERE citizenid='YOUR_CITIZENID' ORDER BY id DESC;`
- Check F8 log for `[GCR Multi]` messages. Verify camera coordinates are not inside custom map geometry.
- `gcr-hud:client:setMultichar` only works when the GCR HUD resource implements that event.
