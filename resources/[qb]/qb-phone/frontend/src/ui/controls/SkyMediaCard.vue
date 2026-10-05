<script setup lang="ts">
import SkyCard from './SkyCard.vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    meta?: number | string
    title?: number | string
  }>(),
  {
    meta: undefined,
    title: undefined,
  },
)
</script>

<template>
  <SkyCard v-bind="$attrs" :content-wrap="false" class="sky-media-card">
    <div
      v-if="$slots.media || title !== undefined || $slots.title"
      class="sky-media-card__media"
    >
      <div v-if="$slots.media" class="sky-media-card__visual">
        <slot name="media" />
      </div>
      <strong
        v-if="title !== undefined || $slots.title"
        class="sky-media-card__title"
      >
        <slot name="title">{{ title }}</slot>
      </strong>
    </div>

    <div
      v-if="meta !== undefined || $slots.meta || $slots.default"
      class="sky-media-card__body"
    >
      <div
        v-if="meta !== undefined || $slots.meta"
        class="sky-media-card__meta"
      >
        <slot name="meta">{{ meta }}</slot>
      </div>
      <div v-if="$slots.default" class="sky-media-card__copy">
        <slot />
      </div>
    </div>

    <template v-if="$slots.actions" #footer>
      <div class="sky-media-card__actions">
        <slot name="actions" />
      </div>
    </template>
  </SkyCard>
</template>
