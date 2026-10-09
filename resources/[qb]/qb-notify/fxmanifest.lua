fx_version 'cerulean'
games { 'gta5' }

author 'X Studios'
description 'xs-notify'
version '1.0.0'
lua54 'yes'

client_scripts {
    'client/client.lua'
}

server_scripts {
    'server/server.lua'
}

ui_page 'html/index.html'

escrow_ignore {
    'client/client.lua',
    'server/server.lua' 
}

files {
    'html/**/*'
    }
dependency '/assetpacks'