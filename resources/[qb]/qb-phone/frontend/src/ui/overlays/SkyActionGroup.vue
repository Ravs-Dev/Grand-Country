<script setup lang="ts">
withDefaults(defineProps<{ component?: string; dividers?: boolean }>(), {
  component: 'div',
  dividers: true,
})
</script>

<template>
  <component
    :is="component"
    class="sky-action-group sky-glass-surface"
    :class="{ 'sky-action-group--dividers': dividers }"
  >
    <slot />
  </component>
</template>
