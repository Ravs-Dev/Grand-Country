import type { LaunchablePhoneAppId } from '@/types/apps'

export type EasyShareKind =
  | 'contact'
  | 'document'
  | 'link'
  | 'location'
  | 'media'
  | 'note'
  | 'photo'
  | 'playlist'
  | 'post'
  | 'profile'
  | 'text'
  | 'track'
  | 'video'

export type EasyShareVisibility = 'contacts' | 'everyone' | 'hidden'
export type EasyShareChatApp = 'darkchat' | 'flare' | 'messages'
export type EasyShareDestinationApp = EasyShareChatApp | 'notes'
export type EasyShareChatDraft = {
  appId: EasyShareChatApp
  body: string
  payload: EasySharePayload
  targetId: string | null
}
export type EasyShareStatus =
  | 'accepted'
  | 'cancelled'
  | 'completed'
  | 'declined'
  | 'expired'
  | 'failed'
  | 'pending'
  | 'transferring'

export type EasySharePayload = {
  appId: LaunchablePhoneAppId
  copyText: string
  id?: number | string
  imageUrl?: string | null
  kind: EasyShareKind
  link?: string
  meta?: Record<string, unknown>
  subtitle?: string
  title: string
}

export type EasyShareTarget = {
  distance: number
  id: number
  name: string
}

export type EasyShareTransfer = {
  createdAt: number
  direction: 'incoming' | 'outgoing'
  id: string
  otherName: string
  payload: EasySharePayload
  progress: number
  status: EasyShareStatus
}

export type EasyShareBootstrap = {
  history: EasyShareTransfer[]
  pending: EasyShareTransfer[]
  targets: EasyShareTarget[]
  visibility: EasyShareVisibility
}

export type EasyShareEvent = {
  transfer: EasyShareTransfer
}
