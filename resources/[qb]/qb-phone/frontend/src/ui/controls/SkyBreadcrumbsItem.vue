<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    active?: boolean
    component?: 'a' | 'button' | 'span'
    disabled?: boolean
    href?: string
    type?: 'button' | 'reset' | 'submit'
  }>(),
  {
    active: false,
    component: 'span',
    disabled: false,
    href: undefined,
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const elementProps = computed<Record<string, unknown>>(() => {
  const common = {
    'aria-current': props.active ? 'page' : undefined,
  }

  if (props.component === 'a') {
    return {
      ...common,
      'aria-disabled': props.disabled || undefined,
      href: props.disabled ? undefined : props.href,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  if (props.component === 'button') {
    return {
      ...common,
      disabled: props.disabled,
      type: props.type,
    }
  }

  return {
    ...common,
    'aria-disabled': props.disabled || undefined,
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
    class="sky-breadcrumbs-item"
    :class="{
      'sky-breadcrumbs-item--active': active,
      'sky-breadcrumbs-item--disabled': disabled,
    }"
    @click="handleClick"
  >
    <slot />
  </component>
</template>
