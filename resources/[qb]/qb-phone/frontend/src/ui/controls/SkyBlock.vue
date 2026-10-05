<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: 'article' | 'aside' | 'div' | 'section'
    inset?: boolean
    nested?: boolean
    outline?: boolean
    strong?: boolean
  }>(),
  {
    component: 'div',
    inset: false,
    nested: false,
    outline: false,
    strong: false,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-block"
    :class="{
      'sky-block--inset': inset,
      'sky-block--nested': nested,
      'sky-block--outline': outline,
      'sky-block--strong': strong,
    }"
  >
    <slot />
  </component>
</template>
