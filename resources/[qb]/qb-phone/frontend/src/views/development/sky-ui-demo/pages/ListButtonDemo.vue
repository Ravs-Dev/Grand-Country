<script setup lang="ts">
import { SkyList, SkyListButton } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
</script>

<template>
  <SkyUiDemoPage title="List Button">
    <SkyList dividers outline strong>
      <SkyListButton>Button 1</SkyListButton>
      <SkyListButton>Button 2</SkyListButton>
      <SkyListButton>Button 3</SkyListButton>
    </SkyList>
    <SkyList dividers inset strong>
      <SkyListButton>Button 1</SkyListButton>
      <SkyListButton>Button 2</SkyListButton>
      <SkyListButton>Button 3</SkyListButton>
    </SkyList>
    <SkyList inset strong>
      <SkyListButton variant="danger">Red Button</SkyListButton>
    </SkyList>
  </SkyUiDemoPage>
</template>
