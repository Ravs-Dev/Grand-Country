export type PicstagramProfile = {
  avatar_media_id: number | null
  avatar_url: string | null
  bio: string
  display_name: string
  follow_status: 'accepted' | 'pending' | null
  followers: number
  following: number
  handle: string
  id: string
  is_following: boolean
  is_owner: boolean
  is_requested: boolean
  locked: boolean
  post_count: number
  private: boolean
  status: 'active'
  verified: boolean
}

export type PicstagramPostMedia = {
  id: number
  media_type: 'photo' | 'video'
  position: number
  url: string
}

export type PicstagramPost = {
  avatar_url: string | null
  caption: string
  comment_count: number
  comments_enabled: boolean
  created_at: number
  display_name: string
  handle: string
  id: string
  is_liked: boolean
  is_owner: boolean
  is_saved: boolean
  like_count: number
  location: string
  media: PicstagramPostMedia[]
  private: boolean
  profile_id: string
  verified: boolean
}

export type PicstagramPage = {
  hasMore: boolean
  items: PicstagramPost[]
  nextCursor: string | null
}

export type PicstagramProfilePage = {
  posts: PicstagramPage
  profile: PicstagramProfile
}

export type PicstagramSearchResult = {
  posts: PicstagramPost[]
  profiles: PicstagramProfile[]
}

export type PicstagramComment = {
  avatar_url: string | null
  body: string
  created_at: number
  display_name: string
  handle: string
  id: string
  is_liked: boolean
  is_owner: boolean
  like_count: number
  parent_id: string | null
  profile_id: string
  reply_to_handle: string | null
  verified: boolean
}

export type PicstagramStory = {
  avatar_url: string | null
  body: string
  created_at: number
  display_name: string
  expires_at: number
  handle: string
  id: string
  is_owner: boolean
  media_type: 'photo' | 'video'
  profile_id: string
  seen: boolean
  url: string
  verified: boolean
  view_count: number
}

export type PicstagramStoryViewer = {
  avatar_url: string | null
  created_at: number
  display_name: string
  handle: string
  id: string
  verified: boolean
}

export type PicstagramActivityKind =
  | 'follow_request'
  | 'follow'
  | 'request_accepted'
  | 'like'
  | 'comment'
  | 'comment_like'
  | 'reply'
  | 'verified'

export type PicstagramActivity = {
  avatar_url: string | null
  created_at: number
  display_name: string
  handle: string
  id: string
  kind: PicstagramActivityKind
  post_id: string | null
  post_url: string | null
  profile_id: string
  read_at: string | null
  verified: boolean
}

export type PicstagramReportTarget = 'profile' | 'post' | 'story' | 'comment'

export type PicstagramReportReason =
  | 'spam'
  | 'harassment'
  | 'dangerous'
  | 'illegal'
  | 'other'

export type PicstagramReport = {
  created_at: number
  details: string
  id: string
  reason: PicstagramReportReason
  reporter_display_name: string
  reporter_handle: string
  target_id: string
  target_type: PicstagramReportTarget
}
