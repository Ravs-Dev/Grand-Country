import { describe, expect, it } from 'vitest'

import {
  allowManualReload,
  isReloadCooldownActive,
} from '@/utils/reload-cooldown'

describe('reload cooldown', () => {
  it('blocks after too many reloads in a short window and recovers', () => {
    const state = { cooldownUntil: 0, reloadAttempts: [] as number[] }

    expect(allowManualReload(state, 1_000)).toBe(true)
    expect(allowManualReload(state, 2_000)).toBe(true)
    expect(allowManualReload(state, 3_000)).toBe(true)
    expect(allowManualReload(state, 4_000)).toBe(false)
    expect(isReloadCooldownActive(state, 13_999)).toBe(true)
    expect(isReloadCooldownActive(state, 14_000)).toBe(false)
    expect(allowManualReload(state, 14_000)).toBe(true)
  })

  it('forgets reloads outside the rolling window', () => {
    const state = { cooldownUntil: 0, reloadAttempts: [] as number[] }

    expect(allowManualReload(state, 1_000)).toBe(true)
    expect(allowManualReload(state, 12_000)).toBe(true)
    expect(state.reloadAttempts).toEqual([12_000])
  })
})
