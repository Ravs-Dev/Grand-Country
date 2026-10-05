import { ref, watch, type ComputedRef, type Ref } from 'vue'

type FieldValue = number | string

export interface ComposedFieldValue {
  clear: () => void
  composing: Ref<boolean>
  endComposition: (value: string) => void
  input: (value: string) => void
  localValue: Ref<string>
  startComposition: () => void
}

export function useComposedFieldValue(
  effectiveValue: ComputedRef<FieldValue>,
  update: (value: string) => void,
): ComposedFieldValue {
  const localValue = ref(String(effectiveValue.value))
  const composing = ref(false)

  watch(effectiveValue, (value) => {
    if (!composing.value) localValue.value = String(value)
  })

  function setValue(value: string): void {
    localValue.value = value
    update(value)
  }

  return {
    clear: () => {
      composing.value = false
      setValue('')
    },
    composing,
    endComposition: (value) => {
      composing.value = false
      setValue(value)
    },
    input: setValue,
    localValue,
    startComposition: () => {
      composing.value = true
    },
  }
}
