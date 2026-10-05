<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'

import {
  SkyBlock,
  SkyButton,
  SkyDialog,
  SkyDialogButton,
  SkyNotification,
} from '@/ui'

import demoIcon from '../assets/demo-icon.png'
import SkyUiDemoPage from '../SkyUiDemoPage.vue'

type NotificationId =
  | 'notificationCallbackOnClose'
  | 'notificationCloseOnClick'
  | 'notificationFull'
  | 'notificationWithButton'

const opened = reactive<Record<NotificationId, boolean>>({
  notificationCallbackOnClose: false,
  notificationCloseOnClick: false,
  notificationFull: false,
  notificationWithButton: false,
})
const alertOpened = ref(false)
let autoCloseTimer: number | null = null

function clearAutoCloseTimer(): void {
  if (autoCloseTimer === null) return
  window.clearTimeout(autoCloseTimer)
  autoCloseTimer = null
}

function closeAllNotifications(): void {
  opened.notificationCallbackOnClose = false
  opened.notificationCloseOnClick = false
  opened.notificationFull = false
  opened.notificationWithButton = false
}

function openNotification(id: NotificationId): void {
  clearAutoCloseTimer()
  closeAllNotifications()
  opened[id] = true

  if (id === 'notificationFull') {
    autoCloseTimer = window.setTimeout(() => {
      opened.notificationFull = false
      autoCloseTimer = null
    }, 3000)
  }
}

function closeWithCallback(): void {
  opened.notificationCallbackOnClose = false
  alertOpened.value = true
}

onBeforeUnmount(clearAutoCloseTimer)
</script>

<template>
  <SkyUiDemoPage title="Notification">
    <SkyBlock
      class="sky-ui-demo-stack sky-ui-demo-notification__stack"
      inset
      strong
    >
      <p class="sky-ui-demo-copy">
        Konsta UI comes with simple Notifications component that allows you to
        show some useful messages to user and request basic actions.
      </p>
      <SkyButton rounded @click="openNotification('notificationFull')">
        Full layout notification
      </SkyButton>
      <SkyButton rounded @click="openNotification('notificationWithButton')">
        With Close Button
      </SkyButton>
      <SkyButton rounded @click="openNotification('notificationCloseOnClick')">
        Click to Close
      </SkyButton>
      <SkyButton
        rounded
        @click="openNotification('notificationCallbackOnClose')"
      >
        Callback on Close
      </SkyButton>
    </SkyBlock>

    <template #fixed>
      <SkyNotification
        :opened="opened.notificationFull"
        role="alert"
        subtitle="This is a subtitle"
        text="This is a simple notification message"
        title="Konsta UI"
        title-right-text="now"
      >
        <template #icon>
          <img class="sky-ui-demo-notification__icon" :src="demoIcon" alt="" />
        </template>
      </SkyNotification>

      <SkyNotification
        close-label="Close notification"
        :opened="opened.notificationWithButton"
        subtitle="Notification with close button"
        text="Click (x) button to close me"
        title="Konsta UI"
        @click="opened.notificationWithButton = false"
        @close="opened.notificationWithButton = false"
      >
        <template #icon>
          <img class="sky-ui-demo-notification__icon" :src="demoIcon" alt="" />
        </template>
        <template #button />
      </SkyNotification>

      <SkyNotification
        :opened="opened.notificationCloseOnClick"
        subtitle="Notification with close on click"
        text="Click me to close"
        title="Konsta UI"
        title-right-text="now"
        @click="opened.notificationCloseOnClick = false"
      >
        <template #icon>
          <img class="sky-ui-demo-notification__icon" :src="demoIcon" alt="" />
        </template>
      </SkyNotification>

      <SkyNotification
        :opened="opened.notificationCallbackOnClose"
        subtitle="Notification with close on click"
        text="Click me to close"
        title="Konsta UI"
        title-right-text="now"
        @click="closeWithCallback"
      >
        <template #icon>
          <img class="sky-ui-demo-notification__icon" :src="demoIcon" alt="" />
        </template>
      </SkyNotification>

      <SkyDialog
        content="Notification closed"
        :opened="alertOpened"
        title="Konsta UI"
        @backdropclick="alertOpened = false"
        @escape="alertOpened = false"
      >
        <template #buttons>
          <SkyDialogButton @click="alertOpened = false">Ok</SkyDialogButton>
        </template>
      </SkyDialog>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.sky-ui-demo-notification__stack {
  gap: var(--sky-space-4);
}

.sky-ui-demo-notification__icon {
  width: 28px;
  height: 28px;
  display: block;
}
</style>
