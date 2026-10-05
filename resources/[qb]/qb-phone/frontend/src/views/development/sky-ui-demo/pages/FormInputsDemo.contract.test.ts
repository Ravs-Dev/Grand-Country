import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./FormInputsDemo.vue', import.meta.url),
  'utf8',
)

describe('FormInputsDemo Konsta contract', () => {
  it('uses the canonical media slot and exact 28px demo icon', () => {
    expect(source.match(/<template #media>/g)).toHaveLength(7)
    expect(source).not.toContain('<template #leading>')
    expect(source).toMatch(
      /\.form-inputs-demo__icon\s*\{[^}]*width:\s*28px;[^}]*height:\s*28px;/s,
    )
    expect(source).not.toMatch(
      /\.form-inputs-demo__icon\s*\{[^}]*border-radius:/s,
    )
  })

  it('enables Konsta dropdown icons on both select examples', () => {
    expect(source.match(/:dropdown="field\.type === 'select'"/g)).toHaveLength(
      2,
    )
  })

  it('uses the Konsta info contract rather than demo-only help text', () => {
    expect(source).toContain('info="Basic string checking"')
    expect(source).toContain('info="Type something to see clear button"')
    expect(source).toContain(':info="')
    expect(source).not.toMatch(/\shelp=/)
  })
})
