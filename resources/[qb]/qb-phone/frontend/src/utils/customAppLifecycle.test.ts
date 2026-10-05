import { describe, expect, it, vi } from 'vitest'

import type { ExternalPhoneAppDefinition } from '@/types/apps'
import {
  createCustomAppLifecycleReporter,
  createCustomAppLifecycleScheduler,
  createCustomAppOrientationCoordinator,
  getCustomAppFrameKey,
  getCustomAppSafeArea,
} from '@/utils/customAppLifecycle'
import type { NuiResponse } from '@/utils/nui'

function deferredResponse(): {
  promise: Promise<NuiResponse>
  resolve: (response: NuiResponse) => void
} {
  let resolve!: (response: NuiResponse) => void
  const promise = new Promise<NuiResponse>((complete) => {
    resolve = complete
  })
  return { promise, resolve }
}

function externalApp(
  overrides: Partial<ExternalPhoneAppDefinition> = {},
): ExternalPhoneAppDefinition {
  return {
    bridgeMode: 'sky',
    bundled: true,
    capabilities: ['theme.read'],
    category: 'utilities',
    compatibility: {},
    component: null,
    defaultInstalled: true,
    description: 'Example description',
    developer: 'Example developer',
    dockOrder: null,
    gridOrder: 100,
    icon: {} as ExternalPhoneAppDefinition['icon'],
    iconClass: 'app-icon--custom',
    iconImage: 'https://cfx-nui-example/web/icon.svg',
    id: 'example-app' as ExternalPhoneAppDefinition['id'],
    kind: 'external',
    name: 'Example App',
    orientation: 'portrait',
    ownerResource: 'example_resource',
    readyTimeoutMs: 8000,
    removable: true,
    route: '/apps/example-app' as ExternalPhoneAppDefinition['route'],
    ui: 'https://cfx-nui-example/web/index.html',
    ...overrides,
  }
}

describe('custom app lifecycle', () => {
  it('waits for delayed open and preserves fast ready/close ordering', async () => {
    const open = deferredResponse()
    const ready = deferredResponse()
    const close = deferredResponse()
    const calls: string[] = []
    const send = vi.fn((event: string) => {
      calls.push(event)
      if (event === 'open') return open.promise
      if (event === 'ready') return ready.promise
      return close.promise
    })
    const reporter = createCustomAppLifecycleReporter({
      scheduler: createCustomAppLifecycleScheduler(),
      send,
    })

    const openResult = reporter.report('open', { screen: 'details' })
    const readyResult = reporter.report('ready')
    const closeResult = reporter.report('close')
    await Promise.resolve()

    expect(calls).toEqual(['open'])

    open.resolve({ success: true })
    await openResult
    await Promise.resolve()
    expect(calls).toEqual(['open', 'ready'])

    ready.resolve({ success: true })
    await readyResult
    await Promise.resolve()
    expect(calls).toEqual(['open', 'ready', 'close'])

    close.resolve({ success: true })
    await expect(closeResult).resolves.toEqual({ success: true })
    expect(send).toHaveBeenNthCalledWith(1, 'open', { screen: 'details' })
  })

  it('finalizes only successful events and retries a failed event', async () => {
    const failure = vi.fn()
    const send = vi
      .fn()
      .mockResolvedValueOnce({ error: 'phone_closed', success: false })
      .mockResolvedValueOnce({ success: true })
    const reporter = createCustomAppLifecycleReporter({
      onFailure: failure,
      scheduler: createCustomAppLifecycleScheduler(),
      send,
    })

    await expect(reporter.report('open')).resolves.toMatchObject({
      error: 'phone_closed',
      success: false,
    })
    expect(reporter.isComplete('open')).toBe(false)

    await expect(reporter.report('open')).resolves.toEqual({ success: true })
    expect(reporter.isComplete('open')).toBe(true)
    expect(send).toHaveBeenCalledTimes(2)
    expect(failure).toHaveBeenCalledWith('open', 'phone_closed')
  })

  it('treats a failed hook as applied and continues with ready', async () => {
    const failure = vi.fn()
    const send = vi
      .fn()
      .mockResolvedValueOnce({ error: 'hook_failed', success: false })
      .mockResolvedValueOnce({ success: true })
    const reporter = createCustomAppLifecycleReporter({
      onFailure: failure,
      scheduler: createCustomAppLifecycleScheduler(),
      send,
    })

    const open = reporter.report('open')
    const ready = reporter.report('ready')

    await expect(open).resolves.toEqual({
      error: 'hook_failed',
      success: false,
    })
    await expect(ready).resolves.toEqual({ success: true })
    expect(reporter.isComplete('open')).toBe(true)
    expect(reporter.isComplete('ready')).toBe(true)
    expect(failure).toHaveBeenCalledWith('open', 'hook_failed')
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('does not report ready when its queued open failed', async () => {
    const send = vi.fn().mockResolvedValue({
      error: 'phone_closed',
      success: false,
    })
    const reporter = createCustomAppLifecycleReporter({
      scheduler: createCustomAppLifecycleScheduler(),
      send,
    })

    const open = reporter.report('open')
    const ready = reporter.report('ready')

    await expect(open).resolves.toMatchObject({ success: false })
    await expect(ready).resolves.toEqual({
      error: 'open_not_completed',
      success: false,
    })
    expect(send).toHaveBeenCalledOnce()
  })

  it('turns a rejected transport promise into a retryable response', async () => {
    const send = vi
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({ success: true })
    const reporter = createCustomAppLifecycleReporter({
      scheduler: createCustomAppLifecycleScheduler(),
      send,
    })

    await expect(reporter.report('open')).resolves.toEqual({
      error: 'network down',
      success: false,
    })
    await expect(reporter.report('open')).resolves.toEqual({ success: true })
    expect(reporter.isComplete('open')).toBe(true)
  })

  it('turns iframe, bridge, permission, and orientation updates into remounts', () => {
    const original = externalApp()
    const originalKey = getCustomAppFrameKey(original)

    expect(
      getCustomAppFrameKey(
        externalApp({ ui: 'https://cfx-nui-example/web/v2.html' }),
      ),
    ).not.toBe(originalKey)
    expect(
      getCustomAppFrameKey(externalApp({ bridgeMode: 'legacy' })),
    ).not.toBe(originalKey)
    expect(
      getCustomAppFrameKey(externalApp({ capabilities: ['app.close'] })),
    ).not.toBe(originalKey)
    expect(
      getCustomAppFrameKey(externalApp({ orientation: 'landscape' })),
    ).not.toBe(originalKey)
  })

  it('applies landscape safe areas and resets only the current owner', () => {
    const changes: boolean[] = []
    const coordinator = createCustomAppOrientationCoordinator()
    const previous = coordinator.createSession((value) => changes.push(value))
    const current = coordinator.createSession((value) => changes.push(value))

    previous.apply('landscape')
    current.apply('landscape')
    previous.release()
    current.apply('portrait')
    current.release()

    expect(changes).toEqual([true, true, false, false])
    expect(getCustomAppSafeArea('portrait')).toEqual({
      bottom: 25,
      left: 0,
      right: 0,
      top: 44,
    })
    expect(getCustomAppSafeArea('landscape')).toEqual({
      bottom: 0,
      left: 44,
      right: 25,
      top: 0,
    })
  })
})
