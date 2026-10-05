import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyDialogButton from './SkyDialogButton.vue'

async function renderDialogButton(
  props: { disabled?: boolean; strong?: boolean } = {},
): Promise<string> {
  return renderToString(
    createSSRApp({
      render: () => h(SkyDialogButton, props, () => 'Continue'),
    }),
  )
}

describe('SkyDialogButton', () => {
  it('uses the Konsta iOS tonal button for a regular action', async () => {
    const html = await renderDialogButton()
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )

    expect(html).toContain('<button')
    expect(html).toContain('type="button"')
    expect(html).toContain('sky-dialog-button')
    expect(html).toContain('sky-button--primary')
    expect(html).toContain('sky-button--large')
    expect(html).toContain('sky-button--rounded')
    expect(html).toContain('sky-button--tonal')
    expect(html).not.toContain('sky-dialog-button--strong')
    expect(overlays).toMatch(
      /\.sky-dialog-button\.sky-button\s*\{\s*color:\s*#fff;/,
    )
  })

  it('uses the Konsta iOS filled button for a strong action', async () => {
    const html = await renderDialogButton({ strong: true })

    expect(html).toContain('sky-dialog-button--strong')
    expect(html).toContain('sky-button--primary')
    expect(html).not.toContain('sky-button--tonal')
  })

  it('uses neutral Konsta disabled colors instead of fading the button', async () => {
    const html = await renderDialogButton({ disabled: true, strong: true })
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )

    expect(html).toContain('disabled')
    expect(overlays).toMatch(
      /\.sky-dialog-button:disabled\s*\{[\s\S]*?background:\s*var\(--sky-pressed\);[\s\S]*?color:\s*var\(--sky-subtle\);[\s\S]*?opacity:\s*1;/,
    )
    expect(overlays).not.toMatch(
      /\.sky-action-button:disabled,[\s\S]*?\.sky-dialog-button:disabled,[\s\S]*?opacity:\s*0\.45;/,
    )
  })
})
