export type ReorderDirection = 'down' | 'left' | 'right' | 'up'

export function consumeEscape(
  event: Pick<
    KeyboardEvent,
    | 'defaultPrevented'
    | 'isComposing'
    | 'key'
    | 'preventDefault'
    | 'stopImmediatePropagation'
  >,
): boolean {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) {
    return false
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  return true
}

export function handleEnterAction(
  event: Pick<KeyboardEvent, 'isComposing' | 'preventDefault'>,
  action: () => unknown,
): boolean {
  if (event.isComposing) return false
  event.preventDefault()
  void action()
  return true
}

export function reorderDirectionFromKeyboard(
  event: Pick<
    KeyboardEvent,
    'altKey' | 'ctrlKey' | 'isComposing' | 'key' | 'metaKey'
  >,
): ReorderDirection | null {
  if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) {
    return null
  }
  const directions: Partial<Record<string, ReorderDirection>> = {
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
  }
  return directions[event.key] ?? null
}
