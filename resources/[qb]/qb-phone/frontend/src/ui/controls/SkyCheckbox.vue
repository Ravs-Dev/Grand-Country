<script setup lang="ts">
import { computed, nextTick, ref, useId, watchEffect } from 'vue'

defineOptions({ inheritAttrs: false })

type CheckboxValue = number | string

const props = withDefaults(
  defineProps<{
    ariaDescribedby?: string
    ariaLabel?: string
    ariaLabelledby?: string
    checked?: boolean
    component?: 'div' | 'label' | 'span'
    disabled?: boolean
    id?: string
    indeterminate?: boolean
    modelValue?: boolean
    name?: string
    readonly?: boolean
    required?: boolean
    value?: CheckboxValue
  }>(),
  {
    ariaDescribedby: '',
    ariaLabel: '',
    ariaLabelledby: '',
    checked: false,
    component: 'label',
    disabled: false,
    id: undefined,
    indeterminate: false,
    modelValue: undefined,
    name: undefined,
    readonly: false,
    required: false,
    value: undefined,
  },
)

const emit = defineEmits<{
  change: [event: Event]
  'update:modelValue': [value: boolean]
}>()

const generatedId = useId()
const input = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id || generatedId)
const isChecked = computed(() => props.modelValue ?? props.checked)
const isMarked = computed(() => isChecked.value || props.indeterminate)
const labelId = computed(() => `${inputId.value}-label`)

watchEffect(() => {
  if (input.value) input.value.indeterminate = props.indeterminate
})

function resyncIndeterminate(): void {
  void nextTick(() => {
    if (input.value) input.value.indeterminate = props.indeterminate
  })
}

function handleChange(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return

  if (props.readonly) {
    event.target.checked = isChecked.value
    resyncIndeterminate()
    return
  }

  emit('update:modelValue', event.target.checked)
  emit('change', event)
  resyncIndeterminate()
}

function handleContainerClick(event: MouseEvent): void {
  if (props.disabled || props.readonly) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  if (props.component !== 'label' && event.target !== input.value) {
    input.value?.click()
  }
}
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-checkbox"
    :class="{
      'sky-checkbox--checked': isMarked,
      'sky-checkbox--disabled': disabled,
      'sky-checkbox--indeterminate': indeterminate,
      'sky-checkbox--readonly': readonly,
    }"
    @click="handleContainerClick"
  >
    <input
      :id="inputId"
      ref="input"
      class="sky-checkbox__input"
      type="checkbox"
      :aria-describedby="ariaDescribedby || undefined"
      :aria-label="ariaLabel || undefined"
      :aria-labelledby="
        ariaLabelledby || (!ariaLabel && $slots.default ? labelId : undefined)
      "
      :aria-readonly="readonly || undefined"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="value"
      @change="handleChange"
    />
    <span class="sky-checkbox__mark" aria-hidden="true">
      <span v-if="indeterminate" class="sky-checkbox__indeterminate" />
      <span v-else class="sky-checkbox__check" />
    </span>
    <span v-if="$slots.default" :id="labelId" class="sky-checkbox__label">
      <slot />
    </span>
  </component>
</template>
