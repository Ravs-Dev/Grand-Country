<script setup lang="ts">
import SkyButton from '../controls/SkyButton.vue'

withDefaults(defineProps<{ disabled?: boolean; strong?: boolean }>(), {
  disabled: false,
  strong: false,
})
</script>

<template>
  <SkyButton
    class="sky-dialog-button"
    :class="{ 'sky-dialog-button--strong': strong }"
    :disabled="disabled"
    large
    rounded
    :tonal="!strong"
  >
    <slot />
  </SkyButton>
</template>
