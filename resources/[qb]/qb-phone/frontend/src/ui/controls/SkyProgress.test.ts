import { readFileSync } from 'node:fs'

import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'

import SkyProgress from './SkyProgress.vue'

const controls = readFileSync(
  new URL('../controls.css', import.meta.url),
  'utf8',
)
const tokens = readFileSync(new URL('../tokens.css', import.meta.url), 'utf8')

async function renderProgress(progress: number): Promise<string> {
  return renderToString(
    createSSRApp({
      render: () =>
        h(SkyProgress, {
          label: 'Upload progress',
          progress,
        }),
    }),
  )
}

describe('SkyProgress', () => {
  it('clamps the semantic and visual progress values', async () => {
    const partial = await renderProgress(0.1)
    const belowRange = await renderProgress(-1)
    const aboveRange = await renderProgress(2)
    const invalid = await renderProgress(Number.NaN)

    expect(partial).toContain('role="progressbar"')
    expect(partial).toContain('aria-label="Upload progress"')
    expect(partial).toContain('aria-valuenow="10"')
    expect(partial).toContain('transform:translateX(-90%)')
    expect(belowRange).toContain('aria-valuenow="0"')
    expect(belowRange).toContain('transform:translateX(-100%)')
    expect(aboveRange).toContain('aria-valuenow="100"')
    expect(aboveRange).toContain('transform:translateX(-0%)')
    expect(invalid).toContain('aria-valuenow="0"')
  })

  it('matches the Konsta iOS track, fill and motion contract', () => {
    expect(tokens).toMatch(
      /\.sky-ui-provider,[\s\S]*?--sky-progress-track-color:\s*#000000;/,
    )
    expect(tokens).toMatch(
      /\.sky-ui-provider--dark,[\s\S]*?--sky-progress-track-color:\s*currentColor;/,
    )
    expect(controls).toMatch(
      /\.sky-progress\s*\{[^}]*height:\s*6px;[^}]*position:\s*relative;[^}]*overflow:\s*hidden;[^}]*border-radius:\s*999px;[^}]*background:\s*transparent;[^}]*color:\s*var\(--sky-app-accent, #007aff\);/s,
    )
    expect(controls).toMatch(
      /\.sky-progress::before\s*\{[^}]*inset:\s*0;[^}]*background:\s*var\(--sky-progress-track-color, #000000\);[^}]*opacity:\s*0\.1;/s,
    )
    expect(controls).toMatch(
      /\.sky-progress__value\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*background:\s*currentColor;[^}]*transition:\s*transform 200ms ease;/s,
    )
    expect(controls).toMatch(
      /\[dir='rtl'\] \.sky-progress,[\s\S]*?\.sky-progress\[dir='rtl'\]\s*\{[^}]*transform:\s*rotate\(180deg\);/,
    )
  })
})
