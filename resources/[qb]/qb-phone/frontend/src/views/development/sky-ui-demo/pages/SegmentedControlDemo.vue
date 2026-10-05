<script setup lang="ts">
import { ref } from 'vue'

import { SkyBlock, SkyBlockTitle, SkySegmented, SkySegmentedButton } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

interface SegmentedExample {
  outline: boolean
  raised: boolean
  strong: boolean
  title: string
}

const activeSegmented = ref(1)
const sections: readonly SegmentedExample[] = [
  {
    outline: false,
    raised: false,
    strong: false,
    title: 'Default Segmented',
  },
  {
    outline: false,
    raised: true,
    strong: false,
    title: 'Raised Segmented',
  },
  { outline: true, raised: false, strong: false, title: 'Outline' },
  {
    outline: false,
    raised: false,
    strong: true,
    title: 'Strong Segmented',
  },
]
</script>

<template>
  <SkyUiDemoPage title="Segmented Control">
    <template v-for="section in sections" :key="section.title">
      <SkyBlockTitle>{{ section.title }}</SkyBlockTitle>
      <SkyBlock class="segmented-control-demo__surface" inset strong>
        <SkySegmented
          :active-index="activeSegmented - 1"
          :aria-label="section.title"
          :item-count="3"
          :navigation="false"
          :outline="section.outline"
          :raised="section.raised"
          :rounded="false"
          :strong="section.strong"
        >
          <SkySegmentedButton
            v-for="index in 3"
            :key="index"
            :active="activeSegmented === index"
            @click="activeSegmented = index"
          >
            Button
          </SkySegmentedButton>
        </SkySegmented>
        <SkySegmented
          :active-index="activeSegmented - 1"
          :aria-label="`${section.title}, rounded`"
          :item-count="3"
          :navigation="false"
          :outline="section.outline"
          :raised="section.raised"
          :rounded="true"
          :strong="section.strong"
        >
          <SkySegmentedButton
            v-for="index in 3"
            :key="index"
            :active="activeSegmented === index"
            @click="activeSegmented = index"
          >
            Button
          </SkySegmentedButton>
        </SkySegmented>
      </SkyBlock>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.segmented-control-demo__surface {
  display: grid;
  gap: var(--sky-space-4);
}
</style>
