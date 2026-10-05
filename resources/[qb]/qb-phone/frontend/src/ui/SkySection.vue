<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  title: string
}>()
</script>

<template>
  <section v-bind="$attrs" class="sky-section">
    <h2 class="sky-section__title">{{ title }}</h2>
    <slot />
  </section>
</template>
