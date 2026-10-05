<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useOverlayFocusTrap } from './useOverlayFocusTrap'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    ariaModal?: boolean | 'false' | 'true'
    backdrop?: boolean
    component?: 'article' | 'div' | 'section'
    modal?: boolean
    opened: boolean
    role?: 'alertdialog' | 'dialog' | 'region'
    tabindex?: number | string
  }>(),
  {
    ariaModal: true,
    backdrop: true,
    component: 'section',
    modal: true,
    role: 'dialog',
    tabindex: -1,
  },
)

const emit = defineEmits<{
  backdropclick: [event: MouseEvent]
  escape: [event: KeyboardEvent]
}>()

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const trapActive = computed(() => props.opened && props.modal)
const effectiveRole = computed(() => {
  const isDialog = props.role === 'dialog' || props.role === 'alertdialog'
  return isDialog && !props.ariaLabel && !props.ariaLabelledby
    ? 'region'
    : props.role
})
const hasDialogRole = computed(
  () =>
    effectiveRole.value === 'dialog' || effectiveRole.value === 'alertdialog',
)

useOverlayFocusTrap({
  onEscape: (event) => emit('escape', event),
  opened: trapActive,
  panel,
  root,
})

function onDocumentKeydown(event: KeyboardEvent): void {
  if (
    !props.opened ||
    props.modal ||
    event.key !== 'Escape' ||
    event.isComposing
  )
    return

  event.preventDefault()
  event.stopPropagation()
  emit('escape', event)
}

watch(
  () => props.opened && !props.modal,
  (active) => {
    if (typeof document === 'undefined') return
    if (active) {
      document.addEventListener('keydown', onDocumentKeydown, true)
    } else {
      document.removeEventListener('keydown', onDocumentKeydown, true)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onDocumentKeydown, true)
})
</script>

<template>
  <Transition name="sky-popup-rise" appear>
    <div
      v-if="opened"
      ref="root"
      v-bind="$attrs"
      class="sky-popup"
      :class="{ 'sky-popup--modal': modal }"
    >
      <div
        v-if="backdrop"
        class="sky-overlay-backdrop sky-popup__backdrop"
        aria-hidden="true"
        @click="emit('backdropclick', $event)"
      ></div>

      <component
        :is="component"
        ref="panel"
        class="sky-popup__panel"
        :role="effectiveRole"
        :aria-describedby="ariaDescribedby"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabel ? undefined : ariaLabelledby"
        :aria-modal="modal && hasDialogRole ? ariaModal : undefined"
        :tabindex="tabindex"
      >
        <slot />
      </component>
    </div>
  </Transition>
</template>
