-- ============================================================
-- Grand Country Roleplay - qb-hud metadata patch
-- Database shown by the user already has the required QBCore
-- players columns. This patch DOES NOT add/remove columns.
-- It only makes sure HUD metadata keys exist inside players.metadata.
-- Existing metadata values are preserved.
-- ============================================================

START TRANSACTION;

UPDATE players
SET metadata = CAST(
    JSON_MERGE_PATCH(
        JSON_OBJECT(
            'hunger', 100,
            'thirst', 100,
            'stress', 0,
            'armor', 0,
            'isdead', FALSE,
            'inlaststand', FALSE,
            'injuries', JSON_OBJECT(
                'head', FALSE,
                'torso', FALSE,
                'leftarm', FALSE,
                'rightarm', FALSE,
                'leftleg', FALSE,
                'rightleg', FALSE
            )
        ),
        CASE
            WHEN metadata IS NOT NULL
                 AND metadata <> ''
                 AND JSON_VALID(metadata)
            THEN CAST(metadata AS JSON)
            ELSE JSON_OBJECT()
        END
    ) AS CHAR CHARACTER SET utf8mb4
);

COMMIT;

SELECT
    citizenid,
    JSON_EXTRACT(metadata, '$.hunger') AS hunger,
    JSON_EXTRACT(metadata, '$.thirst') AS thirst,
    JSON_EXTRACT(metadata, '$.stress') AS stress,
    JSON_EXTRACT(metadata, '$.injuries') AS injuries
FROM players
LIMIT 25;
