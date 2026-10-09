"""Run: python apply_patch.py PATH_TO_QB_TARGET
Safely patch qb-target client.lua and config.lua; copy NUI files.
"""
from pathlib import Path
import sys, shutil, re

root = Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path.cwd()
src = Path(__file__).parent
client_path = root/'client.lua'
config_path = root/'config.lua'
if not client_path.exists() or not config_path.exists() or not (root/'html/index.html').exists():
    raise SystemExit('Error: provide the existing qb-target folder (client.lua, config.lua, html/index.html required).')
client = client_path.read_text(encoding='utf-8')
if 'GCR_HOLD_TARGET_PATCH' in client:
    raise SystemExit('Already patched. No changes made.')
needle = '''\t\t\tif not hasFocus then
\t\t\t\tEnableControlAction(0, 1, true) -- look left/right'''
replacement = '''\t\t\t-- GCR_HOLD_TARGET_PATCH: first left click locks focus; next selects the NUI option.
\t\t\tif success and not hasFocus and IsDisabledControlJustPressed(0, 24) then
\t\t\t\tEnableNUI(nuiData)
\t\t\tend
\t\t\tif not hasFocus then
\t\t\t\tEnableControlAction(0, 1, true) -- look left/right'''
if client.count(needle)!=1:
    raise SystemExit('Unknown qb-target client.lua version: mouse-control insertion point not found. Not modified.')
client = client.replace(needle,replacement,1)
old = '''\tRegisterCommand('-playerTarget', function()
\t\tif success then
\t\t\tEnableNUI(nuiData)
\t\telse
\t\t\tDisableTarget(true)
\t\tend
\tend, false)'''
new = '''\tRegisterCommand('-playerTarget', function()
\t\t-- Hold to target: releasing Left ALT always closes the eye.
\t\tDisableTarget(true)
\tend, false)'''
if client.count(old)!=1:
    raise SystemExit('Unknown qb-target client.lua version: key-release block not found. Not modified.')
client = client.replace(old,new,1)
config = config_path.read_text(encoding='utf-8')
for filename in ('client.lua','config.lua','html/app.js','html/style.css'):
    target=root/filename
    if target.exists(): shutil.copy2(target, target.with_name(target.name+'.gcr-backup'))
client_path.write_text(client,encoding='utf-8')
config = config.replace('Config.EnableOutline = false','Config.EnableOutline = true')
config = re.sub(r'Config.OutlineColor = \{[^\n]*\}', 'Config.OutlineColor = { 255, 148, 31, 180 }', config, count=1)
config = re.sub(r'Config.SuccessDrawColor = \{[^\n]*\}', 'Config.SuccessDrawColor = { 255, 148, 31, 220 }', config, count=1)
config_path.write_text(config,encoding='utf-8')
for filename in ('app.js','style.css'):
    shutil.copy2(src/'html'/filename,root/'html'/filename)
print('GCR qb-target installed. Originals saved as *.gcr-backup. Restart qb-target.')
