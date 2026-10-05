<script setup lang="ts">
import { ref } from 'vue'

import { SkyList, SkyListItem, SkyToggle } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const values = ref([true, true, true, true])
const colorClasses = [
  '',
  'sky-ui-demo-color-red',
  'sky-ui-demo-color-green',
  'sky-ui-demo-color-yellow',
]
</script>

<template>
  <SkyUiDemoPage title="Toggle">
    <SkyList inset strong>
      <SkyListItem
        v-for="(_, index) in values"
        :key="index"
        label
        :title="`Item ${index + 1}`"
      >
        <template #after>
          <SkyToggle
            v-model="values[index]"
            :aria-label="`Item ${index + 1}`"
            :class="colorClasses[index]"
            component="div"
            :name="`demo-toggle-${index + 1}`"
          />
        </template>
      </SkyListItem>
    </SkyList>
  </SkyUiDemoPage>
</template>
