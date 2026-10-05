import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useHousingStore } from '@/stores/housing'
import type { HousingOverview } from '@/types/housing'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))

const mockNuiCall = vi.mocked(nuiCall)
const overview: HousingOverview = {
  available: true,
  provider: 'esx_property',
  properties: [
    {
      access: 'owner',
      capabilities: {
        cctv: true,
        garageStatus: true,
        keys: true,
        lock: true,
        waypoint: true,
      },
      cctv: { enabled: true },
      entrance: { x: 1, y: 2, z: 3 },
      garage: { enabled: true, storedVehicles: 2 },
      id: 'esx_property:1',
      keys: [],
      locked: true,
      name: 'Alta Street 3',
      providerId: '1',
    },
  ],
}

describe('housing store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNuiCall.mockReset()
  })

  it('loads a provider-backed housing overview', async () => {
    mockNuiCall.mockResolvedValueOnce({ data: overview, success: true })
    const housing = useHousingStore()

    expect(await housing.load()).toBe(true)
    expect(housing.overview).toEqual(overview)
    expect(mockNuiCall).toHaveBeenCalledWith('housing:overview')
  })

  it('represents a missing provider as an available response with offline data', async () => {
    const offline = { available: false, properties: [], provider: null }
    mockNuiCall.mockResolvedValueOnce({ data: offline, success: true })
    const housing = useHousingStore()

    expect(await housing.load()).toBe(true)
    expect(housing.overview).toEqual(offline)
  })

  it('loads only provider-authorized key candidates', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { candidates: [{ id: 42, name: 'Alex Morgan' }] },
      success: true,
    })
    const housing = useHousingStore()

    expect(await housing.loadKeyCandidates('esx_property:1')).toBe(true)
    expect(housing.candidates).toEqual([{ id: 42, name: 'Alex Morgan' }])
  })

  it('refreshes the overview after a successful state mutation', async () => {
    mockNuiCall
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ data: overview, success: true })
    const housing = useHousingStore()

    expect(await housing.command('toggle_lock', 'esx_property:1')).toBe(true)
    expect(mockNuiCall).toHaveBeenNthCalledWith(1, 'housing:command', {
      action: 'toggle_lock',
      propertyId: 'esx_property:1',
    })
    expect(mockNuiCall).toHaveBeenNthCalledWith(2, 'housing:overview')
  })

  it('keeps the overview and exposes a rejected action', async () => {
    mockNuiCall.mockResolvedValueOnce({
      error: 'property_access_denied',
      success: false,
    })
    const housing = useHousingStore()
    housing.overview = overview

    expect(await housing.command('toggle_lock', 'esx_property:1')).toBe(false)
    expect(housing.overview).toEqual(overview)
    expect(housing.error).toBe('property_access_denied')
  })

  it('blocks every housing request while a reload cooldown is active', async () => {
    const housing = useHousingStore()
    housing.cooldownUntil = Date.now() + 10_000

    expect(await housing.load()).toBe(false)
    expect(await housing.loadKeyCandidates('esx_property:1')).toBe(false)
    expect(await housing.command('toggle_lock', 'esx_property:1')).toBe(false)
    expect(housing.error).toBe('reload_cooldown')
    expect(mockNuiCall).not.toHaveBeenCalled()
  })
})
