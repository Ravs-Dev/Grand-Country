import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./BreadcrumbsDemo.vue', import.meta.url),
  'utf8',
)

describe('BreadcrumbsDemo', () => {
  it('matches the Konsta collapsed breadcrumb popover composition', () => {
    const popover = source.slice(
      source.indexOf('<SkyPopover'),
      source.indexOf('</SkyPopover>'),
    )

    expect(popover).toContain(':offset="0"')
    expect(popover).not.toMatch(/\sangle(?:\s|>)/)
    expect(popover).not.toContain('placement="top"')
    expect(popover.match(/<SkyListItem/g)).toHaveLength(3)
    expect(popover.match(/\blink\b/g)).toHaveLength(3)
    expect(popover).not.toMatch(/\smenu(?:\s|=|>)/)
    expect(source).toMatch(/\.breadcrumbs-demo__menu\s*\{[^}]*width:\s*100%;/s)
    expect(source).toContain('class="breadcrumbs-demo__popover"')
    expect(source).toMatch(
      /\.breadcrumbs-demo__popover :deep\(\.sky-popover__panel\)\s*\{[^}]*width:\s*120px;/s,
    )
  })

  it('keeps the collapsed popover usable through every close path', () => {
    expect(source).toContain('@click="popoverOpened = true"')
    expect(source).toContain('@backdropclick="popoverOpened = false"')
    expect(source).toContain('@escape="popoverOpened = false"')
    expect(source.match(/@click="popoverOpened = false"/g)).toHaveLength(3)
  })
})
