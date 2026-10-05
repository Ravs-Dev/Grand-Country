import { computed, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useComposedFieldValue } from '@/ui/controls/useComposedFieldValue'

describe('useComposedFieldValue', () => {
  it('does not overwrite active IME composition from external state', async () => {
    const externalValue = ref('before')
    const updates: string[] = []
    const field = useComposedFieldValue(
      computed(() => externalValue.value),
      (value) => updates.push(value),
    )

    field.startComposition()
    field.input('composing')
    externalValue.value = 'external'
    await nextTick()

    expect(field.localValue.value).toBe('composing')

    field.endComposition('completed')

    expect(field.localValue.value).toBe('completed')
    expect(updates).toEqual(['composing', 'completed'])
  })

  it('resumes controlled updates after composition and clears explicitly', async () => {
    const externalValue = ref('before')
    const updates: string[] = []
    const field = useComposedFieldValue(
      computed(() => externalValue.value),
      (value) => updates.push(value),
    )

    field.startComposition()
    field.endComposition('completed')
    externalValue.value = 'after'
    await nextTick()

    expect(field.localValue.value).toBe('after')

    field.clear()

    expect(field.composing.value).toBe(false)
    expect(field.localValue.value).toBe('')
    expect(updates.at(-1)).toBe('')
  })
})
