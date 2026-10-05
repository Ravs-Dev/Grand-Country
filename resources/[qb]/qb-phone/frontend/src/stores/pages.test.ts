import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePagesStore } from '@/stores/pages'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))
const mockNuiCall = vi.mocked(nuiCall)

describe('Local Pages store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNuiCall.mockReset()
  })

  it('shares only the CityMarkt listing id with the server', async () => {
    mockNuiCall.mockResolvedValueOnce({ data: { id: 'post-id' }, success: true })
    const response = await usePagesStore().shareCityMarkt('listing-id')
    expect(response.success).toBe(true)
    expect(mockNuiCall).toHaveBeenCalledWith('pages:share-citymarkt', {
      listingId: 'listing-id',
    })
  })

  it('updates a successful like locally', async () => {
    mockNuiCall.mockResolvedValueOnce({ success: true })
    const pages = usePagesStore()
    pages.items = [{ id: 'post-id', is_liked: false, like_count: 2 } as never]
    await pages.react('post-id', 'like', true)
    expect(pages.items[0]?.is_liked).toBe(true)
    expect(pages.items[0]?.like_count).toBe(3)
  })

  it('removes an unsaved post from the saved profile list immediately', async () => {
    mockNuiCall.mockResolvedValueOnce({ success: true })
    const pages = usePagesStore()
    pages.savedItems = [
      { id: 'saved-post', is_saved: true } as never,
      { id: 'other-post', is_saved: true } as never,
    ]

    await pages.react('saved-post', 'save', false)

    expect(pages.savedItems.map((item) => item.id)).toEqual(['other-post'])
  })

  it('adds a newly saved post to the profile list immediately', async () => {
    mockNuiCall.mockResolvedValueOnce({ success: true })
    const pages = usePagesStore()
    pages.items = [{ id: 'feed-post', is_saved: false } as never]

    await pages.react('feed-post', 'save', true)

    expect(pages.savedItems.map((item) => item.id)).toEqual(['feed-post'])
    expect(pages.savedItems[0]?.is_saved).toBe(true)
  })

  it('stores the profile returned by the server', async () => {
    const profile = {
      avatar_media_id: 42,
      avatar_url: 'https://example.test/avatar.webp',
      bio: 'Vinewood tips and city stories.',
      email: 'demo@ifruit.com',
      exists: true,
      handle: 'demo',
      post_count: 2,
    }
    mockNuiCall.mockResolvedValueOnce({ data: profile, success: true })

    const response = await usePagesStore().saveProfile({
      avatarMediaId: profile.avatar_media_id,
      bio: profile.bio,
      handle: profile.handle,
    })

    expect(response.success).toBe(true)
    expect(usePagesStore().profile).toEqual(profile)
  })

  it('keeps an existing profile when an old browser mock returns no profile payload', async () => {
    const pages = usePagesStore()
    pages.profile = {
      avatar_media_id: null,
      avatar_url: null,
      bio: '',
      email: 'demo@ifruit.com',
      exists: true,
      handle: 'demo',
      post_count: 2,
    }
    mockNuiCall
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ data: { hasMore: false, items: [], offset: 0 }, success: true })
      .mockResolvedValueOnce({ data: { hasMore: false, items: [], offset: 0 }, success: true })

    expect(await pages.loadProfile()).toBe(true)
    expect(pages.profile.handle).toBe('demo')
  })
})
