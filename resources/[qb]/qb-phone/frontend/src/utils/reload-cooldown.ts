export const RELOAD_COOLDOWN_ERROR = 'reload_cooldown'

const RELOAD_LIMIT = 3
const RELOAD_WINDOW_MS = 10_000
const RELOAD_COOLDOWN_MS = 10_000

export interface ReloadCooldownState {
  cooldownUntil: number
  reloadAttempts: number[]
}

export function isReloadCooldownActive(
  state: ReloadCooldownState,
  now = Date.now(),
): boolean {
  if (state.cooldownUntil <= now) {
    state.cooldownUntil = 0
    return false
  }
  return true
}

export function allowManualReload(
  state: ReloadCooldownState,
  now = Date.now(),
): boolean {
  if (isReloadCooldownActive(state, now)) return false

  state.reloadAttempts = state.reloadAttempts.filter(
    (attemptedAt) => now - attemptedAt < RELOAD_WINDOW_MS,
  )
  if (state.reloadAttempts.length >= RELOAD_LIMIT) {
    state.cooldownUntil = now + RELOAD_COOLDOWN_MS
    state.reloadAttempts = []
    return false
  }

  state.reloadAttempts.push(now)
  return true
}
