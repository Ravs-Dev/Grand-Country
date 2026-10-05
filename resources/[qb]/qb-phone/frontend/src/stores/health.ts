import { defineStore } from 'pinia'

import type {
  HealthMedicalId,
  HealthMedicalIdInput,
  HealthOverview,
} from '@/types/health'
import { nuiCall } from '@/utils/nui'

export const useHealthStore = defineStore('health', {
  state: () => ({
    error: '',
    isLoading: false,
    isSaving: false,
    overview: null as HealthOverview | null,
    requestGeneration: 0,
  }),
  actions: {
    async load(): Promise<boolean> {
      const generation = ++this.requestGeneration
      this.isLoading = true
      const response = await nuiCall<HealthOverview>('health:overview').finally(
        () => {
          if (generation === this.requestGeneration) this.isLoading = false
        },
      )
      if (generation !== this.requestGeneration) return response.success
      if (response.success && response.data) {
        this.overview = response.data
        this.error = ''
        return true
      }
      this.error = response.error ?? 'request_failed'
      return false
    },
    async saveMedicalId(data: HealthMedicalIdInput): Promise<boolean> {
      if (this.isSaving) return false
      this.isSaving = true
      const response = await nuiCall<HealthMedicalId>(
        'health:save-profile',
        data,
      ).finally(() => {
        this.isSaving = false
      })
      if (response.success && response.data && this.overview) {
        this.overview.medicalId = response.data
        this.error = ''
        return true
      }
      this.error = response.error ?? 'request_failed'
      return false
    },
  },
})
