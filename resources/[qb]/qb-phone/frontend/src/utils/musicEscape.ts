export type MusicEscapeLayer =
  | 'delete-playlist-confirmation'
  | 'menu'
  | 'player'
  | 'remove-track-confirmation'
  | 'sheet'

export function musicEscapeLayer(state: {
  actionMenuOpened: boolean
  activeSheet: boolean
  addMenuOpened: boolean
  confirmDeletePlaylist: boolean
  confirmRemoveTrack: boolean
  playerOpened: boolean
}): MusicEscapeLayer | null {
  if (state.confirmRemoveTrack) return 'remove-track-confirmation'
  if (state.confirmDeletePlaylist) return 'delete-playlist-confirmation'
  if (state.activeSheet) return 'sheet'
  if (state.addMenuOpened || state.actionMenuOpened) return 'menu'
  if (state.playerOpened) return 'player'
  return null
}
