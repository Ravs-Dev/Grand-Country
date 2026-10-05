import { defineStore } from 'pinia'

import type {
  SkyRideBootstrap,
  SkyRideCoordinates,
  SkyRideCustomFareInput,
  SkyRideHistoryResponse,
  SkyRideLocation,
  SkyRideQuote,
  SkyRideQuoteOption,
  SkyRideRide,
  SkyRideProfileInput,
  SkyRideStateUpdate,
} from '@/types/skyride'
import { nuiCall, type NuiResponse } from '@/utils/nui'

type RideAction = 'accept' | 'arrive' | 'start' | 'complete'

export const useSkyRideStore = defineStore('skyride', {
  state: () => ({
    activeRide: null as SkyRideRide | null,
    availableRequests: [] as SkyRideRide[],
    driverEligible: false,
    driverOnline: false,
    error: '',
    history: [] as SkyRideRide[],
    isActionPending: false,
    isLoading: false,
    pendingRating: null as SkyRideRide | null,
    profile: null as SkyRideBootstrap['profile'] | null,
    quickLocations: [] as SkyRideLocation[],
    quote: null as SkyRideQuote | null,
  }),
  actions: {
    applyUpdate(update: SkyRideStateUpdate): void {
      if (update.activeRide !== undefined) this.activeRide = update.activeRide
      if (update.availableRequests !== undefined)
        this.availableRequests = update.availableRequests
      if (update.driverOnline !== undefined)
        this.driverOnline = update.driverOnline
      if (update.history !== undefined) this.history = update.history
      if (update.pendingRating !== undefined)
        this.pendingRating = update.pendingRating
      if (update.profile !== undefined) this.profile = update.profile
    },
    async bootstrap(): Promise<boolean> {
      this.isLoading = true
      const response = await nuiCall<SkyRideBootstrap>('skyride:bootstrap')
      this.isLoading = false
      if (!response.success || !response.data) {
        this.error = response.error ?? 'request_failed'
        return false
      }

      this.activeRide = response.data.activeRide
      this.availableRequests = response.data.availableRequests
      this.driverEligible = response.data.driverEligible
      this.driverOnline = response.data.driverOnline
      this.history = response.data.history
      this.pendingRating = response.data.pendingRating
      this.profile = response.data.profile
      this.quickLocations = response.data.quickLocations
      this.quote = null
      this.error = ''
      return true
    },
    async loadHistory(): Promise<boolean> {
      const response = await nuiCall<SkyRideHistoryResponse>('skyride:history')
      if (!response.success || !response.data) {
        this.error = response.error ?? 'request_failed'
        return false
      }
      this.history = response.data.items
      this.error = ''
      return true
    },
    async updateProfile(
      profile: SkyRideProfileInput,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>(
        'skyride:update-profile',
        profile,
      )
      this.isActionPending = false
      if (response.success) {
        if (response.data) this.applyUpdate(response.data)
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async createQuote(
      pickup: SkyRideLocation,
      destination: SkyRideLocation,
      customFare?: SkyRideCustomFareInput,
    ): Promise<NuiResponse<SkyRideQuote>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideQuote>('skyride:quote', {
        ...(customFare ? { customFare } : {}),
        destination,
        pickup,
      })
      this.isActionPending = false
      if (response.success && response.data) {
        this.quote = response.data
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async requestRide(
      option: Pick<SkyRideQuoteOption, 'quoteId'>,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>('skyride:request', {
        quoteId: option.quoteId,
      })
      this.isActionPending = false
      if (response.success) {
        if (response.data) this.applyUpdate(response.data)
        this.quote = null
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async setDriverStatus(
      online: boolean,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>(
        'skyride:set-driver-status',
        { online },
      )
      this.isActionPending = false
      if (response.success) {
        this.driverOnline = response.data?.driverOnline ?? online
        if (response.data) this.applyUpdate(response.data)
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async performRideAction(
      action: RideAction,
      rideId: string,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>(`skyride:${action}`, {
        rideId,
      })
      this.isActionPending = false
      if (response.success) {
        if (response.data) this.applyUpdate(response.data)
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async cancelRide(
      rideId: string,
      reason?: string,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>('skyride:cancel', {
        rideId,
        ...(reason ? { reason } : {}),
      })
      this.isActionPending = false
      if (response.success) {
        if (response.data) this.applyUpdate(response.data)
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async rateRide(
      rideId: string,
      rating: number,
      tip: number,
      comment: string,
    ): Promise<NuiResponse<SkyRideStateUpdate>> {
      this.isActionPending = true
      const response = await nuiCall<SkyRideStateUpdate>('skyride:rate', {
        comment,
        rating,
        rideId,
        tip,
      })
      this.isActionPending = false
      if (response.success) {
        if (response.data) this.applyUpdate(response.data)
        this.pendingRating = null
        this.error = ''
      } else {
        this.error = response.error ?? 'request_failed'
      }
      return response
    },
    async getPlayerCoordinates(): Promise<
      NuiResponse<{ coords: SkyRideCoordinates }>
    > {
      return nuiCall<{ coords: SkyRideCoordinates }>(
        'skyride:get-player-coords',
      )
    },
    async setWaypoint(coords: SkyRideCoordinates): Promise<NuiResponse> {
      return nuiCall('map:setWaypoint', { coords })
    },
    clearQuote(): void {
      this.quote = null
      this.error = ''
    },
  },
})
