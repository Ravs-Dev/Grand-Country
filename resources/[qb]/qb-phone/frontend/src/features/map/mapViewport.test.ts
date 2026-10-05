import { describe, expect, it } from 'vitest'

import {
  clampMapPan,
  clientPointToMapPercent,
  minimumCoverZoom,
  zoomPanAtPoint,
} from '@/features/map/mapViewport'

describe('map viewport geometry', () => {
  const metrics = {
    canvasHeight: 900,
    canvasWidth: 600,
    viewportHeight: 720,
    viewportWidth: 360,
  }

  it('raises the minimum zoom until the canvas covers the viewport', () => {
    expect(minimumCoverZoom(metrics)).toBe(0.8)
  })

  it('clamps panning so no empty edge enters the viewport', () => {
    expect(clampMapPan({ x: 999, y: -999 }, 1, metrics)).toEqual({
      x: 120,
      y: -90,
    })
  })

  it('converts scaled client positions into bounded map percentages', () => {
    const canvas = { height: 800, left: 100, top: 50, width: 400 }

    expect(clientPointToMapPercent({ x: 300, y: 250 }, canvas)).toEqual({
      x: 0.5,
      y: 0.25,
    })
    expect(clientPointToMapPercent({ x: 900, y: -100 }, canvas)).toEqual({
      x: 1,
      y: 0,
    })
  })

  it('keeps the focal map point stationary while zooming', () => {
    expect(
      zoomPanAtPoint(
        { x: 20, y: -10 },
        1,
        2,
        { x: 270, y: 180 },
        { x: 360, y: 720 },
      ),
    ).toEqual({ x: -50, y: 160 })
  })
})
