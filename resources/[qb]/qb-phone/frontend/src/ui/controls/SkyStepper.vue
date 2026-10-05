<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    buttonsOnly?: boolean
    component?: 'div' | 'span'
    decrementLabel: string
    disabled?: boolean
    id?: string
    incrementLabel: string
    input?: boolean
    inputDisabled?: boolean
    inputLabel?: string
    inputPlaceholder?: string
    inputReadonly?: boolean
    inputType?: 'number' | 'text'
    large?: boolean
    max?: number
    min?: number
    modelValue?: number
    name?: string
    outline?: boolean
    raised?: boolean
    rounded?: boolean
    small?: boolean
    step?: number
    value?: number
  }>(),
  {
    buttonsOnly: false,
    component: 'span',
    disabled: false,
    id: undefined,
    input: false,
    inputDisabled: false,
    inputLabel: '',
    inputPlaceholder: '',
    inputReadonly: false,
    inputType: 'number',
    large: false,
    max: undefined,
    min: undefined,
    modelValue: undefined,
    name: undefined,
    outline: false,
    raised: false,
    rounded: false,
    small: false,
    step: 1,
    value: 0,
  },
)

const emit = defineEmits<{
  blur: [event: FocusEvent]
  change: [event: Event]
  focus: [event: FocusEvent]
  input: [event: Event]
  minus: [event: MouseEvent]
  plus: [event: MouseEvent]
  'update:modelValue': [value: number]
}>()

const generatedId = useId()
const composing = ref(false)
const inputId = computed(() => props.id || generatedId)
const internalValue = ref(props.modelValue ?? props.value)
const currentValue = computed(() => props.modelValue ?? internalValue.value)
const effectiveStep = computed(() =>
  Number.isFinite(props.step) && props.step > 0 ? props.step : 1,
)
const decrementDisabled = computed(
  () =>
    props.disabled ||
    (props.min !== undefined && currentValue.value <= props.min),
)
const incrementDisabled = computed(
  () =>
    props.disabled ||
    (props.max !== undefined && currentValue.value >= props.max),
)

watch(
  () => props.value,
  (value) => {
    if (props.modelValue === undefined) internalValue.value = value
  },
)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) internalValue.value = value
  },
)

function normalizeValue(value: number): number {
  let nextValue = value
  if (props.min !== undefined) nextValue = Math.max(props.min, nextValue)
  if (props.max !== undefined) nextValue = Math.min(props.max, nextValue)
  return nextValue
}

function updateValue(value: number): void {
  const nextValue = normalizeValue(value)
  if (props.modelValue === undefined) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
}

function decrement(event: MouseEvent): void {
  if (decrementDisabled.value) return
  updateValue(currentValue.value - effectiveStep.value)
  emit('minus', event)
}

function increment(event: MouseEvent): void {
  if (incrementDisabled.value) return
  updateValue(currentValue.value + effectiveStep.value)
  emit('plus', event)
}

function inputValue(event: Event): number | undefined {
  if (!(event.target instanceof HTMLInputElement)) return undefined
  const value =
    props.inputType === 'number'
      ? event.target.valueAsNumber
      : Number(event.target.value)
  return Number.isFinite(value) ? value : undefined
}

function handleInput(event: Event): void {
  if (composing.value) {
    emit('input', event)
    return
  }

  const value = inputValue(event)
  if (value !== undefined) updateValue(value)
  emit('input', event)
}

function handleCompositionEnd(event: CompositionEvent): void {
  composing.value = false
  const value = inputValue(event)
  if (value !== undefined) updateValue(value)
}

function handleChange(event: Event): void {
  const value = inputValue(event)
  if (value !== undefined) {
    updateValue(value)
  } else if (event.target instanceof HTMLInputElement) {
    event.target.value = String(currentValue.value)
  }
  emit('change', event)
}
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-stepper"
    :class="{
      'sky-stepper--buttons-only': buttonsOnly,
      'sky-stepper--disabled': disabled,
      'sky-stepper--input': input,
      'sky-stepper--large': large,
      'sky-stepper--outline': outline,
      'sky-stepper--raised': raised,
      'sky-stepper--rounded': rounded,
      'sky-stepper--small': small,
    }"
  >
    <button
      class="sky-stepper__button sky-stepper__decrement"
      type="button"
      :aria-controls="input && !buttonsOnly ? inputId : undefined"
      :aria-label="decrementLabel || undefined"
      :disabled="decrementDisabled"
      @click="decrement"
    >
      <slot name="decrement">
        <span
          class="sky-stepper__minus"
          :aria-hidden="decrementLabel ? true : undefined"
          >&minus;</span
        >
      </slot>
    </button>

    <input
      v-if="input && !buttonsOnly"
      :id="inputId"
      class="sky-stepper__value sky-stepper__input"
      :aria-label="inputLabel || undefined"
      :disabled="disabled || inputDisabled"
      :max="max"
      :min="min"
      :name="name"
      :placeholder="inputPlaceholder"
      :readonly="inputReadonly"
      :step="effectiveStep"
      :type="inputType"
      :value="currentValue"
      @blur="emit('blur', $event)"
      @change="handleChange"
      @compositionend="handleCompositionEnd"
      @compositionstart="composing = true"
      @focus="emit('focus', $event)"
      @input="handleInput"
    />
    <span
      v-else-if="!buttonsOnly"
      class="sky-stepper__value"
      aria-live="polite"
    >
      <slot name="value" :value="currentValue">{{ currentValue }}</slot>
    </span>

    <button
      class="sky-stepper__button sky-stepper__increment"
      type="button"
      :aria-controls="input && !buttonsOnly ? inputId : undefined"
      :aria-label="incrementLabel || undefined"
      :disabled="incrementDisabled"
      @click="increment"
    >
      <slot name="increment">
        <span
          class="sky-stepper__plus"
          :aria-hidden="incrementLabel ? true : undefined"
          >+</span
        >
      </slot>
    </button>
  </component>
</template>
