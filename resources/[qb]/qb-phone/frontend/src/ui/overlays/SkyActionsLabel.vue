<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: 'div' | 'p'
    dividers?: boolean
  }>(),
  {
    component: 'div',
    dividers: true,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-actions-label"
    :class="{ 'sky-actions-label--dividers': dividers }"
  >
    <slot />
  </component>
</template>
