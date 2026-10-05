<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    inset?: boolean
    strong?: boolean
  }>(),
  {
    inset: true,
    strong: true,
  },
)
</script>

<template>
  <ul
    v-bind="$attrs"
    class="sky-list-card"
    :class="{
      'sky-list-card--inset': inset,
      'sky-list-card--strong': strong,
    }"
  >
    <slot />
  </ul>
</template>
