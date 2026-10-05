import { defineStore } from 'pinia'

import type {
  CrewLinkBootstrap,
  CrewLinkColour,
  CrewLinkGroup,
  CrewLinkLive,
  CrewLinkNearbyPlayer,
  CrewLinkPing,
  CrewLinkPingType,
  CrewLinkRole,
} from '@/types/crewlink'
import { nuiCall, type NuiResponse } from '@/utils/nui'

export const useCrewLinkStore = defineStore('crewlink', {
  state: () => ({
    activeGroup: null as CrewLinkGroup | null,
    authenticated: false,
    error: '',
    groups: [] as CrewLinkBootstrap['groups'],
    invitations: [] as CrewLinkBootstrap['invitations'],
    isLoading: false,
    limits: null as CrewLinkBootstrap['limits'] | null,
    profile: null as CrewLinkBootstrap['profile'],
  }),
  actions: {
    applyBootstrap(data: CrewLinkBootstrap): void {
      this.authenticated = data.authenticated ?? Boolean(data.profile)
      this.profile = data.profile
      this.groups = data.groups ?? []
      this.activeGroup = data.activeGroup ?? null
      this.invitations = data.invitations ?? []
      this.limits = data.limits ?? null
      this.error = ''
    },
    async bootstrap(): Promise<boolean> {
      this.isLoading = true
      const response = await nuiCall<CrewLinkBootstrap>('crewlink:bootstrap')
      this.isLoading = false
      if (response.success && response.data) {
        this.applyBootstrap(response.data)
        return true
      }
      this.error = response.error ?? 'request_failed'
      return false
    },
    async request(
      endpoint: string,
      data: Record<string, unknown> = {},
      refresh = true,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      this.isLoading = true
      const response = await nuiCall<CrewLinkBootstrap>(endpoint, data)
      this.isLoading = false
      if (!response.success) {
        this.error = response.error ?? 'request_failed'
        return response
      }
      this.error = ''
      if (response.data?.profile !== undefined) {
        this.applyBootstrap(response.data)
      } else if (refresh) {
        await this.bootstrap()
      }
      return response
    },
    login(password: string): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:login', { password })
    },
    register(
      username: string,
      password: string,
      avatarMediaId = 0,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:register', {
        avatarMediaId,
        password,
        username,
      })
    },
    logout(): Promise<NuiResponse> {
      this.authenticated = false
      this.profile = null
      this.groups = []
      this.activeGroup = null
      this.invitations = []
      return nuiCall('crewlink:logout')
    },
    updateProfile(
      username: string,
      mapVisible: boolean,
      overheadVisible: boolean,
      avatarMediaId?: number | null,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      const data: Record<string, unknown> = {
        mapVisible,
        overheadVisible,
        username,
      }
      if (avatarMediaId !== undefined) data.avatarMediaId = avatarMediaId
      return this.request('crewlink:update-profile', data)
    },
    createGroup(
      name: string,
      colour: CrewLinkColour,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:create-group', { colour, name })
    },
    updateGroup(
      groupId: string,
      name: string,
      colour: CrewLinkColour,
      allowMemberPings: boolean,
      overheadAllowed: boolean,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:update-group', {
        allowMemberPings,
        colour,
        groupId,
        name,
        overheadAllowed,
      })
    },
    deleteGroup(groupId: string): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:delete-group', { groupId })
    },
    setActive(groupId: string): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:set-active', { groupId })
    },
    joinCode(code: string): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:join-code', { code })
    },
    rotateCode(groupId: string): Promise<NuiResponse<{ inviteCode: string }>> {
      return nuiCall<{ inviteCode: string }>('crewlink:rotate-code', {
        groupId,
      })
    },
    nearby(): Promise<NuiResponse<CrewLinkNearbyPlayer[]>> {
      return nuiCall<CrewLinkNearbyPlayer[]>('crewlink:nearby')
    },
    inviteNearby(targetSource: number): Promise<NuiResponse> {
      return this.request('crewlink:invite-nearby', { targetSource }, false)
    },
    respondInvite(
      invitationId: string,
      accepted: boolean,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:respond-invite', {
        accepted,
        invitationId,
      })
    },
    updateMember(
      groupId: string,
      profileId: string,
      role: CrewLinkRole,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:update-member', {
        groupId,
        profileId,
        role,
      })
    },
    transferOwner(
      groupId: string,
      profileId: string,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:transfer-owner', { groupId, profileId })
    },
    removeMember(
      groupId: string,
      profileId: string,
    ): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:remove-member', { groupId, profileId })
    },
    leave(groupId: string): Promise<NuiResponse<CrewLinkBootstrap>> {
      return this.request('crewlink:leave', { groupId })
    },
    createPing(
      type: CrewLinkPingType,
      label: string,
      coords?: { x: number; y: number; z: number },
    ): Promise<NuiResponse<CrewLinkPing>> {
      return nuiCall<CrewLinkPing>('crewlink:create-ping', {
        coords,
        label,
        type,
        useCurrent: !coords,
      })
    },
    removePing(pingId: string): Promise<NuiResponse> {
      return this.request('crewlink:remove-ping', { pingId })
    },
    async refreshLive(): Promise<boolean> {
      const response = await nuiCall<CrewLinkLive>('crewlink:live')
      if (!response.success || !response.data || !this.activeGroup) return false
      this.activeGroup.members = response.data.members
      this.activeGroup.pings = response.data.pings
      return true
    },
  },
})
