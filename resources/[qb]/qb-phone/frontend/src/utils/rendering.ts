import type { CSSProperties } from 'vue'

export function getHairlinePixelStyle(
  renderScale: number,
  devicePixelRatio: number,
): CSSProperties {
  const safeRenderScale =
    Number.isFinite(renderScale) && renderScale > 0 ? renderScale : 1
  const safeDevicePixelRatio =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1
  const effectivePixelRatio = safeRenderScale * safeDevicePixelRatio

  return {
    '--k-device-pixel-ratio': effectivePixelRatio,
    '--sky-hairline-scale': 1 / effectivePixelRatio,
  }
}
