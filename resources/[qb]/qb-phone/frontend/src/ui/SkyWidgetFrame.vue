<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    showLabel?: boolean
    size: 'small' | 'medium' | 'large'
  }>(),
  {
    showLabel: true,
  },
)
</script>

<template>
  <div
    class="sky-widget-frame"
    :class="[
      `sky-widget-frame--${size}`,
      { 'sky-widget-frame--unlabelled': !showLabel },
    ]"
  >
    <div class="sky-widget-frame__surface">
      <slot />
    </div>
    <span v-if="showLabel" class="sky-widget-frame__label" aria-hidden="true">
      {{ label }}
    </span>
  </div>
</template>
