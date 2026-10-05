<script setup lang="ts">
import { computed } from 'vue'

import SkyChipDeleteIcon from './SkyChipDeleteIcon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    component?: 'a' | 'button' | 'div' | 'span'
    deleteButton?: boolean
    deleteLabel?: string
    disabled?: boolean
    href?: string
    outline?: boolean
    selected?: boolean
    type?: 'button' | 'reset' | 'submit'
  }>(),
  {
    component: 'button',
    deleteButton: false,
    deleteLabel: '',
    disabled: false,
    href: undefined,
    outline: false,
    selected: undefined,
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  delete: [event: KeyboardEvent | MouseEvent]
}>()

const showDelete = computed(
  () => props.deleteButton && Boolean(props.deleteLabel),
)
const effectiveComponent = computed(() =>
  showDelete.value && (props.component === 'a' || props.component === 'button')
    ? 'span'
    : props.component,
)

const elementProps = computed<Record<string, unknown>>(() => {
  if (effectiveComponent.value === 'button') {
    return { disabled: props.disabled, type: props.type }
  }

  if (effectiveComponent.value === 'a') {
    return {
      'aria-disabled': props.disabled || undefined,
      href: props.disabled ? undefined : props.href,
      tabindex: props.disabled ? -1 : undefined,
    }
  }

  return { 'aria-disabled': props.disabled || undefined }
})

function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}

function handleDelete(event: KeyboardEvent | MouseEvent): void {
  if (props.disabled) return
  emit('delete', event)
}
</script>

<template>
  <component
    :is="effectiveComponent"
    v-bind="{ ...$attrs, ...elementProps }"
    class="sky-chip"
    :class="{
      'sky-chip--outline': outline,
      'sky-chip--selected': selected,
      'sky-chip--with-delete': showDelete,
    }"
    :aria-pressed="
      effectiveComponent === 'button' && selected !== undefined
        ? selected
        : undefined
    "
    @click="handleClick"
  >
    <span v-if="$slots.media" class="sky-chip__media">
      <slot name="media" />
    </span>
    <slot />
    <span
      v-if="showDelete"
      class="sky-chip__delete"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-label="deleteLabel"
      @click.stop="handleDelete"
      @keydown.enter.prevent.stop="handleDelete"
      @keydown.space.prevent.stop="handleDelete"
    >
      <slot name="delete">
        <SkyChipDeleteIcon />
      </slot>
    </span>
  </component>
</template>
