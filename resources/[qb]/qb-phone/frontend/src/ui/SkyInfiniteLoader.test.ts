import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyInfiniteLoader from '@/ui/SkyInfiniteLoader.vue'

function renderLoader(error: boolean | string): Promise<string> {
  const app = createSSRApp(SkyInfiniteLoader, {
    error,
    hasMore: false,
    loading: false,
    loadingLabel: 'Loading more companies',
    loadKey: null,
    retryLabel: 'Try Again',
  })

  return renderToString(app)
}

describe('SkyInfiniteLoader error rendering', () => {
  it('does not Boolean-cast a bound empty error string to true', async () => {
    const html = await renderLoader('')

    expect(html).not.toContain('sky-infinite-loader__retry')
    expect(html).not.toContain('Try Again')
  })

  it.each([true, 'append_failed'])(
    'renders retry for error %j',
    async (error) => {
      const html = await renderLoader(error)

      expect(html).toContain('sky-infinite-loader__retry')
      expect(html).toContain('Try Again')
    },
  )
})
