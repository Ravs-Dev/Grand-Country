import type { DatabaseDateValue } from '@/utils/date'

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash'
export type MailFolderKey = MailFolder | `mailbox:${number}`
export type MailReadFilter = 'all' | 'read' | 'unread'
export type MailDirectionFilter = 'all' | 'inbox' | 'sent'
export type MailAddressFilter = 'all' | 'from-me' | 'to-me'

export type MailListFilters = {
  address: MailAddressFilter
  direction: MailDirectionFilter
  read: MailReadFilter
  today: boolean
}

export type MailMailbox = {
  count: number
  id: number
  name: string
  sort_order: number
}

export type MailMailboxesResponse = {
  mailboxes: MailMailbox[]
}

export type MailCounts = {
  drafts: number
  inbox: number
  sent: number
  trash: number
  unread: number
}

export type MailListItem = {
  body?: string
  created_at: DatabaseDateValue
  folder?: 'inbox' | 'sent'
  id: number | string
  is_read?: boolean
  message_id?: string
  preview: string
  recipients: string[]
  sender?: string
  subject: string
  trashed_at?: string | null
  updated_at?: string
}

export type MailMessage = MailListItem & {
  body: string
  folder: 'inbox' | 'sent'
  id: number
  message_id: string
  sender: string
}

export type MailDraft = {
  body: string
  created_at: DatabaseDateValue
  id: string
  recipients: string[]
  subject: string
  updated_at: string
}

export type MailSession = {
  counts: MailCounts
  email: string
}

export type MailListResponse = {
  hasMore: boolean
  items: MailListItem[]
  offset: number
}

export type MailComposeDraft = {
  body: string
  id?: string
  recipients: string[]
  subject: string
}
