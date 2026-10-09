fx_version 'cerulean'
game 'gta5'

lua54 'yes'

author 'Grand Country Roleplay'
description 'GCR IME-inspired QBCore radial menu'
version '1.0.0'

ui_page 'html/index.html'

shared_script 'config.lua'

client_script 'client/main.lua'
server_script 'server/main.lua'

files {
    'html/index.html',
    'html/style.css',
    'html/app.js'
}

dependency 'qb-core'
