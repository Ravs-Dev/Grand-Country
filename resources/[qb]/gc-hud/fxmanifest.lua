fx_version 'cerulean'
game 'gta5'

lua54 'yes'

author 'Grand Country Roleplay'
description 'Grand Country Roleplay - GC HUD'
version '8.0.0'

shared_script 'config.lua'
client_script 'client.lua'
server_script 'server.lua'

ui_page 'html/hud.html'

files {
    'html/hud.html',
    'html/style.css',
    'html/app.js',
    'images/logo.webm',
    'images/logo.png',
    'images/body.png'
}

-- Compatibility for resources that still declare qb-hud as a dependency.
provide 'qb-hud'
