<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    ariaLabel?: string
    bgClass?: string
    component?: 'div' | 'footer' | 'header' | 'nav'
    innerClass?: string
    outline?: boolean
    tabbar?: boolean
    tabbarIcons?: boolean
    tabbarLabels?: boolean
    top?: boolean
  }>(),
  {
    ariaLabel: '',
    bgClass: '',
    component: 'div',
    innerClass: '',
    outline: false,
    tabbar: false,
    tabbarIcons: false,
    tabbarLabels: false,
    top: false,
  },
)
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-toolbar"
    :class="{
      'sky-toolbar--outline': outline,
      'sky-toolbar--tabbar': tabbar,
      'sky-toolbar--tabbar-icons': tabbarIcons,
      'sky-toolbar--tabbar-labels': tabbarLabels,
      'sky-toolbar--top': top,
    }"
    :aria-label="ariaLabel || undefined"
    :aria-orientation="tabbar ? undefined : 'horizontal'"
    :role="tabbar ? 'tablist' : 'toolbar'"
  >
    <span class="sky-toolbar__blur" aria-hidden="true" />
    <span class="sky-toolbar__background" :class="bgClass" aria-hidden="true" />
    <div class="sky-toolbar__inner" :class="innerClass">
      <slot />
    </div>
  </component>
</template>
