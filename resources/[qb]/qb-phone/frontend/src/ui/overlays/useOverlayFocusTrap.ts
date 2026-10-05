import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

interface OverlayStackEntry {
  hadInertAttribute: boolean
  id: symbol
  onEscape: (event: KeyboardEvent) => void
  panel: HTMLElement
  previousAriaHidden: string | null
  previousFocus: HTMLElement | null
  root: HTMLElement
}

interface OverlayFocusTrapOptions {
  onEscape: (event: KeyboardEvent) => void
  opened: Readonly<Ref<boolean>>
  panel: Readonly<Ref<HTMLElement | null>>
  root: Readonly<Ref<HTMLElement | null>>
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

const overlayStack: OverlayStackEntry[] = []
let documentListenerAttached = false

function isVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getClientRects().length > 0 &&
    !element.closest('[aria-hidden="true"], [inert]')
  )
}

function canReceiveFocus(element: HTMLElement): boolean {
  return (
    element.isConnected &&
    !element.matches(':disabled') &&
    !element.hasAttribute('hidden') &&
    isVisible(element)
  )
}

function getTabbableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((element) => element.tabIndex >= 0 && canReceiveFocus(element))
}

function focusElement(element: HTMLElement | null): boolean {
  if (!element || !canReceiveFocus(element)) return false

  element.focus({ preventScroll: true })
  return document.activeElement === element
}

function focusFirstElement(entry: OverlayStackEntry): void {
  const preferred = entry.root.querySelector<HTMLElement>(
    '[data-sky-autofocus], [autofocus]',
  )

  if (focusElement(preferred)) return

  const firstTabbable = getTabbableElements(entry.root)[0]
  if (focusElement(firstTabbable)) return

  focusElement(entry.panel)
}

function trapTabKey(entry: OverlayStackEntry, event: KeyboardEvent): void {
  const tabbable = getTabbableElements(entry.root)

  if (tabbable.length === 0) {
    event.preventDefault()
    event.stopPropagation()
    focusElement(entry.panel)
    return
  }

  const activeElement = document.activeElement
  const first = tabbable[0]
  const last = tabbable[tabbable.length - 1]
  const focusIsInside =
    activeElement instanceof Node && entry.root.contains(activeElement)

  if (!focusIsInside) {
    event.preventDefault()
    event.stopPropagation()
    focusElement(event.shiftKey ? last : first)
    return
  }

  const activeIndex = tabbable.indexOf(activeElement as HTMLElement)

  if (activeIndex < 0) {
    event.preventDefault()
    event.stopPropagation()
    focusElement(event.shiftKey ? last : first)
    return
  }

  if (event.shiftKey && activeElement === first) {
    event.preventDefault()
    event.stopPropagation()
    focusElement(last)
    return
  }

  if (!event.shiftKey && activeElement === last) {
    event.preventDefault()
    event.stopPropagation()
    focusElement(first)
  }
}

function restoreOverlayAccessibility(entry: OverlayStackEntry): void {
  entry.root.style.removeProperty('--sky-overlay-layer')

  if (entry.previousAriaHidden === null) {
    entry.root.removeAttribute('aria-hidden')
  } else {
    entry.root.setAttribute('aria-hidden', entry.previousAriaHidden)
  }

  if (entry.hadInertAttribute) {
    entry.root.setAttribute('inert', '')
  } else {
    entry.root.removeAttribute('inert')
  }
}

function syncOverlayStack(): void {
  const topIndex = overlayStack.length - 1

  overlayStack.forEach((entry, index) => {
    entry.root.style.setProperty('--sky-overlay-layer', String(80 + index))

    if (index === topIndex) {
      if (entry.previousAriaHidden === null) {
        entry.root.removeAttribute('aria-hidden')
      } else {
        entry.root.setAttribute('aria-hidden', entry.previousAriaHidden)
      }

      if (entry.hadInertAttribute) {
        entry.root.setAttribute('inert', '')
      } else {
        entry.root.removeAttribute('inert')
      }
      return
    }

    entry.root.setAttribute('aria-hidden', 'true')
    entry.root.setAttribute('inert', '')
  })
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  const topOverlay = overlayStack[overlayStack.length - 1]
  if (!topOverlay) return

  if (event.key === 'Escape') {
    if (event.isComposing) return

    event.preventDefault()
    event.stopPropagation()
    topOverlay.onEscape(event)
    return
  }

  if (event.key === 'Tab') trapTabKey(topOverlay, event)
}

function syncDocumentListener(): void {
  if (typeof document === 'undefined') return

  const shouldAttach = overlayStack.length > 0

  if (shouldAttach && !documentListenerAttached) {
    document.addEventListener('keydown', handleDocumentKeydown, true)
    documentListenerAttached = true
    return
  }

  if (!shouldAttach && documentListenerAttached) {
    document.removeEventListener('keydown', handleDocumentKeydown, true)
    documentListenerAttached = false
  }
}

function currentFocus(): HTMLElement | null {
  const activeElement = document.activeElement

  if (
    !(activeElement instanceof HTMLElement) ||
    activeElement === document.body ||
    activeElement === document.documentElement
  ) {
    return null
  }

  return activeElement
}

function registerOverlay(
  root: HTMLElement,
  panel: HTMLElement,
  onEscape: (event: KeyboardEvent) => void,
): () => void {
  const entry: OverlayStackEntry = {
    hadInertAttribute: root.hasAttribute('inert'),
    id: Symbol('sky-overlay'),
    onEscape,
    panel,
    previousAriaHidden: root.getAttribute('aria-hidden'),
    previousFocus: currentFocus(),
    root,
  }

  overlayStack.push(entry)
  syncDocumentListener()
  focusFirstElement(entry)
  syncOverlayStack()

  let registered = true

  return () => {
    if (!registered) return
    registered = false

    const index = overlayStack.findIndex(
      (candidate) => candidate.id === entry.id,
    )
    if (index < 0) return

    const wasTopOverlay = index === overlayStack.length - 1
    const overlayAbove = overlayStack[index + 1]

    overlayStack.splice(index, 1)
    restoreOverlayAccessibility(entry)
    syncOverlayStack()
    syncDocumentListener()

    if (!wasTopOverlay) {
      if (
        overlayAbove &&
        entry.previousFocus &&
        overlayAbove.previousFocus &&
        entry.root.contains(overlayAbove.previousFocus)
      ) {
        overlayAbove.previousFocus = entry.previousFocus
      }
      return
    }

    const nextTopOverlay = overlayStack[overlayStack.length - 1]
    if (nextTopOverlay) {
      if (
        entry.previousFocus &&
        nextTopOverlay.root.contains(entry.previousFocus) &&
        focusElement(entry.previousFocus)
      ) {
        return
      }

      focusFirstElement(nextTopOverlay)
      return
    }

    focusElement(entry.previousFocus)
  }
}

export function useOverlayFocusTrap(options: OverlayFocusTrapOptions): void {
  let activation = 0
  let unregister: (() => void) | undefined

  const stopWatching = watch(
    options.opened,
    async (opened) => {
      activation += 1
      const currentActivation = activation

      if (!opened) {
        unregister?.()
        unregister = undefined
        return
      }

      await nextTick()

      if (currentActivation !== activation || !options.opened.value) return

      const root = options.root.value
      const panel = options.panel.value
      if (!root || !panel) return

      unregister?.()
      unregister = registerOverlay(root, panel, options.onEscape)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    activation += 1
    stopWatching()
    unregister?.()
    unregister = undefined
  })
}
