<script setup lang="ts">
import { computed, useId, type CSSProperties } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    ariaValueText?: string
    caption?: string
    disabled?: boolean
    id?: string
    max?: number
    min?: number
    modelValue?: number
    name?: string
    step?: number
    value?: number
  }>(),
  {
    ariaLabel: '',
    ariaValueText: '',
    caption: '',
    disabled: false,
    id: undefined,
    max: 100,
    min: 0,
    modelValue: undefined,
    name: undefined,
    step: 1,
    value: undefined,
  },
)

const emit = defineEmits<{
  change: [event: Event]
  input: [event: Event]
  'update:modelValue': [value: number]
}>()

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)
const effectiveValue = computed(
  () => props.modelValue ?? props.value ?? props.min,
)
const normalizedProgress = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.min(
    100,
    Math.max(0, ((effectiveValue.value - props.min) / span) * 100),
  )
})
const rangeStyle = computed<CSSProperties>(() => ({
  '--sky-range-progress': `${normalizedProgress.value}%`,
}))

function handleInput(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return
  emit('update:modelValue', event.target.valueAsNumber)
  emit('input', event)
}
</script>

<template>
  <label
    v-bind="$attrs"
    class="sky-range"
    :class="{
      'sky-range--captioned': Boolean(caption || $slots.caption),
      'sky-range--disabled': disabled,
    }"
    :for="inputId"
  >
    <span
      v-if="caption || $slots.caption"
      class="sky-range__caption"
      aria-hidden="true"
    >
      <slot name="caption">{{ caption }}</slot>
    </span>
    <input
      :id="inputId"
      class="sky-range__input"
      type="range"
      :aria-label="ariaLabel || undefined"
      :aria-valuetext="ariaValueText || undefined"
      :disabled="disabled"
      :max="max"
      :min="min"
      :name="name"
      :step="step"
      :style="rangeStyle"
      :value="effectiveValue"
      @change="emit('change', $event)"
      @input="handleInput"
    />
    <span v-if="$slots.default" class="sky-range__label">
      <slot />
    </span>
  </label>
</template>
