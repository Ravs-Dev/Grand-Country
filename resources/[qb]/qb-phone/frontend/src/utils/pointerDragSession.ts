type PointerDragSessionTarget = Pick<
  Window,
  'addEventListener' | 'removeEventListener'
>

type PointerDragSessionHandlers = {
  cancel: () => void
  move: (event: PointerEvent) => void
  up: (event: PointerEvent) => void
}

export function bindPointerDragSession(
  target: PointerDragSessionTarget,
  pointerId: number,
  handlers: PointerDragSessionHandlers,
): () => void {
  let active = true

  const cleanup = (): void => {
    if (!active) return
    active = false
    target.removeEventListener('pointermove', onPointerMove, true)
    target.removeEventListener('pointerup', onPointerUp, true)
    target.removeEventListener('pointercancel', onPointerCancel, true)
    target.removeEventListener('blur', onBlur, true)
  }
  const matchesPointer = (event: PointerEvent): boolean =>
    active && event.pointerId === pointerId
  const onPointerMove = (event: PointerEvent): void => {
    if (matchesPointer(event)) handlers.move(event)
  }
  const onPointerUp = (event: PointerEvent): void => {
    if (!matchesPointer(event)) return
    cleanup()
    handlers.up(event)
  }
  const onPointerCancel = (event: PointerEvent): void => {
    if (!matchesPointer(event)) return
    cleanup()
    handlers.cancel()
  }
  const onBlur = (): void => {
    if (!active) return
    cleanup()
    handlers.cancel()
  }

  target.addEventListener('pointermove', onPointerMove, true)
  target.addEventListener('pointerup', onPointerUp, true)
  target.addEventListener('pointercancel', onPointerCancel, true)
  target.addEventListener('blur', onBlur, true)

  return cleanup
}
