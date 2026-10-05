<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBlockHeader,
  SkyBlockTitle,
  SkyList,
  SkyListItem,
  SkyRange,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const volume = ref(50)
const price = ref(150)
const red = ref(100)
const green = ref(50)
const blue = ref(75)
</script>

<template>
  <SkyUiDemoPage title="Range Slider">
    <SkyBlockTitle>Volume: {{ volume }}</SkyBlockTitle>
    <SkyBlockHeader>From 0 to 100 with step 10</SkyBlockHeader>
    <SkyList inset strong>
      <SkyListItem>
        <template #inner>
          <span class="range-slider-demo__row">
            <span>0</span>
            <SkyRange
              v-model="volume"
              aria-label="Volume"
              :max="100"
              :min="0"
              :step="10"
            />
            <span>100</span>
          </span>
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlockTitle>Price: ${{ price }}</SkyBlockTitle>
    <SkyBlockHeader>From 0 to 1000 with step 1</SkyBlockHeader>
    <SkyList inset strong>
      <SkyListItem>
        <template #inner>
          <span class="range-slider-demo__row">
            <span>$0</span>
            <SkyRange
              v-model="price"
              aria-label="Price"
              :max="1000"
              :min="0"
              :step="1"
            />
            <span>$1000</span>
          </span>
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlockTitle>
      Color: rgb({{ red }}, {{ green }}, {{ blue }})
    </SkyBlockTitle>
    <SkyList inset strong>
      <SkyListItem>
        <template #inner>
          <SkyRange
            v-model="red"
            aria-label="Red"
            class="sky-ui-demo-color-red"
            :max="255"
            :min="0"
            :step="1"
          />
        </template>
      </SkyListItem>
      <SkyListItem>
        <template #inner>
          <SkyRange
            v-model="green"
            aria-label="Green"
            class="sky-ui-demo-color-green"
            :max="255"
            :min="0"
            :step="1"
          />
        </template>
      </SkyListItem>
      <SkyListItem>
        <template #inner>
          <SkyRange
            v-model="blue"
            aria-label="Blue"
            class="range-slider-demo__blue"
            :max="255"
            :min="0"
            :step="1"
          />
        </template>
      </SkyListItem>
    </SkyList>
  </SkyUiDemoPage>
</template>

<style scoped>
.range-slider-demo__row {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--sky-space-4);
}

.range-slider-demo__row .sky-range {
  min-width: 0;
  flex: 1;
}

.range-slider-demo__blue {
  --sky-app-accent: #007aff;
  --sky-app-accent-soft: rgba(0, 122, 255, 0.16);
}
</style>
