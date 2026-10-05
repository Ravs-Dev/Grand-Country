<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'

import { provideSkyPageScroll } from './page-scroll-context'
import { useSkyTheme } from './theme'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    accent?: string
    accentSoft?: string
    component?: string
    dark?: boolean
    label?: string
  }>(),
  {
    accent: '',
    accentSoft: '',
    component: 'main',
    dark: undefined,
    label: '',
  },
)

const attrs = useAttrs()
const theme = useSkyTheme()
const pageScroll = provideSkyPageScroll()
const isDark = computed(() => props.dark ?? theme?.dark.value ?? false)
const effectiveAccent = computed(
  () => props.accent || theme?.accent.value || '',
)
const effectiveAccentSoft = computed(
  () => props.accentSoft || theme?.accentSoft.value || '',
)
const accessibleLabel = computed(() => {
  if (props.label) return props.label
  const attribute = attrs['aria-label']
  return typeof attribute === 'string' && attribute ? attribute : undefined
})

const accentStyle = computed(() =>
  effectiveAccent.value || effectiveAccentSoft.value
    ? {
        ...(effectiveAccent.value
          ? { '--sky-app-accent': effectiveAccent.value }
          : {}),
        ...(effectiveAccentSoft.value
          ? { '--sky-app-accent-soft': effectiveAccentSoft.value }
          : {}),
      }
    : undefined,
)
const pageStyle = computed<CSSProperties>(
  () =>
    ({
      ...(accentStyle.value ?? {}),
      '--sky-page-collapse-offset': `${pageScroll.collapseOffset.value}px`,
    }) as CSSProperties,
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-app-page"
    :class="{ 'sky-app-page--dark': isDark }"
    :style="pageStyle"
    :aria-label="accessibleLabel"
  >
    <div class="sky-app-page__backdrop" aria-hidden="true"></div>
    <slot />
  </component>
</template>
