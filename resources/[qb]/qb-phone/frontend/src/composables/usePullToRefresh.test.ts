import { afterEach, describe, expect, it, vi } from 'vitest'

import { usePullToRefresh } from '@/composables/usePullToRefresh'

function touchEvent(clientY: number): TouchEvent {
  return { touches: [{ clientY }] } as unknown as TouchEvent
}

function wheelEvent(deltaY: number): WheelEvent {
  return { deltaY } as WheelEvent
}

afterEach(() => {
  vi.useRealTimers()
})

describe('usePullToRefresh', () => {
  it('ignores gestures while away from the top or busy', () => {
    const refresh = vi.fn()
    const pull = usePullToRefresh({
      isAtTop: () => false,
      isBusy: () => true,
      refresh,
    })

    expect(pull.startPull(touchEvent(40))).toBe(false)
    expect(pull.pullWithWheel(wheelEvent(-100))).toBe(false)
    expect(pull.pullDistance.value).toBe(0)
    expect(refresh).not.toHaveBeenCalled()
  })

  it('applies touch resistance and resets a short pull', () => {
    const pull = usePullToRefresh({
      isAtTop: () => true,
      refresh: vi.fn(),
    })

    expect(pull.startPull(touchEvent(100))).toBe(true)
    pull.movePull(touchEvent(180))
    expect(pull.pullDistance.value).toBe(36)

    pull.finishPull()
    expect(pull.pullDistance.value).toBe(0)
  })

  it('runs one refresh after crossing the threshold and always resets', async () => {
    let releaseRefresh: (() => void) | undefined
    const refresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          releaseRefresh = resolve
        }),
    )
    const pull = usePullToRefresh({
      isAtTop: () => true,
      refresh,
    })

    pull.startPull(touchEvent(0))
    pull.movePull(touchEvent(200))
    expect(pull.pullDistance.value).toBe(76)

    pull.finishPull()
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(pull.isRefreshing.value).toBe(true)
    expect(pull.pullDistance.value).toBe(56)
    expect(await pull.refresh()).toBe(false)

    releaseRefresh?.()
    await vi.waitFor(() => expect(pull.isRefreshing.value).toBe(false))
    expect(pull.pullDistance.value).toBe(0)
  })

  it('settles wheel input before deciding whether to refresh', async () => {
    vi.useFakeTimers()
    const refresh = vi.fn()
    const pull = usePullToRefresh({
      isAtTop: () => true,
      refresh,
    })

    expect(pull.pullWithWheel(wheelEvent(-400))).toBe(true)
    expect(pull.pullDistance.value).toBe(72)
    expect(refresh).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(130)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(pull.pullDistance.value).toBe(0)
  })

  it('cancels pending wheel work when disposed', async () => {
    vi.useFakeTimers()
    const refresh = vi.fn()
    const pull = usePullToRefresh({
      isAtTop: () => true,
      refresh,
    })

    pull.pullWithWheel(wheelEvent(-400))
    pull.dispose()
    await vi.advanceTimersByTimeAsync(130)

    expect(refresh).not.toHaveBeenCalled()
  })
})
