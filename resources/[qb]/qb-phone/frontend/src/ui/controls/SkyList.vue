<script setup lang="ts">
import { computed, provide } from 'vue'

import { skyListContextKey } from './list-context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    component?: 'div' | 'ol' | 'ul'
    density?: 'compact' | 'regular'
    dividers?: boolean
    flush?: boolean
    inset?: boolean
    menu?: boolean
    nested?: boolean
    outline?: boolean
    strong?: boolean
  }>(),
  {
    component: 'div',
    density: 'regular',
    dividers: true,
    flush: false,
    inset: false,
    menu: false,
    nested: false,
    outline: false,
    strong: false,
  },
)

provide(
  skyListContextKey,
  computed(() => ({ dividers: props.dividers, nested: props.nested })),
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-list"
    :class="{
      'sky-list--inset': inset,
      'sky-list--dividers': dividers,
      'sky-list--menu': menu,
      'sky-list--nested': nested,
      'sky-list--outline': outline,
      'sky-list--strong': strong,
      'sky-list--compact': density === 'compact',
      'sky-list--flush': flush,
    }"
  >
    <ul class="sky-list__items">
      <slot />
    </ul>
  </component>
</template>
