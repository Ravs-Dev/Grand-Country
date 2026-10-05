import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const component = readFileSync(
  new URL('./MessageAttachmentBubble.vue', import.meta.url),
  'utf8',
)
const styles = readFileSync(
  new URL('../assets/main.css', import.meta.url),
  'utf8',
)

describe('MessageAttachmentBubble contract', () => {
  it('renders an optional caption below media', () => {
    expect(component).toContain('message.body?.trim()')
    expect(component).toContain('messages-attachment-caption')
  })

  it('gives image-only messages an accessible name', () => {
    expect(component).toContain('role="img"')
    expect(component).toContain('Apps.photos.photoAlt')
  })

  it('keeps remote GIFs proportional instead of cover-cropping them', () => {
    expect(component).toContain('messages-attachment--remote')
    expect(styles).toMatch(
      /\.messages-attachment--gif\.messages-attachment--remote img\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*object-fit:\s*contain;/s,
    )
  })
})
