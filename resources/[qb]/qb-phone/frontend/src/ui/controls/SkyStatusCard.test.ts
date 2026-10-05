import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyStatusCard from '@/ui/controls/SkyStatusCard.vue'

const controlsStyles = readFileSync(
  new URL('../controls.css', import.meta.url),
  'utf8',
)

describe('SkyStatusCard', () => {
  it('renders a textual live status with a semantic tone and indicator', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          SkyStatusCard,
          {
            indicator: true,
            ariaLive: 'polite',
            subtitle: 'Yaca',
            title: 'Connected to 120.5 MHz',
            tone: 'success',
          },
          { icon: () => h('svg', { 'aria-hidden': 'true' }) },
        ),
    })

    const html = await renderToString(app)

    expect(html).toContain('role="status"')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('aria-atomic="true"')
    expect(html).toContain('sky-status-card--success')
    expect(html).toContain('sky-status-card__indicator')
    expect(html).toContain('Connected to 120.5 MHz')
    expect(html).toContain('Yaca')
  })

  it('keeps an indicator in the right-hand column when no icon is present', async () => {
    const app = createSSRApp({
      render: () =>
        h(SkyStatusCard, {
          indicator: true,
          subtitle: 'Sky-only status primitive',
          title: 'Ready',
          tone: 'success',
        }),
    })

    const html = await renderToString(app)
    const statusCardRule = controlsStyles.match(
      /\.sky-status-card\s*\{([^}]*)\}/s,
    )?.[1]

    expect(html).toContain('sky-status-card__indicator')
    expect(statusCardRule).toContain('display: flex')
    expect(statusCardRule).not.toContain('grid-template-columns')
    expect(controlsStyles).toMatch(
      /\.sky-status-card__copy\s*\{[^}]*flex:\s*1 1 auto;/s,
    )
    expect(controlsStyles).toMatch(
      /\.sky-status-card__indicator\s*\{[^}]*flex:\s*none;/s,
    )
  })

  it('prefers a trailing slot over the indicator', async () => {
    const app = createSSRApp({
      render: () =>
        h(
          SkyStatusCard,
          { indicator: true, title: 'Connected' },
          { trailing: () => h('span', '120.5 MHz') },
        ),
    })

    const html = await renderToString(app)

    expect(html).toContain('sky-status-card__trailing')
    expect(html).toContain('120.5 MHz')
    expect(html).not.toContain('sky-status-card__indicator')
    expect(controlsStyles).toMatch(
      /\.sky-status-card__trailing\s*\{[^}]*flex:\s*none;/s,
    )
  })
})
