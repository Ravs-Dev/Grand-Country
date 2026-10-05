export type MusicSource = 'server' | 'youtube'

export type MusicTrack = {
  artist: string
  artwork: string | null
  createdAt?: number
  id: string
  source: MusicSource
  title: string
  url?: string
  videoId?: string
}

export type MusicPlaylistEntry = {
  songId: string
  source: MusicSource
}

export type MusicPlaylist = {
  createdAt: number
  entries: MusicPlaylistEntry[]
  id: string
  name: string
}

export type MusicBootstrap = {
  playlists: MusicPlaylist[]
  serverTracks: MusicTrack[]
  youtubeTracks: MusicTrack[]
}
