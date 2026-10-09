GCR VEHICLE HUD SPEEDOMETER PATCH

Desain:
- speed besar di tengah
- arc RPM
- angka 1-5
- gear
- FUEL / ENG / BELT
- tema orange GCR + putih
- transparan seperti referensi

PASANG:
1. Backup HUD lama.
2. Replace client.lua dengan client.lua dari paket ini.
3. Di HTML HUD utama, hapus block <section id="vehicleHud"> lama.
4. Ganti dengan isi html/vehicle_hud_block.html.
5. Di <head>, setelah style.css:
   <link rel="stylesheet" href="vehicle_hud.css">
6. Sebelum </body>, SETELAH app.js:
   <script src="vehicle_hud.js"></script>
7. Tambahkan ke files{} fxmanifest.lua:
   'html/vehicle_hud.css',
   'html/vehicle_hud.js',
8. Full restart.

UNIT:
Config.SpeedUnit = 'KM/H'
atau
Config.SpeedUnit = 'MPH'

BELT:
Client membaca:
LocalPlayer.state.seatbelt
LocalPlayer.state.seatBelt
LocalPlayer.state.belt

Kalau seatbelt script kamu memakai nama state lain, ubah beltValue di client.lua.

Preview:
Buka html/vehicle_hud_preview.html di browser.
