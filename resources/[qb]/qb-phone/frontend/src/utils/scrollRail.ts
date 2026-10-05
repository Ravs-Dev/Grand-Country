export const SCROLL_RAIL_DELTA_MODE_PIXEL = 0
export const SCROLL_RAIL_DELTA_MODE_LINE = 1
export const SCROLL_RAIL_DELTA_MODE_PAGE = 2
export const SCROLL_RAIL_LINE_HEIGHT = 16

export interface ScrollRailWheelInput {
  clientWidth: number
  deltaMode: number
  deltaX: number
  deltaY: number
  scrollLeft: number
  scrollWidth: number
}

export interface ScrollRailWheelResult {
  consumed: boolean
  scrollLeft: number
}

export function resolveScrollRailWheel({
  clientWidth,
  deltaMode,
  deltaX,
  deltaY,
  scrollLeft,
  scrollWidth,
}: ScrollRailWheelInput): ScrollRailWheelResult {
  const maxScrollLeft = Math.max(0, scrollWidth - clientWidth)
  if (maxScrollLeft === 0) {
    return { consumed: false, scrollLeft: 0 }
  }

  const boundedScrollLeft = Math.min(maxScrollLeft, Math.max(0, scrollLeft))

  let delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX
  if (deltaMode === SCROLL_RAIL_DELTA_MODE_LINE) {
    delta *= SCROLL_RAIL_LINE_HEIGHT
  } else if (deltaMode === SCROLL_RAIL_DELTA_MODE_PAGE) {
    delta *= clientWidth
  }

  const nextScrollLeft = Math.min(
    maxScrollLeft,
    Math.max(0, boundedScrollLeft + delta),
  )
  const consumed = Math.abs(nextScrollLeft - boundedScrollLeft) >= 0.5

  return {
    consumed,
    scrollLeft: consumed ? nextScrollLeft : scrollLeft,
  }
}
