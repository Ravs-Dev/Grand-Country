<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    progress?: number
  }>(),
  {
    label: '',
    progress: 0,
  },
)

const normalizedProgress = computed(() =>
  Math.min(
    1,
    Math.max(0, Number.isFinite(props.progress) ? props.progress : 0),
  ),
)
const percentage = computed(() => Math.round(normalizedProgress.value * 100))
const remainingPercentage = computed(() => 100 - normalizedProgress.value * 100)
</script>

<template>
  <div
    v-bind="$attrs"
    class="sky-progress"
    role="progressbar"
    :aria-label="label || undefined"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="percentage"
  >
    <span
      class="sky-progress__value"
      :style="{ transform: `translateX(-${remainingPercentage}%)` }"
    />
  </div>
</template>
