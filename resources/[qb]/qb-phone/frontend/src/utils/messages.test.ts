import { describe, expect, it } from 'vitest'

import type { SmsConversation } from '@/types/messages'
import {
  sortContactsByMessageRecency,
  sortConversationsByRecency,
} from '@/utils/messages'

function conversation(
  phoneNumber: string,
  lastMessageAt: string,
): SmsConversation {
  return {
    lastMessage: phoneNumber,
    lastMessageAt,
    lastMessageType: 'text',
    phoneNumber,
    unread: 0,
  }
}

const conversations = [
  conversation('5550000001', '2026-08-12 10:00:00'),
  conversation('5550000002', '2026-08-12 12:00:00'),
]

describe('SMS recency ordering', () => {
  it('places the conversation with the newest message first', () => {
    expect(
      sortConversationsByRecency(conversations).map(
        (item) => item.phoneNumber,
      ),
    ).toEqual(['5550000002', '5550000001'])
  })

  it('places recently messaged contacts before unused contacts', () => {
    const contacts = [
      { name: 'Unused', phone_number: '5550000003' },
      { name: 'Older', phone_number: '5550000001' },
      { name: 'Newest', phone_number: '5550000002' },
    ]

    expect(
      sortContactsByMessageRecency(contacts, conversations).map(
        (item) => item.name,
      ),
    ).toEqual(['Newest', 'Older', 'Unused'])
  })
})
