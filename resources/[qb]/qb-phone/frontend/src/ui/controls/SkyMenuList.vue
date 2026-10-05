<script setup lang="ts">
import SkyList from './SkyList.vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    ariaLabel?: string
    component?: 'div' | 'ol' | 'ul'
    density?: 'compact' | 'regular'
    dividers?: boolean
    flush?: boolean
    inset?: boolean
    nested?: boolean
    outline?: boolean
    strong?: boolean
  }>(),
  {
    ariaLabel: '',
    component: 'ul',
    density: 'regular',
    dividers: true,
    flush: false,
    inset: false,
    nested: false,
    outline: false,
    strong: false,
  },
)
</script>

<template>
  <SkyList
    v-bind="$attrs"
    class="sky-menu-list"
    :aria-label="ariaLabel || undefined"
    :component="component"
    :density="density"
    :dividers="dividers"
    :flush="flush"
    :inset="inset"
    menu
    :nested="nested"
    :outline="outline"
    :strong="strong"
  >
    <slot />
  </SkyList>
</template>
