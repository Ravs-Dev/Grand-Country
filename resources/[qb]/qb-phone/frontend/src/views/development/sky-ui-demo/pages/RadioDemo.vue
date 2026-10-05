<script setup lang="ts">
import { ref } from 'vue'

import { SkyBlock, SkyBlockTitle, SkyList, SkyListItem, SkyRadio } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const inlineValue = ref('inline-1')
const groupValue = ref('Books')
const mediaValue = ref('Item 1')

const groupOptions = ['Books', 'Movies', 'Food', 'Drinks'] as const

function handleRadioRowClick(
  event: MouseEvent,
  value: string,
  group: 'group' | 'media',
): void {
  const target = event.target
  if (target instanceof Element && target.closest('.sky-radio')) return

  if (group === 'group') groupValue.value = value
  else mediaValue.value = value
}
</script>

<template>
  <SkyUiDemoPage title="Radio">
    <SkyBlockTitle>Inline</SkyBlockTitle>
    <SkyBlock inset strong>
      <p class="radio-demo__copy">
        Lorem
        <SkyRadio
          v-model="inlineValue"
          aria-label="First inline option"
          name="demo-radio-inline"
          value="inline-1"
        />
        ipsum dolor sit amet, consectetur adipisicing elit. Alias beatae illo
        nihil aut eius commodi sint eveniet aliquid eligendi
        <SkyRadio
          v-model="inlineValue"
          aria-label="Second inline option"
          name="demo-radio-inline"
          value="inline-2"
        />
        ad delectus impedit tempore nemo, enim vel praesentium consequatur nulla
        mollitia!
      </p>
    </SkyBlock>

    <SkyBlockTitle>Radio Group</SkyBlockTitle>
    <SkyList inset strong>
      <SkyListItem
        v-for="item in groupOptions"
        :key="`leading-${item}`"
        class="radio-demo__row"
        :title="item"
        @click="handleRadioRowClick($event, item, 'group')"
      >
        <template #media>
          <SkyRadio
            v-model="groupValue"
            :aria-label="item"
            name="demo-radio-group"
            :value="item"
          />
        </template>
      </SkyListItem>
    </SkyList>

    <SkyList inset strong>
      <SkyListItem
        v-for="item in groupOptions"
        :key="`trailing-${item}`"
        class="radio-demo__row"
        :title="item"
        @click="handleRadioRowClick($event, item, 'group')"
      >
        <template #after>
          <SkyRadio
            v-model="groupValue"
            :aria-label="item"
            name="demo-radio-group"
            :value="item"
          />
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlockTitle>With Media Lists</SkyBlockTitle>
    <SkyList inset strong>
      <SkyListItem
        after="17:14"
        class="radio-demo__row"
        subtitle="New messages from John Doe"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
        title="Facebook"
        @click="handleRadioRowClick($event, 'Item 1', 'media')"
      >
        <template #media>
          <SkyRadio
            v-model="mediaValue"
            aria-label="Facebook"
            name="demo-radio-media"
            value="Item 1"
          />
        </template>
      </SkyListItem>
      <SkyListItem
        after="17:11"
        class="radio-demo__row"
        subtitle="John Doe (@_johndoe) mentioned you on Twitter!"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
        title="John Doe (via Twitter)"
        @click="handleRadioRowClick($event, 'Item 2', 'media')"
      >
        <template #media>
          <SkyRadio
            v-model="mediaValue"
            aria-label="John Doe via Twitter"
            name="demo-radio-media"
            value="Item 2"
          />
        </template>
      </SkyListItem>
    </SkyList>
  </SkyUiDemoPage>
</template>

<style scoped>
.radio-demo__copy {
  margin: 0;
}

.radio-demo__row :deep(.sky-list-item__row) {
  cursor: pointer;
}
</style>
