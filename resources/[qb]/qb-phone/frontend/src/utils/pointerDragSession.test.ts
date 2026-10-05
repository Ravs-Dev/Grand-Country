import { describe, expect, it, vi } from 'vitest'

import { bindPointerDragSession } from '@/utils/pointerDragSession'

function pointerEvent(type: string, pointerId: number): PointerEvent {
  const event = new Event(type)
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  return event as PointerEvent
}

describe('pointer drag session', () => {
  it('keeps tracking the active pointer at window scope until pointerup', () => {
    const target = new EventTarget()
    const move = vi.fn()
    const up = vi.fn()
    const cancel = vi.fn()

    bindPointerDragSession(target as Window, 7, { cancel, move, up })
    target.dispatchEvent(pointerEvent('pointermove', 8))
    target.dispatchEvent(pointerEvent('pointermove', 7))
    target.dispatchEvent(new Event('lostpointercapture'))
    target.dispatchEvent(pointerEvent('pointerup', 7))
    target.dispatchEvent(pointerEvent('pointermove', 7))

    expect(move).toHaveBeenCalledTimes(1)
    expect(up).toHaveBeenCalledTimes(1)
    expect(cancel).not.toHaveBeenCalled()
  })

  it('cancels and removes listeners when the NUI window loses focus', () => {
    const target = new EventTarget()
    const move = vi.fn()
    const up = vi.fn()
    const cancel = vi.fn()

    bindPointerDragSession(target as Window, 3, { cancel, move, up })
    target.dispatchEvent(new Event('blur'))
    target.dispatchEvent(pointerEvent('pointermove', 3))
    target.dispatchEvent(pointerEvent('pointerup', 3))

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(move).not.toHaveBeenCalled()
    expect(up).not.toHaveBeenCalled()
  })
})
