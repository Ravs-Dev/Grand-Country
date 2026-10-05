<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    ariaDescribedby?: string
    ariaLabelledby?: string
    checked?: boolean
    component?: 'div' | 'label' | 'span'
    disabled?: boolean
    id?: string
    modelValue?: boolean
    name?: string
    readonly?: boolean
    value?: number | string
  }>(),
  {
    ariaLabel: '',
    ariaDescribedby: '',
    ariaLabelledby: '',
    checked: false,
    component: 'label',
    disabled: false,
    id: undefined,
    modelValue: undefined,
    name: undefined,
    readonly: false,
    value: undefined,
  },
)

const emit = defineEmits<{
  change: [event: Event]
  'update:modelValue': [value: boolean]
}>()

const generatedId = useId()
const isChecked = computed(() => props.modelValue ?? props.checked)
const input = ref<HTMLInputElement | null>(null)
const labelId = computed(() => `${props.id || generatedId}-label`)

function restoreReadonlyState(): void {
  void nextTick(() => {
    if (input.value) input.value.checked = isChecked.value
  })
}

function handleChange(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return

  if (props.readonly) {
    event.target.checked = isChecked.value
    restoreReadonlyState()
    return
  }

  emit('update:modelValue', event.target.checked)
  emit('change', event)
}

function handleContainerClick(event: MouseEvent): void {
  if (props.disabled || props.readonly) {
    event.preventDefault()
    event.stopPropagation()
    restoreReadonlyState()
    return
  }

  if (props.component !== 'label' && event.target !== input.value) {
    event.preventDefault()
    input.value?.click()
  }
}
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="sky-toggle"
    :class="{
      'sky-toggle--checked': isChecked,
      'sky-toggle--disabled': disabled,
      'sky-toggle--readonly': readonly,
    }"
    @click="handleContainerClick"
  >
    <input
      :id="id"
      ref="input"
      class="sky-toggle__input"
      type="checkbox"
      :aria-describedby="ariaDescribedby || undefined"
      role="switch"
      :aria-label="ariaLabel || undefined"
      :aria-labelledby="
        ariaLabelledby || (!ariaLabel && $slots.default ? labelId : undefined)
      "
      :aria-readonly="readonly || undefined"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :readonly="readonly"
      :value="value"
      @change="handleChange"
    />
    <span class="sky-toggle__track" aria-hidden="true">
      <span class="sky-toggle__thumb-side" />
      <span class="sky-toggle__thumb-bg" />
      <span class="sky-toggle__thumb-shadow" />
      <span class="sky-toggle__thumb-wrap">
        <span class="sky-toggle__thumb" />
      </span>
    </span>
    <span v-if="$slots.default" :id="labelId" class="sky-toggle__label">
      <slot />
    </span>
  </component>
</template>
