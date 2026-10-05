import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./SheetModalDemo.vue', import.meta.url),
  'utf8',
)

describe('SheetModalDemo', () => {
  it('matches the Konsta sheet content and close-control geometry', () => {
    expect(source).toMatch(
      /<SkyToolbar[\s\S]*?class="sky-ui-demo-sheet__toolbar"[\s\S]*?<SkyToolbarPane>/,
    )
    expect(source).toMatch(
      /\.sky-ui-demo-sheet__toolbar\s*\{[\s\S]*?justify-content: flex-end;/,
    )
    expect(source).toMatch(
      /\.sky-ui-demo-sheet__content\s*\{[\s\S]*?gap: var\(--sky-space-4\);[\s\S]*?padding-right: calc\([\s\S]*?var\(--sky-page-gutter\)[\s\S]*?var\(--sky-safe-area-right, 0px\)[\s\S]*?padding-left: calc\([\s\S]*?var\(--sky-page-gutter\)[\s\S]*?var\(--sky-safe-area-left, 0px\)/,
    )
  })
})
