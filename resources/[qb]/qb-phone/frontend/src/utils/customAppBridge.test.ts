import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createCustomAppBridgeRequestHandler,
  getCustomAppFrameBootstrapMessages,
  getSkyPhoneAppCapabilities,
  shouldReportCustomAppReady,
  type CustomAppBridgeNotification,
  type CustomAppBridgeTarget,
} from '@/utils/customAppBridge'

const source = {
  capabilities: [] as string[],
  id: 'source-app',
}
const createNotification =
  vi.fn<(input: CustomAppBridgeNotification) => string | null>()
const prepareExternalOpen = vi.fn<(appId: string, data?: unknown) => boolean>()
const resolveTarget = vi.fn<(appId: string) => CustomAppBridgeTarget | null>()
const storageCall = vi.fn()

function createHandler() {
  return createCustomAppBridgeRequestHandler({
    createNotification,
    getSourceApp: () => source,
    prepareExternalOpen,
    resolveTarget,
    storageCall,
  })
}

describe('custom app bridge', () => {
  beforeEach(() => {
    source.capabilities = []
    createNotification.mockReset().mockReturnValue('notification-1')
    prepareExternalOpen.mockReset().mockReturnValue(true)
    resolveTarget.mockReset().mockReturnValue(null)
    storageCall.mockReset().mockResolvedValue({ success: true })
  })

  it('advertises only implemented methods granted by manifest permissions', () => {
    expect(
      getSkyPhoneAppCapabilities([
        'app.close',
        'device.storage',
        'notifications',
        'location.read',
      ]),
    ).toEqual([
      'app.close',
      'device.storage.get',
      'device.storage.set',
      'notification.create',
    ])
  })

  it('reports ready lifecycle from load only for legacy frames', () => {
    expect(shouldReportCustomAppReady('legacy', 'frame-load')).toBe(true)
    expect(shouldReportCustomAppReady('legacy', 'bridge-ready')).toBe(false)
    expect(shouldReportCustomAppReady('sky', 'frame-load')).toBe(false)
    expect(shouldReportCustomAppReady('sky', 'bridge-ready')).toBe(true)
  })

  it('boots LB Phone frames with their documented ready signal', () => {
    expect(
      getCustomAppFrameBootstrapMessages({ provider: 'lb_phone' }),
    ).toEqual(['componentsLoaded'])
    expect(
      getCustomAppFrameBootstrapMessages({ provider: '17mov' }),
    ).toEqual([])
  })

  it('passes validated storage data and server response data through', async () => {
    source.capabilities = ['device.storage']
    storageCall.mockResolvedValue({
      data: { exists: true, revision: 4, value: { enabled: true } },
      success: true,
    })
    const handler = createHandler()

    const result = await handler.handle({
      method: 'device.storage.get',
      payload: { key: 'settings.main' },
      requestId: 'storage-get',
    })

    expect(storageCall).toHaveBeenCalledWith('custom-app:storage:get', {
      appId: 'source-app',
      key: 'settings.main',
    })
    expect(result?.response).toEqual({
      data: { exists: true, revision: 4, value: { enabled: true } },
      requestId: 'storage-get',
      success: true,
    })
  })

  it('validates storage writes and deduplicates request ids', async () => {
    source.capabilities = ['device.storage']
    const handler = createHandler()
    const request = {
      method: 'device.storage.set',
      payload: { key: 'profile', revision: 2, value: { color: 'blue' } },
      requestId: 'storage-set',
    }

    const first = await handler.handle(request)
    const duplicate = await handler.handle(request)
    const invalid = await handler.handle({
      method: 'device.storage.set',
      payload: { key: '../profile', revision: -1, value: Number.NaN },
      requestId: 'storage-invalid',
    })

    expect(first?.response.success).toBe(true)
    expect(duplicate).toBeNull()
    expect(invalid?.response).toMatchObject({
      error: 'invalid_storage_request',
      success: false,
    })
    expect(storageCall).toHaveBeenCalledWith('custom-app:storage:set', {
      appId: 'source-app',
      key: 'profile',
      revision: 2,
      value: { color: 'blue' },
    })
    expect(storageCall).toHaveBeenCalledOnce()
  })

  it('bounds the request-id deduplication window', async () => {
    const handler = createHandler()
    const first = await handler.handle({
      method: 'unknown',
      requestId: 'oldest-request',
    })
    for (let index = 0; index < 512; index += 1) {
      await handler.handle({
        method: 'unknown',
        requestId: `request-${index}`,
      })
    }
    const afterEviction = await handler.handle({
      method: 'unknown',
      requestId: 'oldest-request',
    })

    expect(first?.response.error).toBe('unsupported_method')
    expect(afterEviction?.response.error).toBe('unsupported_method')
  })

  it('requires storage and close permissions', async () => {
    const handler = createHandler()

    const storage = await handler.handle({
      method: 'device.storage.get',
      payload: { key: 'profile' },
      requestId: 'denied-storage',
    })
    const close = await handler.handle({
      method: 'app.close',
      requestId: 'denied-close',
    })

    expect(storage?.response.error).toBe('permission_denied')
    expect(close?.response.error).toBe('permission_denied')
    expect(close?.effect).toBeUndefined()
  })

  it('creates a small text-only notification routed to its own app', async () => {
    source.capabilities = ['notifications']
    const handler = createHandler()

    const result = await handler.handle({
      method: 'notification.create',
      payload: {
        sound: 'signal',
        subtitle: '  Update  ',
        text: '  Work completed.  ',
        title: '  Example  ',
      },
      requestId: 'notification',
    })

    expect(createNotification).toHaveBeenCalledWith({
      appId: 'source-app',
      route: '/apps/source-app',
      sound: 'signal',
      subtitle: 'Update',
      text: 'Work completed.',
      title: 'Example',
    })
    expect(result?.response.data).toEqual({
      notificationId: 'notification-1',
    })
  })

  it('rejects notification route injection and undeclared notification use', async () => {
    source.capabilities = ['notifications']
    const handler = createHandler()
    const injected = await handler.handle({
      method: 'notification.create',
      payload: {
        route: 'https://example.test',
        text: 'Body',
        title: 'Title',
      },
      requestId: 'notification-injected',
    })
    source.capabilities = []
    const denied = await handler.handle({
      method: 'notification.create',
      payload: { text: 'Body', title: 'Title' },
      requestId: 'notification-denied',
    })

    expect(injected?.response.error).toBe('invalid_notification')
    expect(denied?.response.error).toBe('permission_denied')
    expect(createNotification).not.toHaveBeenCalled()
  })

  it('opens only registered targets and passes JSON data to external apps', async () => {
    source.capabilities = ['app.open']
    resolveTarget.mockReturnValue({
      external: true,
      id: 'target-app',
      route: '/apps/target-app',
    })
    const handler = createHandler()
    const data = { screen: 'details', selectedId: 17 }

    const result = await handler.handle({
      method: 'app.open',
      payload: { appId: 'target-app', data },
      requestId: 'open-target',
    })

    expect(resolveTarget).toHaveBeenCalledWith('target-app')
    expect(prepareExternalOpen).toHaveBeenCalledWith('target-app', data)
    expect(result).toMatchObject({
      effect: { route: '/apps/target-app', type: 'open' },
      response: {
        data: { appId: 'target-app' },
        success: true,
      },
    })
  })

  it('rejects foreign URLs, unknown apps, and data for built-in apps', async () => {
    source.capabilities = ['app.open']
    const handler = createHandler()

    const foreignUrl = await handler.handle({
      method: 'app.open',
      payload: { appId: 'target-app', url: 'https://example.test' },
      requestId: 'open-url',
    })
    const missing = await handler.handle({
      method: 'app.open',
      payload: { appId: 'missing-app' },
      requestId: 'open-missing',
    })
    resolveTarget.mockReturnValue({
      external: false,
      id: 'notes',
      route: '/apps/notes',
    })
    const builtInData = await handler.handle({
      method: 'app.open',
      payload: { appId: 'notes', data: { noteId: 'one' } },
      requestId: 'open-built-in-data',
    })

    expect(foreignUrl?.response.error).toBe('invalid_app_open')
    expect(missing?.response.error).toBe('app_not_found')
    expect(builtInData?.response.error).toBe('open_data_not_supported')
    expect(prepareExternalOpen).not.toHaveBeenCalled()
  })
})
