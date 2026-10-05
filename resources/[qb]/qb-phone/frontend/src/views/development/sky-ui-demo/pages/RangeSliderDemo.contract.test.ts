import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./RangeSliderDemo.vue', import.meta.url),
  'utf8',
)
const controls = readFileSync(
  new URL('../../../../ui/controls.css', import.meta.url),
  'utf8',
)

describe('RangeSliderDemo', () => {
  it('keeps the Konsta title, header and inset-list sequence', () => {
    expect(source).toMatch(
      /<SkyBlockTitle>Volume: \{\{ volume \}\}<\/SkyBlockTitle>\s*<SkyBlockHeader>From 0 to 100 with step 10<\/SkyBlockHeader>\s*<SkyList inset strong>/,
    )
    expect(source).toMatch(
      /<SkyBlockTitle>Price: \$\{\{ price \}\}<\/SkyBlockTitle>\s*<SkyBlockHeader>From 0 to 1000 with step 1<\/SkyBlockHeader>\s*<SkyList inset strong>/,
    )
    expect(source).toMatch(
      /<SkyBlockTitle>\s*Color: rgb\(\{\{ red \}\}, \{\{ green \}\}, \{\{ blue \}\}\)\s*<\/SkyBlockTitle>\s*<SkyList inset strong>/,
    )
  })

  it('locks the Chrome 103-safe eight-pixel Konsta block rhythm', () => {
    expect(controls).toMatch(
      /\.sky-block-title \+ \.sky-block,[\s\S]*?\.sky-block-title \+ \.sky-block-header,[\s\S]*?\.sky-block-title \+ \.sky-list,[\s\S]*?\{\s*margin-top:\s*8px;/,
    )
    expect(controls).toMatch(
      /\.sky-block-header\s*\{[^}]*margin:\s*32px 0 -24px;/s,
    )
    expect(controls).toMatch(/\.sky-list\s*\{[^}]*margin:\s*32px 0;/s)
  })
})
