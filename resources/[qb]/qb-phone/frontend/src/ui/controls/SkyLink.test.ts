import { readFileSync } from 'node:fs'

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyLink from './SkyLink.vue'

describe('SkyLink', () => {
  it('matches the Konsta anchor default', async () => {
    const html = await renderToString(createSSRApp(SkyLink))

    expect(html).toMatch(/^<a[^>]*class="sky-link"/)
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('role="link"')
  })

  it('keeps intrinsic visible geometry with an invisible 44px hit target', () => {
    const controls = readFileSync(
      new URL('../controls.css', import.meta.url),
      'utf8',
    )

    expect(controls).toMatch(
      /\.sky-link\s*\{[^}]*min-width:\s*0;[^}]*min-height:\s*0;[^}]*gap:\s*4px;[^}]*padding:\s*0;[^}]*border-radius:\s*0;/s,
    )
    expect(controls).toMatch(
      /\.sky-link::before\s*\{[^}]*width:\s*max\(100%, var\(--sky-touch-target, 44px\)\);[^}]*height:\s*max\(100%, var\(--sky-touch-target, 44px\)\)/s,
    )
    expect(controls).toMatch(
      /\.sky-link:active:not\(:disabled\)\s*\{[^}]*opacity:\s*0\.5;/s,
    )
    expect(controls).not.toMatch(
      /\.sky-link:active:not\(:disabled\)\s*\{[^}]*background:/s,
    )
  })
})
