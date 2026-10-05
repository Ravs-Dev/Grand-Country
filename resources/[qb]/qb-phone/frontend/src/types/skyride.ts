export type SkyRideMode = 'rider' | 'driver'

export type SkyRideServiceClass = 'taxi' | 'comfort' | 'xl' | 'premium'

export type SkyRideDistanceUnit = 'kilometer' | 'mile'

export type SkyRideFareMode = 'calculated' | 'custom'

export type SkyRideRideStatus =
  | 'searching'
  | 'accepted'
  | 'driver_arriving'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type SkyRideCoordinates = {
  x: number
  y: number
  z: number
}

export type SkyRideLocation = {
  coords: SkyRideCoordinates
  id?: string
  label: string
}

export type SkyRidePerson = {
  avatarUrl: string | null
  id: string
  name: string
  phoneNumber?: string
  rating: number
  trips: number
}

export type SkyRideVehicle = {
  color: string
  model: string
  plate: string
}

export type SkyRideDriver = SkyRidePerson & {
  location?: SkyRideCoordinates
  vehicle: SkyRideVehicle
}

export type SkyRidePassenger = Pick<
  SkyRidePerson,
  'avatarUrl' | 'id' | 'name' | 'phoneNumber' | 'rating' | 'trips'
>

export type SkyRideQuoteOption = {
  available: boolean
  calculatedPrice: number
  currency: string
  etaMinutes: number
  fareMode: SkyRideFareMode
  maximumCustomPrice: number
  minimumCustomPrice: number
  price: number
  pricePerDistanceUnit: number
  quoteId: string
  seats: number
  serviceClass: SkyRideServiceClass
}

export type SkyRideCustomFareInput = {
  price: number
  serviceClass: SkyRideServiceClass
}

export type SkyRideQuote = {
  destination: SkyRideLocation
  distance: number
  distanceMeters: number
  distanceUnit: SkyRideDistanceUnit
  durationSeconds: number
  expiresAt: number
  options: SkyRideQuoteOption[]
  pickup: SkyRideLocation
}

export type SkyRideRide = {
  createdAt: number
  currency: string
  destination: SkyRideLocation
  distanceMeters: number
  driver: SkyRideDriver | null
  durationSeconds: number
  finalPrice?: number
  id: string
  passenger?: SkyRidePassenger
  pickup: SkyRideLocation
  price: number
  serviceClass: SkyRideServiceClass
  status: SkyRideRideStatus
  updatedAt: number
}

export type SkyRideProfile = {
  acceptanceRate: number | null
  avatarMediaId: number | null
  avatarUrl: string | null
  cancelledRides: number
  completedRides: number
  currency: string
  defaultPaymentMethod: string
  earningsToday: number | null
  id: string
  memberSince: number
  name: string
  rating: number
}

export type SkyRideProfileInput = {
  avatarMediaId: number
  name: string
}

export type SkyRideBootstrap = {
  activeRide: SkyRideRide | null
  availableRequests: SkyRideRide[]
  driverEligible: boolean
  driverOnline: boolean
  history: SkyRideRide[]
  pendingRating: SkyRideRide | null
  profile: SkyRideProfile
  quickLocations: SkyRideLocation[]
}

export type SkyRideStateUpdate = Partial<
  Pick<
    SkyRideBootstrap,
    | 'activeRide'
    | 'availableRequests'
    | 'driverOnline'
    | 'history'
    | 'pendingRating'
    | 'profile'
  >
>

export type SkyRideHistoryResponse = {
  items: SkyRideRide[]
}

export type SkyRideChangedMessage = {
  data: SkyRideStateUpdate
  type: 'skyride:changed'
}
