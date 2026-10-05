import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyBreadcrumbs from './SkyBreadcrumbs.vue'
import SkyBreadcrumbsCollapsed from './SkyBreadcrumbsCollapsed.vue'
import SkyBreadcrumbsItem from './SkyBreadcrumbsItem.vue'
import SkyBreadcrumbsSeparator from './SkyBreadcrumbsSeparator.vue'

const controls = readFileSync(
  new URL('../controls.css', import.meta.url),
  'utf8',
)

describe('SkyBreadcrumbs', () => {
  it('renders semantic current-page and collapsed navigation controls', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyBreadcrumbs,
            { ariaLabel: 'Catalog breadcrumb' },
            {
              default: () => [
                h(SkyBreadcrumbsItem, { component: 'button' }, () => 'Home'),
                h(SkyBreadcrumbsSeparator),
                h(SkyBreadcrumbsCollapsed, {
                  ariaControls: 'hidden-levels',
                  ariaLabel: 'Show hidden levels',
                  expanded: false,
                }),
                h(SkyBreadcrumbsSeparator),
                h(SkyBreadcrumbsItem, { active: true }, () => 'iPhone 12'),
              ],
            },
          ),
      }),
    )

    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Catalog breadcrumb"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('aria-controls="hidden-levels"')
    expect(html).toContain('aria-expanded="false"')
    expect(html.match(/sky-breadcrumbs-collapsed__dot/g)).toHaveLength(3)
  })

  it('matches Konsta iOS geometry while retaining 44px hit boxes', () => {
    expect(controls).toMatch(
      /\.sky-breadcrumbs\s*\{[^}]*height:\s*var\(--sky-touch-target, 44px\)[^}]*gap:\s*12px[^}]*overflow-x:\s*auto[^}]*overflow-y:\s*hidden[^}]*margin-block:\s*-6px[^}]*padding:\s*10px 0[^}]*font-size:\s*17px[^}]*line-height:\s*24px/s,
    )
    expect(controls).toMatch(
      /\.sky-breadcrumbs-separator\s*\{[^}]*width:\s*12px[^}]*min-width:\s*12px[^}]*opacity:\s*0\.35/s,
    )
    expect(controls).toMatch(
      /\.sky-breadcrumbs-collapsed\s*\{[^}]*width:\s*var\(--sky-touch-target, 44px\)[^}]*height:\s*var\(--sky-touch-target, 44px\)[^}]*margin-inline:\s*-7px[^}]*padding:\s*0/s,
    )
    expect(controls).toMatch(
      /\.sky-breadcrumbs-collapsed::before\s*\{[^}]*width:\s*30px[^}]*height:\s*17px[^}]*background:\s*rgba\(0, 0, 0, 0\.15\)/s,
    )
    expect(controls).toMatch(
      /\.sky-app-page--dark \.sky-breadcrumbs-collapsed::before\s*\{[^}]*background:\s*rgba\(255, 255, 255, 0\.15\)/s,
    )
  })

  it('keeps rounded outline segments rounded at both ends', () => {
    expect(controls).toMatch(
      /\.sky-segmented--outline\.sky-segmented--rounded[\s\S]*?\.sky-segmented-button:first-child\s*\{[^}]*border-start-start-radius:\s*var\(--sky-radius-pill, 999px\)[^}]*border-end-start-radius:\s*var\(--sky-radius-pill, 999px\)/,
    )
    expect(controls).toMatch(
      /\.sky-segmented--outline\.sky-segmented--rounded[\s\S]*?\.sky-segmented-button:last-child\s*\{[^}]*border-start-end-radius:\s*var\(--sky-radius-pill, 999px\)[^}]*border-end-end-radius:\s*var\(--sky-radius-pill, 999px\)/,
    )
  })
})
