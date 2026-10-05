import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkySettingsRangeRow from '@/ui/settings/SkySettingsRangeRow.vue'

describe('SkySettingsRangeRow', () => {
  it('renders a semantic list row and forwards the native range contract', async () => {
    const app = createSSRApp(SkySettingsRangeRow, {
      ariaValueText: '75 percent',
      max: 100,
      min: 25,
      modelValue: 75,
      step: 5,
      title: 'Brightness',
      valueLabel: '75%',
    })

    const html = await renderToString(app)

    expect(html).toContain('<li')
    expect(html).toContain('class="sky-settings-range-row"')
    expect(html).toContain('type="range"')
    expect(html).toContain('aria-label="Brightness"')
    expect(html).toContain('aria-valuetext="75 percent"')
    expect(html).toContain('min="25"')
    expect(html).toContain('max="100"')
    expect(html).toContain('step="5"')
    expect(html).toContain('class="sky-settings-range-row__title">Brightness')
    expect(html).toContain('class="sky-settings-range-row__value">75%')
    expect(html).not.toContain('sky-range__caption')
  })

  it('uses the effective numeric value as its default visible label', async () => {
    const app = createSSRApp(SkySettingsRangeRow, {
      title: 'Scale',
      value: 1.25,
    })

    const html = await renderToString(app)

    expect(html).toMatch(
      /class="sky-settings-range-row__value">.*1\.25.*<\/span>/,
    )
    expect(html).not.toContain('aria-valuetext=')
  })

  it('uses the formatted visible label as the accessible value fallback', async () => {
    const app = createSSRApp(SkySettingsRangeRow, {
      modelValue: 0.75,
      title: 'Scale',
      valueLabel: '75%',
    })

    const html = await renderToString(app)

    expect(html).toContain('aria-valuetext="75%"')
    expect(html).toMatch(
      /class="sky-settings-range-row__value">.*75%.*<\/span>/,
    )
  })

  it('supports decorative range endpoint icons without changing the label', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          SkySettingsRangeRow,
          { modelValue: 50, title: 'Volume', valueLabel: '50%' },
          {
            leading: () => h('svg', { 'data-endpoint': 'low' }),
            trailing: () => h('svg', { 'data-endpoint': 'high' }),
          },
        ),
    })

    const html = await renderToString(app)

    expect(html).toContain('sky-settings-range-row__endpoint--leading')
    expect(html).toContain('sky-settings-range-row__endpoint--trailing')
    expect(html).toContain('data-endpoint="low"')
    expect(html).toContain('data-endpoint="high"')
    expect(html).toContain('aria-label="Volume"')
  })

  it('exposes input, change, and numeric model update events', () => {
    const component = SkySettingsRangeRow as unknown as { emits: string[] }

    expect(component.emits).toEqual(
      expect.arrayContaining(['change', 'input', 'update:modelValue']),
    )
  })
})
