import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./MessageContactBubble.vue', import.meta.url),
  'utf8',
)

describe('MessageContactBubble Sky UI contract', () => {
  it('uses Sky buttons without direct Konsta markup', () => {
    expect(source).not.toContain("from 'konsta/vue'")
    expect(source).not.toMatch(/<\/?k-[a-z]/)
    expect(source).toContain('<SkyButton')
  })

  it('inherits light and dark colors from Sky theme tokens', () => {
    expect(source).toContain('var(--sky-text)')
    expect(source).toContain('var(--sky-surface)')
    expect(source).toContain('var(--sky-surface-muted)')
    expect(source).toContain('var(--sky-muted)')
    expect(source).toContain('var(--sky-hairline)')
    expect(source).not.toContain(':global(.phone-app.dark)')
  })
})
