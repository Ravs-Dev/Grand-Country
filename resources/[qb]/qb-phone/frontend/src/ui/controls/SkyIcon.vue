<script setup lang="ts">
import { computed, type CSSProperties, useSlots } from 'vue'

import SkyBadge from './SkyBadge.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    badge?: number | string
    badgeColors?: {
      bg?: string
      text?: string
    }
    component?: string
    label?: string
    size?: number | string
  }>(),
  {
    badge: undefined,
    badgeColors: undefined,
    component: 'i',
    label: '',
    size: undefined,
  },
)

const slots = useSlots()

const iconStyle = computed<CSSProperties | undefined>(() => {
  if (props.size === undefined) return undefined
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { height: size, width: size }
})

const badgeStyle = computed<CSSProperties | undefined>(() => {
  if (!props.badgeColors?.bg && !props.badgeColors?.text) return undefined
  return {
    background: props.badgeColors.bg,
    color: props.badgeColors.text,
  }
})

const hasBadge = computed(
  () =>
    (props.badge !== undefined && props.badge !== null) || Boolean(slots.badge),
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-icon"
    :style="iconStyle"
    :aria-hidden="label ? undefined : true"
    :aria-label="label || undefined"
    :role="label ? 'img' : undefined"
  >
    <slot />
    <SkyBadge v-if="hasBadge" class="sky-icon__badge" small :style="badgeStyle">
      {{ badge }}<slot name="badge" />
    </SkyBadge>
  </component>
</template>

<style scoped>
.sky-icon {
  position: relative;
  font-style: normal;
}

.sky-icon__badge {
  position: absolute;
  inset-block-start: -2px;
  inset-inline-end: -6px;
}
</style>
