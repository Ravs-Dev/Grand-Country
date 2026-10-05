<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    component?: 'div' | 'li'
    disabled?: boolean
    href?: string
    linkComponent?: 'a' | 'button'
    linkProps?: Record<string, unknown>
    target?: string
    type?: 'button' | 'reset' | 'submit'
    value?: number | string
    variant?: 'danger' | 'default'
  }>(),
  {
    ariaLabel: '',
    component: 'li',
    disabled: false,
    href: undefined,
    linkComponent: undefined,
    linkProps: () => ({}),
    target: undefined,
    type: 'button',
    value: undefined,
    variant: 'default',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const actionComponent = computed(
  () => props.linkComponent ?? (props.href !== undefined ? 'a' : 'button'),
)
const actionProps = computed<Record<string, unknown>>(() => {
  if (actionComponent.value === 'a') {
    return {
      ...props.linkProps,
      'aria-disabled': props.disabled || undefined,
      'aria-label': props.ariaLabel || undefined,
      href: props.disabled ? undefined : props.href,
      tabindex: props.disabled ? -1 : undefined,
      target: props.target,
    }
  }

  return {
    ...props.linkProps,
    'aria-label': props.ariaLabel || undefined,
    disabled: props.disabled,
    type: props.type,
    value: props.value,
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
    v-bind="$attrs"
    class="sky-list-button"
    :class="[
      `sky-list-button--${variant}`,
      { 'sky-list-button--disabled': disabled },
    ]"
  >
    <component
      :is="actionComponent"
      v-bind="actionProps"
      class="sky-list-button__action"
      @click="handleClick"
    >
      <slot />
    </component>
  </component>
</template>
