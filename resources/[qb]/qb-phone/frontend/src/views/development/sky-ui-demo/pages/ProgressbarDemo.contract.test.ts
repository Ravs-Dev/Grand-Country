import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./ProgressbarDemo.vue', import.meta.url),
  'utf8',
)

describe('ProgressbarDemo', () => {
  it('keeps the Konsta iOS rounded strong percentage selector', () => {
    const selector = source.slice(
      source.indexOf('<SkySegmented'),
      source.indexOf('</SkySegmented>'),
    )

    expect(selector).toContain(':active-index="values.indexOf(progress)"')
    expect(selector).toContain(':item-count="4"')
    expect(selector).toMatch(/\srounded(?:\s|>)/)
    expect(selector).toMatch(/\sstrong(?:\s|>)/)
    expect(selector).not.toMatch(/\soutline(?:\s|>)/)
    expect(selector).toContain('@click="progress = value"')
  })

  it('keeps every Konsta progress value and color row', () => {
    expect(source).toContain('const values = [0.1, 0.3, 0.5, 1]')
    expect(source).toContain('class="sky-ui-demo-color-red"')
    expect(source).toContain(':progress="0.25"')
    expect(source).toContain('class="sky-ui-demo-color-green"')
    expect(source).toContain(':progress="0.5"')
    expect(source).toContain('class="sky-ui-demo-color-yellow"')
    expect(source).toContain(':progress="0.75"')
    expect(source).toContain('class="sky-ui-demo-color-purple"')
    expect(source).toContain(':progress="1"')
  })
})
