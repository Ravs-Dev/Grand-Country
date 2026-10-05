import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyIcon from './SkyIcon.vue'

describe('SkyIcon', () => {
  it('uses the Konsta i element default and renders a colored badge', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyIcon,
            {
              badge: 5,
              badgeColors: { bg: '#ef4444', text: '#ffffff' },
              size: 28,
            },
            { default: () => h('svg') },
          ),
      }),
    )

    expect(html).toContain('<i')
    expect(html).toContain('class="sky-icon"')
    expect(html).toContain('height:28px')
    expect(html).toContain('width:28px')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('sky-icon__badge')
    expect(html).toContain('background:#ef4444')
    expect(html).toContain('color:#ffffff')
    expect(html).toMatch(/sky-icon__badge[\s\S]*?5[\s\S]*?<\/span>/)
  })

  it('supports a custom component and a badge slot without a badge prop', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyIcon,
            { component: 'span', label: 'Inbox' },
            {
              badge: () => 'NEW',
              default: () => h('svg'),
            },
          ),
      }),
    )

    expect(html).toContain('<span')
    expect(html).toContain('aria-label="Inbox"')
    expect(html).toContain('role="img"')
    expect(html).not.toContain('aria-hidden="true"')
    expect(html).toContain('sky-icon__badge')
    expect(html).toMatch(/sky-icon__badge[\s\S]*?NEW[\s\S]*?<\/span>/)
  })
})
