<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    color?: string
  }>(),
  {
    ariaLabel: '',
    color: 'var(--sky-app-accent)',
  },
)

const iconStyle = computed<CSSProperties>(() => ({
  '--sky-settings-icon-color': props.color,
}))
</script>

<template>
  <span
    class="sky-settings-icon"
    :style="iconStyle"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    :aria-hidden="ariaLabel ? undefined : true"
  >
    <slot />
  </span>
</template>
