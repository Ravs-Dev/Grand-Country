import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./MusicApp.vue', import.meta.url), 'utf8')
const playlistPlaceholder = readFileSync(
  new URL('../../assets/img/music/playlist-placeholder.jpg', import.meta.url),
)
const menuSource = source.match(/<SkyDropdown[\s\S]*?\/>/)?.[0] ?? ''
const menuItemsSource = source.slice(
  source.indexOf('const menuItems = computed'),
  source.indexOf('function eventValue'),
)
const menuDispatcherSource = source.slice(
  source.indexOf('function selectMenuItem'),
  source.indexOf('function shareTrack'),
)

describe('MusicApp action menu contract', () => {
  it('uses the shared anchored Sky dropdown and its close paths', () => {
    expect(source).toContain('SkyDropdown,')
    expect(source).toContain('const menuTarget = ref<HTMLElement | null>(null)')
    expect(source.split('menuTarget.value = event.currentTarget')).toHaveLength(
      3,
    )
    expect(menuSource).toContain(':items="menuItems"')
    expect(menuSource).toContain(':label="menuLabel"')
    expect(menuSource).toContain(':opened="addMenuOpened || actionMenuOpened"')
    expect(menuSource).toContain(':target="menuTarget"')
    expect(menuSource).toContain('@backdropclick="dismissMenus"')
    expect(menuSource).toContain('@escape="dismissMenus"')
    expect(menuSource).toContain('@positionerror="dismissMenus"')
    expect(menuSource).toContain('@select="selectMenuItem"')
  })

  it('exposes accessible expanded state on every plus and more trigger', () => {
    expect(source.match(/aria-haspopup="menu"/g)).toHaveLength(5)
    expect(source.split(':aria-expanded="addMenuOpened"')).toHaveLength(3)
    expect(source.split('actionTrack?.id === track.id')).toHaveLength(4)
    expect(source.split('actionTrack?.source === track.source')).toHaveLength(4)
  })

  it('keeps every add, playlist, and track action in the central dropdown', () => {
    for (const id of [
      'share-playlist',
      'add-songs',
      'rename-playlist',
      'delete-playlist',
      'add-youtube',
      'new-playlist',
      'share-track',
      'add-to-playlist',
      'remove-from-playlist',
      'remove-from-library',
    ]) {
      expect(menuItemsSource).toContain(`id: '${id}'`)
      expect(menuDispatcherSource).toContain(`case '${id}'`)
    }

    for (const action of [
      'shareActivePlaylist()',
      'openActivePlaylistTrackPicker()',
      "openSheet('rename')",
      'requestDeletePlaylist()',
      "openSheet('youtube')",
      'openNewPlaylist()',
      'shareTrack()',
      'openPlaylistPicker(actionTrack.value)',
      'void removeFromActivePlaylist()',
      'requestRemoveTrack()',
    ]) {
      expect(menuDispatcherSource).toContain(action)
    }

    expect(menuItemsSource.match(/destructive: true/g)).toHaveLength(3)
    expect(menuItemsSource.match(/separatorBefore:/g)).toHaveLength(3)
  })

  it('uses the generated playlist artwork when no usable preview exists', () => {
    expect(source).toContain(
      "import playlistPlaceholder from '@/assets/img/music/playlist-placeholder.jpg'",
    )
    expect(source).toContain("phone.t('Apps.music.playlistActions')")
    expect(source).not.toContain('playlist-placeholder.png')
    expect([...playlistPlaceholder.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff])
    expect(playlistPlaceholder.byteLength).toBeGreaterThan(80_000)
    expect(playlistPlaceholder.byteLength).toBeLessThan(150_000)
    expect(source).toContain('track.artwork.trim().length > 0')
    expect(source).toContain('.filter(hasPlaylistArtwork)')
    expect(source.match(/class="music-playlist-placeholder"/g)).toHaveLength(2)
    expect(source.match(/@error="usePlaylistPlaceholder"/g)).toHaveLength(2)
    expect(source).toContain('image.src = playlistPlaceholder')
    expect(source).toContain(
      'imageUrl: playlistArtwork(playlist)[0]?.artwork || playlistPlaceholder',
    )
    expect(source).toMatch(
      /\.music-playlist-placeholder\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*grid-row:\s*1 \/ -1;/s,
    )
  })

  it('does not retain the generic or manually positioned popover menu', () => {
    expect(source).not.toContain('SkyPopover,')
    expect(source).not.toContain('<SkyPopover')
    expect(source).not.toContain('SkyListButton,')
    expect(source).not.toContain('<sky-list-button')
    expect(source).not.toContain('positionPopover')
    expect(source).not.toContain('popoverStyle')
    expect(source).not.toContain('MUSIC_POPOVER_')
    expect(source).not.toContain('music-popover-dismiss')
    expect(source).not.toContain('class="music-popover"')
  })
})
