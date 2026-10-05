<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { useOverlayFocusTrap } from './useOverlayFocusTrap'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    ariaModal?: boolean | 'false' | 'true'
    backdrop?: boolean
    component?: string
    label?: string
    opened: boolean
    role?: 'alertdialog' | 'dialog' | 'none' | 'presentation'
    tabindex?: number | string
  }>(),
  {
    ariaModal: true,
    backdrop: true,
    component: 'div',
    tabindex: -1,
  },
)
const emit = defineEmits<{
  backdropclick: [event: MouseEvent]
  escape: [event: KeyboardEvent]
}>()

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const inferredRole = ref<'alertdialog' | 'dialog' | 'none' | 'presentation'>()
const effectiveRole = computed(() => {
  const role = inferredRole.value
  const isDialog = role === 'dialog' || role === 'alertdialog'
  return isDialog && !props.ariaLabel && !props.label && !props.ariaLabelledby
    ? 'presentation'
    : role
})

watch(
  [toRef(props, 'opened'), toRef(props, 'role')],
  async ([opened]) => {
    inferredRole.value = undefined
    if (!opened) return

    await nextTick()
    if (!props.opened || !panel.value) return

    const nestedDialog = panel.value.querySelector(
      '[role="dialog"], [role="alertdialog"]',
    )
    inferredRole.value = props.role ?? (nestedDialog ? undefined : 'dialog')
  },
  { immediate: true, flush: 'post' },
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
    name="sky-action-rise"
    :duration="{ enter: 300, leave: 300 }"
    appear
  >
    <div v-if="opened" ref="root" v-bind="$attrs" class="sky-action-sheet">
      <div
        v-if="backdrop"
        class="sky-overlay-backdrop"
        aria-hidden="true"
        @click="emit('backdropclick', $event)"
      ></div>
      <component
        :is="component"
        ref="panel"
        class="sky-action-sheet__panel"
        :role="effectiveRole"
        :aria-modal="
          effectiveRole === 'dialog' || effectiveRole === 'alertdialog'
            ? ariaModal
            : undefined
        "
        :aria-label="
          effectiveRole ? ariaLabel || label || undefined : undefined
        "
        :aria-labelledby="
          effectiveRole && !ariaLabel ? ariaLabelledby : undefined
        "
        :aria-describedby="effectiveRole ? ariaDescribedby : undefined"
        :tabindex="tabindex"
      >
        <slot />
      </component>
    </div>
  </Transition>
</template>
