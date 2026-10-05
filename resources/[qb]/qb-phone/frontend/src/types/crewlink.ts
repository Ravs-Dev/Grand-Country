import type { MapPoint } from '@/features/map/defaultMapGeometry'

export type CrewLinkRole =
  | 'owner'
  | 'coordinator'
  | 'moderator'
  | 'member'
  | 'guest'

export type CrewLinkColour =
  | 'cyan'
  | 'blue'
  | 'violet'
  | 'orange'
  | 'green'
  | 'rose'

export type CrewLinkPingType = 'meeting' | 'danger' | 'help' | 'target' | 'info'

export type CrewLinkProfile = {
  activeGroupId: string | null
  avatarMediaId: number | null
  avatarUrl: string | null
  id: string
  mapVisible: boolean
  overheadVisible: boolean
  username: string
}

export type CrewLinkMember = {
  avatarUrl?: string | null
  coords?: MapPoint & { z: number }
  id: string
  joinedAt: number
  mapVisible: boolean
  online: boolean
  overheadVisible: boolean
  role: CrewLinkRole
  source?: number
  username: string
}

export type CrewLinkPing = {
  coords: MapPoint & { z: number }
  createdAt: number
  creatorProfileId: string | null
  creatorUsername: string
  expiresAt: number
  id: string
  label: string
  sourceResource?: string | null
  type: CrewLinkPingType
}

export type CrewLinkGroupSummary = {
  allowMemberPings: boolean
  colour: CrewLinkColour
  id: string
  inviteCode?: string
  isOwner: boolean
  memberCount: number
  name: string
  overheadAllowed: boolean
  role: CrewLinkRole
}

export type CrewLinkGroup = CrewLinkGroupSummary & {
  members: CrewLinkMember[]
  pings: CrewLinkPing[]
}

export type CrewLinkInvitation = {
  colour: CrewLinkColour
  expiresAt: number
  groupId: string
  groupName: string
  id: string
  inviterUsername: string
}

export type CrewLinkLimits = {
  maximumGroups: number
  maximumMembers: number
  nearbyDistance: number
  overheadDistance: number
  pingLifetimeSeconds: number
}

export type CrewLinkBootstrap = {
  activeGroup?: CrewLinkGroup | null
  authenticated?: boolean
  groups: CrewLinkGroupSummary[]
  invitations: CrewLinkInvitation[]
  limits?: CrewLinkLimits
  profile: CrewLinkProfile | null
}

export type CrewLinkNearbyPlayer = {
  distance: number
  source: number
  username: string
}

export type CrewLinkLive = {
  members: CrewLinkMember[]
  pings: CrewLinkPing[]
}
