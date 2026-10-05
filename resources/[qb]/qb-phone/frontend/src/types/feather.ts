export type FeatherMedia = {
  id: number
  media_type: 'photo'
  url: string
}

export type FeatherProfile = {
  avatar_url?: string
  bio: string
  display_name: string
  followers: number
  following: number
  handle: string
  id: number
  is_following: boolean
  is_owner: boolean
  post_count: number
  verified: boolean
}

export type FeatherPost = {
  avatar_url?: string
  body: string
  created_at: number
  display_name: string
  handle: string
  id: string
  is_bookmarked: boolean
  is_following: boolean
  is_liked: boolean
  is_owner: boolean
  like_count: number
  media: FeatherMedia[]
  profile_id: number
  quote_id?: string
  reply_count: number
  reply_to_id?: string
  verified: boolean
}

export type FeatherPage = {
  hasMore: boolean
  items: FeatherPost[]
  offset: number
}

export type FeatherActivity = {
  avatar_url?: string
  created_at: number
  display_name: string
  handle: string
  id: string
  kind: 'like' | 'reply' | 'follow' | 'quote'
  post_id?: string
  profile_id: number
  read: boolean
  verified: boolean
}

export type FeatherTopic = {
  count: number
  tag: string
}

export type FeatherBootstrap = {
  feed?: FeatherPage
  onboarded: boolean
  profile?: FeatherProfile
  suggestions?: FeatherProfile[]
  topics: FeatherTopic[]
}

export type FeatherProfilePage = {
  posts: FeatherPost[]
  profile: FeatherProfile
}

export type FeatherThread = {
  post: FeatherPost
  replies: FeatherPost[]
}
