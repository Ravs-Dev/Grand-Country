<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'

import { skyListContextKey } from './list-context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    after?: number | string
    ariaLabel?: string
    active?: boolean
    chevron?: boolean
    component?: 'div' | 'li'
    contacts?: boolean
    contentClass?: string
    disabled?: boolean
    dividers?: boolean
    footer?: string
    groupTitle?: boolean
    header?: string
    href?: boolean | string
    innerClass?: string
    label?: boolean
    link?: boolean
    linkComponent?: 'a' | 'button'
    linkProps?: Record<string, unknown>
    media?: number | string
    mediaClass?: string
    menu?: boolean
    strongTitle?: boolean | 'auto'
    subtitle?: string
    target?: string
    text?: string
    title?: string
    titleFontSizeIos?: string
    titleWrapClass?: string
  }>(),
  {
    after: undefined,
    ariaLabel: '',
    active: false,
    chevron: true,
    component: 'li',
    contacts: false,
    contentClass: '',
    disabled: false,
    dividers: undefined,
    footer: '',
    groupTitle: false,
    header: '',
    href: undefined,
    innerClass: '',
    label: false,
    link: false,
    linkComponent: 'a',
    linkProps: () => ({}),
    media: undefined,
    mediaClass: '',
    menu: false,
    strongTitle: 'auto',
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

const slots = useSlots()
const hasActions = computed(() => Boolean(slots.actions))
const listContext = inject(skyListContextKey, undefined)
const effectiveDividers = computed(
  () => props.dividers ?? listContext?.value.dividers ?? false,
)
const isNested = computed(() => listContext?.value.nested ?? false)
const resolvedStrongTitle = computed(
  () =>
    props.strongTitle === true ||
    (props.strongTitle === 'auto' &&
      Boolean(props.title || slots.title) &&
      Boolean(props.subtitle || slots.subtitle || props.text || slots.text)),
)
const hasHref = computed(
  () => typeof props.href === 'string' || props.href === true,
)
const isLink = computed(() => props.link || hasHref.value)
const effectiveLinkComponent = computed(() => props.linkComponent ?? 'a')

const rowComponent = computed(() => {
  if (isLink.value) return effectiveLinkComponent.value
  if (props.label) return 'label'
  return 'div'
})

const rowProps = computed<Record<string, unknown>>(() => {
  if (!isLink.value) return {}

  if (effectiveLinkComponent.value === 'a') {
    const href =
      typeof props.href === 'string'
        ? props.href
        : props.href === true
          ? ''
          : undefined

    return {
      ...props.linkProps,
      'aria-disabled': props.disabled || undefined,
      href: props.disabled ? undefined : href,
      target: props.target,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  return {
    ...props.linkProps,
    disabled: props.disabled,
    type: props.linkProps.type ?? 'button',
  }
})

function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>

<template>
  <component
    :is="component"
    v-if="groupTitle"
    v-bind="$attrs"
    class="sky-list-item sky-list-item--group-title"
    :class="{
      'sky-list-item--contacts': contacts,
      'sky-list-item--dividers': effectiveDividers,
    }"
    :role="component === 'div' ? 'listitem' : undefined"
  >
    <slot name="title">{{ title }}</slot>
    <slot />
  </component>
  <component
    :is="component"
    v-else
    v-bind="$attrs"
    class="sky-list-item"
    :class="{
      'sky-list-item--disabled': disabled,
      'sky-list-item--active': active,
      'sky-list-item--contacts': contacts,
      'sky-list-item--dividers': effectiveDividers,
      'sky-list-item--with-actions': hasActions,
      'sky-list-item--no-dividers': !effectiveDividers,
      'sky-list-item--label': label,
      'sky-list-item--link': isLink,
      'sky-list-item--menu': menu,
      'sky-list-item--nested': isNested,
    }"
    :role="component === 'div' ? 'listitem' : undefined"
  >
    <component
      :is="rowComponent"
      v-bind="rowProps"
      class="sky-list-item__row"
      :class="contentClass"
      :aria-label="ariaLabel || undefined"
      @click="handleClick"
    >
      <span
        v-if="media !== undefined || $slots.media"
        class="sky-list-item__media"
        :class="mediaClass"
      >
        <slot name="media">{{ media }}</slot>
      </span>

      <span class="sky-list-item__content" :class="innerClass">
        <small v-if="header || $slots.header" class="sky-list-item__header">
          <slot name="header">{{ header }}</slot>
        </small>
        <span
          v-if="
            title ||
            $slots.title ||
            after !== undefined ||
            $slots.after ||
            (isLink && chevron && !menu)
          "
          class="sky-list-item__title-wrap"
          :class="titleWrapClass"
        >
          <div
            v-if="title || $slots.title"
            class="sky-list-item__title"
            :class="[
              titleFontSizeIos,
              { 'sky-list-item__title--strong': resolvedStrongTitle },
            ]"
          >
            <slot name="title">{{ title }}</slot>
          </div>
          <span
            v-if="after !== undefined || $slots.after"
            class="sky-list-item__after"
          >
            <slot name="after">{{ after }}</slot>
          </span>
          <span
            v-if="isLink && chevron && !menu"
            class="sky-list-item__chevron"
            aria-hidden="true"
          />
        </span>
        <span
          v-if="subtitle || $slots.subtitle"
          class="sky-list-item__subtitle"
        >
          <slot name="subtitle">{{ subtitle }}</slot>
        </span>
        <span v-if="text || $slots.text" class="sky-list-item__text">
          <slot name="text">{{ text }}</slot>
        </span>
        <small v-if="footer || $slots.footer" class="sky-list-item__footer">
          <slot name="footer">{{ footer }}</slot>
        </small>
        <slot name="inner" />
      </span>
      <slot name="content" />
    </component>
    <div v-if="hasActions" class="sky-list-item__actions">
      <slot name="actions" />
    </div>
    <slot />
  </component>
</template>
