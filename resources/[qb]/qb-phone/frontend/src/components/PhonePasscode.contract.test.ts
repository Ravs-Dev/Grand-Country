import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./PhonePasscode.vue', import.meta.url),
  'utf8',
)

describe('PhonePasscode iOS presentation contract', () => {
  it('uses the Lock Screen wallpaper and status bar for device unlocks', () => {
    expect(source).toContain('lockScreen?: boolean')
    expect(source).toContain('settings.lockWallpaperImageUrl')
    expect(source).toContain(
      'wallpaper--${phone.preferences.settings.lockWallpaper}',
    )
    expect(source).toContain('<PhoneStatusBar v-if="lockScreen"')
  })

  it('renders the telephone letters and accessible native-size controls', () => {
    expect(source).toContain("{ digit: 2, letters: 'ABC' }")
    expect(source).toContain("{ digit: 7, letters: 'PQRS' }")
    expect(source).toContain('min-height: var(--sky-touch-target)')
    expect(source).toContain('passcode-screen__footer')
    expect(source).toContain('--passcode-key-background: transparent')
    expect(source).toContain('@keydown="handleKeydown"')
  })

  it('keeps light, dark and reduced-motion treatments explicit', () => {
    expect(source).toContain(':global(.phone-app--light)')
    expect(source).toContain('@media (prefers-reduced-motion: reduce)')
    expect(source).toContain('passcode-screen__backdrop')
  })
})
