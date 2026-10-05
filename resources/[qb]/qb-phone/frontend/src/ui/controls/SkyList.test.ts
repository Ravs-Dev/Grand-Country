import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyList from '@/ui/controls/SkyList.vue'

describe('SkyList', () => {
  it('exposes compact flush grouping as a reusable list contract', async () => {
    const app = createSSRApp(SkyList, {
      density: 'compact',
      flush: true,
      inset: true,
      strong: true,
    })

    const html = await renderToString(app)

    expect(html).toContain('sky-list--compact')
    expect(html).toContain('sky-list--flush')
    expect(html).toContain('sky-list--inset')
    expect(html).toContain('sky-list--strong')
    expect(html).toMatch(/^<div[^>]*class="sky-list/)
    expect(html).toMatch(/<ul class="sky-list__items">[\s\S]*<\/ul><\/div>$/)
  })
})
