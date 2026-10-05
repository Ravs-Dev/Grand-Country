<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { resolveScrollRailWheel } from '@/utils/scrollRail'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    as?: string
    label?: string
  }>(),
  {
    as: 'div',
    label: '',
  },
)

const DRAG_THRESHOLD_PX = 5

const isDragging = ref(false)
let activePointerId: number | null = null
let dragStartClientX = 0
let dragStartScrollLeft = 0
let renderedScale = 1
let suppressNextClick = false
let clickResetTimer: ReturnType<typeof setTimeout> | undefined

function resetPointerState() {
  activePointerId = null
  isDragging.value = false
}

function scheduleClickReset() {
  if (clickResetTimer !== undefined) {
    clearTimeout(clickResetTimer)
  }

  clickResetTimer = setTimeout(() => {
    suppressNextClick = false
    clickResetTimer = undefined
  }, 0)
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === 'touch' || !event.isPrimary || event.button !== 0) {
    return
  }

  const rail = event.currentTarget as HTMLElement
  const renderedWidth = rail.getBoundingClientRect().width

  activePointerId = event.pointerId
  dragStartClientX = event.clientX
  dragStartScrollLeft = rail.scrollLeft
  renderedScale =
    rail.clientWidth > 0 && renderedWidth > 0
      ? renderedWidth / rail.clientWidth
      : 1
  suppressNextClick = false
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerId !== activePointerId) {
    return
  }

  if ((event.buttons & 1) === 0) {
    resetPointerState()
    return
  }

  const rail = event.currentTarget as HTMLElement
  const deltaX = (event.clientX - dragStartClientX) / renderedScale

  if (!isDragging.value && Math.abs(deltaX) < DRAG_THRESHOLD_PX) {
    return
  }

  if (!isDragging.value) {
    isDragging.value = true
    rail.setPointerCapture(event.pointerId)
  }

  event.preventDefault()
  rail.scrollLeft = dragStartScrollLeft - deltaX
}

function finishPointer(event: PointerEvent) {
  if (event.pointerId !== activePointerId) {
    return
  }

  const rail = event.currentTarget as HTMLElement
  const dragged = isDragging.value

  if (rail.hasPointerCapture(event.pointerId)) {
    rail.releasePointerCapture(event.pointerId)
  }

  resetPointerState()

  if (dragged) {
    suppressNextClick = true
    scheduleClickReset()
  }
}

function handlePointerLeave(event: PointerEvent) {
  if (event.pointerId === activePointerId && !isDragging.value) {
    resetPointerState()
  }
}

function handleLostPointerCapture(event: PointerEvent) {
  if (event.pointerId === activePointerId) {
    resetPointerState()
  }
}

function handleClickCapture(event: MouseEvent) {
  if (!suppressNextClick) {
    return
  }

  suppressNextClick = false
  event.preventDefault()
  event.stopPropagation()
}

function handleWheel(event: WheelEvent) {
  if (event.ctrlKey) return

  const rail = event.currentTarget as HTMLElement
  const result = resolveScrollRailWheel({
    clientWidth: rail.clientWidth,
    deltaMode: event.deltaMode,
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    scrollLeft: rail.scrollLeft,
    scrollWidth: rail.scrollWidth,
  })

  if (!result.consumed) return

  rail.scrollLeft = result.scrollLeft
  event.preventDefault()
}

onBeforeUnmount(() => {
  if (clickResetTimer !== undefined) {
    clearTimeout(clickResetTimer)
  }
})
</script>

<template>
  <component
    :is="as"
    v-bind="$attrs"
    class="sky-scroll-rail"
    :class="{ 'sky-scroll-rail--dragging': isDragging }"
    role="region"
    :aria-label="label || undefined"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="finishPointer"
    @pointercancel="finishPointer"
    @pointerleave="handlePointerLeave"
    @lostpointercapture="handleLostPointerCapture"
    @click.capture="handleClickCapture"
    @wheel="handleWheel"
  >
    <slot />
  </component>
</template>
