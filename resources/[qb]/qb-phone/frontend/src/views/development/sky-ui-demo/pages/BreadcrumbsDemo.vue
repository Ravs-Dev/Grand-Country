<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBlock,
  SkyBlockHeader,
  SkyBlockTitle,
  SkyBreadcrumbs,
  SkyBreadcrumbsCollapsed,
  SkyBreadcrumbsItem,
  SkyBreadcrumbsSeparator,
  SkyList,
  SkyListItem,
  SkyPopover,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const popoverOpened = ref(false)
const popoverTarget = ref<HTMLElement | null>(null)
</script>

<template>
  <SkyUiDemoPage title="Breadcrumbs">
    <SkyBlock inset strong>
      Breadcrumbs allow users to keep track and maintain awareness of their
      locations within the app or website. They should be used for large sites
      and apps with hierarchically arranged pages.
    </SkyBlock>

    <SkyBlockTitle>Basic</SkyBlockTitle>
    <SkyBlock outline strong>
      <SkyBreadcrumbs aria-label="Basic breadcrumb">
        <SkyBreadcrumbsItem component="button">Home</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem component="button">Catalog</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem active>Phones</SkyBreadcrumbsItem>
      </SkyBreadcrumbs>
    </SkyBlock>

    <SkyBlockTitle>Scrollable</SkyBlockTitle>
    <SkyBlockHeader>
      Breadcrumbs will be scrollable if they don't fit the screen
    </SkyBlockHeader>
    <SkyBlock outline strong>
      <SkyBreadcrumbs aria-label="Scrollable breadcrumb">
        <SkyBreadcrumbsItem component="button">Home</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem component="button">Catalog</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem component="button">Phones</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem component="button">Apple</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem active>iPhone 12</SkyBreadcrumbsItem>
      </SkyBreadcrumbs>
    </SkyBlock>

    <SkyBlockTitle>Collapsed</SkyBlockTitle>
    <SkyBlock outline strong>
      <SkyBreadcrumbs aria-label="Collapsed breadcrumb">
        <SkyBreadcrumbsItem component="button">Home</SkyBreadcrumbsItem>
        <SkyBreadcrumbsSeparator />
        <span ref="popoverTarget" class="breadcrumbs-demo__target">
          <SkyBreadcrumbsCollapsed
            ariaControls="breadcrumbs-menu"
            ariaLabel="Show hidden breadcrumbs"
            :expanded="popoverOpened"
            @click="popoverOpened = true"
          />
        </span>
        <SkyBreadcrumbsSeparator />
        <SkyBreadcrumbsItem active>iPhone 12</SkyBreadcrumbsItem>
      </SkyBreadcrumbs>
    </SkyBlock>

    <template #fixed>
      <SkyPopover
        id="breadcrumbs-menu"
        aria-label="Hidden breadcrumbs"
        class="breadcrumbs-demo__popover"
        :opened="popoverOpened"
        :offset="0"
        role="region"
        :target="popoverTarget"
        @backdropclick="popoverOpened = false"
        @escape="popoverOpened = false"
      >
        <SkyList class="breadcrumbs-demo__menu" nested>
          <SkyListItem link title="Catalog" @click="popoverOpened = false" />
          <SkyListItem link title="Phones" @click="popoverOpened = false" />
          <SkyListItem link title="Apple" @click="popoverOpened = false" />
        </SkyList>
      </SkyPopover>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.breadcrumbs-demo__menu {
  width: 100%;
}

.breadcrumbs-demo__popover :deep(.sky-popover__panel) {
  width: 120px;
}

.breadcrumbs-demo__target {
  display: inline-flex;
  flex: none;
}
</style>
