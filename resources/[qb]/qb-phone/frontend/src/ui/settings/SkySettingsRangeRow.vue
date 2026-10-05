<script setup lang="ts">
import { computed } from 'vue'

import SkyRange from '@/ui/controls/SkyRange.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaValueText?: string
    disabled?: boolean
    max?: number
    min?: number
    modelValue?: number
    step?: number
    title: string
    value?: number
    valueLabel?: string
  }>(),
  {
    ariaValueText: '',
    disabled: false,
    max: 100,
    min: 0,
    modelValue: undefined,
    step: 1,
    value: undefined,
    valueLabel: undefined,
  },
)

const emit = defineEmits<{
  change: [event: Event]
  input: [event: Event]
  'update:modelValue': [value: number]
}>()

const effectiveValue = computed(
  () => props.modelValue ?? props.value ?? props.min,
)
const visibleValue = computed(
  () => props.valueLabel ?? String(effectiveValue.value),
)
const accessibleValue = computed(
  () => props.ariaValueText || props.valueLabel || '',
)
</script>

<template>
  <li
    v-bind="$attrs"
    class="sky-settings-range-row"
    :class="{ 'sky-settings-range-row--disabled': disabled }"
  >
    <div class="sky-settings-range-row__frame">
      <div class="sky-settings-range-row__header">
        <span class="sky-settings-range-row__title">{{ title }}</span>
        <span class="sky-settings-range-row__value">{{ visibleValue }}</span>
      </div>
      <div class="sky-settings-range-row__control">
        <span
          v-if="$slots.leading"
          class="sky-settings-range-row__endpoint sky-settings-range-row__endpoint--leading"
          aria-hidden="true"
        >
          <slot name="leading" />
        </span>
        <SkyRange
          :aria-label="title"
          :aria-value-text="accessibleValue"
          :disabled="disabled"
          :max="max"
          :min="min"
          :model-value="effectiveValue"
          :step="step"
          @change="emit('change', $event)"
          @input="emit('input', $event)"
          @update:model-value="emit('update:modelValue', $event)"
        />
        <span
          v-if="$slots.trailing"
          class="sky-settings-range-row__endpoint sky-settings-range-row__endpoint--trailing"
          aria-hidden="true"
        >
          <slot name="trailing" />
        </span>
      </div>
    </div>
  </li>
</template>
