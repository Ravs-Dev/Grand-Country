<script setup lang="ts">
import { SkyBlock, SkyBlockTitle, SkySpinner } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
</script>

<template>
  <SkyUiDemoPage title="Preloader">
    <SkyBlockTitle>Default</SkyBlockTitle>
    <SkyBlock class="preloader-single" inset strong>
      <SkySpinner label="Loading" />
    </SkyBlock>

    <SkyBlockTitle>Colors</SkyBlockTitle>
    <SkyBlock class="preloader-grid" inset strong>
      <SkySpinner class="sky-ui-demo-color-red" label="Red loader" />
      <SkySpinner class="sky-ui-demo-color-green" label="Green loader" />
      <SkySpinner class="sky-ui-demo-color-purple" label="Purple loader" />
      <SkySpinner class="sky-ui-demo-color-yellow" label="Yellow loader" />
    </SkyBlock>

    <SkyBlockTitle>Sizes</SkyBlockTitle>
    <SkyBlock class="preloader-grid preloader-grid--sizes" outline strong>
      <SkySpinner label="Small loader" :size="16" />
      <SkySpinner label="Medium loader" :size="32" />
      <SkySpinner label="Large loader" :size="48" />
      <SkySpinner label="Extra large loader" :size="64" />
    </SkyBlock>
  </SkyUiDemoPage>
</template>

<style scoped>
.preloader-single {
  text-align: center;
}

.preloader-grid {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
}

.preloader-grid--sizes {
  min-height: 96px;
}

.preloader-grid :deep(.sky-ui-demo-color-red) {
  color: #ff3b30;
}

.preloader-grid :deep(.sky-ui-demo-color-green) {
  color: #4cd964;
}

.preloader-grid :deep(.sky-ui-demo-color-purple) {
  color: #9c27b0;
}

.preloader-grid :deep(.sky-ui-demo-color-yellow) {
  color: #ffcc00;
}
</style>
