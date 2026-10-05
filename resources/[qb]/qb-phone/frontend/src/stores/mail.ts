import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAccountStore } from '@/stores/account'
import type { IfruitAccount } from '@/types/device'
import type {
  MailComposeDraft,
  MailCounts,
  MailDraft,
  MailFolderKey,
  MailListItem,
  MailListFilters,
  MailListResponse,
  MailMailbox,
  MailMailboxesResponse,
  MailMessage,
} from '@/types/mail'
import { nuiCall } from '@/utils/nui'

const emptyCounts = (): MailCounts => ({
  drafts: 0,
  inbox: 0,
  sent: 0,
  trash: 0,
  unread: 0,
})
const emptyListFilters = (): MailListFilters => ({
  address: 'all',
  direction: 'all',
  read: 'all',
  today: false,
})

export const useMailStore = defineStore('mail', () => {
  const account = useAccountStore()
  const accountEmail = ref('')
  const counts = ref<MailCounts>(emptyCounts())
  const folder = ref<MailFolderKey>('inbox')
  const hasMore = ref(false)
  const items = ref<MailListItem[]>([])
  const loading = ref(false)
  const listFilters = ref<MailListFilters>(emptyListFilters())
  const mailboxes = ref<MailMailbox[]>([])
  const search = ref('')
  let authenticationGeneration = 0
  let folderRequestGeneration = 0
  let sessionGeneration = 0

  function clearSession(): void {
    authenticationGeneration += 1
    sessionGeneration += 1
    folderRequestGeneration += 1
    accountEmail.value = ''
    counts.value = emptyCounts()
    listFilters.value = emptyListFilters()
    mailboxes.value = []
    items.value = []
    hasMore.value = false
    folder.value = 'inbox'
    search.value = ''
    loading.value = false
  }

  async function bootstrap(email: string): Promise<void> {
    if (!email) {
      clearSession()
      return
    }
    authenticationGeneration += 1
    sessionGeneration += 1
    folderRequestGeneration += 1
    accountEmail.value = email
    await Promise.all([refreshCounts(), loadMailboxes()])
  }

  async function login(email: string, password: string) {
    const generation = ++authenticationGeneration
    const response = await nuiCall<IfruitAccount>('mail:login', {
      email,
      password,
    })
    if (
      generation === authenticationGeneration &&
      response.success &&
      response.data
    ) {
      account.hydrate(response.data)
      await bootstrap(response.data.email)
    }
    return response
  }

  async function register(email: string, password: string) {
    const generation = ++authenticationGeneration
    const response = await nuiCall<IfruitAccount>('mail:register', {
      email,
      password,
    })
    if (
      generation === authenticationGeneration &&
      response.success &&
      response.data
    ) {
      account.hydrate(response.data)
      await bootstrap(response.data.email)
    }
    return response
  }

  async function logout(): Promise<void> {
    const generation = ++authenticationGeneration
    if (accountEmail.value) {
      const response = await nuiCall('mail:logout')
      if (generation !== authenticationGeneration) return
      if (response.success) account.hydrate(null)
    }
    if (generation !== authenticationGeneration) return
    clearSession()
  }

  async function loadFolder(
    nextFolder: MailFolderKey,
    nextSearch = '',
    append = false,
  ): Promise<boolean> {
    const generation = ++folderRequestGeneration
    const session = sessionGeneration
    loading.value = true
    const offset = append ? items.value.length : 0
    const hasFilters =
      listFilters.value.address !== 'all' ||
      listFilters.value.direction !== 'all' ||
      listFilters.value.read !== 'all' ||
      listFilters.value.today
    const response = await nuiCall<MailListResponse>('mail:list', {
      folder: nextFolder,
      offset,
      search: nextSearch,
      ...(hasFilters ? { filters: { ...listFilters.value } } : {}),
    })
    if (generation === folderRequestGeneration) loading.value = false
    if (
      generation !== folderRequestGeneration ||
      session !== sessionGeneration
    ) {
      return false
    }
    if (!response.success || !response.data) return false

    folder.value = nextFolder
    search.value = nextSearch
    items.value = append
      ? [...items.value, ...response.data.items]
      : response.data.items
    hasMore.value = response.data.hasMore
    return true
  }

  async function refreshCounts(): Promise<void> {
    const email = accountEmail.value
    const session = sessionGeneration
    const response = await nuiCall<MailCounts>('mail:counts')
    if (
      session === sessionGeneration &&
      email === accountEmail.value &&
      response.success &&
      response.data
    ) {
      counts.value = response.data
    }
  }

  async function loadMailboxes(): Promise<boolean> {
    const email = accountEmail.value
    const session = sessionGeneration
    const response = await nuiCall<MailMailboxesResponse>('mail:mailboxes')
    if (
      session !== sessionGeneration ||
      email !== accountEmail.value ||
      !response.success ||
      !response.data
    ) {
      return false
    }

    mailboxes.value = response.data.mailboxes
    return true
  }

  async function createMailbox(name: string) {
    const session = sessionGeneration
    const response = await nuiCall<MailMailbox>('mail:create-mailbox', { name })
    if (response.success && session === sessionGeneration) {
      await loadMailboxes()
    }
    return response
  }

  async function deleteMailbox(id: number): Promise<boolean> {
    const session = sessionGeneration
    const response = await nuiCall('mail:delete-mailbox', { id })
    if (response.success && session === sessionGeneration) {
      await Promise.all([refreshCounts(), loadMailboxes()])
    }
    return response.success
  }

  async function moveEntry(
    id: number,
    mailboxId: number | null,
  ): Promise<boolean> {
    const session = sessionGeneration
    const response = await nuiCall('mail:move', {
      id,
      mailboxId: mailboxId ?? 0,
    })
    if (response.success && session === sessionGeneration) {
      await Promise.all([
        refreshCounts(),
        loadMailboxes(),
        loadFolder(folder.value, search.value),
      ])
    }
    return response.success
  }

  async function openMessage(id: number): Promise<MailMessage | null> {
    const response = await nuiCall<MailMessage>('mail:get', { id })
    if (!response.success || !response.data) return null
    await refreshCounts()
    return response.data
  }

  async function openDraft(id: string): Promise<MailDraft | null> {
    const response = await nuiCall<MailDraft>('mail:get-draft', { id })
    return response.success && response.data ? response.data : null
  }

  async function saveDraft(draft: MailComposeDraft): Promise<string | null> {
    const response = await nuiCall<{ id: string }>('mail:save-draft', {
      body: draft.body,
      id: draft.id,
      recipients: draft.recipients,
      subject: draft.subject,
    })
    if (response.success && response.data) {
      await refreshCounts()
      return response.data.id
    }
    return null
  }

  async function deleteDraft(id: string): Promise<boolean> {
    const response = await nuiCall('mail:delete-draft', { id })
    if (response.success) await refreshCounts()
    return response.success
  }

  async function send(draft: MailComposeDraft) {
    const response = await nuiCall<{ id: string }>('mail:send', {
      body: draft.body,
      draftId: draft.id,
      recipients: draft.recipients,
      subject: draft.subject,
    })
    if (response.success) await refreshCounts()
    return response
  }

  async function mutateEntry(
    endpoint: string,
    id: number,
    extra: Record<string, unknown> = {},
  ): Promise<boolean> {
    const response = await nuiCall(endpoint, { id, ...extra })
    if (response.success) {
      await Promise.all([
        refreshCounts(),
        loadFolder(folder.value, search.value),
      ])
    }
    return response.success
  }

  async function deleteMany(ids: Array<number | string>): Promise<boolean> {
    const activeFolder = folder.value
    const session = sessionGeneration
    const response = await nuiCall('mail:delete-many', {
      folder: activeFolder,
      ids,
    })
    if (!response.success || session !== sessionGeneration) {
      return response.success
    }

    await Promise.all([refreshCounts(), loadFolder(folder.value, search.value)])
    return true
  }

  async function emptyTrash(): Promise<boolean> {
    const response = await nuiCall('mail:empty-trash')
    if (response.success) {
      await Promise.all([refreshCounts(), loadFolder('trash', search.value)])
    }
    return response.success
  }

  return {
    accountEmail,
    bootstrap,
    counts,
    createMailbox,
    deleteDraft,
    deleteMailbox,
    deleteMany,
    emptyTrash,
    folder,
    hasMore,
    items,
    loadFolder,
    loadMailboxes,
    listFilters,
    loading,
    login,
    logout,
    mailboxes,
    moveEntry,
    mutateEntry,
    openDraft,
    openMessage,
    refreshCounts,
    register,
    saveDraft,
    search,
    send,
    setListFilters(nextFilters: MailListFilters) {
      listFilters.value = { ...nextFilters }
    },
    setCounts(nextCounts: MailCounts) {
      counts.value = nextCounts
    },
  }
})
