import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./SpringboardView.vue', import.meta.url),
  'utf8',
)

describe('Springboard widget actions Sky UI contract', () => {
  it('uses the first-party action sheet without legacy Konsta sheet markup', () => {
    expect(source).not.toContain('<k-sheet')
    expect(source).not.toContain('<k-list')
    expect(source).not.toContain('<k-list-item')
    expect(source).toContain('<SkyProvider')
    expect(source).toContain('<SkyActionSheet')
    expect(source).toContain('<SkyActionGroup')
    expect(source).toContain('<SkyActionsLabel')
    expect(source).toContain('<SkyActionButton')
  })

  it('anchors the action sheet to the phone-owned springboard', () => {
    expect(source).toMatch(
      /\.widget-action-provider\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*pointer-events:\s*none;/s,
    )
    expect(source).toMatch(
      /\.widget-action-sheet\s*\{[^}]*--sky-overlay-layer:\s*105;/s,
    )
  })

  it('keeps ordinary actions white and removal destructive', () => {
    expect(source).toMatch(
      /\.widget-action-sheet\s+:deep\(\.sky-action-button\)\s*\{[^}]*color:\s*#fff;/s,
    )
    expect(source).toMatch(
      /\.widget-action-sheet\s+:deep\(\.widget-action-remove\)\s*\{[^}]*color:\s*var\(--sky-danger\);/s,
    )
  })
})
