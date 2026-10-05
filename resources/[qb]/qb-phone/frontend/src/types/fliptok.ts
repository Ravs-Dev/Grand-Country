export type FlipTokProfile = {
  account_type: 'person' | 'business' | 'organization' | 'media' | 'event'
  avatar_media_id: number | null
  avatar_url: string | null
  bio: string
  display_name: string
  followers: number
  following: number
  handle: string
  id: number
  is_following: boolean
  is_owner: boolean
  verified: boolean
  video_count: number
}

export type FlipTokVideo = {
  avatar_url: string | null
  caption: string
  comment_count: number
  comments_enabled: boolean
  created_at: number
  display_name: string
  handle: string
  id: string
  is_following: boolean
  is_liked: boolean
  is_owner: boolean
  is_saved: boolean
  like_count: number
  location: string
  media?: Array<{
    id: number
    mediaType: 'photo' | 'video'
    url: string
  }>
  media_type?: 'photo' | 'video'
  cover_time_ms: number
  music_artist: string
  music_source: '' | 'audio' | 'youtube'
  music_title: string
  music_track: string
  music_url: string
  music_video_id: string
  music_volume: number
  original_volume: number
  profile_id: number
  share_count: number
  trim_end_ms: number | null
  trim_start_ms: number
  url: string
  verified: boolean
  view_count: number
}

export type FlipTokMusicTrack = {
  artist: string
  id: string
  title: string
  url: string
}

export type FlipTokProfilePage = {
  profile: FlipTokProfile
  videos: FlipTokVideo[]
}

export type FlipTokComment = {
  avatar_url: string | null
  body: string
  created_at: number
  display_name: string
  handle: string
  id: string
  is_liked: boolean
  like_count: number
  parent_id: string | null
  profile_id: number
  reply_to_handle: string | null
  verified: boolean
}

export type FlipTokActivity = {
  avatar_url: string | null
  created_at: number
  display_name: string
  handle: string
  id: string
  kind: 'like' | 'comment' | 'follow' | 'verified'
  profile_id: number
  read_at: string | null
  verified: boolean
  video_id: string | null
}

export type FlipTokPage = {
  hasMore: boolean
  items: FlipTokVideo[]
  offset: number
}
