import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const qbSource = readFileSync(
  new URL(
    '../../sky_phone/source/bridge/server/frameworks/qb.lua',
    import.meta.url,
  ),
  'utf8',
)
const qboxSource = readFileSync(
  new URL(
    '../../sky_phone/source/bridge/server/frameworks/qbox.lua',
    import.meta.url,
  ),
  'utf8',
)
const esxSource = readFileSync(
  new URL(
    '../../sky_phone/source/bridge/server/frameworks/esx.lua',
    import.meta.url,
  ),
  'utf8',
)
const radioSource = readFileSync(
  new URL('../../sky_phone/source/server/radio.lua', import.meta.url),
  'utf8',
)

describe('radio member identity contract', () => {
  it('exposes a framework character-name pair for every adapter', () => {
    for (const source of [esxSource, qbSource, qboxSource]) {
      expect(source).toContain(
        'function Bridge.Framework.GetCharacterName(source)',
      )
    }
  })

  it('matches the installed lb-phone ESX database fallback', () => {
    expect(esxSource).toContain(
      'function Bridge.Framework.GetCharacterName(source)',
    )
    expect(esxSource).toContain(
      'SELECT `firstname`, `lastname` FROM `users` WHERE `identifier` = ? LIMIT 1',
    )
    expect(esxSource).toContain('{ identifier }')
  })

  it('prefers the radio override, then the framework identity', () => {
    const memberNameStart = radioSource.indexOf(
      'local function get_radio_member_name(source)',
    )
    const memberNameEnd = radioSource.indexOf(
      '\nend',
      radioSource.indexOf('GetPlayerName(source)', memberNameStart),
    )
    const memberNameSource = radioSource.slice(memberNameStart, memberNameEnd)

    expect(memberNameSource).toContain('get_effective_display_name(source)')
    expect(memberNameSource).toContain(
      'Bridge.Framework.GetCharacterName(source)',
    )
    expect(memberNameSource.indexOf('GetCharacterName(source)')).toBeLessThan(
      memberNameSource.indexOf('GetPlayerName(source)'),
    )
  })
})
