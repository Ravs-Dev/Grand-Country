<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

import { useSkyPageScroll } from './page-scroll-context'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    as?: string
    padded?: boolean
    withTabbar?: boolean
  }>(),
  {
    as: 'section',
    padded: false,
    withTabbar: false,
  },
)

const root = ref<HTMLElement | null>(null)
const pageScroll = useSkyPageScroll()
let unregister: (() => void) | undefined

watch(
  root,
  (element) => {
    unregister?.()
    unregister = element ? pageScroll?.register(element) : undefined
  },
  { flush: 'post' },
)

onBeforeUnmount(() => unregister?.())
</script>

<template>
  <component
    :is="as"
    ref="root"
    v-bind="$attrs"
    class="sky-scroll-area"
    :class="{
      'sky-scroll-area--padded': padded,
      'sky-scroll-area--tabbar': withTabbar,
    }"
  >
    <slot />
  </component>
</template>
