import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyListItem from './SkyListItem.vue'

describe('SkyListItem', () => {
  it('matches the Konsta anchor default for link rows', async () => {
    const html = await renderToString(
      createSSRApp(SkyListItem, { link: true, title: 'Inbox' }),
    )

    expect(html).toMatch(
      /^<li[^>]*class="sky-list-item[^"]*sky-list-item--link[^"]*"><a class="sky-list-item__row"/,
    )
    expect(html).not.toContain('<button')
  })

  it('renders row actions beside rather than inside the primary control', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(
            SkyListItem,
            { link: true, linkComponent: 'button', title: 'Note' },
            { actions: () => h('button', { type: 'button' }, 'Delete') },
          ),
      }),
    )

    expect(html).toContain('sky-list-item--with-actions')
    expect(html).toMatch(
      /<button[^>]*class="sky-list-item__row"[\s\S]*?<\/button><div class="sky-list-item__actions">[\s\S]*?<button/,
    )
  })
})
