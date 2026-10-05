import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSkyRideStore } from '@/stores/skyride'
import type {
  SkyRideBootstrap,
  SkyRideLocation,
  SkyRideQuote,
  SkyRideRide,
} from '@/types/skyride'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({ nuiCall: vi.fn() }))

const mockNuiCall = vi.mocked(nuiCall)
const pickup: SkyRideLocation = {
  coords: { x: -1037.7, y: -2737.8, z: 20.1 },
  label: 'Los Santos International',
}
const destination: SkyRideLocation = {
  coords: { x: 215.8, y: -810.1, z: 30.7 },
  label: 'Pillbox Hill',
}
const ride: SkyRideRide = {
  createdAt: 1_755_000_000,
  currency: '$',
  destination,
  distanceMeters: 5_200,
  driver: null,
  durationSeconds: 640,
  id: 'ride-1',
  pickup,
  price: 48,
  serviceClass: 'comfort',
  status: 'searching',
  updatedAt: 1_755_000_000,
}
const bootstrap: SkyRideBootstrap = {
  activeRide: null,
  availableRequests: [ride],
  driverEligible: true,
  driverOnline: false,
  history: [],
  pendingRating: null,
  profile: {
    acceptanceRate: 94,
    avatarMediaId: null,
    avatarUrl: null,
    cancelledRides: 2,
    completedRides: 128,
    currency: '$',
    defaultPaymentMethod: 'Bank',
    earningsToday: 320,
    id: 'profile-1',
    memberSince: 1_700_000_000,
    name: 'Alex Morgan',
    rating: 4.9,
  },
  quickLocations: [destination],
}
const quote: SkyRideQuote = {
  destination,
  distance: 5.2,
  distanceMeters: 5200,
  distanceUnit: 'kilometer',
  durationSeconds: 640,
  expiresAt: 1_755_000_120,
  options: [
    {
      available: true,
      calculatedPrice: 48,
      currency: '$',
      etaMinutes: 4,
      fareMode: 'calculated',
      maximumCustomPrice: 144,
      minimumCustomPrice: 24,
      price: 48,
      pricePerDistanceUnit: 24,
      quoteId: 'quote-comfort',
      seats: 4,
      serviceClass: 'comfort',
    },
  ],
  pickup,
}

describe('SkyRide store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNuiCall.mockReset()
  })

  it('hydrates the complete server-authoritative snapshot', async () => {
    mockNuiCall.mockResolvedValueOnce({ data: bootstrap, success: true })
    const skyride = useSkyRideStore()
    skyride.quote = quote

    expect(await skyride.bootstrap()).toBe(true)
    expect(skyride.profile).toEqual(bootstrap.profile)
    expect(skyride.driverEligible).toBe(true)
    expect(skyride.availableRequests).toEqual([ride])
    expect(skyride.quote).toBeNull()
    expect(mockNuiCall).toHaveBeenCalledWith('skyride:bootstrap')
  })

  it('requests a quote with pickup and destination coordinates', async () => {
    mockNuiCall.mockResolvedValueOnce({ data: quote, success: true })
    const skyride = useSkyRideStore()

    expect((await skyride.createQuote(pickup, destination)).success).toBe(true)
    expect(skyride.quote).toEqual(quote)
    expect(mockNuiCall).toHaveBeenCalledWith('skyride:quote', {
      destination,
      pickup,
    })
  })

  it('updates the editable profile with an owned media id', async () => {
    const updatedProfile = {
      ...bootstrap.profile,
      avatarMediaId: 17,
      avatarUrl: 'https://example.test/avatar.webp',
      name: 'Jordan Sky',
    }
    mockNuiCall.mockResolvedValueOnce({
      data: { profile: updatedProfile },
      success: true,
    })
    const skyride = useSkyRideStore()
    skyride.profile = bootstrap.profile

    const response = await skyride.updateProfile({
      avatarMediaId: 17,
      name: 'Jordan Sky',
    })

    expect(response.success).toBe(true)
    expect(skyride.profile).toEqual(updatedProfile)
    expect(mockNuiCall).toHaveBeenCalledWith('skyride:update-profile', {
      avatarMediaId: 17,
      name: 'Jordan Sky',
    })
  })

  it('books with the opaque quote id and never sends a client price', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { activeRide: ride },
      success: true,
    })
    const skyride = useSkyRideStore()
    skyride.quote = quote

    const response = await skyride.requestRide(quote.options[0])

    expect(response.success).toBe(true)
    expect(skyride.activeRide).toEqual(ride)
    expect(skyride.quote).toBeNull()
    expect(mockNuiCall).toHaveBeenCalledWith('skyride:request', {
      quoteId: 'quote-comfort',
    })
  })

  it('asks the server to bind a validated own price to a new quote', async () => {
    const customQuote = {
      ...quote,
      options: [
        {
          ...quote.options[0],
          fareMode: 'custom' as const,
          price: 60,
          quoteId: 'quote-comfort-custom',
        },
      ],
    }
    mockNuiCall.mockResolvedValueOnce({ data: customQuote, success: true })
    const skyride = useSkyRideStore()

    await skyride.createQuote(pickup, destination, {
      price: 60,
      serviceClass: 'comfort',
    })

    expect(mockNuiCall).toHaveBeenCalledWith('skyride:quote', {
      customFare: { price: 60, serviceClass: 'comfort' },
      destination,
      pickup,
    })
  })

  it('preserves the active ride when a lifecycle action is rejected', async () => {
    mockNuiCall.mockResolvedValueOnce({
      error: 'ride_state_changed',
      success: false,
    })
    const skyride = useSkyRideStore()
    skyride.activeRide = ride

    await skyride.performRideAction('start', ride.id)

    expect(skyride.activeRide).toEqual(ride)
    expect(skyride.error).toBe('ride_state_changed')
  })

  it('applies live snapshots including an explicit cleared ride', () => {
    const skyride = useSkyRideStore()
    skyride.activeRide = ride
    skyride.driverOnline = false

    skyride.applyUpdate({ activeRide: null, driverOnline: true })

    expect(skyride.activeRide).toBeNull()
    expect(skyride.driverOnline).toBe(true)
  })

  it('submits rating details and clears the pending rating on success', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { history: [{ ...ride, status: 'completed' }] },
      success: true,
    })
    const skyride = useSkyRideStore()
    skyride.pendingRating = { ...ride, status: 'completed' }

    await skyride.rateRide(ride.id, 5, 10, 'Excellent')

    expect(skyride.pendingRating).toBeNull()
    expect(mockNuiCall).toHaveBeenCalledWith('skyride:rate', {
      comment: 'Excellent',
      rating: 5,
      rideId: ride.id,
      tip: 10,
    })
  })
})
