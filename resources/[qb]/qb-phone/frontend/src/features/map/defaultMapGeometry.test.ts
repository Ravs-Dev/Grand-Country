import { describe, expect, it } from 'vitest'

import {
  defaultCayoStyle,
  defaultMainlandStyle,
  defaultMapPercentToWorld,
  defaultMapWorldToPercent,
} from '@/features/map/defaultMapGeometry'

describe('default map geometry', () => {
  it('round-trips world coordinates through map percentages', () => {
    const world = { x: -75.2, y: -818.9 }
    const restored = defaultMapPercentToWorld(defaultMapWorldToPercent(world))

    expect(restored.x).toBeCloseTo(world.x, 6)
    expect(restored.y).toBeCloseTo(world.y, 6)
  })

  it('keeps every rendered map layer inside the composite canvas', () => {
    for (const style of [defaultMainlandStyle, defaultCayoStyle]) {
      const left = Number.parseFloat(style.left)
      const top = Number.parseFloat(style.top)
      const width = Number.parseFloat(style.width)
      const height = Number.parseFloat(style.height)

      expect(left).toBeGreaterThanOrEqual(0)
      expect(top).toBeGreaterThanOrEqual(0)
      expect(left + width).toBeLessThanOrEqual(100.000001)
      expect(top + height).toBeLessThanOrEqual(100.000001)
    }
  })
})
