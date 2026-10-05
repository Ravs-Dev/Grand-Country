import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyMessagebar from './SkyMessagebar.vue'

async function renderMessagebar(
  props: Record<string, unknown> = {},
): Promise<string> {
  return renderToString(
    createSSRApp({
      render: () =>
        h(SkyMessagebar, props, {
          left: () => h('button', { class: 'camera' }, 'Camera'),
          right: () => h('button', { class: 'send' }, 'Send'),
        }),
    }),
  )
}

describe('SkyMessagebar', () => {
  it('uses a toolbar fade with separate Glass around the input', async () => {
    const html = await renderMessagebar({
      ariaLabel: 'Message',
      modelValue: 'Hello',
    })

    expect(html).toMatch(/class="[^"]*sky-messagebar[^"]*sky-toolbar[^"]*"/)
    expect(html).toContain('sky-toolbar__blur')
    expect(html).toContain('sky-toolbar__background')
    expect(html).toContain('sky-messagebar__inner')
    expect(html).toContain('sky-messagebar__area')
    expect(html).toContain('sky-glass')
    expect(html).not.toContain('sky-glass-surface')
    expect(html).toContain('aria-label="Message"')
    expect(html).toContain('>Hello</textarea>')
    expect(html.indexOf('sky-messagebar__left')).toBeLessThan(
      html.indexOf('sky-messagebar__area'),
    )
    expect(html.indexOf('sky-messagebar__area')).toBeLessThan(
      html.indexOf('sky-messagebar__right'),
    )
  })

  it('keeps app-owned composers in flow through the embedded variant', async () => {
    const html = await renderMessagebar({ embedded: true })
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )

    expect(html).toContain('sky-messagebar--embedded')
    expect(overlays).toMatch(
      /\.sky-messagebar--embedded\s*\{[\s\S]*?position:\s*relative;[\s\S]*?z-index:\s*auto;[\s\S]*?padding:\s*0;/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar--embedded \.sky-toolbar__blur,[\s\S]*?\.sky-messagebar--embedded \.sky-toolbar__background\s*\{[\s\S]*?display:\s*none;/,
    )
  })

  it('locks the Konsta iOS messagebar geometry', () => {
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )

    expect(overlays).toMatch(
      /\.sky-messagebar\s*\{[\s\S]*?--sky-messagebar-gap:\s*12px;/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar__area\s*\{[\s\S]*?height:\s*40px;[\s\S]*?border-radius:\s*24px;/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar textarea\s*\{[\s\S]*?height:\s*40px;[\s\S]*?padding:\s*12px 16px 4px;[\s\S]*?line-height:\s*16px;/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar \.sky-toolbar-pane\s*\{[\s\S]*?height:\s*40px;/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar__left,[\s\S]*?\.sky-messagebar__right\s*\{[\s\S]*?color:\s*var\(--sky-messagebar-icon\);/,
    )
    expect(overlays).toMatch(
      /\.sky-messagebar__left \.sky-link,[\s\S]*?\.sky-messagebar__right \.sky-link\s*\{[\s\S]*?color:\s*inherit;/,
    )
  })
})
