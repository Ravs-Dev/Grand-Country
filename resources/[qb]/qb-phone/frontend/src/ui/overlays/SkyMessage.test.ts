import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyMessage from './SkyMessage.vue'

describe('SkyMessage', () => {
  it('renders received and sent message states', async () => {
    const [received, sent] = await Promise.all([
      renderToString(
        createSSRApp({
          render: () =>
            h(SkyMessage, {
              name: 'Kate',
              text: 'Hi, I am good!',
              type: 'received',
            }),
        }),
      ),
      renderToString(
        createSSRApp({
          render: () => h(SkyMessage, { text: 'Hi, Kate', type: 'sent' }),
        }),
      ),
    ])

    expect(received).toContain('sky-message--received')
    expect(received).toContain('sky-message__name')
    expect(received).toContain('Kate')
    expect(received).toContain('Hi, I am good!')
    expect(sent).toContain('sky-message--sent')
  })

  it('uses the exact Konsta iOS received and metadata colors', () => {
    const overlays = readFileSync(
      new URL('../overlays.css', import.meta.url),
      'utf8',
    )
    const tokens = readFileSync(
      new URL('../tokens.css', import.meta.url),
      'utf8',
    )

    expect(tokens).toMatch(/--sky-message-received-background:\s*#e5e5ea;/)
    expect(tokens).toMatch(/--sky-message-received-background:\s*#252525;/)
    expect(tokens).toMatch(/--sky-message-meta:\s*rgba\(0, 0, 0, 0\.45\);/)
    expect(tokens).toMatch(
      /--sky-message-meta:\s*rgba\(255, 255, 255, 0\.45\);/,
    )
    expect(overlays).toMatch(
      /\.sky-message__bubble\s*\{[\s\S]*?background:\s*var\(--sky-message-received-background\);/,
    )
    expect(overlays).toMatch(
      /\.sky-message__name,[\s\S]*?\.sky-message__header\s*\{[\s\S]*?color:\s*var\(--sky-message-meta\);/,
    )
  })
})
