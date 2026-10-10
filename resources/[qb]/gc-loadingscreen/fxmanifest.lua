fx_version 'cerulean'
game 'gta5'

author 'Iconix Studios / GCRP configuration'
description 'Grand Country Roleplay loading screen'
version '1.0.8-gcrp'

loadscreen 'html/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

shared_script 'config.lua'
client_script 'client.lua'

files {
    'html/index.html',
    'html/config.js',
    'html/css/style.css',
    'html/js/app.js',
    'html/assets/background.webm',
    'html/assets/background-poster.jpg',
    'html/assets/logo.png',
    'html/assets/music/*.mp3',
    'html/assets/icons/*.svg'
}

escrow_ignore {
    'client.lua',
    'html/config.js',
    'html/assets/background.webm',
    'html/assets/background-poster.jpg',
    'html/assets/logo.png',
    'html/assets/music/*.mp3'
}

-- Keep a single Asset Escrow runtime requirement for the protected config.
dependency '/assetpacks'
