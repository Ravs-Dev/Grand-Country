import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyPopup from './SkyPopup.vue'

async function renderPopup(
  props: InstanceType<typeof SkyPopup>['$props'],
): Promise<string> {
  return renderToString(
    createSSRApp({
      render: () => h(SkyPopup, props, () => 'Popup content'),
    }),
  )
}

describe('SkyPopup', () => {
  it('renders the complete modal contract', async () => {
    const html = await renderPopup({ ariaLabel: 'Popup', opened: true })

    expect(html).toContain('class="sky-popup sky-popup--modal"')
    expect(html).toContain('class="sky-overlay-backdrop sky-popup__backdrop"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('<section')
    expect(html).toContain('class="sky-popup__panel"')
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-label="Popup"')
    expect(html).toContain('aria-modal="true"')
    expect(html).toContain('tabindex="-1"')
    expect(html).toContain('Popup content')
  })

  it('omits closed popups and optional backdrops', async () => {
    expect(await renderPopup({ opened: false })).not.toContain('sky-popup')

    const html = await renderPopup({ backdrop: false, opened: true })
    expect(html).not.toContain('sky-popup__backdrop')
    expect(html).toContain('Popup content')
  })

  it('matches the Konsta iOS surface, geometry, backdrop, and motion', () => {
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )
    const source = readFileSync(
      new URL('./SkyPopup.vue', import.meta.url),
      'utf8',
    )
    const tokens = readFileSync(
      new URL('../tokens.css', import.meta.url),
      'utf8',
    )
    const transitionRule = overlays.match(
      /\.sky-popup-rise-enter-active \.sky-popup__panel,[\s\S]*?\.sky-popup-rise-leave-active \.sky-popup__panel\s*\{(?<declarations>[^}]*)\}/,
    )?.groups?.declarations

    expect(transitionRule).toBeDefined()
    expect(transitionRule).toContain(
      'transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);',
    )
    expect(transitionRule).not.toContain('opacity')
    expect(overlays).toMatch(
      /\.sky-popup-rise-enter-from \.sky-popup__panel,[\s\S]*?transform:\s*translateY\(100%\);/,
    )
    expect(overlays).toMatch(
      /\.sky-popup__backdrop\s*\{[^}]*background:\s*rgba\(0, 0, 0, 0\.5\);/,
    )
    expect(overlays).toMatch(
      /\.sky-popup__panel\s*\{[^}]*background:\s*var\(--sky-popup-background, var\(--sky-surface\)\);/,
    )
    expect(overlays).toMatch(
      /\.sky-popup__panel\s*\{[^}]*inset:\s*0;[^}]*overflow:\s*hidden;[^}]*box-shadow:\s*none;/,
    )
    expect(source).not.toContain(':duration=')
    expect(tokens).toContain('--sky-popup-background: #ffffff;')
    expect(tokens).toContain('--sky-popup-background: #000000;')
  })
})
