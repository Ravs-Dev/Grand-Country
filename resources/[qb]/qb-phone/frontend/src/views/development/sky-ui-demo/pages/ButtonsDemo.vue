<script setup lang="ts">
import { SkyBlock, SkyBlockTitle, SkyButton } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
</script>

<template>
  <SkyUiDemoPage title="Buttons">
    <SkyBlockTitle>Default Buttons</SkyBlockTitle>
    <SkyBlock class="button-examples" inset strong>
      <div class="button-row">
        <SkyButton>Button</SkyButton>
        <SkyButton class="sky-ui-demo-color-red">Button</SkyButton>
        <SkyButton>Button</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton outline>Outline</SkyButton>
        <SkyButton class="sky-ui-demo-color-red" outline>Outline</SkyButton>
        <SkyButton outline>Outline</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton clear>Clear</SkyButton>
        <SkyButton class="sky-ui-demo-color-red" clear>Clear</SkyButton>
        <SkyButton clear>Clear</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton tonal>Tonal</SkyButton>
        <SkyButton class="sky-ui-demo-color-red" tonal>Tonal</SkyButton>
        <SkyButton tonal>Tonal</SkyButton>
      </div>
    </SkyBlock>

    <SkyBlockTitle>Rounded Buttons</SkyBlockTitle>
    <SkyBlock class="button-examples" inset strong>
      <div class="button-row">
        <SkyButton rounded>Button</SkyButton>
        <SkyButton class="sky-ui-demo-color-green" rounded>Button</SkyButton>
        <SkyButton rounded>Button</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton outline rounded>Outline</SkyButton>
        <SkyButton class="sky-ui-demo-color-green" outline rounded>
          Outline
        </SkyButton>
        <SkyButton outline rounded>Outline</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton clear rounded>Clear</SkyButton>
        <SkyButton class="sky-ui-demo-color-green" clear rounded>
          Clear
        </SkyButton>
        <SkyButton clear rounded>Clear</SkyButton>
      </div>
    </SkyBlock>

    <SkyBlockTitle>Large Buttons</SkyBlockTitle>
    <SkyBlock class="button-examples" inset strong>
      <div class="button-row">
        <SkyButton large>Button</SkyButton>
        <SkyButton class="sky-ui-demo-color-yellow" large>Button</SkyButton>
        <SkyButton large rounded>Button</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton large outline>Outline</SkyButton>
        <SkyButton class="sky-ui-demo-color-yellow" large outline>
          Outline
        </SkyButton>
        <SkyButton large outline rounded>Outline</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton clear large>Clear</SkyButton>
        <SkyButton class="sky-ui-demo-color-yellow" clear large>
          Clear
        </SkyButton>
        <SkyButton clear large rounded>Clear</SkyButton>
      </div>
    </SkyBlock>

    <SkyBlockTitle>Small Buttons</SkyBlockTitle>
    <SkyBlock class="button-examples" inset strong>
      <div class="button-row">
        <SkyButton small>Button</SkyButton>
        <SkyButton small>Button</SkyButton>
        <SkyButton rounded small>Button</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton outline small>Outline</SkyButton>
        <SkyButton outline small>Outline</SkyButton>
        <SkyButton outline rounded small>Outline</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton clear small>Clear</SkyButton>
        <SkyButton clear small>Clear</SkyButton>
        <SkyButton clear rounded small>Clear</SkyButton>
      </div>
    </SkyBlock>

    <SkyBlockTitle>Raised Buttons</SkyBlockTitle>
    <SkyBlock class="button-examples" inset strong>
      <div class="button-row">
        <SkyButton raised>Button</SkyButton>
        <SkyButton raised>Button</SkyButton>
        <SkyButton raised rounded>Button</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton outline raised>Outline</SkyButton>
        <SkyButton outline raised>Outline</SkyButton>
        <SkyButton outline raised rounded>Outline</SkyButton>
      </div>
      <div class="button-row">
        <SkyButton clear raised>Clear</SkyButton>
        <SkyButton clear raised>Clear</SkyButton>
        <SkyButton clear raised rounded>Clear</SkyButton>
      </div>
    </SkyBlock>

    <SkyBlockTitle>Disabled Buttons</SkyBlockTitle>
    <SkyBlock inset strong>
      <div class="button-row">
        <SkyButton disabled>Button</SkyButton>
        <SkyButton disabled outline>Outline</SkyButton>
        <SkyButton clear disabled>Clear</SkyButton>
      </div>
    </SkyBlock>
  </SkyUiDemoPage>
</template>

<style scoped>
.button-examples {
  display: grid;
  gap: var(--sky-space-2, 8px);
}

.button-row {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--sky-space-4, 16px);
}
</style>
