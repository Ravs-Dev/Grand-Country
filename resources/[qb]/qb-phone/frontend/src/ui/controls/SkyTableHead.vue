<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    sticky?: boolean
  }>(),
  {
    sticky: false,
  },
)
</script>

<template>
  <thead
    v-bind="$attrs"
    class="sky-table-head"
    :class="{ 'sky-table-head--sticky': sticky }"
  >
    <slot />
  </thead>
</template>
