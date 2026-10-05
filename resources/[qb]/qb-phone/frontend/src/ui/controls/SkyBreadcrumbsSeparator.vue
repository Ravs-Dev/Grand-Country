<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: 'span'
  }>(),
  {
    component: 'span',
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-breadcrumbs-separator"
    aria-hidden="true"
  >
    <span class="sky-breadcrumbs-separator__icon" />
    <slot />
  </component>
</template>
