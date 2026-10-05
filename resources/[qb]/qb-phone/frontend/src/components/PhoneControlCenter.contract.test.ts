import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./PhoneControlCenter.vue', import.meta.url),
  'utf8',
)
const appSource = readFileSync(new URL('../App.vue', import.meta.url), 'utf8')

describe('phone control center sliders', () => {
  it('tracks brightness and volume drags at window scope', () => {
    expect(source).toContain(
      "import { bindPointerDragSession } from '@/utils/pointerDragSession'",
    )
    expect(source).toContain("startSliderDrag('brightness', $event)")
    expect(source).toContain("startSliderDrag('volume', $event)")
    expect(source).toContain('bindPointerDragSession(window, pointerId')
    expect(source).toContain(
      "window.addEventListener('mousemove', onMouseMove, true)",
    )
    expect(source).toContain(
      "window.addEventListener('mouseup', onMouseUp, true)",
    )
    expect(source).toContain('drag.target.getBoundingClientRect()')
    expect(source).toContain('class="control-center__slider-drag-surface"')
    expect(source).toContain('@pointermove="continueSliderSurfaceDrag"')
    expect(source).toContain('clientY - drag.lastClientY')
    expect(source).toContain(
      'move: (moveEvent) => queueSliderDrag(moveEvent.clientY, drag)',
    )
    expect(source).toContain('window.requestAnimationFrame')
    expect(source).toContain(
      "const initialValue = kind === 'brightness' ? brightness.value : volume.value",
    )
    expect(source).not.toContain('target.setPointerCapture(pointerId)')
    expect(source).not.toContain('@pointermove="dragBrightness"')
    expect(source).not.toContain('@pointermove="dragVolume"')
  })

  it('persists the final value and cleans up interrupted drags', () => {
    expect(source).toContain("phone.setPreference('screenBrightness'")
    expect(source).toContain('phone.setAlertVolumes(volume.value)')
    expect(source).toMatch(
      /watch\([\s\S]*?\(opened\) => \{[\s\S]*?if \(!opened\) \{[\s\S]*?finishSliderDrag\(true\)/,
    )
    expect(source).toMatch(
      /onBeforeUnmount\(\(\) => \{[\s\S]*?finishSliderDrag\(true\)/,
    )
  })

  it('renders a completely empty hardware volume fill when muted', () => {
    expect(appSource).toContain(
      "'--phone-hardware-volume-fill': `${hardwareAlertVolume.value}%`",
    )
    expect(appSource).not.toContain('32 + hardwareAlertVolume.value')
  })
})
