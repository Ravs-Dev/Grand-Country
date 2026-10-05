import type { DatabaseDateValue } from '@/utils/date'
import type { EasySharePayload } from '@/types/easyshare'

export type SmsDirection = 'sent' | 'received'
export type SmsAttachmentType = 'image' | 'gif' | 'video'
export type SmsMessageType =
  | 'contact'
  | 'share'
  | 'text'
  | 'voice'
  | SmsAttachmentType
export type SmsDeliveryStatus = 'sending' | 'delivered' | 'failed'

export type SmsSharedContact = {
  avatar_url: string | null
  name: string
  organization: string | null
  phone_number: string
}

export type SmsConversation = {
  lastMessage: string
  lastMessageAt: DatabaseDateValue
  lastMessageType: SmsMessageType
  phoneNumber: string
  unread: number
}

export type SmsMessage = {
  body: string
  client_id?: string
  contact?: SmsSharedContact | null
  created_at: DatabaseDateValue
  delivery_status?: SmsDeliveryStatus
  direction: SmsDirection
  id: string
  media_asset_id: string | null
  media_duration_ms: number | null
  media_mime: string | null
  media_waveform: number[] | null
  message_type: SmsMessageType
  share?: EasySharePayload | null
  read_at: string | null
  recipient_number: string
  sender_number: string
}

export type SmsOutgoingMessage =
  | { body: string; messageType: 'text' }
  | {
      contact: SmsSharedContact
      contactId: string
      messageType: 'contact'
    }
  | { body?: string; messageType: 'share'; sharePayload: EasySharePayload }
  | {
      mediaDurationMs: number
      mediaMime: string
      mediaPayload: string
      mediaWaveform: number[]
      messageType: 'voice'
    }
  | {
      body?: string
      mediaAssetId: string
      mediaDurationMs?: number
      messageType: SmsAttachmentType
    }

export type SmsMedia = {
  mime: string
  payload: string
}

export type GifSearchResult = {
  height: number
  id: string
  previewUrl: string
  title: string
  url: string
  width: number
}

export type GifSearchPage = {
  hasMore: boolean
  nextOffset: number
  results: GifSearchResult[]
}
