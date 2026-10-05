import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyPillNavigation from './SkyPillNavigation.vue'

const foundation = readFileSync(
  new URL('./foundation.css', import.meta.url),
  'utf8',
)

describe('SkyPillNavigation', () => {
  it('defaults to a labelled full-width navigation', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyPillNavigation,
            { label: 'Store navigation' },
            { default: () => h('div', 'Tabs') },
          ),
      }),
    )

    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Store navigation"')
    expect(html).toContain('sky-pill-navigation--full')
    expect(html).toContain('sky-pill-navigation--align-center')
    expect(html).toContain('sky-pill-navigation__group--primary')
    expect(html).not.toContain('sky-pill-navigation__group--end')
  })

  it('supports compact start/end alignment and separated groups', async () => {
    const compact = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyPillNavigation,
            { align: 'end', label: 'Compact navigation', layout: 'compact' },
            { default: () => h('div', 'Compact') },
          ),
      }),
    )
    const split = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyPillNavigation,
            { label: 'Split navigation', layout: 'split' },
            {
              default: () => h('div', 'Apps and games'),
              end: () => h('div', 'Search'),
            },
          ),
      }),
    )

    expect(compact).toContain('sky-pill-navigation--compact')
    expect(compact).toContain('sky-pill-navigation--align-end')
    expect(split).toContain('sky-pill-navigation--split')
    expect(split).toContain('sky-pill-navigation__group--primary')
    expect(split).toContain('sky-pill-navigation__group--end')
  })

  it('locks full, compact and split geometry to the safe phone surface', () => {
    expect(foundation).toMatch(
      /\.sky-pill-navigation\s*\{[^}]*right:\s*calc\(var\(--sky-safe-area-right\) \+ var\(--sky-space-4\)\)[^}]*bottom:\s*calc\(var\(--sky-safe-area-bottom\) \+ 10px\)[^}]*left:\s*calc\(var\(--sky-safe-area-left\) \+ var\(--sky-space-4\)\)/s,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation--full[\s\S]*?\.sky-pill-navigation__group--primary\s*\{[^}]*width:\s*100%/,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation--compact\.sky-pill-navigation--align-start[\s\S]*?justify-content:\s*flex-start/,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation--compact\.sky-pill-navigation--align-end[\s\S]*?justify-content:\s*flex-end/,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation--split \.sky-pill-navigation__inner\s*\{[^}]*justify-content:\s*space-between/,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation__group--end\s*\{[^}]*margin-inline-start:\s*auto/,
    )
    expect(foundation).toMatch(
      /\.sky-pill-navigation--compact \.sky-segmented-button,[\s\S]*?width:\s*60px;[\s\S]*?flex:\s*0 0 60px/,
    )
  })
})
