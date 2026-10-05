import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./VoiceMessageBubble.vue', import.meta.url),
  'utf8',
)

describe('VoiceMessageBubble contract', () => {
  it('uses the central accessible range to seek protected audio', () => {
    expect(source).toContain("import { SkyRange } from '@/ui'")
    expect(source).toContain('<SkyRange')
    expect(source).toContain("phone.t('Apps.messages.seekAudio')")
    expect(source).toContain('@input="seekPlayback"')
    expect(source).toContain('audio.value.currentTime = nextTime')
    expect(source).toContain('await ensureSource()')
    expect(source).toContain(
      'let sourceLoadPromise: Promise<boolean> | undefined',
    )
    expect(source).toContain('return sourceLoadPromise')
    expect(source).toContain(':aria-value-text="seekValueText"')
  })

  it('fits every stored sample into the available waveform width', () => {
    expect(source).toMatch(
      /\.voice-message__waveform i\s*\{[^}]*min-width:\s*1px;[^}]*flex:\s*1 1 1px;/s,
    )
  })
})
