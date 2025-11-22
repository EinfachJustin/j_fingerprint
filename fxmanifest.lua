
fx_version 'cerulean'
game 'gta5'

author 'e1nfachjustin'
description 'Fingerprint scanner for ESX.'
version '1.0.0'

shared_script '@es_extended/imports.lua'

shared_script {
    'locales/en.lua',
    'locales/de.lua',
    'config.lua'
}

client_script {
    'client/utils.lua',
    'client/main.lua'
}

server_script 'server/main.lua'

ui_page 'html/ui.html'

files {
    'html/ui.html',
    'html/style.css',
    'html/script.js',
    'html/fingerprint.gif'
}