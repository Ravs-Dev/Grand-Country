<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBadge,
  SkyIcon,
  SkyLink,
  SkyList,
  SkyListItem,
  SkyTabBar,
  SkyTabButton,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
import BadgeIosIcon from '../assets/BadgeIosIcon.vue'
import demoIcon from '../assets/demo-icon.png'

const activeTab = ref('inbox')
</script>

<template>
  <SkyUiDemoPage title="Badge" with-tabbar>
    <template #navbarRight>
      <SkyLink
        aria-label="Profile, 5 notifications"
        class="badge-demo__profile-action"
        icon-only
      >
        <SkyIcon badge="5" :badge-colors="{ bg: '#ef4444' }" :size="28">
          <BadgeIosIcon name="person-circle-fill" />
        </SkyIcon>
      </SkyLink>
    </template>

    <SkyList inset strong>
      <SkyListItem title="Foo Bar">
        <template #media>
          <img class="badge-demo__list-icon" :src="demoIcon" alt="" />
        </template>
        <template #after>
          <SkyBadge class="badge-demo__badge--gray">0</SkyBadge>
        </template>
      </SkyListItem>
      <SkyListItem title="Ivan Petrov">
        <template #media>
          <img class="badge-demo__list-icon" :src="demoIcon" alt="" />
        </template>
        <template #after><SkyBadge>CEO</SkyBadge></template>
      </SkyListItem>
      <SkyListItem title="John Doe">
        <template #media>
          <img class="badge-demo__list-icon" :src="demoIcon" alt="" />
        </template>
        <template #after>
          <SkyBadge class="badge-demo__badge--green">5</SkyBadge>
        </template>
      </SkyListItem>
      <SkyListItem title="Jane Doe">
        <template #media>
          <img class="badge-demo__list-icon" :src="demoIcon" alt="" />
        </template>
        <template #after>
          <SkyBadge class="badge-demo__badge--yellow">NEW</SkyBadge>
        </template>
      </SkyListItem>
    </SkyList>

    <template #fixed>
      <SkyTabBar label="Badge demo tabs">
        <SkyTabButton
          :active="activeTab === 'inbox'"
          label="Inbox"
          @click="activeTab = 'inbox'"
        >
          <template #icon>
            <SkyIcon badge="5" :badge-colors="{ bg: '#22c55e' }" :size="28">
              <BadgeIosIcon name="envelope-fill" />
            </SkyIcon>
          </template>
        </SkyTabButton>
        <SkyTabButton
          :active="activeTab === 'calendar'"
          label="Calendar"
          @click="activeTab = 'calendar'"
        >
          <template #icon>
            <SkyIcon badge="7" :badge-colors="{ bg: '#ef4444' }" :size="28">
              <BadgeIosIcon name="calendar" />
            </SkyIcon>
          </template>
        </SkyTabButton>
        <SkyTabButton
          :active="activeTab === 'upload'"
          label="Upload"
          @click="activeTab = 'upload'"
        >
          <template #icon>
            <SkyIcon badge="1" :badge-colors="{ bg: '#ef4444' }" :size="28">
              <BadgeIosIcon name="cloud-upload-fill" />
            </SkyIcon>
          </template>
        </SkyTabButton>
      </SkyTabBar>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.badge-demo__profile-action {
  box-sizing: border-box;
  width: var(--sky-touch-target, 44px);
  height: var(--sky-touch-target, 44px);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  color: inherit;
}

.badge-demo__profile-action:focus-visible {
  outline: 2px solid var(--sky-app-accent, #007aff);
  outline-offset: 2px;
}

.badge-demo__badge--gray {
  background: #6b7280;
  color: #ffffff;
}

.badge-demo__badge--green {
  background: #22c55e;
}

.badge-demo__badge--yellow {
  background: #eab308;
}

.badge-demo__list-icon {
  width: 28px;
  height: 28px;
  display: block;
}
</style>
