<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: string
    contentClass?: string
    contentWrap?: boolean
    contentWrapPadding?: string
    footer?: number | string
    footerDivider?: boolean
    header?: number | string
    headerDivider?: boolean
    outline?: boolean
    raised?: boolean
  }>(),
  {
    component: 'div',
    contentClass: '',
    contentWrap: true,
    contentWrapPadding: '',
    footer: undefined,
    footerDivider: false,
    header: undefined,
    headerDivider: false,
    outline: false,
    raised: false,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-card"
    :class="{
      'sky-card--outline': outline,
      'sky-card--raised': raised,
    }"
  >
    <div
      v-if="header !== undefined || $slots.header"
      class="sky-card__header"
      :class="{ 'sky-card__header--divider': headerDivider }"
    >
      <slot name="header">{{ header }}</slot>
    </div>
    <div
      v-if="contentWrap"
      class="sky-card__content"
      :class="[contentWrapPadding, contentClass]"
    >
      <slot />
    </div>
    <slot v-else />
    <div
      v-if="footer !== undefined || $slots.footer"
      class="sky-card__footer"
      :class="{ 'sky-card__footer--divider': footerDivider }"
    >
      <slot name="footer">{{ footer }}</slot>
    </div>
  </component>
</template>
