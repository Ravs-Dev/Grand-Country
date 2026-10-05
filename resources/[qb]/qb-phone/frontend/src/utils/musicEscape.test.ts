import { describe, expect, it } from 'vitest'

import { musicEscapeLayer } from '@/utils/musicEscape'

const closedState = {
  actionMenuOpened: false,
  activeSheet: false,
  addMenuOpened: false,
  confirmDeletePlaylist: false,
  confirmRemoveTrack: false,
  playerOpened: false,
}

describe('music Escape ownership', () => {
  it('owns Escape while either music popover is open', () => {
    expect(
      musicEscapeLayer({ ...closedState, addMenuOpened: true }),
    ).toBe('menu')
    expect(
      musicEscapeLayer({ ...closedState, actionMenuOpened: true }),
    ).toBe('menu')
  })

  it('keeps a real form sheet above menus and the player', () => {
    expect(
      musicEscapeLayer({
        ...closedState,
        activeSheet: true,
        addMenuOpened: true,
        playerOpened: true,
      }),
    ).toBe('sheet')
  })

  it('does not claim Escape with no music overlay open', () => {
    expect(musicEscapeLayer(closedState)).toBeNull()
  })
})
