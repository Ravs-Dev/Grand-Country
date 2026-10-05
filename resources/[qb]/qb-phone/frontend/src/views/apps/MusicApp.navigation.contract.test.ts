import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./MusicApp.vue', import.meta.url), 'utf8')
const navigationSource = source.slice(
  source.indexOf('<SkyPillNavigation'),
  source.indexOf('</SkyPillNavigation>') + '</SkyPillNavigation>'.length,
)

describe('MusicApp Sky pill navigation contract', () => {
  it('uses the centered surface back action owned by SkyNavbar for playlists', () => {
    const navbarTag = source.match(/<sky-navbar\b[^>]*>/is)?.[0]

    expect(navbarTag).toBeDefined()
    expect(navbarTag).toContain(':show-back="Boolean(activePlaylist)"')
    expect(navbarTag).toContain('back-appearance="surface"')
    expect(navbarTag).toContain('Apps.music.tabs.playlists')
    expect(navbarTag).toContain('@back="closePlaylist"')
    expect(source).not.toContain('SkyNavbarBackLink,')
    expect(source).not.toContain('<sky-navbar-back-link')
  })

  it('inherits the central safe areas for the iPhone header', () => {
    const appRuleStart = source.indexOf('.music-app {')
    const appRule = source.slice(
      appRuleStart,
      source.indexOf('}', appRuleStart) + 1,
    )

    expect(appRule).not.toContain('--sky-safe-area-top:')
    expect(appRule).not.toContain('--sky-safe-area-bottom:')
  })

  it('uses the full-width sliding Glass navigation outside playlists', () => {
    expect(source).not.toContain('kTabbar')
    expect(source).not.toContain('kTabbarLink')
    expect(source).not.toContain('kToolbarPane')
    expect(source).not.toContain('<k-tabbar')
    expect(source).not.toContain('<k-toolbar-pane')
    expect(navigationSource).toContain('v-if="!activePlaylist"')
    expect(navigationSource).toContain('layout="full"')
    expect(navigationSource).toContain('<SkySegmented')
    expect(navigationSource).toContain('navigation')
    expect(navigationSource).toContain(':active-index="activeTabIndex"')
    expect(navigationSource).toContain(':data-active-tab="activeTab"')
    expect(navigationSource).toContain(':item-count="tabs.length"')
    expect(navigationSource).toContain('<SkySegmentedButton')
    expect(navigationSource).not.toContain('compact')
  })

  it('keeps the three localized Music destinations and switching behavior', () => {
    expect(source).toContain("{ id: 'library', icon: Library }")
    expect(source).toContain("{ id: 'playlists', icon: ListMusic }")
    expect(source).toContain("{ id: 'search', icon: Search }")
    expect(navigationSource).toContain(':active="activeTab === item.id"')
    expect(navigationSource).toContain(
      ':aria-label="phone.t(`Apps.music.tabs.${item.id}`)"',
    )
    expect(navigationSource).toContain('@click="selectTab(item.id)"')
    expect(navigationSource).toContain(':size="20"')
    expect(source).toMatch(
      /function selectTab\(tab: MusicTab\): void \{\s+activeTab\.value = tab\s+activePlaylist\.value = null\s+scrollToTop\(\)\s+\}/,
    )
  })

  it('reserves the absolute navigation and mini-player without changing playlist space', () => {
    expect(source).toMatch(
      /\.music-scroll\s*\{[^}]*padding:\s*8px 0\s*calc\(\s*var\(--sky-safe-area-bottom\) \+ var\(--sky-tabbar-height\) \+\s*var\(--sky-space-3\)\s*\)/s,
    )
    expect(source).toMatch(
      /\.music-app--playing \.music-scroll\s*\{[^}]*padding-bottom:\s*calc\(\s*var\(--music-mini-player-bottom\) \+ var\(--music-mini-player-height\) \+\s*var\(--sky-space-3\)\s*\)/s,
    )
    expect(source).toContain(
      'var(--sky-safe-area-bottom) + var(--sky-tabbar-height) + var(--sky-space-2)',
    )
    expect(source).toContain('--music-mini-player-height: 58px')
    const miniPlayerRuleStart = source.indexOf('.music-mini-player {')
    const miniPlayerRule = source.slice(
      miniPlayerRuleStart,
      source.indexOf('}', miniPlayerRuleStart) + 1,
    )
    expect(miniPlayerRule).toContain(
      'right: calc(var(--sky-safe-area-right) + var(--sky-space-4))',
    )
    expect(miniPlayerRule).toContain(
      'left: calc(var(--sky-safe-area-left) + var(--sky-space-4))',
    )
    expect(source).toMatch(
      /\.music-app--playlist \.music-scroll\s*\{[^}]*padding-bottom:\s*42px/s,
    )
    expect(source).toMatch(
      /\.music-app--playlist\.music-app--playing \.music-scroll\s*\{[^}]*padding-bottom:\s*100px/s,
    )
  })

  it('bridges the Music accent and light-dark theme into Sky UI', () => {
    expect(source).toContain('class="music-app sky-ui-provider"')
    expect(source).toContain("'sky-ui-provider--dark': phone.isDarkMode")
    expect(source).toContain('--sky-app-accent: var(--music-accent)')
    expect(source).toContain('class="music-navigation__item"')
    expect(source).toMatch(
      /\.music-navigation__item > span:last-child\s*\{[^}]*text-overflow:\s*ellipsis[^}]*white-space:\s*nowrap/s,
    )
    expect(source).not.toContain('.music-tabbar')
  })
})
