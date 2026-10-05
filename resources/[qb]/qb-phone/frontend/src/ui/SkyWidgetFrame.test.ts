import { readFileSync } from 'node:fs'

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyWidgetFrame from '@/ui/SkyWidgetFrame.vue'

const foundationStyles = readFileSync(
  new URL('./foundation.css', import.meta.url),
  'utf8',
)

describe('SkyWidgetFrame', () => {
  it('reserves a separate app-style label row below the widget surface', async () => {
    const html = await renderToString(
      createSSRApp(SkyWidgetFrame, { label: 'Weather', size: 'small' }),
    )

    expect(html).toContain('sky-widget-frame--small')
    expect(html).toContain('sky-widget-frame__surface')
    expect(html).toContain('sky-widget-frame__label')
    expect(html).toContain('Weather')
    expect(foundationStyles).toContain('var(--sky-widget-label-height);')
    expect(foundationStyles).toContain('var(--sky-widget-label-gap)')
  })

  it('keeps gallery previews unlabelled when requested', async () => {
    const html = await renderToString(
      createSSRApp(SkyWidgetFrame, {
        label: 'Music',
        showLabel: false,
        size: 'medium',
      }),
    )

    expect(html).toContain('sky-widget-frame--unlabelled')
    expect(html).not.toContain('sky-widget-frame__label')
  })
})
