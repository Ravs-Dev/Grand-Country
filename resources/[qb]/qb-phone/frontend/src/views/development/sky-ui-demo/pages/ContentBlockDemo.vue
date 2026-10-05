<script setup lang="ts">
import { SkyBlock, SkyBlockFooter, SkyBlockHeader, SkyBlockTitle } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
</script>

<template>
  <SkyUiDemoPage title="Content Block">
    <SkyBlockTitle>Block Title</SkyBlockTitle>
    <SkyBlock>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle>Strong Block</SkyBlockTitle>
    <SkyBlock strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle>Strong Outline Block</SkyBlockTitle>
    <SkyBlock outline strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle>Strong Inset Block</SkyBlockTitle>
    <SkyBlock inset strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle>Strong Inset Outline Block</SkyBlockTitle>
    <SkyBlock inset outline strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle>With Header &amp; Footer</SkyBlockTitle>
    <SkyBlockHeader>Header</SkyBlockHeader>
    <SkyBlock outline strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>
    <SkyBlockFooter>Footer</SkyBlockFooter>

    <SkyBlockTitle medium>Medium Title</SkyBlockTitle>
    <SkyBlock outline strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>

    <SkyBlockTitle large>Large Title</SkyBlockTitle>
    <SkyBlock outline strong>
      <p class="content-copy">
        Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam
        mollis, vulputate turpis vel, sagittis felis.
      </p>
    </SkyBlock>
  </SkyUiDemoPage>
</template>

<style scoped>
.content-copy {
  margin: 0;
}
</style>
