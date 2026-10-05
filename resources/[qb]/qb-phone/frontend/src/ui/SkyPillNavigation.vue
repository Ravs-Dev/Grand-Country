<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    align?: 'center' | 'end' | 'start'
    label: string
    layout?: 'compact' | 'full' | 'split'
  }>(),
  {
    align: 'center',
    layout: 'full',
  },
)
</script>

<template>
  <nav
    v-bind="$attrs"
    class="sky-pill-navigation"
    :class="[
      `sky-pill-navigation--${layout}`,
      `sky-pill-navigation--align-${align}`,
    ]"
    :aria-label="label"
  >
    <div class="sky-pill-navigation__inner">
      <div
        v-if="$slots.default"
        class="sky-pill-navigation__group sky-pill-navigation__group--primary"
      >
        <slot />
      </div>
      <div
        v-if="layout === 'split' && $slots.end"
        class="sky-pill-navigation__group sky-pill-navigation__group--end"
      >
        <slot name="end" />
      </div>
    </div>
  </nav>
</template>
