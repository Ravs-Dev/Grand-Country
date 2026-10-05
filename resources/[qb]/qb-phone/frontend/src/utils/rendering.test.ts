import { describe, expect, it } from 'vitest'

import { getHairlinePixelStyle } from '@/utils/rendering'

describe('getHairlinePixelStyle', () => {
  it('compensates both browser pixels and the outer phone zoom', () => {
    expect(getHairlinePixelStyle(1.25, 1)).toEqual({
      '--k-device-pixel-ratio': 1.25,
      '--sky-hairline-scale': 0.8,
    })
    expect(getHairlinePixelStyle(0.8, 2)).toEqual({
      '--k-device-pixel-ratio': 1.6,
      '--sky-hairline-scale': 0.625,
    })
  })

  it('falls back to an unscaled CSS pixel for invalid values', () => {
    expect(getHairlinePixelStyle(0, Number.NaN)).toEqual({
      '--k-device-pixel-ratio': 1,
      '--sky-hairline-scale': 1,
    })
  })
})
