import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useWeazelNewsStore } from '@/stores/weazel-news'
import type {
  WeazelNewsArticle,
  WeazelNewsArticleDraft,
} from '@/types/weazel-news'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))

const mockNuiCall = vi.mocked(nuiCall)

const article: WeazelNewsArticle = {
  authorName: 'Jane Doe',
  body: 'The full article body.',
  category: 'news',
  createdAt: 1_754_000_000,
  excerpt: 'The article excerpt.',
  id: '7d28b252-0532-4869-9512-e313e34d2fb8',
  imageMediaId: 12,
  imageUrl: 'https://media.invalid/weazel/article.webp',
  images: [
    {
      mediaId: 12,
      url: 'https://media.invalid/weazel/article.webp',
    },
    {
      mediaId: 13,
      url: 'https://media.invalid/weazel/article-2.webp',
    },
  ],
  publishedAt: 1_754_000_100,
  revision: 4,
  status: 'published',
  title: 'Breaking news',
  updatedAt: 1_754_000_100,
}

const draft: WeazelNewsArticleDraft = {
  body: 'Updated body.',
  category: 'business',
  imageMediaIds: [33, 34],
  status: 'draft',
  title: 'Updated headline',
}

describe('Weazel News store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNuiCall.mockReset()
  })

  it('loads the server-owned management context and category counts', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: {
        canManage: true,
        categories: [
          { count: 3, id: 'news' },
          { count: 1, id: 'jobs' },
        ],
        jobGradeLabel: 'Editor',
        jobLabel: 'Weazel News',
        maximumImages: 6,
      },
      success: true,
    })
    const store = useWeazelNewsStore()

    expect(await store.loadContext()).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:context')
    expect(store.context?.canManage).toBe(true)
    expect(store.context?.categories[0]).toEqual({ count: 3, id: 'news' })
    expect(store.context?.maximumImages).toBe(6)
  })

  it('loads and deduplicates appended public pages', async () => {
    mockNuiCall
      .mockResolvedValueOnce({
        data: { hasMore: true, items: [article] },
        success: true,
      })
      .mockResolvedValueOnce({
        data: {
          hasMore: false,
          items: [
            { ...article, revision: 5, title: 'Canonical headline' },
            { ...article, id: 'second-article' },
          ],
        },
        success: true,
      })
    const store = useWeazelNewsStore()

    await store.loadPublic({ category: 'news', search: 'breaking' })
    await store.loadPublic({
      append: true,
      category: 'news',
      search: 'breaking',
    })

    expect(mockNuiCall).toHaveBeenNthCalledWith(1, 'weazel-news:list', {
      category: 'news',
      offset: 0,
      search: 'breaking',
    })
    expect(mockNuiCall).toHaveBeenNthCalledWith(2, 'weazel-news:list', {
      category: 'news',
      offset: 1,
      search: 'breaking',
    })
    expect(store.publicItems).toHaveLength(2)
    expect(store.publicItems[0]?.title).toBe('Canonical headline')
    expect(store.publicHasMore).toBe(false)
  })

  it('normalizes the public response to newest first without changing images', async () => {
    const older = {
      ...article,
      id: 'older-article',
      publishedAt: (article.publishedAt ?? 0) - 1_000,
    }
    const newer = {
      ...article,
      id: 'newer-article',
      images: [...article.images].reverse(),
      publishedAt: (article.publishedAt ?? 0) + 1_000,
    }
    mockNuiCall.mockResolvedValueOnce({
      data: { hasMore: false, items: [older, newer] },
      success: true,
    })
    const store = useWeazelNewsStore()

    expect(await store.loadPublic()).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:list', {
      category: null,
      offset: 0,
      search: '',
    })
    expect(store.publicItems.map((item) => item.id)).toEqual([
      'newer-article',
      'older-article',
    ])
    expect(store.publicItems[0]?.images).toEqual(newer.images)
  })

  it('replaces stale search results with a successful empty response', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { hasMore: false, items: [] },
      success: true,
    })
    const store = useWeazelNewsStore()
    store.publicItems = [article]

    expect(await store.loadPublic({ search: 'missing headline' })).toBe(true)
    expect(store.publicItems).toEqual([])
    expect(store.publicHasMore).toBe(false)
  })

  it('loads paged management results including drafts', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { hasMore: false, items: [{ ...article, status: 'draft' }] },
      success: true,
    })
    const store = useWeazelNewsStore()

    expect(
      await store.loadManaged('draft', { offset: 20, search: 'city' }),
    ).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:manage-list', {
      offset: 20,
      search: 'city',
      status: 'draft',
    })
    expect(store.managedItems[0]?.status).toBe('draft')
  })

  it('loads a canonical article for public or management detail', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { article },
      success: true,
    })
    const store = useWeazelNewsStore()

    expect(await store.loadArticle(article.id, true)).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:get', {
      id: article.id,
      manage: true,
    })
    expect(store.selected).toEqual(article)
  })

  it('normalizes a direct canonical create response', async () => {
    const created = { ...article, id: 'created-article', revision: 1 }
    mockNuiCall.mockResolvedValueOnce({ data: created, success: true })
    const store = useWeazelNewsStore()

    expect(await store.create({ ...draft, status: 'published' })).toEqual(
      created,
    )
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:create', {
      ...draft,
      status: 'published',
    })
    expect(store.managedItems).toEqual([created])
    expect(store.publicItems).toEqual([created])
  })

  it('sends the optimistic revision and applies the canonical update', async () => {
    const canonical = {
      ...article,
      ...draft,
      excerpt: 'Updated excerpt.',
      revision: 5,
      updatedAt: 1_754_100_000,
    }
    mockNuiCall.mockResolvedValueOnce({
      data: { article: canonical },
      success: true,
    })
    const store = useWeazelNewsStore()
    store.publicItems = [article]
    store.managedItems = [article]
    store.selected = article

    expect(await store.update(article, draft)).toEqual(canonical)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:update', {
      ...draft,
      id: article.id,
      revision: 4,
    })
    expect(store.selected).toEqual(canonical)
    expect(store.managedItems).toEqual([canonical])
    expect(store.publicItems).toEqual([])
  })

  it('keeps local articles unchanged after a revision conflict', async () => {
    mockNuiCall.mockResolvedValueOnce({
      error: 'revision_conflict',
      success: false,
    })
    const store = useWeazelNewsStore()
    store.managedItems = [article]

    expect(await store.update(article, draft)).toBeNull()
    expect(store.managedItems).toEqual([article])
    expect(store.error).toBe('revision_conflict')
  })

  it('deletes by id and revision only after server confirmation', async () => {
    mockNuiCall.mockResolvedValueOnce({ success: true })
    const store = useWeazelNewsStore()
    store.publicItems = [article]
    store.managedItems = [article]
    store.selected = article

    expect(await store.remove(article)).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('weazel-news:delete', {
      id: article.id,
      revision: article.revision,
    })
    expect(store.publicItems).toEqual([])
    expect(store.managedItems).toEqual([])
    expect(store.selected).toBeNull()
  })
})
