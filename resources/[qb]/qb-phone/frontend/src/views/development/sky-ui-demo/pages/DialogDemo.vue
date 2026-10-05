<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBlock,
  SkyButton,
  SkyDialog,
  SkyDialogButton,
  SkyList,
  SkyListItem,
  SkyRadio,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const basicOpened = ref(false)
const alertOpened = ref(false)
const confirmOpened = ref(false)
const listOpened = ref(false)
const radioValue = ref('batman')

function handleHeroRowClick(event: MouseEvent, value: string): void {
  const target = event.target
  if (target instanceof Element && target.closest('.sky-radio')) return
  radioValue.value = value
}
</script>

<template>
  <SkyUiDemoPage title="Dialog">
    <SkyBlock inset strong>
      Dialog is a type of modal window that appears in front of app content to
      provide critical information, or prompt for a decision to be made.
    </SkyBlock>

    <SkyBlock class="dialog-demo__buttons" inset strong>
      <SkyButton rounded @click="basicOpened = true">Basic</SkyButton>
      <SkyButton rounded @click="alertOpened = true">Alert</SkyButton>
      <SkyButton rounded @click="confirmOpened = true">Confirm</SkyButton>
      <SkyButton rounded @click="listOpened = true">List</SkyButton>
    </SkyBlock>

    <template #fixed>
      <SkyDialog
        :opened="basicOpened"
        @backdropclick="basicOpened = false"
        @escape="basicOpened = false"
      >
        <template #title>Dialog Title</template>
        Dialog is a type of modal window that appears in front of app content to
        provide critical information, or prompt for a decision to be made.
        <template #buttons>
          <SkyDialogButton @click="basicOpened = false">
            Action 2
          </SkyDialogButton>
          <SkyDialogButton strong @click="basicOpened = false">
            Action 1
          </SkyDialogButton>
        </template>
      </SkyDialog>

      <SkyDialog
        :opened="alertOpened"
        role="alertdialog"
        @backdropclick="alertOpened = false"
        @escape="alertOpened = false"
      >
        <template #title>Konsta UI</template>
        Hello world!
        <template #buttons>
          <SkyDialogButton strong @click="alertOpened = false">
            Ok
          </SkyDialogButton>
        </template>
      </SkyDialog>

      <SkyDialog
        :opened="confirmOpened"
        role="alertdialog"
        @backdropclick="confirmOpened = false"
        @escape="confirmOpened = false"
      >
        <template #title>Konsta UI</template>
        All good today?
        <template #buttons>
          <SkyDialogButton @click="confirmOpened = false">No</SkyDialogButton>
          <SkyDialogButton strong @click="confirmOpened = false">
            Yes
          </SkyDialogButton>
        </template>
      </SkyDialog>

      <SkyDialog
        :opened="listOpened"
        @backdropclick="listOpened = false"
        @escape="listOpened = false"
      >
        <template #title>Your super hero</template>
        <SkyList class="dialog-demo__list" nested>
          <SkyListItem
            v-for="hero in [
              { label: 'Batman', value: 'batman' },
              { label: 'Spider-man', value: 'spiderman' },
              { label: 'Hulk', value: 'hulk' },
            ]"
            :key="hero.value"
            :title="hero.label"
            @click="handleHeroRowClick($event, hero.value)"
          >
            <template #after>
              <SkyRadio
                v-model="radioValue"
                :aria-label="hero.label"
                name="super-hero"
                :value="hero.value"
              />
            </template>
          </SkyListItem>
        </SkyList>
        <template #buttons>
          <SkyDialogButton strong @click="listOpened = false">
            Confirm
          </SkyDialogButton>
        </template>
      </SkyDialog>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.dialog-demo__buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sky-space-3);
}

.dialog-demo__list {
  margin: 0 calc(var(--sky-space-4) * -1) calc(var(--sky-space-4) * -1);
}

.dialog-demo__list :deep(.sky-list-item__row) {
  cursor: pointer;
}
</style>
