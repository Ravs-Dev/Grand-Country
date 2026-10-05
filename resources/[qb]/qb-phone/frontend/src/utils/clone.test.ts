import { reactive } from 'vue'
import { describe, expect, it } from 'vitest'

import { cloneJsonData } from '@/utils/clone'

describe('JSON data cloning', () => {
  it('turns reactive custom app payloads into structured-cloneable data', () => {
    const payload = reactive({
      action: 'setSpeedCameras',
      data: [{ id: 1, label: 'Alta Street' }],
    })

    expect(() => structuredClone(payload)).toThrow()

    const cloned = cloneJsonData(payload)

    expect(cloned).toEqual(payload)
    expect(() => structuredClone(cloned)).not.toThrow()
  })
})
