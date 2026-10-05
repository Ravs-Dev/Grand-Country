import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { nuiCall } from '@/utils/nui'

describe('nuiCall', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('window', {
      clearTimeout: globalThis.clearTimeout,
      location: { search: '' },
      setTimeout: globalThis.setTimeout,
    })
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('clears the request timeout after a successful callback', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { value: 1 }, success: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(nuiCall<{ value: number }>('test')).resolves.toEqual({
      data: { value: 1 },
      success: true,
    })
    expect(vi.getTimerCount()).toBe(0)
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/api/test',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('aborts a callback that never completes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
      ),
    )

    const request = nuiCall('never-responds')
    await vi.advanceTimersByTimeAsync(20_000)

    await expect(request).resolves.toEqual({
      error: 'request_timeout',
      success: false,
    })
    expect(vi.getTimerCount()).toBe(0)
  })
})
