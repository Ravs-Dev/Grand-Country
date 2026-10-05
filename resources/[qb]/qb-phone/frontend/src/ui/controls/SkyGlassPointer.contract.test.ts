import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./SkyGlass.vue', import.meta.url), 'utf8')

describe('SkyGlass pointer geometry contract', () => {
  it('maps viewport pointer coordinates into the scaled element layout', () => {
    expect(source).toContain('element.offsetWidth / bounds.width')
    expect(source).toContain('element.offsetHeight / bounds.height')
    expect(source).toContain('(event.clientX - bounds.left) * scaleX')
    expect(source).toContain('(event.clientY - bounds.top) * scaleY')
    expect(source).not.toContain(
      'Math.min(bounds.width, event.clientX - bounds.left)',
    )
  })
})
