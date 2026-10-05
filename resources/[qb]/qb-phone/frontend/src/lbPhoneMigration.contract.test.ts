import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const migration = readFileSync(
  new URL(
    '../../sky_phone/source/server/lb_phone_migration.lua',
    import.meta.url,
  ),
  'utf8',
)
const config = readFileSync(
  new URL('../../sky_phone/config/config.lua', import.meta.url),
  'utf8',
)

describe('LB Phone social migration contract', () => {
  it('reruns the repaired social domains and maps active LB profiles to Sky accounts', () => {
    expect(migration).toMatch(
      /local domain_versions = \{[\s\S]*?picstagram = 2,[\s\S]*?flipTok = 2,[\s\S]*?feather = 2,/,
    )
    expect(migration).toContain(
      'local function prepare_social_profile_accounts',
    )
    expect(migration).toContain('preferred_entry_by_owner')
    expect(migration).toContain('owner.`account_id`')
    expect(migration).toContain(
      'move_profile(existing, preferred_entry, owner_account_id)',
    )
  })

  it('refreshes device sessions when the active LB account changed', () => {
    expect(migration).toMatch(
      /INSERT INTO `sky_phone_picstagram_sessions`[\s\S]*?ON DUPLICATE KEY UPDATE `profile_id` = VALUES\(`profile_id`\)/,
    )
    expect(migration).toMatch(
      /INSERT INTO `sky_phone_fliptok_sessions`[\s\S]*?ON DUPLICATE KEY UPDATE `profile_id` = VALUES\(`profile_id`\)/,
    )
  })

  it('imports LB Tinder data into the Flare domain', () => {
    expect(config).toMatch(/Domains = \{[\s\S]*?flare = true,/)
    expect(migration).toContain('local function run_flare(dry_run)')
    expect(migration).toContain('source_table("tinder_accounts")')
    expect(migration).toContain('source_table("tinder_swipes")')
    expect(migration).toContain('INSERT IGNORE INTO `sky_phone_flare_profiles`')
    expect(migration).toContain(
      'INSERT IGNORE INTO `sky_phone_flare_profile_photos`',
    )
    expect(migration).toContain('INSERT IGNORE INTO `sky_phone_flare_swipes`')
    expect(migration).toContain('INSERT IGNORE INTO `sky_phone_flare_matches`')
  })
})
