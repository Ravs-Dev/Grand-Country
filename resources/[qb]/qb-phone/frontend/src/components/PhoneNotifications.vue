<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { getPhoneApp } from '@/config/apps'
import type { PhoneNotification } from '@/stores/notifications'
import { usePhoneStore } from '@/stores/phone'
import { SkyNotification, SkyProvider } from '@/ui'

const props = defineProps<{
  dark?: boolean
  notification: PhoneNotification | null
}>()
const emit = defineEmits<{
  close: []
  open: [notification: PhoneNotification]
}>()
const phone = usePhoneStore()
const notificationTime = ref('')
const darkMode = computed(() => props.dark ?? phone.isDarkMode)
const icon = computed(() =>
  props.notification
    ? getPhoneApp(props.notification.appId)?.iconImage
    : undefined,
)
let pointerElement: HTMLElement | null = null
let pointerId: number | null = null
let pointerStartX = 0
let pointerStartY = 0
let pointerStartedAt = 0
let pointerAxis: 'horizontal' | 'vertical' | null = null
let pointerOffset = 0
let suppressOpenUntil = 0

watch(
  () => props.notification?.id,
  (notificationId) => {
    resetGesture()
    if (!notificationId) {
      notificationTime.value = ''
      return
    }
    notificationTime.value = new Intl.DateTimeFormat(phone.lang, {
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
    }).format(new Date())
  },
  { immediate: true },
)

function resetGesture(): void {
  if (
    pointerElement &&
    pointerId !== null &&
    pointerElement.hasPointerCapture(pointerId)
  ) {
    pointerElement.releasePointerCapture(pointerId)
  }
  pointerElement?.classList.remove('phone-notification--dragging')
  pointerElement?.style.removeProperty('--phone-notification-drag-y')
  pointerElement = null
  pointerId = null
  pointerAxis = null
  pointerOffset = 0
}

function openNotification(): void {
  if (!props.notification?.route || performance.now() < suppressOpenUntil)
    return
  emit('open', props.notification)
}

function beginDismissGesture(event: PointerEvent): void {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const element = event.currentTarget
  if (!(element instanceof HTMLElement)) return
  pointerElement = element
  pointerId = event.pointerId
  pointerStartX = event.clientX
  pointerStartY = event.clientY
  pointerStartedAt = performance.now()
  pointerAxis = null
  pointerOffset = 0
  element.classList.add('phone-notification--dragging')
  element.setPointerCapture(event.pointerId)
}

function moveDismissGesture(event: PointerEvent): void {
  if (!pointerElement || pointerId !== event.pointerId) return
  const deltaX = event.clientX - pointerStartX
  const deltaY = event.clientY - pointerStartY
  if (!pointerAxis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 6) {
    pointerAxis =
      Math.abs(deltaY) >= Math.abs(deltaX) ? 'vertical' : 'horizontal'
  }
  if (pointerAxis !== 'vertical') return
  event.preventDefault()
  pointerOffset = Math.max(-110, Math.min(8, deltaY))
  pointerElement.style.setProperty(
    '--phone-notification-drag-y',
    `${pointerOffset}px`,
  )
}

function finishDismissGesture(event: PointerEvent): void {
  if (!pointerElement || pointerId !== event.pointerId) return
  const element = pointerElement
  const elapsed = Math.max(1, performance.now() - pointerStartedAt)
  const velocityY = (event.clientY - pointerStartY) / elapsed
  const shouldDismiss =
    pointerAxis === 'vertical' && (pointerOffset <= -28 || velocityY <= -0.3)
  if (element.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId)
  }
  element.classList.remove('phone-notification--dragging')
  pointerElement = null
  pointerId = null
  pointerAxis = null
  if (shouldDismiss) {
    suppressOpenUntil = performance.now() + 180
    emit('close')
    return
  }
  pointerOffset = 0
  element.style.setProperty('--phone-notification-drag-y', '0px')
}
</script>

<template>
  <SkyProvider class="phone-notification-provider" :dark="darkMode" safe-areas>
    <SkyNotification
      :opened="!!notification"
      :title="notification?.title"
      :subtitle="notification?.subtitle"
      :text="notification?.text"
      :title-right-text="notificationTime"
      :role="notification?.critical ? 'alert' : 'status'"
      class="phone-notification"
      :class="{ 'is-actionable': !!notification?.route }"
      @pointerdown="beginDismissGesture"
      @pointermove="moveDismissGesture"
      @pointerup="finishDismissGesture"
      @pointercancel="finishDismissGesture"
    >
      <template v-if="icon" #icon>
        <img :src="icon" alt="" class="phone-notification__icon" />
      </template>
      <button
        v-if="notification?.route"
        type="button"
        class="phone-notification__open"
        :aria-label="phone.t('Notifications.open')"
        @click.stop="openNotification"
        @keydown.esc.stop="emit('close')"
      ></button>
    </SkyNotification>
  </SkyProvider>
</template>
