<script setup lang="ts">
import { ref } from 'vue'

import { SkyBlock, SkyMenuList, SkyMenuListItem } from '@/ui'

import demoIcon from '../assets/demo-icon.png'
import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const firstActive = ref('home')
const secondActive = ref('home')
const items = [
  { id: 'home', subtitle: 'Home subtitle', title: 'Home' },
  { id: 'profile', subtitle: 'Profile subtitle', title: 'Profile' },
  { id: 'settings', subtitle: 'Settings subtitle', title: 'Settings' },
]
</script>

<template>
  <SkyUiDemoPage title="Menu List">
    <SkyBlock inset strong>
      <p class="menu-list-copy">
        Menu list unlike usual links list is designed to indicate currently
        active screen (or section) of your app. Think about it like a Tabbar but
        in a form of a list.
      </p>
    </SkyBlock>

    <SkyMenuList aria-label="Primary menu" outline strong>
      <SkyMenuListItem
        v-for="item in items"
        :key="item.id"
        :active="firstActive === item.id"
        :title="item.title"
        @click="firstActive = item.id"
      >
        <template #media>
          <img class="menu-list-demo__icon" :src="demoIcon" alt="" />
        </template>
      </SkyMenuListItem>
    </SkyMenuList>

    <SkyMenuList aria-label="Detailed menu" outline strong>
      <SkyMenuListItem
        v-for="item in items"
        :key="item.id"
        :active="secondActive === item.id"
        :subtitle="item.subtitle"
        :title="item.title"
        @click="secondActive = item.id"
      >
        <template #media>
          <img class="menu-list-demo__icon" :src="demoIcon" alt="" />
        </template>
      </SkyMenuListItem>
    </SkyMenuList>
  </SkyUiDemoPage>
</template>

<style scoped>
.menu-list-copy {
  margin: 0;
}

.menu-list-demo__icon {
  width: 28px;
  height: 28px;
  display: block;
}
</style>
