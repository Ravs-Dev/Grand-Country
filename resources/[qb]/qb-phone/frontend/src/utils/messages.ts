import type { SmsConversation } from '@/types/messages'
import { parseDatabaseDate } from '@/utils/date'

function conversationTime(conversation: SmsConversation): number {
  const timestamp = parseDatabaseDate(conversation.lastMessageAt).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function sortConversationsByRecency(
  conversations: SmsConversation[],
): SmsConversation[] {
  return conversations
    .map((conversation, index) => ({ conversation, index }))
    .sort(
      (left, right) =>
        conversationTime(right.conversation) -
          conversationTime(left.conversation) || left.index - right.index,
    )
    .map(({ conversation }) => conversation)
}

export function sortContactsByMessageRecency<
  T extends { phone_number: string },
>(contacts: T[], conversations: SmsConversation[]): T[] {
  const activity = new Map(
    conversations.map((conversation) => [
      conversation.phoneNumber,
      conversationTime(conversation),
    ]),
  )
  return contacts
    .map((contact, index) => ({ contact, index }))
    .sort((left, right) => {
      const leftActivity = activity.get(left.contact.phone_number)
      const rightActivity = activity.get(right.contact.phone_number)
      if (leftActivity === undefined && rightActivity === undefined)
        return left.index - right.index
      if (leftActivity === undefined) return 1
      if (rightActivity === undefined) return -1
      return rightActivity - leftActivity || left.index - right.index
    })
    .map(({ contact }) => contact)
}
