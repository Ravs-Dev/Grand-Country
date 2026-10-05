import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useHealthStore } from '@/stores/health'
import type { HealthOverview } from '@/types/health'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))

const overview: HealthOverview = {
  dailyStepGoal: 8000,
  days: [],
  emergencyNumber: '911',
  medicalId: {
    allergies: '',
    bloodType: '',
    conditions: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    medication: '',
    playerName: 'Alex Morgan',
  },
  previousWeekSteps: 0,
}

describe('health store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(nuiCall).mockReset()
  })

  it('loads the server-authoritative health overview', async () => {
    vi.mocked(nuiCall).mockResolvedValue({ data: overview, success: true })
    const health = useHealthStore()

    await expect(health.load()).resolves.toBe(true)
    expect(nuiCall).toHaveBeenCalledWith('health:overview')
    expect(health.overview?.dailyStepGoal).toBe(8000)
  })

  it('persists medical ID edits through NUI', async () => {
    const health = useHealthStore()
    health.overview = structuredClone(overview)
    vi.mocked(nuiCall).mockResolvedValue({
      data: { ...overview.medicalId, bloodType: 'O+' },
      success: true,
    })

    await expect(
      health.saveMedicalId({
        allergies: overview.medicalId.allergies,
        bloodType: 'O+',
        conditions: overview.medicalId.conditions,
        emergencyName: overview.medicalId.emergencyName,
        emergencyPhone: overview.medicalId.emergencyPhone,
        emergencyRelation: overview.medicalId.emergencyRelation,
        medication: overview.medicalId.medication,
      }),
    ).resolves.toBe(true)
    expect(health.overview.medicalId.bloodType).toBe('O+')
  })
})
