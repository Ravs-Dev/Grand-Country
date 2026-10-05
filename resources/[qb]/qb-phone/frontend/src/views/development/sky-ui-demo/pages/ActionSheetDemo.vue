<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyActionButton,
  SkyActionGroup,
  SkyActionSheet,
  SkyActionsLabel,
  SkyBlock,
  SkyBlockTitle,
  SkyButton,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const actionsOneOpened = ref(false)
const actionsTwoOpened = ref(false)
</script>

<template>
  <SkyUiDemoPage class="action-sheet-demo" title="Action Sheet">
    <SkyBlock inset strong>
      Action Sheet is a slide-up pane for presenting the user with a set of
      alternatives for how to proceed with a given task.
    </SkyBlock>

    <SkyBlockTitle>Open Action Sheet</SkyBlockTitle>
    <SkyBlock class="sky-ui-demo-row" inset strong>
      <SkyButton
        class="action-sheet-demo__trigger"
        rounded
        @click="actionsOneOpened = true"
      >
        One group
      </SkyButton>
      <SkyButton
        class="action-sheet-demo__trigger"
        rounded
        @click="actionsTwoOpened = true"
      >
        Two groups
      </SkyButton>
    </SkyBlock>

    <template #fixed>
      <SkyActionSheet
        aria-label="Do something"
        :opened="actionsOneOpened"
        @backdropclick="actionsOneOpened = false"
        @escape="actionsOneOpened = false"
      >
        <SkyActionGroup>
          <SkyActionsLabel>Do something</SkyActionsLabel>
          <SkyActionButton bold @click="actionsOneOpened = false">
            Button 1
          </SkyActionButton>
          <SkyActionButton @click="actionsOneOpened = false">
            Button 2
          </SkyActionButton>
          <SkyActionButton @click="actionsOneOpened = false">
            Cancel
          </SkyActionButton>
        </SkyActionGroup>
      </SkyActionSheet>

      <SkyActionSheet
        aria-label="Do something"
        :opened="actionsTwoOpened"
        @backdropclick="actionsTwoOpened = false"
        @escape="actionsTwoOpened = false"
      >
        <SkyActionGroup>
          <SkyActionsLabel>Do something</SkyActionsLabel>
          <SkyActionButton bold @click="actionsTwoOpened = false">
            Button 1
          </SkyActionButton>
          <SkyActionButton @click="actionsTwoOpened = false">
            Button 2
          </SkyActionButton>
        </SkyActionGroup>
        <SkyActionGroup>
          <SkyActionButton @click="actionsTwoOpened = false">
            Cancel
          </SkyActionButton>
        </SkyActionGroup>
      </SkyActionSheet>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.action-sheet-demo__trigger {
  min-width: 0;
  flex: 1 1 0;
}
</style>
