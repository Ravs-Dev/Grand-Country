import { defineStore } from 'pinia'

import type {
  PagesPage,
  PagesPost,
  PagesPostDraft,
  PagesProfile,
  PagesProfileDraft,
} from '@/types/pages'
import { nuiCall, type NuiResponse } from '@/utils/nui'

export const usePagesStore = defineStore('pages', {
  state: () => ({
    items: [] as PagesPost[],
    ownItems: [] as PagesPost[],
    savedItems: [] as PagesPost[],
    profile: null as PagesProfile | null,
    isLoading: false,
  }),
  actions: {
    async load(filters: Record<string, unknown> = {}): Promise<boolean> {
      this.isLoading = true
      const response = await nuiCall<PagesPage>('pages:list', filters)
      this.isLoading = false
      if (response.success && response.data) this.items = response.data.items
      return response.success
    },
    async loadProfile(): Promise<boolean> {
      const [profile, own, saved] = await Promise.all([
        nuiCall<PagesProfile>('pages:profile'),
        nuiCall<PagesPage>('pages:list-own'),
        nuiCall<PagesPage>('pages:list', { saved: true }),
      ])
      if (profile.success && profile.data) this.profile = profile.data
      if (own.success && own.data) this.ownItems = own.data.items
      if (saved.success && saved.data) this.savedItems = saved.data.items
      return profile.success && Boolean(profile.data ?? this.profile)
    },
    async saveProfile(draft: PagesProfileDraft): Promise<NuiResponse<PagesProfile>> {
      const response = await nuiCall<PagesProfile>('pages:profile-save', draft)
      if (response.success && response.data) {
        this.profile = response.data
        for (const item of [...this.items, ...this.ownItems, ...this.savedItems]) {
          if (item.is_owner) {
            item.author_avatar = response.data.avatar_url
            item.author_name = response.data.handle
          }
        }
      }
      return response
    },
    get(id: string): Promise<NuiResponse<PagesPost>> {
      return nuiCall<PagesPost>('pages:get', { id })
    },
    async create(draft: PagesPostDraft): Promise<NuiResponse<{ id: string }>> {
      const response = await nuiCall<{ id: string }>('pages:create', draft)
      if (response.success) await Promise.all([this.load(), this.loadProfile()])
      return response
    },
    async shareCityMarkt(listingId: string): Promise<NuiResponse<{ id: string }>> {
      return nuiCall<{ id: string }>('pages:share-citymarkt', { listingId })
    },
    async react(id: string, kind: 'like' | 'save', active: boolean): Promise<boolean> {
      const response = await nuiCall('pages:react', { active, id, kind })
      if (response.success) {
        const knownItems = [...this.items, ...this.ownItems, ...this.savedItems]
        for (const item of knownItems) {
          if (item.id !== id) continue
          if (kind === 'like') {
            item.like_count = Math.max(0, item.like_count + (active ? 1 : -1))
            item.is_liked = active
          } else item.is_saved = active
        }
        if (kind === 'save' && !active) {
          this.savedItems = this.savedItems.filter((item) => item.id !== id)
        }
        if (kind === 'save' && active && !this.savedItems.some((item) => item.id === id)) {
          let savedItem = knownItems.find((item) => item.id === id)
          if (!savedItem) {
            const loaded = await this.get(id)
            savedItem = loaded.success ? loaded.data : undefined
          }
          if (savedItem) {
            savedItem.is_saved = true
            this.savedItems.unshift(savedItem)
          }
        }
      }
      return response.success
    },
    async remove(id: string): Promise<boolean> {
      const response = await nuiCall('pages:delete', { id })
      if (response.success) {
        this.items = this.items.filter((item) => item.id !== id)
        this.ownItems = this.ownItems.filter((item) => item.id !== id)
      }
      return response.success
    },
  },
})
