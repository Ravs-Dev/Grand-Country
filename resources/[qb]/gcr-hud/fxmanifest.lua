fx_version 'cerulean'
game 'gta5'

author 'Ravs-Dev'
description 'Grand Country Roleplay Custom QBCore HUD'
version '2.0.0'

ui_page 'html/index.html'

shared_scripts {
    'config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
    'html/images/body.svg',
    'html/images/logo.png'
}

dependency 'qb-core'
