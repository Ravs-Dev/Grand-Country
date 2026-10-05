<script setup lang="ts">
import { computed, inject, provide } from 'vue'

import { skyListContextKey } from './list-context'

const parent = inject(skyListContextKey, undefined)

provide(
  skyListContextKey,
  computed(() => ({
    dividers: parent?.value.dividers ?? false,
    nested: false,
  })),
)
</script>

<template>
  <slot />
</template>
