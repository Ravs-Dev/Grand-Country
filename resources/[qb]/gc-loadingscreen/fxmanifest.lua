fx_version 'cerulean'
game 'gta5'

author 'Iconix Studios'
description 'Iconix FiveM loading screen for QBCore, Qbox, ESX, and standalone servers'
version '1.0.7'

lua54 'yes'

ui_page 'html/index.html'
loadscreen_cursor 'yes'

shared_script 'config.lua'

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
    'html/config.js',
    'html/assets/background.webm',
    'html/assets/background-poster.jpg',
    'html/assets/logo.png',
    'html/assets/music/*.mp3'
}

dependency '/assetpacks'

dependency '/assetpacks'