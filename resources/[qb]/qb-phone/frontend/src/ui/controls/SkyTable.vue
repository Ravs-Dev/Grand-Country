<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    ariaLabel?: string
    caption?: string
    compact?: boolean
    striped?: boolean
  }>(),
  {
    ariaLabel: '',
    caption: '',
    compact: false,
    striped: false,
  },
)
</script>

<template>
  <table
    v-bind="$attrs"
    class="sky-table"
    :class="{
      'sky-table--compact': compact,
      'sky-table--striped': striped,
    }"
    :aria-label="ariaLabel || undefined"
  >
    <caption v-if="caption || $slots.caption" class="sky-table__caption">
      <slot name="caption">{{ caption }}</slot>
    </caption>
    <slot />
  </table>
</template>
