import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyRadio from './SkyRadio.vue'

describe('SkyRadio', () => {
  it('keeps native radio semantics and accessible label wiring', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyRadio,
            {
              modelValue: 'apps',
              name: 'view',
              value: 'apps',
            },
            { default: () => 'Apps' },
          ),
      }),
    )

    expect(html).toContain('type="radio"')
    expect(html).toContain('checked')
    expect(html).toContain('name="view"')
    expect(html).toContain('value="apps"')
    expect(html).toContain('aria-labelledby=')
    expect(html).toContain('sky-radio--checked')
    expect(html).toContain('Apps')
  })

  it('uses the 22px mark footprint without shrinking the 44px input target', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')
    const radioStyles = controls.slice(
      controls.indexOf('.sky-radio {'),
      controls.indexOf('.sky-range {'),
    )

    expect(radioStyles).toMatch(
      /\.sky-radio\s*\{\s*min-width: 22px;\s*min-height: 22px/,
    )
    expect(radioStyles).toMatch(
      /\.sky-radio__input\s*\{[\s\S]*?width: var\(--sky-touch-target, 44px\)[\s\S]*?height: var\(--sky-touch-target, 44px\)[\s\S]*?inset-inline-start: -11px/,
    )
  })
})
