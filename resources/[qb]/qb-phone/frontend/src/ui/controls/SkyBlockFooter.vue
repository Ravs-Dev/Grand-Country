<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: 'div' | 'footer' | 'p'
    inset?: boolean
  }>(),
  {
    component: 'div',
    inset: false,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-block-footer"
    :class="{ 'sky-block-footer--inset': inset }"
  >
    <slot />
  </component>
</template>
