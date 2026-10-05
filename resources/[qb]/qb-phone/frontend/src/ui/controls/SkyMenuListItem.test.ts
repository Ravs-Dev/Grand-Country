import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyMenuListItem from './SkyMenuListItem.vue'

describe('SkyMenuListItem', () => {
  it('forwards the active and auto-strong media state to SkyListItem', async () => {
    const html = await renderToString(
      createSSRApp(SkyMenuListItem, {
        active: true,
        subtitle: 'Home subtitle',
        title: 'Home',
      }),
    )

    expect(html).toContain('sky-menu-list-item--active')
    expect(html).toContain('sky-list-item--active')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('sky-list-item__title--strong')
  })

  it('matches Konsta iOS active colors in light and dark themes', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')
    const tokens = readFileSync(`${uiDirectory}/tokens.css`, 'utf8')
    const lightTokens = tokens.slice(
      tokens.indexOf('.sky-ui-provider,'),
      tokens.indexOf('.sky-ui-provider--dark,'),
    )
    const darkTokens = tokens.slice(tokens.indexOf('.sky-ui-provider--dark,'))

    expect(lightTokens).toContain(
      '--sky-menu-list-active-background: var(--sky-app-accent-soft);',
    )
    expect(lightTokens).toContain(
      '--sky-menu-list-active-text: var(--sky-app-accent);',
    )
    expect(darkTokens).toContain(
      '--sky-menu-list-active-background: var(--sky-app-accent);',
    )
    expect(darkTokens).toContain('--sky-menu-list-active-text: #ffffff;')
    expect(controls).toMatch(
      /\.sky-list-item--menu\.sky-list-item--active \.sky-list-item__row\s*\{[\s\S]*?background:\s*var\(\s*--sky-menu-list-active-background[\s\S]*?color:\s*var\(\s*--sky-menu-list-active-text/,
    )
  })

  it('keeps the title and subtitle on adjacent 20px line boxes', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')

    expect(controls).toMatch(
      /\.sky-list-item--menu\s*\{[^}]*padding:\s*4px 0;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__row\s*\{[^}]*min-height:\s*var\(--sky-touch-target, 44px\);[^}]*gap:\s*16px;[^}]*padding:\s*0 0 0 8px;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__content\s*\{[^}]*gap:\s*0;[^}]*padding:\s*12px 16px 12px 0;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__title-wrap\s*\{[^}]*min-height:\s*0;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__title\s*\{[^}]*font-size:\s*14px;[^}]*font-weight:\s*500;[^}]*line-height:\s*20px;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__title--strong\s*\{[^}]*font-weight:\s*600;/s,
    )
    expect(controls).toMatch(
      /\.sky-list-item--menu \.sky-list-item__subtitle\s*\{[^}]*color:\s*inherit;[^}]*font-size:\s*14px;[^}]*line-height:\s*20px;/s,
    )
  })
})
