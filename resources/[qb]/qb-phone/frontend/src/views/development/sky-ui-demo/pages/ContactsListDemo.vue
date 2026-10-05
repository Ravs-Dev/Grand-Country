<script setup lang="ts">
import { SkyList, SkyListGroup, SkyListItem } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const contacts = [
  {
    letter: 'A',
    names: [
      'Aaron',
      'Abbie',
      'Adam',
      'Adele',
      'Agatha',
      'Agnes',
      'Albert',
      'Alexander',
    ],
  },
  {
    letter: 'B',
    names: ['Bailey', 'Barclay', 'Bartolo', 'Bellamy', 'Belle', 'Benjamin'],
  },
  {
    letter: 'C',
    names: [
      'Caiden',
      'Calvin',
      'Candy',
      'Carl',
      'Cherilyn',
      'Chester',
      'Chloe',
    ],
  },
  { letter: 'V', names: ['Vladimir'] },
]
</script>

<template>
  <SkyUiDemoPage title="Contacts List">
    <SkyList class="contacts-list-demo__list" flush strong>
      <SkyListGroup
        v-for="group in contacts"
        :key="group.letter"
        :dividers="false"
      >
        <SkyListItem contacts group-title :title="group.letter" />
        <SkyListItem
          v-for="name in group.names"
          :key="name"
          contacts
          :title="name"
        />
      </SkyListGroup>
    </SkyList>
  </SkyUiDemoPage>
</template>

<style scoped>
.contacts-list-demo__list :deep(.sky-list-item--group-title) {
  min-height: 32px;
  padding: 0 var(--sky-space-4);
  align-items: center;
  background: var(--sky-surface-muted);
  color: var(--sky-text);
  font-size: 14px;
}
</style>
