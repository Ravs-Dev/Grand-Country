import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const callsServer = readFileSync(
  new URL('../../sky_phone/source/server/calls.lua', import.meta.url),
  'utf8',
)
const messagesServer = readFileSync(
  new URL('../../sky_phone/source/server/messages.lua', import.meta.url),
  'utf8',
)
const migration = readFileSync(
  new URL('../../sky_phone/source/server/db_migrate.lua', import.meta.url),
  'utf8',
)
const migrationFramework = readFileSync(
  new URL(
    '../../sky_phone/source/bridge/server/migrations.lua',
    import.meta.url,
  ),
  'utf8',
)
const install = readFileSync(
  new URL('../../sky_phone/sql/install.sql', import.meta.url),
  'utf8',
)

describe('shared contact block contract', () => {
  it('stores the current SIM as blocker and the selected contact as blocked', () => {
    const callback = callsServer.slice(
      callsServer.indexOf('Bridge.Callbacks.Register("sky_phone:calls:block"'),
    )

    expect(callback).toContain('INSERT IGNORE INTO `sky_phone_call_blocks`')
    expect(callback).toContain('{ scope.device.sim_id, rows[1].id }')
  })

  it('rejects SMS before insertion when the recipient blocked the sender', () => {
    const callback = messagesServer.slice(
      messagesServer.indexOf(
        'Bridge.Callbacks.Register("sky_phone:messages:send"',
      ),
    )
    const blockCheck = callback.indexOf('FROM `sky_phone_call_blocks`')
    const insert = callback.indexOf('INSERT INTO `sky_phone_sms_messages`')

    expect(callback).toContain(
      'WHERE `blocker_sim_id` = ? AND `blocked_sim_id` = ?',
    )
    expect(callback).toContain('{ recipient.id, device.sim_id }')
    expect(callback).toContain('return { success = false, error = "blocked" }')
    expect(blockCheck).toBeGreaterThanOrEqual(0)
    expect(insert).toBeGreaterThan(blockCheck)
  })

  it('creates the block table during runtime upgrades with matching constraints', () => {
    const table = migration.slice(
      migration.indexOf('name = "sky_phone_call_blocks"'),
      migration.indexOf('name = "sky_phone_call_entries"'),
    )

    expect(table).toContain('name = "blocker_sim_id"')
    expect(table).toContain('name = "blocked_sim_id"')
    expect(table).toContain(
      'primaryKey = { "blocker_sim_id", "blocked_sim_id" }',
    )
    expect(table).toContain('idx_sky_phone_call_blocks_blocked')
    expect(table.match(/ON DELETE CASCADE/g)).toHaveLength(2)
    expect(migrationFramework).toContain('if type(primary_key) == "table"')
    expect(migrationFramework).toContain('table.concat(quoted_columns, ", ")')
  })
})

describe('SMS batch ordering contract', () => {
  it('persists sub-second timestamps before applying the stable id tie-breaker', () => {
    expect(install).toMatch(
      /CREATE TABLE IF NOT EXISTS `sky_phone_sms_messages`[\s\S]*`created_at` DATETIME\(6\) NOT NULL DEFAULT CURRENT_TIMESTAMP\(6\)/,
    )
    expect(migration).toMatch(
      /ALTER TABLE `sky_phone_sms_messages`[\s\S]*MODIFY COLUMN `created_at` DATETIME\(6\) NOT NULL DEFAULT CURRENT_TIMESTAMP\(6\)/,
    )
    expect(messagesServer).toContain('ORDER BY `created_at` ASC, `id` ASC')
  })
})
