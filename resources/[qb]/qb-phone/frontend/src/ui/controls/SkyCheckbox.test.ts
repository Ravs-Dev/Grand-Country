import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyCheckbox from './SkyCheckbox.vue'

describe('SkyCheckbox', () => {
  it('keeps its native state and accessible label wiring', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyCheckbox,
            {
              indeterminate: true,
              modelValue: true,
              name: 'selection',
              required: true,
              value: 'all',
            },
            { default: () => 'Select all' },
          ),
      }),
    )

    expect(html).toContain('type="checkbox"')
    expect(html).toContain('checked')
    expect(html).toContain('required')
    expect(html).toContain('name="selection"')
    expect(html).toContain('value="all"')
    expect(html).toContain('aria-labelledby=')
    expect(html).toContain('sky-checkbox--checked')
    expect(html).toContain('sky-checkbox--indeterminate')
    expect(html).toContain('sky-checkbox__indeterminate')
    expect(html).toContain('Select all')
  })

  it('matches the Konsta iOS checkbox colors without inventing a glass hold state', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')
    const checkboxStyles = controls.slice(
      controls.indexOf('.sky-checkbox {'),
      controls.indexOf('.sky-fab {'),
    )

    expect(checkboxStyles).toContain(
      'border: 1px solid var(--sky-subtle, rgba(0, 0, 0, 0.3))',
    )
    expect(checkboxStyles).toMatch(
      /\.sky-checkbox__indeterminate\s*\{[\s\S]*?width: 75%/,
    )
    expect(checkboxStyles).not.toContain('--sky-shadow-glass')
    expect(checkboxStyles).not.toContain('scale(1.4)')
  })
})
