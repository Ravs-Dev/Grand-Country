<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    bold?: boolean
    component?: string
    disabled?: boolean
    dividers?: boolean
    href?: boolean | string
    target?: string
  }>(),
  { bold: false, disabled: false, dividers: undefined },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedComponent = computed(
  () =>
    props.component ??
    (props.href !== undefined && props.href !== false ? 'a' : 'button'),
)
const resolvedHref = computed(() => {
  if (typeof props.href === 'string') return props.href
  return props.href ? '' : undefined
})
const isNativeButton = computed(() => resolvedComponent.value === 'button')

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}

function onKeydown(event: KeyboardEvent): void {
  if (isNativeButton.value || event.isComposing) return
  if (event.key !== 'Enter' && event.key !== ' ') return

  event.preventDefault()
  if (!props.disabled) (event.currentTarget as HTMLElement).click()
}
</script>

<template>
  <component
    :is="resolvedComponent"
    v-bind="$attrs"
    :type="isNativeButton ? 'button' : undefined"
    :href="resolvedComponent === 'a' ? resolvedHref : undefined"
    :target="resolvedComponent === 'a' ? target : undefined"
    :role="isNativeButton ? undefined : 'button'"
    :tabindex="disabled ? -1 : 0"
    :disabled="isNativeButton ? disabled : undefined"
    :aria-disabled="!isNativeButton && disabled ? 'true' : undefined"
    class="sky-action-button"
    :class="{
      'sky-action-button--bold': bold,
      'sky-action-button--dividers': dividers !== false,
      'sky-action-button--disabled': disabled,
    }"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </component>
</template>
