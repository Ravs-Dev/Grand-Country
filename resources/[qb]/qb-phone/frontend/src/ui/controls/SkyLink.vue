<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    component?: 'a' | 'button'
    disabled?: boolean
    href?: string
    iconOnly?: boolean
    linkProps?: Record<string, unknown>
    type?: 'button' | 'reset' | 'submit'
  }>(),
  {
    component: 'a',
    disabled: false,
    href: undefined,
    iconOnly: false,
    linkProps: () => ({}),
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const elementProps = computed<Record<string, unknown>>(() => {
  if (props.component === 'a') {
    return {
      ...props.linkProps,
      'aria-disabled': props.disabled || undefined,
      href: props.disabled ? undefined : props.href,
      tabindex: props.disabled ? -1 : 0,
    }
  }

  return {
    ...props.linkProps,
    disabled: props.disabled,
    type: props.linkProps.type ?? props.type,
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
    v-bind="{ ...$attrs, ...elementProps }"
    class="sky-link"
    :class="{ 'sky-link--icon-only': iconOnly }"
    role="link"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
