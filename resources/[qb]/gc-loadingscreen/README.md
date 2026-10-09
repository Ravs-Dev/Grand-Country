# Iconix Loading Screen

Iconix Loading Screen is a FiveM loading screen resource built for QBCore, Qbox, ESX, and standalone servers. It runs as a normal FiveM loadscreen and does not require any framework dependency.

## Installation

1. Place the `iconix-loadingscreen` folder inside your server resources folder.
2. Add this line to `server.cfg`:

```cfg
ensure iconix-loadingscreen
```

3. Restart the server so FiveM rebuilds the resource cache.

## Configuration

All customer settings are in:

```text
html/config.js
```

You can configure:

- social links for Discord, Instagram, YouTube, website, and Tebex
- server rules, keybinds, staff, store items, and navigation buttons
- logo, poster image, and music paths
- loading messages and progress labels
- music title, artist, volume, autoplay, and loop settings
- theme colors and layout positions

## Assets

Customer-replaceable asset paths:

- `html/assets/background.webm`
- `html/assets/background-poster.jpg`
- `html/assets/logo.png`
- `html/assets/music/*.mp3`

Only WebM is supported for the loading screen video. Use `background.webm` so the video works reliably in FiveM's embedded browser. MP4 is not supported by this resource. For music, add MP3 files to the music folder and list them in `html/config.js`.

## Music Playlist

Place MP3 files in:

```text
html/assets/music
```

Add each track to `music.tracks` in `html/config.js`:

```js
tracks: [
    { name: "Late Nights", artist: "Iconix Beats", src: "./assets/music/late-nights.mp3" },
    { name: "City Drive", artist: "Iconix Beats", src: "./assets/music/city-drive.mp3" }
]
```

Players can use the previous and next buttons to skip through the playlist. When `music.loop` is enabled, the playlist starts again after the last track.

## Background Video

The background video is loaded from:

```text
html/assets/background.webm
```

The video tag uses native muted autoplay:

```html
<source src="./assets/background.webm" type="video/webm" />
```

After replacing the video, restart the server. If FiveM still shows an older version, remove this cache folder and restart again:

```text
cache/files/iconix-loadingscreen
```

## Customer Checklist

- Update all links in `IconixLinks`.
- Replace default staff names with the server's real team.
- Replace store items and prices with the server's actual offers.
- Replace rules and keybinds with server-specific information.
- Replace `logo.png`, `background-poster.jpg`, the background video, and MP3 files if needed.
- Restart the server after changes.

## Support Notes

The loading bar listens for FiveM `loadProgress` events. It can also receive custom messages with `type` or `action` set to `setProgress`.
