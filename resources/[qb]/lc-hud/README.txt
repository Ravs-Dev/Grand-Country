GRAND COUNTRY ROLEPLAY - LC HUD v9 IME CLEAN
=============================================

Perubahan utama:
- HUD kanan atas dibuat clean/IME-style: text only, tanpa kotak/card besar.
- Body/person condition card di kiri atas dihapus total.
- Ammo HUD ditambahkan di bawah info kanan dan hanya muncul saat memegang firearm.
- HUD NUI mulai dalam keadaan hidden dan baru tampil setelah QBCore:Client:OnPlayerLoaded.
- Update NUI tidak bisa lagi menampilkan HUD sendiri saat character selection.
- Minimap GTA muncul setelah character loaded/spawn dan tersembunyi saat HUD belum aktif.
- Health/armor/hunger/thirst/stress/stamina tetap berada di kiri bawah dekat minimap.
- Vehicle HUD terintegrasi tetap dipertahankan.
- Native GTA health regeneration tetap dimatikan agar HP di bawah 50% tidak naik sendiri.
- logo.webm tetap digunakan dengan logo.png sebagai poster/fallback.

INSTALL
-------
1. Backup folder lc-hud lama.
2. Replace dengan folder lc-hud dari ZIP ini.
3. Pastikan server.cfg memakai:

   ensure lc-hud

4. Jangan jalankan qb-hud lama bersamaan.
5. Restart lc-hud atau restart server.

CONFIG PENTING
--------------
Config.SpawnHudDelay = 900
Config.ShowMinimap = true
Config.ShowVehicleHud = true
Config.SpeedUnit = 'KM/H'

Ammo:
- Clip = peluru di magazine.
- Reserve = total peluru cadangan.
- Counter otomatis hilang saat tangan kosong/melee/tool.

Visibility:
- HUD tidak tampil di multicharacter karena hudVisible default false.
- Hanya event player-loaded / manual hud:client:ShowHud yang boleh menampilkannya.


GCR ICON HUD UPDATE
- ONLINE / CASH / BANK / JOB / GANG now use inline SVG icons (not emoji).
- Ammo HUD now includes a matching vector gun icon.
- No Font Awesome/CDN dependency is required.
- Existing IDs remain unchanged, so app.js data updates continue to work.

GCR IME HUD polish update:
- Right-side row icon and label spacing tightened.
- GTA minimap forced to rectangular clip.
- Native green/blue minimap health/armour strips hidden.
- Microphone icon is vector based: blue when idle, bright white while transmitting.
- Voice detection checks FiveM network talking, Mumble talking when available, and pma-voice radio PTT.

SKY BLUE HUD FIX (15 OCT 2026)
- Primary HUD gradients, borders, rings, labels and glow now sky blue (#38BDF8).
- Mic indicator uses blue idle and bright white while voice is detected.
- Immediate mic PTT indicator fallback uses FiveM control 249 (default N).
- If voice PTT uses another key, change Config.VoicePTTControl in config.lua.
- If the mic cannot actually transmit, check FiveM Settings > Voice Chat and pma-voice status; the HUD only displays the state.
- Restart the active lc-hud resource; ensure there are no duplicate HUD resources overwriting this CSS.

============================================================
UPDATE 2026-10-15 - BRIGHT BLUE / VOICE / CLEAN MINIMAP
============================================================
- Brighter cyan/sky-blue HUD accents.
- Tighter spacing between right-side icons and ONLINE/CASH/BANK/JOB/GANG labels.
- Microphone is cyan while idle and turns white immediately while the HUD PTT key is held.
- Default HUD voice indicator key: N (Config.VoiceIndicatorKey).
- Minimap is forced to rectangular mode and GTA native health/armor strips are re-hidden regularly.

IMPORTANT:
Run only one HUD resource. If ps-hud or another HUD is started at the same time,
it may redraw the native minimap health/armor bars or override radar settings.
Disable the other HUD and keep lc-hud enabled.


LC HUD status update:
- Food/Drink/Stress/Stamina/Mic status now use larger icon-only rings.
- Native minimap health/armour bars are suppressed every frame; map stays rectangular.
- Mic indicator follows FiveM Push To Talk action (default N). Player remaps in Key Bindings are saved by FiveM and followed automatically.
