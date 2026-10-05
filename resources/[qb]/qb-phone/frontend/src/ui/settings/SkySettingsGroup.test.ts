import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkySettingsGroup from '@/ui/settings/SkySettingsGroup.vue'
import SkySettingsRow from '@/ui/settings/SkySettingsRow.vue'

const settingsStyles = readFileSync(
  new URL('../settings.css', import.meta.url),
  'utf8',
)

describe('SkySettingsGroup', () => {
  it('connects its heading and footer to the settings section', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          SkySettingsGroup,
          {
            footer: 'Used when reconnecting to the channel.',
            title: 'Connection',
          },
          {
            default: () =>
              h(SkySettingsRow, {
                kind: 'value',
                title: 'Status',
                value: 'Ready',
              }),
          },
        ),
    })

    const html = await renderToString(app)
    const titleId = html.match(/<h2 id="([^"]+)"/)?.[1]
    const footerId = html.match(/<p id="([^"]+)"/)?.[1]

    expect(titleId).toBeTruthy()
    expect(footerId).toBeTruthy()
    expect(html).toContain(`aria-labelledby="${titleId}"`)
    expect(html).toContain(`aria-describedby="${footerId}"`)
    expect(html).toContain('<ul class="sky-settings-group__list">')
    expect(html).not.toContain('sky-list--inset')
  })

  it('uses an explicit accessible name when no heading is shown', async () => {
    const app = createSSRApp(SkySettingsGroup, {
      ariaLabel: 'Profile actions',
    })

    const html = await renderToString(app)

    expect(html).toContain('aria-label="Profile actions"')
    expect(html).not.toContain('<h2')
    expect(html).not.toContain('sky-settings-group__footer')
  })

  it('keeps the first group title flush with the scroll content', () => {
    expect(settingsStyles).toMatch(
      /\.sky-settings-group:first-child\s*>\s*\.sky-settings-group__title:first-child\s*\{[^}]*margin-top:\s*0/s,
    )
    expect(settingsStyles).toMatch(
      /\.sky-settings-group__title\s*\{[^}]*margin:\s*32px 16px 8px/s,
    )
  })

  it('centers standalone fields without the base field negative margins', () => {
    expect(settingsStyles).toMatch(
      /\.sky-settings-group__list\s*>\s*\.sky-field:not\(\.sky-field--has-label\)\s*\.sky-field__inner\s*\{[^}]*display:\s*flex[^}]*justify-content:\s*center/s,
    )
    expect(settingsStyles).toMatch(
      /\.sky-settings-group__list\s*>\s*\.sky-field:not\(\.sky-field--has-label\)\s*\.sky-field__control\s*\{[^}]*margin:\s*0/s,
    )
  })
})
