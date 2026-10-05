-- Migration Query: Merges old glovebox, stash, and trunk item tables into the unified inventories table.
-- Safe to run multiple times (handles duplicate keys by updating items data).
INSERT INTO inventories (identifier, items)
SELECT CONCAT('glovebox-', plate) AS identifier, items FROM gloveboxitems
UNION ALL
SELECT stash AS identifier, items FROM stashitems
UNION ALL
SELECT CONCAT('trunk-', plate) AS identifier, items FROM trunkitems
ON DUPLICATE KEY UPDATE items = VALUES(items);