import { describe, expect, it } from 'vitest'

import {
  resolveScrollRailWheel,
  SCROLL_RAIL_DELTA_MODE_LINE,
  SCROLL_RAIL_DELTA_MODE_PAGE,
  SCROLL_RAIL_DELTA_MODE_PIXEL,
  SCROLL_RAIL_LINE_HEIGHT,
} from '@/utils/scrollRail'

const baseInput = {
  clientWidth: 300,
  deltaMode: SCROLL_RAIL_DELTA_MODE_PIXEL,
  deltaX: 0,
  deltaY: 0,
  scrollLeft: 100,
  scrollWidth: 700,
}

describe('horizontal scroll rail wheel behavior', () => {
  it('maps a vertical mouse wheel to horizontal movement', () => {
    expect(resolveScrollRailWheel({ ...baseInput, deltaY: 120 })).toEqual({
      consumed: true,
      scrollLeft: 220,
    })
    expect(resolveScrollRailWheel({ ...baseInput, deltaY: -60 })).toEqual({
      consumed: true,
      scrollLeft: 40,
    })
  })

  it('uses the dominant trackpad axis without adding both deltas', () => {
    expect(
      resolveScrollRailWheel({ ...baseInput, deltaX: 80, deltaY: 12 }),
    ).toEqual({ consumed: true, scrollLeft: 180 })
  })

  it('normalizes line and page wheel deltas', () => {
    expect(
      resolveScrollRailWheel({
        ...baseInput,
        deltaMode: SCROLL_RAIL_DELTA_MODE_LINE,
        deltaY: 2,
      }).scrollLeft,
    ).toBe(100 + 2 * SCROLL_RAIL_LINE_HEIGHT)
    expect(
      resolveScrollRailWheel({
        ...baseInput,
        deltaMode: SCROLL_RAIL_DELTA_MODE_PAGE,
        deltaY: 1,
      }).scrollLeft,
    ).toBe(400)
  })

  it('clamps movement and releases the wheel at either edge', () => {
    expect(resolveScrollRailWheel({ ...baseInput, deltaY: -500 })).toEqual({
      consumed: true,
      scrollLeft: 0,
    })
    expect(
      resolveScrollRailWheel({ ...baseInput, scrollLeft: 0, deltaY: -40 }),
    ).toEqual({ consumed: false, scrollLeft: 0 })
    expect(
      resolveScrollRailWheel({
        ...baseInput,
        scrollLeft: 400,
        deltaY: 40,
      }),
    ).toEqual({ consumed: false, scrollLeft: 400 })
    expect(
      resolveScrollRailWheel({
        ...baseInput,
        scrollLeft: 400.75,
        deltaY: 40,
      }),
    ).toEqual({ consumed: false, scrollLeft: 400.75 })
  })

  it('does not consume the wheel when the rail has no overflow', () => {
    expect(
      resolveScrollRailWheel({
        ...baseInput,
        clientWidth: 300,
        scrollLeft: 0,
        scrollWidth: 300,
        deltaY: 80,
      }),
    ).toEqual({ consumed: false, scrollLeft: 0 })
  })
})
