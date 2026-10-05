import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useFeatherStore } from '@/stores/feather'
import type { FeatherPost, FeatherProfile } from '@/types/feather'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))

const profile: FeatherProfile = {
  bio: 'City life',
  display_name: 'Nova',
  followers: 4,
  following: 2,
  handle: 'nova',
  id: 7,
  is_following: false,
  is_owner: false,
  post_count: 1,
  verified: false,
}

const post: FeatherPost = {
  body: 'Hello Los Santos',
  created_at: 1,
  display_name: 'Nova',
  handle: 'nova',
  id: 'post-1',
  is_bookmarked: false,
  is_following: false,
  is_liked: false,
  is_owner: false,
  like_count: 2,
  media: [],
  profile_id: 7,
  reply_count: 0,
  verified: false,
}

describe('Feather store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(nuiCall).mockReset()
  })

  it('hydrates the profile and feed from the account-linked bootstrap', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: {
        feed: { hasMore: false, items: [post], offset: 0 },
        onboarded: true,
        profile,
        suggestions: [],
        topics: [{ count: 12, tag: '#LosSantos' }],
      },
    })
    const store = useFeatherStore()

    expect(await store.bootstrap()).toBe(true)
    expect(store.onboarded).toBe(true)
    expect(store.feed).toHaveLength(1)
    expect(store.topics).toEqual([{ count: 12, tag: '#LosSantos' }])
  })

  it('rolls an optimistic reaction back when the server rejects it', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: false,
      error: 'rate_limited',
    })
    const store = useFeatherStore()
    const item = { ...post }

    await store.react(item, 'like')

    expect(item.is_liked).toBe(false)
    expect(item.like_count).toBe(2)
  })

  it('loads posts matching text or hashtags in Explore', async () => {
    const hashtagPost = { ...post, body: 'Meetup tonight #CityLife' }
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: {
        posts: [hashtagPost],
        profiles: [],
        topics: [{ count: 5, tag: '#CityLife' }],
      },
    })
    const store = useFeatherStore()

    expect(await store.explore('#CityLife')).toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('feather:explore', {
      search: '#CityLife',
    })
    expect(store.explorePosts).toEqual([hashtagPost])
    expect(store.exploreLoading).toBe(false)
  })

  it('loads matching profiles and suggestions for the network tab', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: {
        results: [profile],
        suggestions: [{ ...profile, id: 8 }],
      },
    })
    const store = useFeatherStore()

    expect(await store.loadNetwork('@nova')).toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('feather:network', {
      search: '@nova',
    })
    expect(store.networkResults).toEqual([profile])
    expect(store.networkSuggestions[0]?.id).toBe(8)
  })

  it('loads a profile connection list', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: { items: [profile] },
    })
    const store = useFeatherStore()

    expect(await store.loadConnections(3, 'followers')).toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('feather:connections', {
      mode: 'followers',
      profileId: 3,
    })
    expect(store.connections).toEqual([profile])
  })

  it('loads bookmarked posts for the owner profile', async () => {
    const bookmarkedPost = { ...post, is_bookmarked: true }
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: { items: [bookmarkedPost] },
    })
    const store = useFeatherStore()

    expect(await store.loadBookmarks()).toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('feather:bookmarks')
    expect(store.bookmarkedPosts).toEqual([bookmarkedPost])
    expect(store.bookmarksLoading).toBe(false)
  })

  it('removes an unbookmarked post from the saved profile tab', async () => {
    vi.mocked(nuiCall).mockResolvedValue({ success: true })
    const store = useFeatherStore()
    const bookmarkedPost = { ...post, is_bookmarked: true }
    store.bookmarkedPosts = [bookmarkedPost]

    await store.react(bookmarkedPost, 'bookmark')

    expect(store.bookmarkedPosts).toEqual([])
    expect(nuiCall).toHaveBeenCalledWith('feather:react', {
      active: false,
      id: bookmarkedPost.id,
      kind: 'bookmark',
    })
  })

  it('removes an owned connection and updates the profile count', async () => {
    vi.mocked(nuiCall).mockResolvedValue({ success: true })
    const store = useFeatherStore()
    store.profile = { ...profile, followers: 4, is_owner: true }
    store.connections = [{ ...profile }]

    expect(
      await store.removeConnection(store.connections[0], 'followers'),
    ).toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('feather:remove-connection', {
      mode: 'followers',
      profileId: 7,
    })
    expect(store.connections).toEqual([])
    expect(store.profile.followers).toBe(3)
  })

  it('removes blocked profiles from public surfaces', async () => {
    vi.mocked(nuiCall).mockResolvedValue({ success: true })
    const store = useFeatherStore()
    store.feed = [{ ...post }]
    store.explorePosts = [{ ...post }]
    store.networkResults = [{ ...profile }]
    store.networkSuggestions = [{ ...profile }]

    expect(await store.blockProfile(7)).toBe(true)
    expect(store.feed).toEqual([])
    expect(store.explorePosts).toEqual([])
    expect(store.networkResults).toEqual([])
    expect(store.networkSuggestions).toEqual([])
  })
})
