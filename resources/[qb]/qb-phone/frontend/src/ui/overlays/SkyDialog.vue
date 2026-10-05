<script setup lang="ts">
import { computed, ref, toRef, useId, useSlots } from 'vue'
import { useOverlayFocusTrap } from './useOverlayFocusTrap'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaModal?: boolean | 'false' | 'true'
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    backdrop?: boolean
    component?: string
    content?: string
    opened: boolean
    role?: 'alertdialog' | 'dialog' | 'region'
    tabindex?: number | string
    title?: string
  }>(),
  {
    ariaModal: true,
    backdrop: true,
    component: 'div',
    role: 'dialog',
    tabindex: -1,
  },
)
const emit = defineEmits<{
  backdropclick: [event: MouseEvent]
  escape: [event: KeyboardEvent]
}>()

const titleId = useId()
const contentId = useId()
const slots = useSlots()
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const hasTitle = computed(
  () => props.title !== undefined || Boolean(slots.title),
)
const resolvedLabelledby = computed(() => {
  if (props.ariaLabel) return undefined
  return props.ariaLabelledby ?? (hasTitle.value ? titleId : undefined)
})
const resolvedAriaLabel = computed(
  () =>
    props.ariaLabel ??
    (!resolvedLabelledby.value && props.content ? props.content : undefined),
)
const resolvedDescribedby = computed(
  () =>
    props.ariaDescribedby ??
    (props.content && resolvedAriaLabel.value !== props.content
      ? contentId
      : undefined),
)
const effectiveRole = computed(() => {
  const isDialog = props.role === 'dialog' || props.role === 'alertdialog'
  return isDialog && !resolvedAriaLabel.value && !resolvedLabelledby.value
    ? 'region'
    : props.role
})
const hasDialogRole = computed(
  () =>
    effectiveRole.value === 'dialog' || effectiveRole.value === 'alertdialog',
)

useOverlayFocusTrap({
  onEscape: (event) => emit('escape', event),
  opened: toRef(props, 'opened'),
  panel,
  root,
})
</script>

<template>
  <Transition
    name="sky-dialog-pop"
    :duration="{ enter: 400, leave: 400 }"
    appear
  >
    <div v-if="opened" ref="root" v-bind="$attrs" class="sky-dialog">
      <div
        v-if="backdrop"
        class="sky-overlay-backdrop"
        aria-hidden="true"
        @click="emit('backdropclick', $event)"
      ></div>
      <component
        :is="component"
        ref="panel"
        class="sky-dialog__panel sky-glass-surface"
        :role="effectiveRole"
        :aria-modal="hasDialogRole ? ariaModal : undefined"
        :aria-label="resolvedAriaLabel"
        :aria-labelledby="resolvedLabelledby"
        :aria-describedby="resolvedDescribedby"
        :tabindex="tabindex"
      >
        <div class="sky-dialog__content">
          <h2 v-if="hasTitle" :id="titleId">
            <slot name="title">{{ title }}</slot>
          </h2>
          <p v-if="content" :id="contentId">{{ content }}</p>
          <slot />
        </div>
        <div v-if="$slots.buttons" class="sky-dialog__buttons">
          <slot name="buttons" />
        </div>
      </component>
    </div>
  </Transition>
</template>
