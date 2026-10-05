import type { MapPoint } from './defaultMapGeometry'

export type MapViewportMetrics = {
  canvasHeight: number
  canvasWidth: number
  viewportHeight: number
  viewportWidth: number
}

export type MapRect = {
  height: number
  left: number
  top: number
  width: number
}

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value))

export function minimumCoverZoom(
  metrics: MapViewportMetrics,
  minimum = 0.7,
): number {
  if (
    metrics.canvasWidth <= 0 ||
    metrics.canvasHeight <= 0 ||
    metrics.viewportWidth <= 0 ||
    metrics.viewportHeight <= 0
  ) {
    return minimum
  }

  return Math.max(
    minimum,
    metrics.viewportWidth / metrics.canvasWidth,
    metrics.viewportHeight / metrics.canvasHeight,
  )
}

export function clampMapPan(
  pan: MapPoint,
  zoom: number,
  metrics: MapViewportMetrics,
): MapPoint {
  const maximumX = Math.max(
    0,
    (metrics.canvasWidth * zoom - metrics.viewportWidth) / 2,
  )
  const maximumY = Math.max(
    0,
    (metrics.canvasHeight * zoom - metrics.viewportHeight) / 2,
  )

  return {
    x: clamp(pan.x, -maximumX, maximumX),
    y: clamp(pan.y, -maximumY, maximumY),
  }
}

export function clientPointToMapPercent(
  point: MapPoint,
  canvas: MapRect,
): MapPoint {
  if (canvas.width <= 0 || canvas.height <= 0) return { x: 0.5, y: 0.5 }

  return {
    x: clamp((point.x - canvas.left) / canvas.width, 0, 1),
    y: clamp((point.y - canvas.top) / canvas.height, 0, 1),
  }
}

export function zoomPanAtPoint(
  pan: MapPoint,
  currentZoom: number,
  nextZoom: number,
  focalPoint: MapPoint,
  viewportSize: MapPoint,
): MapPoint {
  if (currentZoom <= 0 || nextZoom <= 0) return pan
  const scale = nextZoom / currentZoom

  return {
    x: pan.x + (focalPoint.x - viewportSize.x / 2 - pan.x) * (1 - scale),
    y: pan.y + (focalPoint.y - viewportSize.y / 2 - pan.y) * (1 - scale),
  }
}
