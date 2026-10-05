<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaControls?: string
    ariaLabel: string
    component?: 'a' | 'button'
    disabled?: boolean
    expanded?: boolean
    href?: string
    type?: 'button' | 'reset' | 'submit'
  }>(),
  {
    ariaControls: '',
    component: 'button',
    disabled: false,
    expanded: undefined,
    href: undefined,
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const elementProps = computed<Record<string, unknown>>(() => {
  const common = {
    'aria-controls': props.ariaControls || undefined,
    'aria-expanded': props.expanded === undefined ? undefined : props.expanded,
    'aria-label': props.ariaLabel || undefined,
  }

  if (props.component === 'a') {
    return {
      ...common,
      'aria-disabled': props.disabled || undefined,
      href: props.disabled ? undefined : props.href,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  return {
    ...common,
    disabled: props.disabled,
    type: props.type,
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
    class="sky-breadcrumbs-collapsed"
    :class="{ 'sky-breadcrumbs-collapsed--disabled': disabled }"
    @click="handleClick"
  >
    <span class="sky-breadcrumbs-collapsed__dot" aria-hidden="true" />
    <span class="sky-breadcrumbs-collapsed__dot" aria-hidden="true" />
    <span class="sky-breadcrumbs-collapsed__dot" aria-hidden="true" />
    <slot />
  </component>
</template>
