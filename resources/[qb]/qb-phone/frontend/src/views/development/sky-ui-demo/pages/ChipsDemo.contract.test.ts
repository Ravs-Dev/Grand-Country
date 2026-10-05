import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./ChipsDemo.vue', import.meta.url), 'utf8')

describe('ChipsDemo', () => {
  it('uses Konsta half-space chip rhythm instead of the generic demo gap', () => {
    expect(source).toContain('class="chips-demo__group"')
    expect(source).not.toContain('class="sky-ui-demo-row"')
    expect(source).toMatch(
      /\.chips-demo__group :deep\(\.sky-chip\)\s*\{[^}]*margin:\s*2px/s,
    )
  })

  it('keeps contact, delete, fill, and outline examples', () => {
    expect(source).toContain('<SkyBlockTitle>Contact Chips</SkyBlockTitle>')
    expect(source).toContain(
      '<SkyBlockTitle>Deletable Chips / Tags</SkyBlockTitle>',
    )
    expect(source).toContain('<SkyBlockTitle>Color Chips</SkyBlockTitle>')
    expect(source).toContain('delete-button')
    expect(source).toContain('outline')
    expect(source).toContain('selected')
  })

  it('uses the exact Tailwind 500 colors from the Konsta kitchen sink', () => {
    expect(source).toContain('--sky-app-accent: #fb2c36;')
    expect(source).toContain('--sky-app-accent: #00c951;')
    expect(source).toContain('--sky-app-accent: #2b7fff;')
    expect(source).toContain('--sky-app-accent: #f0b100;')
    expect(source).toContain('--sky-app-accent: #f6339a;')
  })
})
