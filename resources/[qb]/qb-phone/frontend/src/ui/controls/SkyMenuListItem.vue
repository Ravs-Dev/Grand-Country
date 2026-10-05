<script setup lang="ts">
import { computed } from 'vue'

import SkyListItem from './SkyListItem.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    active?: boolean
    after?: number | string
    ariaLabel?: string
    contentClass?: string
    disabled?: boolean
    footer?: string
    header?: string
    href?: boolean | string
    innerClass?: string
    linkComponent?: 'a' | 'button'
    linkProps?: Record<string, unknown>
    media?: number | string
    mediaClass?: string
    subtitle?: string
    target?: string
    text?: string
    title?: string
    titleFontSizeIos?: string
    titleWrapClass?: string
  }>(),
  {
    active: false,
    after: undefined,
    ariaLabel: '',
    contentClass: '',
    disabled: false,
    footer: '',
    header: '',
    href: undefined,
    innerClass: '',
    linkComponent: undefined,
    linkProps: () => ({}),
    media: undefined,
    mediaClass: '',
    subtitle: '',
    target: undefined,
    text: '',
    title: '',
    titleFontSizeIos: '',
    titleWrapClass: '',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const actionComponent = computed(
  () =>
    props.linkComponent ??
    (typeof props.href === 'string' || props.href === true ? 'a' : 'button'),
)
const actionProps = computed<Record<string, unknown>>(() => ({
  ...props.linkProps,
  'aria-current': props.active ? 'page' : undefined,
}))
</script>

<template>
  <SkyListItem
    v-bind="$attrs"
    class="sky-menu-list-item"
    :class="{ 'sky-menu-list-item--active': active }"
    :after="after"
    :active="active"
    :aria-label="ariaLabel"
    :content-class="contentClass"
    :disabled="disabled"
    :footer="footer"
    :header="header"
    :href="href"
    :inner-class="innerClass"
    link
    :link-component="actionComponent"
    :link-props="actionProps"
    :media="media"
    :media-class="mediaClass"
    menu
    :subtitle="subtitle"
    :target="target"
    :text="text"
    :title="title"
    :title-font-size-ios="titleFontSizeIos"
    :title-wrap-class="titleWrapClass"
    @click="emit('click', $event)"
  >
    <slot />
    <template v-if="$slots.media" #media>
      <slot name="media" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="$slots.subtitle" #subtitle>
      <slot name="subtitle" />
    </template>
    <template v-if="$slots.text" #text>
      <slot name="text" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.after" #after>
      <slot name="after" />
    </template>
    <template v-if="$slots.inner" #inner>
      <slot name="inner" />
    </template>
    <template v-if="$slots.content" #content>
      <slot name="content" />
    </template>
  </SkyListItem>
</template>
