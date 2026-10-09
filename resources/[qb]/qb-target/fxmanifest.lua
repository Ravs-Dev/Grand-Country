-- FX Information
fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'

-- Resource Information
name 'gc_target'
author 'Overextended'
version '1.17.1'
repository 'https://github.com/overextended/gc_target'
description ''

-- Manifest
-- ui_page 'web/index.html'
ui_page 'ui_page/build/index.html'

shared_scripts {
	'@FB_Lib/init.lua',
}

client_scripts {
	'client/main.lua',
	'actions.lua',
	'sh_main.lua',
}

server_scripts {
	-- 'server/main.lua',
'server.lua',
}

files {
	-- 'web/**',
	'ui_page/build/*',
	'ui_page/build/static/css/*.css',
	'ui_page/build/static/js/*.js',
	'ui_page/build/static/media/*',
	'ui_page/build/images/*',
	'locales/*.json',
	'client/api.lua',
	'client/utils.lua',
	'client/state.lua',
	'client/debug.lua',
	-- 'client/defaults.lua',
	'client/framework/nd.lua',
	'client/framework/ox.lua',
	'client/framework/esx.lua',
	'client/framework/qbx.lua',
	'client/framework/rt.lua',
	'client/compat/qtarget.lua',
	'client/compat/RespectTarget.lua',
	'client/compat/RespectTarget.lua',
}

provide 'qtarget'
provide 'RespectTarget'
provide 'RespectTarget'

dependency 'FB_Lib'