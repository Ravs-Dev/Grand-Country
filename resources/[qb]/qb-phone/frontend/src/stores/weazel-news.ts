import { defineStore } from 'pinia'

import type {
  WeazelNewsArticle,
  WeazelNewsArticleDraft,
  WeazelNewsArticleResponse,
  WeazelNewsArticleSummary,
  WeazelNewsContext,
  WeazelNewsListResponse,
  WeazelNewsManagedListOptions,
  WeazelNewsManageStatus,
  WeazelNewsPublicListOptions,
} from '@/types/weazel-news'
import { nuiCall } from '@/utils/nui'

type ArticleMutationResponse = WeazelNewsArticle | WeazelNewsArticleResponse

function readArticle(
  data: ArticleMutationResponse | undefined,
): WeazelNewsArticle | null {
  if (!data) return null
  return 'article' in data ? data.article : data
}

function replaceArticle(
  items: WeazelNewsArticleSummary[],
  article: WeazelNewsArticleSummary,
): WeazelNewsArticleSummary[] {
  return items.map((item) => (item.id === article.id ? article : item))
}

function mergeArticles(
  current: WeazelNewsArticleSummary[],
  incoming: WeazelNewsArticleSummary[],
): WeazelNewsArticleSummary[] {
  const merged = new Map(current.map((article) => [article.id, article]))
  for (const article of incoming) merged.set(article.id, article)
  return [...merged.values()]
}

function sortNewestFirst(
  items: WeazelNewsArticleSummary[],
): WeazelNewsArticleSummary[] {
  return [...items].sort(
    (left, right) =>
      (right.publishedAt ?? right.updatedAt ?? right.createdAt) -
      (left.publishedAt ?? left.updatedAt ?? left.createdAt),
  )
}

export const useWeazelNewsStore = defineStore('weazel-news', {
  state: () => ({
    context: null as WeazelNewsContext | null,
    contextError: '',
    contextLoadSequence: 0,
    contextLoading: false,
    detailError: '',
    detailLoadSequence: 0,
    detailLoading: false,
    error: '',
    loading: false,
    managedError: '',
    managedLoadSequence: 0,
    managedLoading: false,
    managedHasMore: false,
    managedItems: [] as WeazelNewsArticleSummary[],
    mutating: false,
    publicHasMore: false,
    publicError: '',
    publicLoadSequence: 0,
    publicLoading: false,
    publicItems: [] as WeazelNewsArticleSummary[],
    selected: null as WeazelNewsArticle | null,
  }),
  actions: {
    async loadContext(): Promise<boolean> {
      const requestSequence = ++this.contextLoadSequence
      this.contextLoading = true
      this.loading = true
      const response = await nuiCall<WeazelNewsContext>('weazel-news:context')
      if (requestSequence !== this.contextLoadSequence) return false
      this.contextLoading = false
      this.loading =
        this.publicLoading || this.managedLoading || this.detailLoading
      if (!response.success || !response.data) {
        this.contextError = response.error ?? 'request_failed'
        this.error = this.contextError
        return false
      }
      this.context = response.data
      this.contextError = ''
      this.error = ''
      return true
    },
    async loadPublic(
      options: WeazelNewsPublicListOptions = {},
    ): Promise<boolean> {
      const append = options.append ?? false
      const requestSequence = ++this.publicLoadSequence
      this.publicLoading = true
      this.loading = true
      const response = await nuiCall<WeazelNewsListResponse>(
        'weazel-news:list',
        {
          category: options.category ?? null,
          offset: options.offset ?? (append ? this.publicItems.length : 0),
          search: options.search ?? '',
        },
      )
      if (requestSequence !== this.publicLoadSequence) return false
      this.publicLoading = false
      this.loading =
        this.contextLoading || this.managedLoading || this.detailLoading
      if (!response.success || !response.data) {
        this.publicError = response.error ?? 'request_failed'
        this.error = this.publicError
        return false
      }
      this.publicItems = sortNewestFirst(
        append
          ? mergeArticles(this.publicItems, response.data.items)
          : response.data.items,
      )
      this.publicHasMore = response.data.hasMore
      this.publicError = ''
      this.error = ''
      return true
    },
    async loadManaged(
      status: WeazelNewsManageStatus,
      options: WeazelNewsManagedListOptions = {},
    ): Promise<boolean> {
      const append = options.append ?? false
      const requestSequence = ++this.managedLoadSequence
      this.managedLoading = true
      this.loading = true
      const response = await nuiCall<WeazelNewsListResponse>(
        'weazel-news:manage-list',
        {
          offset: options.offset ?? (append ? this.managedItems.length : 0),
          search: options.search ?? '',
          status,
        },
      )
      if (requestSequence !== this.managedLoadSequence) return false
      this.managedLoading = false
      this.loading =
        this.contextLoading || this.publicLoading || this.detailLoading
      if (!response.success || !response.data) {
        this.managedError = response.error ?? 'request_failed'
        this.error = this.managedError
        return false
      }
      this.managedItems = append
        ? mergeArticles(this.managedItems, response.data.items)
        : response.data.items
      this.managedHasMore = response.data.hasMore
      this.managedError = ''
      this.error = ''
      return true
    },
    async loadArticle(id: string, manage = false): Promise<boolean> {
      const requestSequence = ++this.detailLoadSequence
      this.detailLoading = true
      this.loading = true
      const response = await nuiCall<ArticleMutationResponse>(
        'weazel-news:get',
        {
          id,
          manage,
        },
      )
      if (requestSequence !== this.detailLoadSequence) return false
      this.detailLoading = false
      this.loading =
        this.contextLoading || this.publicLoading || this.managedLoading
      const article = response.success ? readArticle(response.data) : null
      if (!article) {
        this.detailError = response.error ?? 'request_failed'
        this.error = this.detailError
        return false
      }
      this.selected = article
      this.detailError = ''
      this.publicItems = replaceArticle(this.publicItems, article)
      this.managedItems = replaceArticle(this.managedItems, article)
      this.error = ''
      return true
    },
    async create(
      draft: WeazelNewsArticleDraft,
    ): Promise<WeazelNewsArticle | null> {
      this.publicLoadSequence += 1
      this.managedLoadSequence += 1
      this.detailLoadSequence += 1
      this.publicLoading = false
      this.managedLoading = false
      this.detailLoading = false
      this.loading = this.contextLoading
      this.mutating = true
      const response = await nuiCall<ArticleMutationResponse>(
        'weazel-news:create',
        draft,
      )
      this.mutating = false
      const article = response.success ? readArticle(response.data) : null
      if (!article) {
        this.error = response.error ?? 'request_failed'
        return null
      }
      this.selected = article
      this.managedItems = [
        article,
        ...this.managedItems.filter((item) => item.id !== article.id),
      ]
      if (article.status === 'published') {
        this.publicItems = sortNewestFirst([
          article,
          ...this.publicItems.filter((item) => item.id !== article.id),
        ])
      }
      this.error = ''
      return article
    },
    async update(
      article: WeazelNewsArticle,
      draft: WeazelNewsArticleDraft,
    ): Promise<WeazelNewsArticle | null> {
      this.publicLoadSequence += 1
      this.managedLoadSequence += 1
      this.detailLoadSequence += 1
      this.publicLoading = false
      this.managedLoading = false
      this.detailLoading = false
      this.loading = this.contextLoading
      this.mutating = true
      const response = await nuiCall<ArticleMutationResponse>(
        'weazel-news:update',
        {
          ...draft,
          id: article.id,
          revision: article.revision,
        },
      )
      this.mutating = false
      const canonical = response.success ? readArticle(response.data) : null
      if (!canonical) {
        this.error = response.error ?? 'request_failed'
        return null
      }
      if (this.selected?.id === canonical.id) this.selected = canonical
      this.managedItems = replaceArticle(this.managedItems, canonical)
      this.publicItems =
        canonical.status === 'published'
          ? sortNewestFirst([
              canonical,
              ...this.publicItems.filter((item) => item.id !== canonical.id),
            ])
          : this.publicItems.filter((item) => item.id !== canonical.id)
      this.error = ''
      return canonical
    },
    async remove(article: WeazelNewsArticle): Promise<boolean> {
      this.publicLoadSequence += 1
      this.managedLoadSequence += 1
      this.detailLoadSequence += 1
      this.publicLoading = false
      this.managedLoading = false
      this.detailLoading = false
      this.loading = this.contextLoading
      this.mutating = true
      const response = await nuiCall('weazel-news:delete', {
        id: article.id,
        revision: article.revision,
      })
      this.mutating = false
      if (!response.success) {
        this.error = response.error ?? 'request_failed'
        return false
      }
      this.publicItems = this.publicItems.filter(
        (item) => item.id !== article.id,
      )
      this.managedItems = this.managedItems.filter(
        (item) => item.id !== article.id,
      )
      if (this.selected?.id === article.id) this.selected = null
      this.error = ''
      return true
    },
  },
})
