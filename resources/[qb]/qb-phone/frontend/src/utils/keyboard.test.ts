import { describe, expect, it, vi } from 'vitest'

import {
  consumeEscape,
  handleEnterAction,
  reorderDirectionFromKeyboard,
} from '@/utils/keyboard'

describe('keyboard interaction', () => {
  it('does not submit while an IME composition is active', () => {
    const action = vi.fn()
    const preventDefault = vi.fn()

    expect(
      handleEnterAction({ isComposing: true, preventDefault }, action),
    ).toBe(false)
    expect(action).not.toHaveBeenCalled()
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('prevents the completed Enter key and runs its action once', () => {
    const action = vi.fn()
    const preventDefault = vi.fn()

    expect(
      handleEnterAction({ isComposing: false, preventDefault }, action),
    ).toBe(true)
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(action).toHaveBeenCalledOnce()
  })

  it('consumes only an unhandled Escape outside IME composition', () => {
    const preventDefault = vi.fn()
    const stopImmediatePropagation = vi.fn()

    expect(
      consumeEscape({
        defaultPrevented: false,
        isComposing: false,
        key: 'Escape',
        preventDefault,
        stopImmediatePropagation,
      }),
    ).toBe(true)
    expect(preventDefault).toHaveBeenCalledOnce()
    expect(stopImmediatePropagation).toHaveBeenCalledOnce()

    expect(
      consumeEscape({
        defaultPrevented: false,
        isComposing: true,
        key: 'Escape',
        preventDefault,
        stopImmediatePropagation,
      }),
    ).toBe(false)
  })

  it('blocks a second Escape owner on the same event target', () => {
    const target = new EventTarget()
    const rootHandler = vi.fn()
    target.addEventListener('keydown', (event) => {
      consumeEscape(event as KeyboardEvent)
    })
    target.addEventListener('keydown', rootHandler)
    const event = new Event('keydown', { cancelable: true })
    Object.defineProperties(event, {
      isComposing: { value: false },
      key: { value: 'Escape' },
    })

    target.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(rootHandler).not.toHaveBeenCalled()
  })

  it('maps only unmodified arrow keys to reorder directions', () => {
    expect(
      reorderDirectionFromKeyboard({
        altKey: false,
        ctrlKey: false,
        isComposing: false,
        key: 'ArrowLeft',
        metaKey: false,
      }),
    ).toBe('left')
    expect(
      reorderDirectionFromKeyboard({
        altKey: false,
        ctrlKey: true,
        isComposing: false,
        key: 'ArrowLeft',
        metaKey: false,
      }),
    ).toBeNull()
  })
})
