<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    ariaLabel?: string
    component?: 'div' | 'nav' | 'span'
  }>(),
  {
    ariaLabel: '',
    component: 'nav',
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-breadcrumbs"
    :aria-label="ariaLabel || undefined"
    :role="component === 'nav' ? undefined : 'navigation'"
  >
    <slot />
  </component>
</template>
