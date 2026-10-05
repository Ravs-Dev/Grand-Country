import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/utils/nui', () => ({
  nuiCall: vi.fn(),
}))

import { useCrewLinkStore } from '@/stores/crewlink'
import { nuiCall } from '@/utils/nui'

describe('CrewLink store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(nuiCall).mockReset()
  })

  it('hydrates a profile and active group from bootstrap', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: {
        activeGroup: {
          allowMemberPings: true,
          colour: 'cyan',
          id: 'group-1',
          isOwner: true,
          memberCount: 1,
          members: [],
          name: 'Night Shift',
          overheadAllowed: true,
          pings: [],
          role: 'owner',
        },
        groups: [],
        invitations: [],
        profile: {
          activeGroupId: 'group-1',
          id: 'profile-1',
          mapVisible: true,
          overheadVisible: false,
          username: 'Skyline',
        },
      },
    })
    const store = useCrewLinkStore()
    expect(await store.bootstrap()).toBe(true)
    expect(store.profile?.username).toBe('Skyline')
    expect(store.activeGroup?.name).toBe('Night Shift')
  })

  it('keeps the server error from a rejected request', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: false,
      error: 'invalid_code',
    })
    const store = useCrewLinkStore()
    const response = await store.joinCode('BADCODE')
    expect(response.success).toBe(false)
    expect(store.error).toBe('invalid_code')
  })

  it('sends only the password when logging in', async () => {
    vi.mocked(nuiCall).mockResolvedValue({
      success: false,
      error: 'invalid_credentials',
    })
    const store = useCrewLinkStore()
    await store.login('CrewLink123!')
    expect(nuiCall).toHaveBeenCalledWith('crewlink:login', {
      password: 'CrewLink123!',
    })
  })

  it('sends username, password, and avatar when registering', async () => {
    vi.mocked(nuiCall).mockResolvedValue({ success: true })
    const store = useCrewLinkStore()
    await store.register('Skyline', 'CrewLink123!', 42)
    expect(nuiCall).toHaveBeenCalledWith('crewlink:register', {
      avatarMediaId: 42,
      password: 'CrewLink123!',
      username: 'Skyline',
    })
  })

  it('applies live members without replacing group metadata', async () => {
    const store = useCrewLinkStore()
    store.activeGroup = {
      allowMemberPings: true,
      colour: 'blue',
      id: 'group-1',
      isOwner: false,
      memberCount: 2,
      members: [],
      name: 'Road Crew',
      overheadAllowed: true,
      pings: [],
      role: 'member',
    }
    vi.mocked(nuiCall).mockResolvedValue({
      success: true,
      data: {
        members: [
          {
            id: 'profile-2',
            joinedAt: 1,
            mapVisible: true,
            online: true,
            overheadVisible: true,
            role: 'member',
            username: 'Nova',
          },
        ],
        pings: [],
      },
    })
    expect(await store.refreshLive()).toBe(true)
    expect(store.activeGroup.name).toBe('Road Crew')
    expect(store.activeGroup.members[0].online).toBe(true)
  })
})
