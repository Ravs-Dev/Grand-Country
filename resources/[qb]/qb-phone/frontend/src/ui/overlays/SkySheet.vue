<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { useOverlayFocusTrap } from './useOverlayFocusTrap'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    ariaModal?: boolean | 'false' | 'true'
    backdrop?: boolean
    component?: string
    grabberClickable?: boolean
    grabberLabel?: string
    opened: boolean
    role?: 'alertdialog' | 'dialog' | 'none' | 'presentation'
    showGrabber?: boolean
    swipeToClose?: boolean
    tabindex?: number | string
  }>(),
  {
    ariaModal: true,
    backdrop: true,
    component: 'div',
    grabberClickable: false,
    grabberLabel: '',
    showGrabber: true,
    tabindex: -1,
  },
)
const emit = defineEmits<{
  backdropclick: [event: MouseEvent]
  escape: [event: KeyboardEvent]
  grabberclick: [event: MouseEvent]
  swipeclose: [event: PointerEvent]
}>()

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const dragOffset = ref(0)
const isDragging = ref(false)
const isSettling = ref(false)
const inferredRole = ref<'alertdialog' | 'dialog' | 'none' | 'presentation'>()
let activePointerId: number | null = null
let dragStartedAt = 0
let dragStartY = 0
let settleTimer: number | undefined

const effectiveRole = computed(() => {
  const role = inferredRole.value
  const isDialog = role === 'dialog' || role === 'alertdialog'
  return isDialog && !props.ariaLabel && !props.ariaLabelledby
    ? 'presentation'
    : role
})
const panelStyle = computed(() =>
  props.swipeToClose && dragOffset.value > 0
    ? { '--sky-sheet-drag-offset': `${dragOffset.value}px` }
    : undefined,
)

function clearSettleTimer(): void {
  if (!settleTimer) return
  window.clearTimeout(settleTimer)
  settleTimer = undefined
}

function settleDrag(): void {
  clearSettleTimer()
  isSettling.value = true
  dragOffset.value = 0
  settleTimer = window.setTimeout(() => {
    isSettling.value = false
    settleTimer = undefined
  }, 220)
}

function startDrag(event: PointerEvent): void {
  const target = event.target
  const grabber =
    target instanceof Element
      ? target.closest('.sky-sheet__grabber')
      : undefined
  const extendedHandle =
    target instanceof Element
      ? target.closest('[data-sky-sheet-drag-handle]')
      : undefined
  const interactiveTarget =
    target instanceof Element
      ? target.closest(
          'button, a, input, select, textarea, [role="button"], [contenteditable="true"]',
        )
      : undefined

  if (
    !props.swipeToClose ||
    !event.isPrimary ||
    (!grabber && (!extendedHandle || interactiveTarget)) ||
    (event.pointerType === 'mouse' && event.button !== 0)
  ) {
    return
  }

  clearSettleTimer()
  activePointerId = event.pointerId
  dragStartY = event.clientY
  dragStartedAt = performance.now()
  dragOffset.value = 0
  isDragging.value = true
  isSettling.value = false
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)
}

function moveDrag(event: PointerEvent): void {
  if (event.pointerId !== activePointerId) return
  dragOffset.value = Math.max(0, event.clientY - dragStartY)
  event.preventDefault()
}

function finishDrag(event: PointerEvent, cancelled = false): void {
  if (event.pointerId !== activePointerId) return

  const handle = event.currentTarget as HTMLElement
  const pointerId = activePointerId
  const elapsed = Math.max(performance.now() - dragStartedAt, 1)
  const velocity = dragOffset.value / elapsed
  const closeThreshold = Math.min(
    Math.max((panel.value?.offsetHeight ?? 0) * 0.18, 72),
    110,
  )
  const shouldClose =
    !cancelled &&
    (dragOffset.value >= closeThreshold ||
      (dragOffset.value >= 28 && velocity >= 0.65))

  activePointerId = null
  isDragging.value = false
  if (handle.hasPointerCapture(pointerId)) {
    handle.releasePointerCapture(pointerId)
  }

  if (shouldClose) {
    emit('swipeclose', event)
    void nextTick(() => {
      if (props.opened) settleDrag()
    })
    return
  }

  settleDrag()
}

watch(
  [toRef(props, 'opened'), toRef(props, 'role')],
  async ([opened]) => {
    inferredRole.value = undefined
    if (!opened) return

    await nextTick()
    if (!props.opened || !panel.value) return

    const nestedDialog = panel.value.querySelector(
      '[role="dialog"], [role="alertdialog"]',
    )
    inferredRole.value = props.role ?? (nestedDialog ? undefined : 'dialog')
  },
  { immediate: true, flush: 'post' },
)

watch(toRef(props, 'opened'), (opened) => {
  if (opened) return
  activePointerId = null
  dragOffset.value = 0
  isDragging.value = false
  isSettling.value = false
  clearSettleTimer()
})

onBeforeUnmount(clearSettleTimer)

useOverlayFocusTrap({
  onEscape: (event) => emit('escape', event),
  opened: toRef(props, 'opened'),
  panel,
  root,
})
</script>

<template>
  <Transition
    name="sky-sheet-rise"
    :duration="{ enter: 400, leave: 400 }"
    appear
  >
    <div v-if="opened" ref="root" v-bind="$attrs" class="sky-sheet">
      <div
        v-if="backdrop"
        class="sky-overlay-backdrop"
        aria-hidden="true"
        @click="emit('backdropclick', $event)"
      ></div>
      <component
        :is="component"
        ref="panel"
        class="sky-sheet__panel"
        :class="{
          'sky-sheet__panel--dragging': isDragging,
          'sky-sheet__panel--settling': isSettling,
        }"
        :style="panelStyle"
        :role="effectiveRole"
        :aria-modal="
          effectiveRole === 'dialog' || effectiveRole === 'alertdialog'
            ? ariaModal
            : undefined
        "
        :aria-label="effectiveRole ? ariaLabel : undefined"
        :aria-labelledby="
          effectiveRole && !ariaLabel ? ariaLabelledby : undefined
        "
        :aria-describedby="effectiveRole ? ariaDescribedby : undefined"
        :tabindex="tabindex"
        @lostpointercapture="finishDrag($event, true)"
        @pointercancel="finishDrag($event, true)"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="finishDrag($event)"
      >
        <component
          :is="grabberClickable ? 'button' : 'div'"
          v-if="swipeToClose && showGrabber"
          class="sky-sheet__grabber"
          :type="grabberClickable ? 'button' : undefined"
          :aria-hidden="grabberClickable ? undefined : true"
          :aria-label="grabberClickable ? grabberLabel : undefined"
          @click="grabberClickable && emit('grabberclick', $event)"
        ></component>
        <slot />
      </component>
    </div>
  </Transition>
</template>
