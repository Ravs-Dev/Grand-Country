import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./RadioApp.vue', import.meta.url), 'utf8')
const navigationSource = source.slice(
  source.indexOf('<SkyPillNavigation'),
  source.indexOf('</SkyPillNavigation>') + '</SkyPillNavigation>'.length,
)

describe('RadioApp Sky UI contract', () => {
  it('uses only the first-party Sky UI surface', () => {
    expect(source).not.toContain("from 'konsta/vue'")
    expect(source).not.toMatch(/<\/?k-[a-z]/)
    expect(source).toContain('<SkyAppPage')
    expect(source).toContain('<SkyNavbar')
    expect(source).toContain('<SkyPillNavigation')
    expect(source.match(/<SkyScrollArea\b/g)).toHaveLength(1)
    expect(source).toContain('<SkyStatusCard')
    expect(source).toContain('<SkyField')
    expect(source).toContain('<SkyRange')
    expect(source).toContain('<SkySettingsGroup')
    expect(source).toContain('<SkySettingsRow')
    expect(source).toContain('<SkyNotification')
  })

  it('renders Radio and Settings in full-width bottom Glass navigation', () => {
    expect(navigationSource).toContain('layout="full"')
    expect(navigationSource).toContain('<SkySegmented')
    expect(navigationSource).toContain('navigation')
    expect(navigationSource).toContain('rounded')
    expect(navigationSource).toContain('strong')
    expect(navigationSource).toContain(
      ':active-index="tab === \'radio\' ? 0 : 1"',
    )
    expect(navigationSource).toContain(':data-active-tab="tab"')
    expect(navigationSource).toContain(':item-count="2"')
    expect(navigationSource.match(/<SkySegmentedButton\b/g)).toHaveLength(2)
    expect(navigationSource).toContain("tab = 'radio'")
    expect(navigationSource).toContain("tab = 'settings'")
    expect(navigationSource).toContain(
      ':aria-label="phone.t(\'Apps.radio.tabs.radio\')"',
    )
    expect(navigationSource).toContain(
      ':aria-label="phone.t(\'Apps.radio.tabs.settings\')"',
    )
    expect(navigationSource.match(/:size="20"/g)).toHaveLength(2)
    expect(navigationSource).not.toContain('compact')
    expect(source).toContain(
      '<SkyScrollArea padded class="radio-content" with-tabbar>',
    )
    expect(source.indexOf('</SkyScrollArea>')).toBeLessThan(
      source.indexOf('<SkyPillNavigation'),
    )
    expect(source).not.toMatch(/\.radio-content\s*\{[^}]*padding-bottom\s*:/s)
    expect(source).not.toContain('<template #subnavbar>')
    expect(source).not.toContain('radio-tab-switcher')
    expect(source).toMatch(
      /\.radio-navigation__item > span:last-child\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/s,
    )
  })

  it('keeps the Radio actions, hydration and trusted updates wired', () => {
    expect(source).toContain('await radio.load()')
    expect(source).toContain('await radio.connect(primary, secondary)')
    expect(source).toContain('await radio.disconnect()')
    expect(source).toContain('void radio.setVolume(volumeInput.value)')
    expect(source).toContain("radio.saveSetting('autoRejoin', $event)")
    expect(source).toContain("radio.saveSetting('notifications', $event)")
    expect(source).toContain('await radio.saveDisplayName(displayName)')
    expect(source).toContain('await radio.saveBadge(badge)')
    expect(source).toContain('isTrustedRootMessageSource(event.source, window)')
    expect(source).toContain("event.data?.type === 'radio:updated'")
    expect(source).toContain('radio.updateMembers(event.data.data.members)')
    expect(source).toContain("window.addEventListener('message', onMessage)")
    expect(source).toContain("window.removeEventListener('message', onMessage)")
    expect(source).toContain("value.replace(',', '.')")
    expect(source).toContain('connectHistory(entry)')
  })

  it('keeps the volume slider inside its Sky list row and exposes speaker progress', () => {
    const volumeTitle = ':title="phone.t(\'Apps.radio.volume\')"'
    const volumeRowStart = source.lastIndexOf(
      '<SkyListItem',
      source.indexOf(volumeTitle),
    )
    const volumeRow = source.slice(
      volumeRowStart,
      source.indexOf(
        '</SkyListItem>',
        volumeRowStart,
      ) + '</SkyListItem>'.length,
    )

    expect(volumeRow).toContain('<template #after>')
    expect(volumeRow).toContain('<template #inner>')
    expect(volumeRow).toContain('<SkyRange')
    expect(volumeRow).not.toContain(':caption=')
    expect(source.match(/media-class="radio-audio-control-icon"/g)).toHaveLength(
      2,
    )
    expect(source.match(/:strong-title="false"/g)).toHaveLength(2)
    expect(
      source.match(/title-font-size-ios="radio-audio-control-title"/g),
    ).toHaveLength(2)
    expect(source).toMatch(
      /:deep\(\.radio-audio-control-icon\)\s*\{[^}]*color:\s*var\(--sky-text\)/s,
    )
    expect(source).toMatch(
      /:deep\(\.radio-audio-control-title\)\s*\{[^}]*font-size:\s*12px[^}]*font-weight:\s*400[^}]*line-height:\s*16px/s,
    )
    expect(source).toContain('inner-class="radio-speaker-content"')
    expect(source).toMatch(
      /:deep\(\.radio-speaker-content \.sky-list-item__subtitle\)\s*\{[^}]*color:\s*var\(--sky-muted\)[^}]*font-size:\s*12px[^}]*line-height:\s*16px/s,
    )
    expect(source).toContain(':aria-busy="radio.speakerPending || undefined"')
    expect(source).toContain('!radio.data.speakerSupported ||')
    expect(source).toContain('!radio.data.connected ||')
    expect(source).toContain('radio.speakerPending')
  })

  it('keeps provider capability rows stable when PMA lacks secondary and speaker support', () => {
    const secondaryFieldStart = source.lastIndexOf(
      '<SkyField',
      source.indexOf("phone.t('Apps.radio.secondaryFrequency')"),
    )
    const secondaryField = source.slice(
      secondaryFieldStart,
      source.indexOf('</SkyField>', secondaryFieldStart),
    )
    const speakerRowStart = source.lastIndexOf(
      '<SkyListItem',
      source.indexOf("phone.t('Apps.radio.speaker')"),
    )
    const speakerRow = source.slice(
      speakerRowStart,
      source.indexOf('</SkyListItem>', speakerRowStart),
    )

    expect(secondaryField.slice(0, secondaryField.indexOf('>'))).not.toContain(
      'v-if="radio.data.secondarySupported"',
    )
    expect(secondaryField).toContain(
      ':disabled="!radio.data.secondarySupported"',
    )
    expect(secondaryField).toContain("'Apps.radio.notSupported'")
    expect(speakerRow).not.toContain('v-if="radio.data.speakerSupported"')
    expect(speakerRow).toContain(':disabled="!radio.data.speakerSupported"')
    expect(source).toContain("'Apps.radio.providerFeatureUnavailable'")
  })

  it('uses compact profile placeholders without dropping the full guidance', () => {
    expect(source.match(/class="radio-profile-field"/g)).toHaveLength(2)
    expect(source).toMatch(
      /:deep\(\.radio-profile-field \.sky-field__input\)\s*\{[^}]*min-width:\s*0[^}]*font-size:\s*15px/s,
    )
  })

  it('uses the rounded Sky button treatment for both primary actions', () => {
    const primaryActions = source.slice(
      source.indexOf('<div class="radio-primary-action">'),
      source.indexOf(
        '</div>',
        source.indexOf('<div class="radio-primary-action">'),
      ) + '</div>'.length,
    )

    expect(primaryActions.match(/<SkyButton\b/g)).toHaveLength(2)
    expect(primaryActions.match(/\r?\n\s+rounded\r?\n/g)).toHaveLength(2)
  })

  it('keeps the recently connected list close to its section title', () => {
    expect(source).toContain(
      '<SkyList v-else inset strong class="radio-history-list">',
    )
    expect(source).toMatch(
      /\.radio-history-list\s*\{[^}]*margin-top:\s*var\(--sky-space-2\)/s,
    )
  })

  it('preserves theme, labels, loading, empty, error and feedback states', () => {
    expect(source).toContain(':dark="phone.isDarkMode"')
    expect(source).toContain(':label="phone.t(\'Apps.radio.name\')"')
    expect(source).toContain('radio.isLoading && !radio.data.provider')
    expect(source).toContain('<span aria-hidden="true">')
    expect(source).toContain('<SkyEmptyState')
    expect(source).toContain('role="alert"')
    expect(source).toContain(':opened="Boolean(feedback)"')
    expect(source).toContain(':text="feedback"')
    expect(source).not.toContain('vertical-position=')
  })
})
