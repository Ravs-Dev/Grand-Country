GRAND COUNTRY ROLEPLAY - GC-HUD V8
=================================

FULL RESOURCE
-------------
Folder resource sudah diubah menjadi:
    gc-hud

Vehicle HUD lama sudah DIHAPUS dari HTML/CSS/JS dan diganti speedometer baru
yang mengikuti referensi foto:
- speed besar di tengah
- RPM arc setengah lingkaran
- angka RPM 1-5
- RPM berubah hijau / kuning / merah
- Fuel
- Engine
- Belt
- transparan tanpa kotak vehicle HUD lama

LOGO WEBM
---------
HUD sekarang memakai:
    images/logo.webm

HTML sudah menggunakan tag <video autoplay loop muted playsinline>.
images/logo.png tetap disertakan sebagai poster/fallback.

Kalau kamu punya logo.webm animasi asli, cukup replace:
    gc-hud/images/logo.webm

dengan file animasi kamu, nama file harus tetap logo.webm.

COMPATIBILITY
-------------
fxmanifest.lua memiliki:
    provide 'qb-hud'

Jadi resource lain yang masih mendeklarasikan dependency qb-hud tetap bisa
menganggap gc-hud sebagai provider qb-hud.

SERVER.CFG
----------
Hapus / comment:
    ensure qb-hud

Gunakan:
    ensure gc-hud

Jangan jalankan qb-hud dan gc-hud bersamaan.

STRUCTURE
---------
gc-hud/
|-- fxmanifest.lua
|-- config.lua
|-- client.lua
|-- server.lua
|-- README.txt
|-- check_database.sql
|-- database_patch.sql
|-- 01_check_database.cmd
|-- 02_patch_database.cmd
|-- html/
|   |-- hud.html
|   |-- style.css
|   `-- app.js
`-- images/
    |-- logo.webm
    |-- logo.png
    `-- body.png

SPEED UNIT
----------
Default:
    Config.SpeedUnit = 'KM/H'

Kalau mau MPH:
    Config.SpeedUnit = 'MPH'

VEHICLE HUD
-----------
Config.ShowVehicleHud = true

Seatbelt state yang didukung:
- LocalPlayer.state.seatbelt
- LocalPlayer.state.seatBelt
- LocalPlayer.state.belt

INSTALL
-------
1. Backup resource HUD lama.
2. Hapus/rename folder qb-hud lama agar tidak start bersamaan.
3. Upload folder gc-hud ini ke resources/[qb]/gc-hud.
4. server.cfg: ensure gc-hud
5. Full restart server.
