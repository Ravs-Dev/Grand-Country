import { defineStore } from 'pinia'

import type {
  FeatherActivity,
  FeatherBootstrap,
  FeatherPost,
  FeatherProfile,
  FeatherProfilePage,
  FeatherThread,
  FeatherTopic,
} from '@/types/feather'
import { nuiCall, type NuiResponse } from '@/utils/nui'

type FeedMode = 'for-you' | 'following'
export type FeatherConnectionMode = 'followers' | 'following'

export const useFeatherStore = defineStore('feather', {
  state: () => ({
    activities: [] as FeatherActivity[],
    bookmarkedPosts: [] as FeatherPost[],
    bookmarksLoading: false,
    connectionLoading: false,
    connections: [] as FeatherProfile[],
    exploreLoading: false,
    explorePosts: [] as FeatherPost[],
    exploreRequest: 0,
    feed: [] as FeatherPost[],
    loading: false,
    mode: 'for-you' as FeedMode,
    networkLoading: false,
    networkRequest: 0,
    networkResults: [] as FeatherProfile[],
    networkSuggestions: [] as FeatherProfile[],
    onboarded: false,
    profile: null as FeatherProfile | null,
    profilePosts: [] as FeatherPost[],
    suggestions: [] as FeatherProfile[],
    thread: null as FeatherThread | null,
    topics: [] as FeatherTopic[],
    viewedProfile: null as FeatherProfile | null,
  }),
  actions: {
    async bootstrap(): Promise<boolean> {
      this.loading = true
      const response = await nuiCall<FeatherBootstrap>('feather:bootstrap')
      this.loading = false
      if (!response.success || !response.data) return false
      this.onboarded = response.data.onboarded
      this.profile = response.data.profile ?? null
      this.feed = response.data.feed?.items ?? []
      this.suggestions = response.data.suggestions ?? []
      this.topics = response.data.topics ?? []
      return true
    },
    async createProfile(data: {
      avatarId?: number
      bio: string
      displayName: string
      handle: string
    }): Promise<NuiResponse> {
      const response = await nuiCall('feather:create-profile', data)
      if (response.success) await this.bootstrap()
      return response
    },
    async updateProfile(data: {
      avatarId?: number
      bio: string
      displayName: string
    }): Promise<NuiResponse> {
      const response = await nuiCall('feather:update-profile', data)
      if (response.success) await this.bootstrap()
      return response
    },
    async loadFeed(mode?: FeedMode): Promise<boolean> {
      mode ??= this.mode
      this.mode = mode
      this.loading = true
      const response = await nuiCall<{ items: FeatherPost[] }>('feather:feed', {
        mode,
        offset: 0,
      })
      this.loading = false
      if (!response.success || !response.data) return false
      this.feed = response.data.items
      return true
    },
    async explore(search = ''): Promise<boolean> {
      const request = ++this.exploreRequest
      this.exploreLoading = true
      const response = await nuiCall<{
        posts: FeatherPost[]
        profiles: FeatherProfile[]
        topics?: FeatherTopic[]
      }>('feather:explore', { search })
      if (request !== this.exploreRequest) return false
      this.exploreLoading = false
      if (!response.success || !response.data) return false
      this.explorePosts = response.data.posts
      this.suggestions = response.data.profiles
      if (response.data.topics) this.topics = response.data.topics
      return true
    },
    async loadNetwork(search = ''): Promise<boolean> {
      const request = ++this.networkRequest
      this.networkLoading = true
      const response = await nuiCall<{
        results: FeatherProfile[]
        suggestions: FeatherProfile[]
      }>('feather:network', { search })
      if (request !== this.networkRequest) return false
      this.networkLoading = false
      if (!response.success || !response.data) return false
      this.networkResults = response.data.results
      this.networkSuggestions = response.data.suggestions
      return true
    },
    async createPost(data: {
      body: string
      mediaIds: number[]
      quoteId?: string
      replyToId?: string
    }): Promise<NuiResponse<{ id: string }>> {
      const response = await nuiCall<{ id: string }>(
        'feather:create-post',
        data,
      )
      if (response.success) await this.loadFeed()
      return response
    },
    async react(post: FeatherPost, kind: 'like' | 'bookmark'): Promise<void> {
      const key = kind === 'like' ? 'is_liked' : 'is_bookmarked'
      const next = !post[key]
      post[key] = next
      if (kind === 'like') post.like_count += next ? 1 : -1
      const response = await nuiCall('feather:react', {
        active: next,
        id: post.id,
        kind,
      })
      if (response.success) {
        if (kind === 'bookmark') {
          this.bookmarkedPosts = next
            ? [post, ...this.bookmarkedPosts.filter((item) => item.id !== post.id)]
            : this.bookmarkedPosts.filter((item) => item.id !== post.id)
        }
        return
      }
      post[key] = !next
      if (kind === 'like') post.like_count += next ? -1 : 1
    },
    async follow(profile: FeatherProfile): Promise<void> {
      const next = !profile.is_following
      const response = await nuiCall('feather:follow', {
        active: next,
        profileId: profile.id,
      })
      if (!response.success) return
      const profiles = new Set([
        profile,
        ...this.suggestions,
        ...this.networkResults,
        ...this.networkSuggestions,
        ...(this.profile ? [this.profile] : []),
        ...(this.viewedProfile ? [this.viewedProfile] : []),
      ])
      for (const item of profiles) {
        if (item.id !== profile.id) continue
        item.is_following = next
        item.followers = Math.max(0, item.followers + (next ? 1 : -1))
      }
      for (const post of [
        ...this.feed,
        ...this.explorePosts,
        ...this.profilePosts,
        ...this.bookmarkedPosts,
      ]) {
        if (post.profile_id === profile.id) post.is_following = next
      }
    },
    async followPost(post: FeatherPost): Promise<void> {
      const next = !post.is_following
      const response = await nuiCall('feather:follow', {
        active: next,
        profileId: post.profile_id,
      })
      if (!response.success) return
      for (const item of [
        ...this.feed,
        ...this.explorePosts,
        ...this.profilePosts,
        ...this.bookmarkedPosts,
      ]) {
        if (item.profile_id === post.profile_id) item.is_following = next
      }
    },
    async loadConnections(
      profileId: number,
      mode: FeatherConnectionMode,
    ): Promise<boolean> {
      this.connectionLoading = true
      const response = await nuiCall<{ items: FeatherProfile[] }>(
        'feather:connections',
        { mode, profileId },
      )
      this.connectionLoading = false
      if (!response.success || !response.data) return false
      this.connections = response.data.items
      return true
    },
    async removeConnection(
      target: FeatherProfile,
      mode: FeatherConnectionMode,
    ): Promise<boolean> {
      const response = await nuiCall('feather:remove-connection', {
        mode,
        profileId: target.id,
      })
      if (!response.success) return false
      this.connections = this.connections.filter(
        (item) => item.id !== target.id,
      )
      if (this.profile) {
        const count = mode === 'followers' ? 'followers' : 'following'
        this.profile[count] = Math.max(0, this.profile[count] - 1)
      }
      if (this.viewedProfile?.is_owner) {
        const count = mode === 'followers' ? 'followers' : 'following'
        this.viewedProfile[count] = Math.max(0, this.viewedProfile[count] - 1)
      }
      if (mode === 'following') {
        target.is_following = false
        for (const post of [
          ...this.feed,
          ...this.explorePosts,
          ...this.profilePosts,
          ...this.bookmarkedPosts,
        ]) {
          if (post.profile_id === target.id) post.is_following = false
        }
      }
      return true
    },
    async loadProfile(profileId?: number): Promise<boolean> {
      const response = await nuiCall<FeatherProfilePage>('feather:profile', {
        profileId,
      })
      if (!response.success || !response.data) return false
      this.viewedProfile = response.data.profile
      this.profilePosts = response.data.posts
      return true
    },
    async loadBookmarks(): Promise<boolean> {
      this.bookmarksLoading = true
      const response = await nuiCall<{ items: FeatherPost[] }>(
        'feather:bookmarks',
      )
      this.bookmarksLoading = false
      if (!response.success || !response.data) return false
      this.bookmarkedPosts = response.data.items
      return true
    },
    async loadThread(id: string): Promise<boolean> {
      const response = await nuiCall<FeatherThread>('feather:thread', { id })
      if (!response.success || !response.data) return false
      this.thread = response.data
      return true
    },
    async loadActivities(): Promise<void> {
      const response = await nuiCall<FeatherActivity[]>('feather:activities')
      this.activities = response.success && response.data ? response.data : []
    },
    async markActivities(): Promise<void> {
      const response = await nuiCall('feather:mark-activities')
      if (response.success)
        this.activities.forEach((item) => (item.read = true))
    },
    async deletePost(id: string): Promise<boolean> {
      const response = await nuiCall('feather:delete', { id })
      if (!response.success) return false
      this.feed = this.feed.filter((post) => post.id !== id)
      this.explorePosts = this.explorePosts.filter((post) => post.id !== id)
      this.profilePosts = this.profilePosts.filter((post) => post.id !== id)
      this.bookmarkedPosts = this.bookmarkedPosts.filter(
        (post) => post.id !== id,
      )
      return true
    },
    async blockProfile(profileId: number): Promise<boolean> {
      const response = await nuiCall('feather:block', { profileId })
      if (!response.success) return false
      this.feed = this.feed.filter((post) => post.profile_id !== profileId)
      this.explorePosts = this.explorePosts.filter(
        (post) => post.profile_id !== profileId,
      )
      this.bookmarkedPosts = this.bookmarkedPosts.filter(
        (post) => post.profile_id !== profileId,
      )
      this.networkResults = this.networkResults.filter(
        (profile) => profile.id !== profileId,
      )
      this.networkSuggestions = this.networkSuggestions.filter(
        (profile) => profile.id !== profileId,
      )
      return true
    },
    async reportPost(
      id: string,
      reason: string,
      details = '',
    ): Promise<boolean> {
      return (await nuiCall('feather:report', { details, id, reason })).success
    },
  },
})
