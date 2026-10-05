export const WEAZEL_NEWS_CATEGORY_IDS = [
  'official',
  'events',
  'jobs',
  'news',
  'business',
] as const

export const WEAZEL_NEWS_ARTICLE_STATUSES = ['draft', 'published'] as const

export type WeazelNewsCategoryId = (typeof WEAZEL_NEWS_CATEGORY_IDS)[number]

export type WeazelNewsArticleStatus =
  (typeof WEAZEL_NEWS_ARTICLE_STATUSES)[number]

export type WeazelNewsManageStatus = 'all' | WeazelNewsArticleStatus

export type WeazelNewsCategorySummary = {
  count: number
  id: WeazelNewsCategoryId
}

export type WeazelNewsArticleImage = {
  mediaId: number
  url: string
}

export type WeazelNewsArticle = {
  authorName: string
  body: string
  category: WeazelNewsCategoryId
  createdAt: number
  excerpt: string
  id: string
  imageMediaId?: number | null
  imageUrl?: string | null
  images: WeazelNewsArticleImage[]
  publishedAt?: number | null
  revision: number
  status: WeazelNewsArticleStatus
  title: string
  updatedAt: number
}

export type WeazelNewsArticleSummary = Omit<WeazelNewsArticle, 'body'>

export type WeazelNewsArticleDraft = {
  body: string
  category: WeazelNewsCategoryId
  imageMediaIds: number[]
  status: WeazelNewsArticleStatus
  title: string
}

export type WeazelNewsContext = {
  canManage: boolean
  categories: WeazelNewsCategorySummary[]
  jobGradeLabel?: string
  jobLabel?: string
  maximumImages: number
}

export type WeazelNewsListResponse = {
  hasMore: boolean
  items: WeazelNewsArticleSummary[]
}

export type WeazelNewsPublicListOptions = {
  append?: boolean
  category?: WeazelNewsCategoryId | null
  offset?: number
  search?: string
}

export type WeazelNewsManagedListOptions = {
  append?: boolean
  offset?: number
  search?: string
}

export type WeazelNewsArticleResponse = {
  article: WeazelNewsArticle
}
