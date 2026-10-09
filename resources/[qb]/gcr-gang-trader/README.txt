GCR NPC Gang Trader -- Fictional RP item exchange

1. Place folder gcr-gang-trader inside resources/[standalone]/.
2. Register items in qb-core/shared/items.lua, example definitions:

['gcr_package'] = {['name']='gcr_package', ['label']='Paket RP', ['weight']=100, ['type']='item', ['image']='gcr_package.png', ['unique']=false, ['useable']=false, ['shouldClose']=true, ['combinable']=nil, ['description']='Paket permainan roleplay'},
['gcr_redtoken'] = {['name']='gcr_redtoken', ['label']='Token Merah', ['weight']=0, ['type']='item', ['image']='gcr_redtoken.png', ['unique']=false, ['useable']=false, ['shouldClose']=true, ['combinable']=nil, ['description']='Token hadiah permainan'},

Add corresponding inventory images (or replace image names with existing placeholders).
3. Edit NPC coordinates, gang restrictions, and item rates in config.lua.
4. In server.cfg, ensure qb-core, qb-inventory, qb-target, then ensure gcr-gang-trader.
5. Interact using existing qb-target eye control. Does not change qb-target controls.

IMPORTANT: These are fictional RP items, not a real-world drug trading workflow.
