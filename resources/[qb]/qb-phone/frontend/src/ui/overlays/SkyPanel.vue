<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { useOverlayFocusTrap } from './useOverlayFocusTrap'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    ariaModal?: boolean | 'false' | 'true'
    backdrop?: boolean
    component?: 'aside' | 'div' | 'section'
    floating?: boolean
    modal?: boolean
    opened: boolean
    role?: 'alertdialog' | 'dialog' | 'navigation' | 'region'
    side?: 'left' | 'right'
    size?: number | string
    tabindex?: number | string
  }>(),
  {
    ariaModal: true,
    backdrop: true,
    component: 'aside',
    floating: false,
    modal: true,
    role: 'dialog',
    side: 'left',
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
const panelStyle = computed<CSSProperties>(() => {
  if (typeof props.size === 'number') return { width: `${props.size}px` }
  if (!props.size) return {}

  const size = props.size.trim()
  if (
    /^(?:calc|min|max|clamp)\(/.test(size) ||
    /^\d*\.?\d+(?:px|rem|em|%|vw|vh)$/.test(size)
  ) {
    return { width: size }
  }

  return {}
})
const sizeClass = computed(() =>
  typeof props.size === 'string' && Object.keys(panelStyle.value).length === 0
    ? props.size
    : undefined,
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
  <Transition :name="`sky-panel-${side}`" appear>
    <div
      v-if="opened"
      ref="root"
      v-bind="$attrs"
      class="sky-panel"
      :class="{
        'sky-panel--floating': floating,
        'sky-panel--modal': modal,
      }"
    >
      <div
        v-if="backdrop"
        class="sky-overlay-backdrop sky-panel__backdrop"
        aria-hidden="true"
        @click="emit('backdropclick', $event)"
      ></div>

      <component
        :is="component"
        ref="panel"
        class="sky-panel__panel sky-glass-surface"
        :class="[
          sizeClass,
          `sky-panel__panel--${side}`,
          { 'sky-panel__panel--floating': floating },
        ]"
        :style="panelStyle"
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
