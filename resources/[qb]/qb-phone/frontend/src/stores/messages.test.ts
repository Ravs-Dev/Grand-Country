import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMessagesStore } from '@/stores/messages'
import type { SmsMessage } from '@/types/messages'
import { nuiCall } from '@/utils/nui'

vi.mock('@/utils/nui', () => ({
  nuiCall: vi.fn(),
}))

const mockNuiCall = vi.mocked(nuiCall)

function sentMessage(id: string): SmsMessage {
  return {
    body: 'Hello',
    created_at: '2026-08-06 15:00:00',
    direction: 'sent',
    id,
    media_duration_ms: null,
    media_asset_id: null,
    media_mime: null,
    media_waveform: null,
    message_type: 'text',
    read_at: null,
    recipient_number: '4205550196',
    sender_number: '4205550100',
  }
}

describe('messages store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockNuiCall.mockReset()
  })

  it('shows an outgoing message immediately and marks it delivered', async () => {
    let resolveSend:
      | ((value: { data: SmsMessage; success: true }) => void)
      | undefined
    const response = new Promise<{ data: SmsMessage; success: true }>(
      (resolve) => {
        resolveSend = resolve
      },
    )
    mockNuiCall
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: [], success: true })
      .mockImplementationOnce(() => response)
      .mockResolvedValueOnce({ data: [], success: true })

    const messages = useMessagesStore()
    await messages.openThread('4205550196')
    const sending = messages.send({ body: 'Hello', messageType: 'text' })

    expect(messages.messages).toHaveLength(1)
    expect(messages.messages[0]).toMatchObject({
      body: 'Hello',
      delivery_status: 'sending',
      message_type: 'text',
    })

    resolveSend?.({ data: sentMessage('server-id'), success: true })
    await sending

    expect(messages.messages[0]).toMatchObject({
      delivery_status: 'delivered',
      id: 'server-id',
    })
  })

  it('keeps a failed optimistic message visible', async () => {
    mockNuiCall
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ error: 'recipient_unavailable', success: false })

    const messages = useMessagesStore()
    await messages.openThread('4205550196')
    await messages.send({ body: 'Hello', messageType: 'text' })

    expect(messages.messages[0].delivery_status).toBe('failed')
  })

  it('discards a failed optimistic attachment when its preview remains retryable', async () => {
    mockNuiCall
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ error: 'request_failed', success: false })

    const messages = useMessagesStore()
    await messages.openThread('4205550196')
    await messages.send(
      {
        body: 'Retry this photo',
        mediaAssetId: '17',
        messageType: 'image',
      },
      { discardFailedOptimistic: true },
    )

    expect(messages.messages).toEqual([])
  })

  it('keeps a photo caption on the optimistic media message', async () => {
    const serverMessage: SmsMessage = {
      ...sentMessage('photo-server-id'),
      body: 'Look at this',
      media_asset_id: 'https://media.example/photo.jpg',
      media_mime: 'image/jpeg',
      message_type: 'image',
    }
    mockNuiCall
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: serverMessage, success: true })
      .mockResolvedValueOnce({ data: [], success: true })

    const messages = useMessagesStore()
    await messages.openThread('4205550196')
    const sending = messages.send({
      body: '  Look at this  ',
      mediaAssetId: '17',
      messageType: 'image',
    })

    expect(messages.messages[0]).toMatchObject({
      body: 'Look at this',
      delivery_status: 'sending',
      media_asset_id: '17',
      message_type: 'image',
    })

    await sending
    expect(mockNuiCall).toHaveBeenNthCalledWith(3, 'messages:send', {
      body: '  Look at this  ',
      mediaAssetId: '17',
      messageType: 'image',
      phoneNumber: '4205550196',
    })
  })

  it('shows a shared contact immediately and sends only its id', async () => {
    const contact = {
      avatar_url: 'https://picsum.photos/seed/shared-alex/240/240',
      name: 'Alex Rivera',
      organization: 'Maze Bank',
      phone_number: '4205550137',
    }
    const serverMessage: SmsMessage = {
      ...sentMessage('contact-server-id'),
      body: contact.name,
      contact,
      message_type: 'contact',
    }
    mockNuiCall
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: [], success: true })
      .mockResolvedValueOnce({ data: serverMessage, success: true })
      .mockResolvedValueOnce({ data: [], success: true })

    const messages = useMessagesStore()
    await messages.openThread('4205550196')
    const sending = messages.send({
      contact,
      contactId: 'contact-alex',
      messageType: 'contact',
    })

    expect(messages.messages[0]).toMatchObject({
      contact,
      delivery_status: 'sending',
      message_type: 'contact',
    })

    await sending
    expect(mockNuiCall).toHaveBeenNthCalledWith(3, 'messages:send', {
      contactId: 'contact-alex',
      messageType: 'contact',
      phoneNumber: '4205550196',
    })
  })

  it('normalizes numeric phone data from the NUI boundary', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: [
        {
          lastMessage: 'Hello',
          lastMessageAt: 1_786_034_600,
          lastMessageType: 'text',
          phoneNumber: 4_205_550_196,
          unread: 0,
        },
      ],
      success: true,
    })

    const messages = useMessagesStore()
    await messages.loadConversations()

    expect(messages.conversations[0].phoneNumber).toBe('4205550196')
  })

  it('loads protected voice media once and caches the data URI', async () => {
    mockNuiCall.mockResolvedValueOnce({
      data: { mime: 'audio/webm;codecs=opus', payload: 'ZmFrZQ==' },
      success: true,
    })

    const messages = useMessagesStore()
    expect(await messages.loadMedia('voice-id')).toBe(true)
    expect(await messages.loadMedia('voice-id')).toBe(true)

    expect(messages.mediaSources['voice-id']).toBe(
      'data:audio/webm;codecs=opus;base64,ZmFrZQ==',
    )
    expect(mockNuiCall).toHaveBeenCalledTimes(1)
  })
})
