import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkySettingsRow from '@/ui/settings/SkySettingsRow.vue'

const settingsStyles = readFileSync(
  new URL('../settings.css', import.meta.url),
  'utf8',
)

async function renderRow(props: Record<string, unknown>): Promise<string> {
  return renderToString(createSSRApp(SkySettingsRow, props))
}

describe('SkySettingsRow', () => {
  it('uses the regular row padding for toggles without compacting them', () => {
    expect(settingsStyles).toMatch(
      /\.sky-settings-row__frame,\s*\.sky-settings-range-row__frame\s*\{[^}]*padding:\s*8px 16px/s,
    )
    expect(settingsStyles).not.toMatch(
      /\.sky-settings-row--toggle\s+\.sky-settings-row__frame\s*\{[^}]*padding-(?:top|bottom):/s,
    )
    expect(settingsStyles).toMatch(
      /\.sky-settings-group--compact\s+\.sky-settings-row__frame,[^}]*padding-top:\s*6px;[^}]*padding-bottom:\s*6px/s,
    )
  })

  it('renders navigation as a full-row button with value and chevron', async () => {
    const html = await renderRow({
      kind: 'navigation',
      title: 'Private address',
      value: 'Static',
    })

    expect(html).toContain('<button')
    expect(html).toContain('type="button"')
    expect(html).toContain('sky-settings-row__value')
    expect(html).toContain('sky-settings-row__chevron')
    expect(html).toContain('Static')
  })

  it('marks a selected choice without adding a chevron', async () => {
    const html = await renderRow({
      kind: 'choice',
      selected: true,
      title: 'System',
    })

    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain('sky-settings-row__check')
    expect(html).not.toContain('sky-settings-row__chevron')
  })

  it('labels the native switch from the row copy', async () => {
    const html = await renderRow({
      description: 'Reconnect after restarting the phone.',
      kind: 'toggle',
      modelValue: true,
      title: 'Automatic rejoin',
    })
    const titleId = html.match(/<label id="([^"]+)"/)?.[1]
    const descriptionId = html.match(/<span id="([^"]+)"/)?.[1]
    const input = html.match(/<input[^>]+role="switch"[^>]*>/)?.[0] ?? ''

    expect(titleId).toBeTruthy()
    expect(descriptionId).toBeTruthy()
    expect(input).toContain(`aria-labelledby="${titleId}"`)
    expect(input).toContain(`aria-describedby="${descriptionId}"`)
    expect(input).toContain('checked')
  })

  it('keeps the labelled switch mounted and disabled while pending', async () => {
    const html = await renderRow({
      kind: 'toggle',
      modelValue: true,
      pending: true,
      title: 'Automatic rejoin',
    })
    const input = html.match(/<input[^>]+role="switch"[^>]*>/)?.[0] ?? ''

    expect(html).toContain('sky-spinner')
    expect(input).toContain('disabled')
    expect(input).toContain('aria-labelledby=')
  })

  it('renders destructive actions as buttons with the danger tone', async () => {
    const html = await renderRow({
      kind: 'action',
      title: 'Remove',
      tone: 'danger',
    })

    expect(html).toContain('<button')
    expect(html).toContain('sky-settings-row--danger')
    expect(html).not.toContain('sky-settings-row__chevron')
  })

  it('keeps value and chevron when navigation supplies custom trailing content', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          SkySettingsRow,
          {
            kind: 'navigation',
            title: 'Wi-Fi',
            value: 'Connected',
          },
          {
            trailing: () => h('span', { class: 'network-strength' }, 'Strong'),
          },
        ),
    })
    const html = await renderToString(app)

    expect(html).toContain('Connected')
    expect(html).toContain('network-strength')
    expect(html).toContain('sky-settings-row__chevron')

    const labelledBy = html.match(/aria-labelledby="([^"]+)"/)?.[1] ?? ''
    const valueId = html.match(
      /<span id="([^"]+)" class="sky-settings-row__value"/,
    )?.[1]
    const trailingId = html.match(
      /<span id="([^"]+)" class="sky-settings-row__trailing"/,
    )?.[1]

    expect(valueId).toBeTruthy()
    expect(trailingId).toBeTruthy()
    expect(labelledBy).toContain(valueId ?? '')
    expect(labelledBy).toContain(trailingId ?? '')
  })

  it.each(['custom', 'value'] as const)(
    'renders the trailing slot for %s rows',
    async (kind) => {
      const app = createSSRApp({
        render: () =>
          h(
            SkySettingsRow,
            { kind, title: 'Status' },
            {
              trailing: () => h('span', { class: 'status-accessory' }, 'Ready'),
            },
          ),
      })
      const html = await renderToString(app)

      expect(html).toContain('status-accessory')
      expect(html).toContain('Ready')
    },
  )
})
