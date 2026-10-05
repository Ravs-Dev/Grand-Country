<script setup lang="ts">
import { SkyAppPage, SkyNavbar, SkyScrollArea } from '@/ui'

import { useSkyUiDemoContext } from './context'

withDefaults(
  defineProps<{
    padded?: boolean
    scrollClass?: string
    subtitle?: string
    title: string
    transparent?: boolean
    variant?: 'compact' | 'large' | 'medium'
    withTabbar?: boolean
  }>(),
  {
    padded: false,
    scrollClass: '',
    subtitle: '',
    transparent: false,
    variant: 'compact',
    withTabbar: false,
  },
)

const demo = useSkyUiDemoContext()
</script>

<template>
  <SkyAppPage
    class="sky-ui-demo-page"
    :accent="demo.accent.value"
    :accent-soft="demo.accentSoft.value"
    :dark="demo.dark.value"
    :label="title"
  >
    <SkyNavbar
      back-label="Back"
      show-back
      :subtitle="subtitle"
      :title="title"
      :transparent="transparent"
      :variant="variant"
      @back="demo.returnToCatalog"
    >
      <template v-if="$slots.navbarRight" #right>
        <slot name="navbarRight" />
      </template>
      <template v-if="$slots.subnavbar" #subnavbar>
        <slot name="subnavbar" />
      </template>
    </SkyNavbar>

    <SkyScrollArea
      class="sky-ui-demo-page__scroll"
      :class="scrollClass"
      :padded="padded"
      :with-tabbar="withTabbar"
    >
      <slot />
    </SkyScrollArea>

    <slot name="fixed" />
  </SkyAppPage>
</template>
