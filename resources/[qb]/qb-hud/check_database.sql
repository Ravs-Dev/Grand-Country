-- Check the QBCore players structure and HUD metadata.

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'players'
  AND COLUMN_NAME IN (
      'citizenid', 'money', 'job', 'gang', 'metadata',
      'position', 'inventory', 'last_updated'
  )
ORDER BY ORDINAL_POSITION;

SELECT
    COUNT(*) AS total_players,
    SUM(CASE WHEN metadata IS NULL OR metadata = '' THEN 1 ELSE 0 END) AS empty_metadata,
    SUM(CASE WHEN metadata IS NOT NULL AND metadata <> '' AND JSON_VALID(metadata) = 0 THEN 1 ELSE 0 END) AS invalid_metadata
FROM players;

SELECT
    citizenid,
    JSON_EXTRACT(metadata, '$.health') AS health,
    JSON_EXTRACT(metadata, '$.armor') AS armor,
    JSON_EXTRACT(metadata, '$.hunger') AS hunger,
    JSON_EXTRACT(metadata, '$.thirst') AS thirst,
    JSON_EXTRACT(metadata, '$.stress') AS stress,
    JSON_EXTRACT(metadata, '$.injuries') AS injuries
FROM players
LIMIT 20;
