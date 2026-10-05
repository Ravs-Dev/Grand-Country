import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyStepper from './SkyStepper.vue'

describe('SkyStepper', () => {
  it('matches Konsta iOS small, medium and large geometry', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')

    expect(controls).toMatch(
      /\.sky-stepper\s*\{[^}]*height:\s*34px[^}]*min-height:\s*34px/s,
    )
    expect(controls).toMatch(
      /\.sky-stepper__button\s*\{[^}]*width:\s*40px[^}]*min-width:\s*40px[^}]*height:\s*34px[^}]*min-height:\s*34px/s,
    )
    expect(controls).toMatch(
      /\.sky-stepper__value\s*\{[^}]*width:\s*44px[^}]*min-width:\s*44px[^}]*height:\s*34px[^}]*min-height:\s*34px/s,
    )
    expect(controls).toMatch(
      /\.sky-stepper--small\s*\{[^}]*height:\s*28px[^}]*min-height:\s*28px/s,
    )
    expect(controls).toMatch(
      /\.sky-stepper--large\s*\{[^}]*height:\s*48px[^}]*min-height:\s*48px/s,
    )
  })

  it('renders a native, labelled text input between the step buttons', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(SkyStepper, {
            decrementLabel: 'Decrease value',
            incrementLabel: 'Increase value',
            input: true,
            inputLabel: 'Stepper value',
            modelValue: 1,
          }),
      }),
    )

    expect(html).toContain('sky-stepper--input')
    expect(html).toContain('aria-label="Decrease value"')
    expect(html).toContain('aria-label="Stepper value"')
    expect(html).toContain('aria-label="Increase value"')
    expect(html).toContain('value="1"')
  })

  it('keeps the value and input on the contextual accent', () => {
    const uiDirectory = fileURLToPath(new URL('..', import.meta.url))
    const controls = readFileSync(`${uiDirectory}/controls.css`, 'utf8')

    expect(controls).toMatch(
      /\.sky-stepper__button\s*\{[\s\S]*?background: var\(--sky-app-accent, #007aff\);[\s\S]*?color: #ffffff;/,
    )
    expect(controls).toMatch(
      /\.sky-stepper__value\s*\{[\s\S]*?border-top: 2px solid var\(--sky-app-accent, #007aff\);[\s\S]*?border-bottom: 2px solid var\(--sky-app-accent, #007aff\);[\s\S]*?color: var\(--sky-app-accent, #007aff\);[\s\S]*?caret-color: var\(--sky-app-accent, #007aff\);/,
    )
    expect(controls).toMatch(
      /\.sky-stepper--outline \.sky-stepper__button\s*\{[\s\S]*?border: 2px solid var\(--sky-app-accent, #007aff\);[\s\S]*?background: transparent;[\s\S]*?color: var\(--sky-app-accent, #007aff\);/,
    )
    expect(controls).toMatch(
      /\.sky-stepper__decrement\s*\{[\s\S]*?border-start-start-radius: inherit;[\s\S]*?border-end-start-radius: inherit;/,
    )
    expect(controls).toMatch(
      /\.sky-stepper__increment\s*\{[\s\S]*?border-start-end-radius: inherit;[\s\S]*?border-end-end-radius: inherit;/,
    )
    expect(controls).not.toMatch(
      /\.sky-stepper__value\s*\{[\s\S]*?color: inherit;/,
    )
  })
})
