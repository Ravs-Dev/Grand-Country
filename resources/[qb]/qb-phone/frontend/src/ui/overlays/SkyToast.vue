<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    component?: string
    opened: boolean
    position?: 'center' | 'left' | 'right'
    verticalPosition?: 'bottom' | 'center' | 'top'
  }>(),
  { component: 'div', position: 'left', verticalPosition: 'bottom' },
)
</script>

<template>
  <Transition name="sky-toast-slide" appear>
    <component
      :is="component"
      v-if="opened"
      v-bind="$attrs"
      class="sky-toast"
      :class="[
        `sky-toast--${position}`,
        `sky-toast--vertical-${verticalPosition}`,
      ]"
      role="status"
      aria-live="polite"
    >
      <div class="sky-toast__inner sky-glass-surface">
        <div class="sky-toast__content">
          <div class="sky-toast__text"><slot /></div>
          <div v-if="$slots.button" class="sky-toast__button">
            <slot name="button" />
          </div>
        </div>
      </div>
    </component>
  </Transition>
</template>
