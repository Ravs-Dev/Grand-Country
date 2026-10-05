<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    header?: boolean
    selected?: boolean
  }>(),
  {
    header: false,
    selected: false,
  },
)
</script>

<template>
  <tr
    v-bind="$attrs"
    class="sky-table-row"
    :class="{
      'sky-table-row--header': header,
      'sky-table-row--selected': selected,
    }"
    :aria-selected="selected || undefined"
  >
    <slot />
  </tr>
</template>
