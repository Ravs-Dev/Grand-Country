import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const manifest = readFileSync(
  new URL('../../sky_phone/fxmanifest.lua', import.meta.url),
  'utf8',
)
const phoneServer = readFileSync(
  new URL('../../sky_phone/source/server/phone.lua', import.meta.url),
  'utf8',
)

describe('server startup contracts', () => {
  it('registers the production phone-open callback before the database migration runs', () => {
    expect(
      phoneServer.indexOf(
        'Bridge.Callbacks.Register("sky_phone:device:open-request"',
      ),
    ).toBeLessThan(
      phoneServer.indexOf('Bridge.Database.AfterMigration("sky_phone"'),
    )
  })

  it('registers the development-open callback before the database migration runs', () => {
    expect(manifest.indexOf("'source/server/phone.lua'")).toBeLessThan(
      manifest.indexOf("'source/server/db_migrate.lua'"),
    )
    expect(
      phoneServer.indexOf(
        'Bridge.Callbacks.Register("sky_phone:device:development-open"',
      ),
    ).toBeLessThan(
      phoneServer.indexOf('Bridge.Database.AfterMigration("sky_phone"'),
    )
  })

  it('initializes bootstrap data providers before phone startup', () => {
    const phoneIndex = manifest.indexOf("'source/server/phone.lua'")

    expect(manifest.indexOf("'source/server/notes.lua'")).toBeLessThan(
      phoneIndex,
    )
    expect(manifest.indexOf("'source/server/memos.lua'")).toBeLessThan(
      phoneIndex,
    )
  })

  it('queues early opens until the resource has fully started', () => {
    expect(phoneServer).toContain(
      'AddEventHandler("onServerResourceStart", function(resource_name)',
    )
    expect(phoneServer).toContain('pending_phone_opens[source] = true')
    expect(phoneServer).toContain('phone_open_handler = open_phone')
    expect(phoneServer).toContain('flush_pending_phone_opens()')
  })
})
