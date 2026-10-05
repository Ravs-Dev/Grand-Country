import { getCurrentScope, onScopeDispose, readonly, ref } from 'vue'

const DEFAULT_THRESHOLD = 56
const DEFAULT_OVERSHOOT = 20
const DEFAULT_TOUCH_RESISTANCE = 0.45
const DEFAULT_WHEEL_RESISTANCE = 0.18
const DEFAULT_WHEEL_SETTLE_MS = 130

type PullToRefreshOptions = {
  isAtTop: (event: Event) => boolean
  isBusy?: () => boolean
  refresh: () => Promise<unknown> | unknown
  threshold?: number
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const pullDistance = ref(0)
  const isRefreshing = ref(false)
  const pullThreshold = options.threshold ?? DEFAULT_THRESHOLD
  const maximumDistance = pullThreshold + DEFAULT_OVERSHOOT
  let pullStartY = 0
  let isPulling = false
  let wheelRefreshTimeout: ReturnType<typeof setTimeout> | undefined

  const isBusy = (): boolean =>
    isRefreshing.value || options.isBusy?.() === true

  async function refresh(): Promise<boolean> {
    if (isBusy()) return false
    isRefreshing.value = true
    pullDistance.value = pullThreshold
    try {
      await options.refresh()
      return true
    } finally {
      isRefreshing.value = false
      pullDistance.value = 0
    }
  }

  function startPull(event: TouchEvent): boolean {
    if (!options.isAtTop(event) || isBusy()) return false
    pullStartY = event.touches[0]?.clientY ?? 0
    isPulling = true
    return true
  }

  function movePull(event: TouchEvent): void {
    if (!isPulling || isBusy()) return
    const distance = (event.touches[0]?.clientY ?? pullStartY) - pullStartY
    pullDistance.value =
      distance > 0
        ? Math.min(maximumDistance, distance * DEFAULT_TOUCH_RESISTANCE)
        : 0
  }

  function finishPull(): void {
    if (!isPulling && pullDistance.value === 0) return
    isPulling = false
    if (pullDistance.value >= pullThreshold) {
      void refresh()
      return
    }
    pullDistance.value = 0
  }

  function pullWithWheel(event: WheelEvent): boolean {
    if (!options.isAtTop(event) || isBusy() || event.deltaY >= 0) return false
    pullDistance.value = Math.min(
      maximumDistance,
      pullDistance.value + Math.abs(event.deltaY) * DEFAULT_WHEEL_RESISTANCE,
    )
    if (wheelRefreshTimeout) clearTimeout(wheelRefreshTimeout)
    wheelRefreshTimeout = setTimeout(finishPull, DEFAULT_WHEEL_SETTLE_MS)
    return true
  }

  function dispose(): void {
    if (wheelRefreshTimeout) clearTimeout(wheelRefreshTimeout)
    wheelRefreshTimeout = undefined
    isPulling = false
  }

  if (getCurrentScope()) onScopeDispose(dispose)

  return {
    dispose,
    finishPull,
    isRefreshing: readonly(isRefreshing),
    movePull,
    pullDistance,
    pullThreshold,
    pullWithWheel,
    refresh,
    startPull,
  }
}
