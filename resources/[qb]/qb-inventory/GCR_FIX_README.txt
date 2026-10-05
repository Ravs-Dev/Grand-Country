GCR qb-inventory fixes

1. Unique items now use one slot per unit.
   Example: adding iphone amount 3 creates three slots with amount 1 each.
2. CanAddItem checks that enough free slots exist for unique items.
3. AddItem prints identifier/item/resource when an inventory cannot be resolved.
4. Shop purchases refund cash if AddItem fails instead of silently charging the player.

This is intended to match Sky Phone's Unique=true / IMEI-per-device behavior.
