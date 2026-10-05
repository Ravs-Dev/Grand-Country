import { defineStore } from 'pinia'

import type {
  HousingCommand,
  HousingKeyCandidate,
  HousingOverview,
} from '@/types/housing'
import { nuiCall } from '@/utils/nui'
import {
  allowManualReload,
  isReloadCooldownActive,
  RELOAD_COOLDOWN_ERROR,
} from '@/utils/reload-cooldown'

export const useHousingStore = defineStore('housing', {
  state: () => ({
    candidates: [] as HousingKeyCandidate[],
    cooldownUntil: 0,
    error: '',
    isLoading: false,
    isLoadingCandidates: false,
    overview: null as HousingOverview | null,
    pendingAction: '',
    reloadAttempts: [] as number[],
  }),
  actions: {
    async load(manualReload = false): Promise<boolean> {
      if (
        isReloadCooldownActive(this) ||
        (manualReload && !allowManualReload(this))
      ) {
        this.error = RELOAD_COOLDOWN_ERROR
        return false
      }
      this.isLoading = true
      const response = await nuiCall<HousingOverview>('housing:overview')
      this.isLoading = false
      if (response.success && response.data) {
        this.overview = response.data
        this.error = ''
        return true
      }
      this.error = response.error ?? 'request_failed'
      return false
    },
    async loadKeyCandidates(propertyId: string): Promise<boolean> {
      if (isReloadCooldownActive(this)) {
        this.error = RELOAD_COOLDOWN_ERROR
        return false
      }
      this.isLoadingCandidates = true
      this.candidates = []
      const response = await nuiCall<{ candidates: HousingKeyCandidate[] }>(
        'housing:key-candidates',
        { propertyId },
      )
      this.isLoadingCandidates = false
      if (response.success && response.data) {
        this.candidates = response.data.candidates
        this.error = ''
        return true
      }
      this.error = response.error ?? 'request_failed'
      return false
    },
    async command(
      action: HousingCommand,
      propertyId: string,
      payload: Record<string, unknown> = {},
    ): Promise<boolean> {
      if (isReloadCooldownActive(this)) {
        this.error = RELOAD_COOLDOWN_ERROR
        return false
      }
      this.pendingAction = `${action}:${propertyId}`
      const response = await nuiCall('housing:command', {
        action,
        propertyId,
        ...payload,
      })
      this.pendingAction = ''
      if (!response.success) {
        this.error = response.error ?? 'request_failed'
        return false
      }
      this.error = ''
      if (
        action === 'toggle_lock' ||
        action === 'grant_key' ||
        action === 'revoke_key'
      ) {
        await this.load()
      }
      return true
    },
  },
})
