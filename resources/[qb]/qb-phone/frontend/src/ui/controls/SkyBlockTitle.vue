<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: 'div' | 'h2' | 'h3'
    large?: boolean
    medium?: boolean
  }>(),
  {
    component: 'h2',
    large: false,
    medium: false,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-block-title"
    :class="{
      'sky-block-title--large': large,
      'sky-block-title--medium': medium && !large,
    }"
  >
    <slot />
  </component>
</template>
