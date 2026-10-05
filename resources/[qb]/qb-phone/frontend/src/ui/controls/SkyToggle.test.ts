import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyToggle from './SkyToggle.vue'

describe('SkyToggle', () => {
  it('renders the complete Konsta iOS glass layer stack', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(SkyToggle, {
            ariaLabel: 'Airplane mode',
            component: 'div',
            modelValue: true,
            name: 'airplane-mode',
            value: 'enabled',
          }),
      }),
    )

    expect(html).toContain('<div')
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-label="Airplane mode"')
    expect(html).toContain('checked')
    expect(html).toContain('name="airplane-mode"')
    expect(html).toContain('value="enabled"')
    expect(html).toContain('sky-toggle--checked')
    expect(html).toContain('sky-toggle__thumb-side')
    expect(html).toContain('sky-toggle__thumb-bg')
    expect(html).toContain('sky-toggle__thumb-shadow')
    expect(html).toContain('sky-toggle__thumb-wrap')
    expect(html).toContain('sky-toggle__thumb')
  })

  it('keeps disabled and readonly switches native and inert', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(SkyToggle, {
            ariaLabel: 'Locked setting',
            disabled: true,
            readonly: true,
          }),
      }),
    )

    expect(html).toContain('sky-toggle--disabled')
    expect(html).toContain('sky-toggle--readonly')
    expect(html).toContain('disabled')
    expect(html).toContain('readonly')
    expect(html).toContain('aria-readonly="true"')
  })

  it('prevents an enclosing label from activating forwarded clicks twice', () => {
    const componentSource = readFileSync(
      fileURLToPath(new URL('./SkyToggle.vue', import.meta.url)),
      'utf8',
    )

    expect(componentSource).toMatch(
      /if \(props\.component !== 'label' && event\.target !== input\.value\) \{\s*event\.preventDefault\(\)\s*input\.value\?\.click\(\)/,
    )
  })

  it('binds the complete enabled-only Konsta hold effect in CSS', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')
    const tokens = readFileSync(`${uiDirectory}/tokens.css`, 'utf8')

    expect(controls).toMatch(
      /\.sky-toggle:not\(\.sky-toggle--disabled\):not\(\.sky-toggle--readonly\):active[\s\S]*?\.sky-toggle__thumb-bg[\s\S]*?--sky-toggle-hold-track-scale, 0\.75/,
    )
    expect(controls).toMatch(
      /\.sky-toggle:not\(\.sky-toggle--disabled\):not\(\.sky-toggle--readonly\):active[\s\S]*?\.sky-toggle__thumb-wrap[\s\S]*?--sky-toggle-hold-background, transparent[\s\S]*?--sky-hold-thumb-scale, 1\.4/,
    )
    expect(controls).toContain('var(--sky-toggle-glow-spread, 10px)')
    expect(controls).toContain('var(--sky-app-accent, #007aff)')
    expect(controls).toContain('var(--sky-toggle-glow-opacity, 0.75)')
    expect(controls).toContain('var(--sky-shadow-glass-thumb)')
    expect(controls).toContain("[dir='rtl'] .sky-toggle--checked")
    expect(controls).toContain(".sky-toggle--checked[dir='rtl']")
    expect(controls).toMatch(
      /\.sky-toggle--checked\[dir='rtl'\] \.sky-toggle__thumb-side\s*\{\s*transform: none/,
    )
    expect(tokens).toContain('--sky-toggle-track: #f1f1f5')
    expect(tokens).toContain('--sky-toggle-track: #444447')
    expect(tokens).toContain('--sky-toggle-glow-opacity: 0.75')
    expect(tokens).toContain('--sky-toggle-glow-opacity: 1')

    const reducedMotion = controls.slice(
      controls.indexOf('@media (prefers-reduced-motion: reduce)'),
      controls.indexOf(
        '@supports',
        controls.indexOf('@media (prefers-reduced-motion: reduce)'),
      ),
    )
    expect(reducedMotion).toContain('.sky-toggle__thumb-side')
    expect(reducedMotion).toContain('.sky-toggle__thumb-bg')
    expect(reducedMotion).toContain('.sky-toggle__thumb-shadow')
    expect(reducedMotion).toContain('.sky-toggle__thumb-wrap')
    expect(reducedMotion).toContain('transform: translateX(-22px)')
  })

  it('keeps trailing list toggles compact without shrinking their touch target', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')

    expect(controls).toMatch(
      /\.sky-list-item__after > \.sky-toggle\s*\{\s*margin-block: -8px;/,
    )
    expect(controls).toMatch(/\.sky-toggle\s*\{[^}]*min-height: 28px/)
    expect(controls).toMatch(
      /\.sky-toggle__input\s*\{[^}]*height: var\(--sky-touch-target, 44px\)/,
    )
    expect(controls).toMatch(
      /\.sky-list-item__content\s*\{[\s\S]*?padding: 12px calc\(var\(--sky-safe-area-right\) \+ 16px\) 12px 0;/,
    )
  })
})
