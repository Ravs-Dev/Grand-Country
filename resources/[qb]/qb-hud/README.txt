Grand Country Roleplay - QB HUD v6

DESAIN
- Panel hitam dibuat transparan penuh. Yang terlihat hanya outline orange/glow tipis.
- Health dan Armor tetap bar tipis.
- Mic, Makan, Minum, Stress, Lari berbentuk bulat ala IME.
- Ring bulat mengikuti nilai status.
- Mic berubah hijau/glow saat player sedang bicara.
- Stress >= 70 berubah merah.
- Hunger/Thirst/Stamina rendah berubah orange/merah.
- Body detector tetap di kiri atas dan bagian tubuh yang kena damage menyala merah.
- Ammo tetap muncul tepat di bawah No Gang saat memegang senjata api.
- Logo memakai images/logo.png.
- Body memakai images/body.png.
- Minimap hilang saat gameplay dan muncul ketika ESC/pause menu dibuka.

STRUKTUR
qb-hud/
  fxmanifest.lua
  config.lua
  client.lua
  server.lua
  PREVIEW.png
  html/
    hud.html
    style.css
    app.js
  images/
    logo.png
    body.png
  check_database.sql
  database_patch.sql
  01_check_database.cmd
  02_patch_database.cmd
  FULL-SCRIPTS.txt

DATABASE
- Tidak perlu menambah kolom hunger/thirst/stress/injuries.
- Data tersebut disimpan di kolom players.metadata.
- Jalankan 01_check_database.cmd untuk cek.
- Jika perlu, jalankan 02_patch_database.cmd untuk memastikan key metadata ada.

COMMAND
/hud          = show/hide HUD
/clearinjury  = reset indikator luka untuk testing

CATATAN
FPS / Ping / PL / CPU overlay di bagian paling atas bukan bagian dari qb-hud ini.
