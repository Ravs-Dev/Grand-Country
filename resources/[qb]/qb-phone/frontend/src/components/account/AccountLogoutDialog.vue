<script setup lang="ts">
import { SkyDialog as kDialog, SkyDialogButton as kDialogButton } from '@/ui'

import { useAppAuthStore, type AppAuthId } from '@/stores/app-auth'
import { useCrewLinkStore } from '@/stores/crewlink'
import { useFeatherStore } from '@/stores/feather'
import { useMarketplaceStore } from '@/stores/marketplace'
import { usePagesStore } from '@/stores/pages'
import { usePhoneStore } from '@/stores/phone'

const opened = defineModel<boolean>('opened', { default: false })
const emit = defineEmits<{ loggedOut: [] }>()
const props = defineProps<{ appId: AppAuthId; appName: string }>()

const appAuth = useAppAuthStore()
const crewLink = useCrewLinkStore()
const feather = useFeatherStore()
const marketplace = useMarketplaceStore()
const pages = usePagesStore()
const phone = usePhoneStore()

function close(): void {
  opened.value = false
}

function confirmLogout(): void {
  appAuth.signOut(props.appId)
  if (props.appId === 'citymarkt') marketplace.$reset()
  if (props.appId === 'local-pages') pages.$reset()
  if (props.appId === 'feather') feather.$reset()
  if (props.appId === 'crewlink') {
    crewLink.$reset()
    crewLink.error = 'not_authenticated'
  }
  opened.value = false
  emit('loggedOut')
}
</script>

<template>
  <k-dialog :opened="opened" @backdropclick="close">
    <template #title>{{
      phone.t('Common.signOutTitle', { app: appName })
    }}</template>
    <p>{{ phone.t('Common.signOutBody', { app: appName }) }}</p>
    <template #buttons>
      <k-dialog-button @click="close">
        {{ phone.t('Common.cancel') }}
      </k-dialog-button>
      <k-dialog-button
        strong
        class="account-logout-confirm"
        @click="confirmLogout"
      >
        {{ phone.t('Common.signOut') }}
      </k-dialog-button>
    </template>
  </k-dialog>
</template>

<style scoped>
.account-logout-confirm {
  background: #e44760 !important;
  color: #fff !important;
}
</style>
