<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBlock,
  SkyBlockTitle,
  SkyProgress,
  SkySegmented,
  SkySegmentedButton,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const progress = ref(0.1)
const values = [0.1, 0.3, 0.5, 1]
</script>

<template>
  <SkyUiDemoPage title="Progressbar">
    <SkyBlockTitle>Determinate Progress Bar</SkyBlockTitle>
    <SkyBlock class="progress-examples" inset strong>
      <SkyProgress
        class="progress-examples__selected"
        label="Selected progress"
        :progress="progress"
      />
      <SkySegmented
        :active-index="values.indexOf(progress)"
        :item-count="4"
        rounded
        strong
      >
        <SkySegmentedButton
          v-for="value in values"
          :key="value"
          :active="progress === value"
          @click="progress = value"
        >
          {{ value * 100 }}%
        </SkySegmentedButton>
      </SkySegmented>
    </SkyBlock>

    <SkyBlockTitle>Colors</SkyBlockTitle>
    <SkyBlock class="progress-colors" inset strong>
      <SkyProgress
        class="sky-ui-demo-color-red"
        label="Red progress"
        :progress="0.25"
      />
      <SkyProgress
        class="sky-ui-demo-color-green"
        label="Green progress"
        :progress="0.5"
      />
      <SkyProgress
        class="sky-ui-demo-color-yellow"
        label="Yellow progress"
        :progress="0.75"
      />
      <SkyProgress
        class="sky-ui-demo-color-purple"
        label="Purple progress"
        :progress="1"
      />
    </SkyBlock>
  </SkyUiDemoPage>
</template>

<style scoped>
.progress-examples__selected {
  margin-block: var(--sky-space-4, 16px);
}

.progress-colors {
  display: grid;
  gap: var(--sky-space-4, 16px);
}
</style>
