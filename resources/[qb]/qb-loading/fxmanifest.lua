fx_version "cerulean"
game "gta5"
lua54 "yes"
description "cylex_loadingScreen"

escrow_ignore {
    'config/config.lua',
    'html/config.json',
}
-- https://discord.gg/cfw0  & https://discord.gg/cfw0
shared_script 'config/config.lua'

server_scripts {
    'server.lua',
    'serverfunctions.lua',
}

loadscreen { 'html/index.html' }
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

files {
    "html/*.*",
    "html/img/*.*"
}

