<script setup lang="ts">
import SkyCard from './SkyCard.vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    ariaLive?: 'assertive' | 'off' | 'polite'
    indicator?: boolean
    subtitle?: string
    title: string
    tone?: 'accent' | 'danger' | 'neutral' | 'success' | 'warning'
  }>(),
  {
    ariaLive: 'off',
    indicator: false,
    subtitle: '',
    tone: 'neutral',
  },
)
</script>

<template>
  <SkyCard
    v-bind="$attrs"
    :content-wrap="false"
    class="sky-status-card"
    :class="`sky-status-card--${tone}`"
    :role="ariaLive === 'off' ? undefined : 'status'"
    :aria-atomic="ariaLive === 'off' ? undefined : true"
    :aria-live="ariaLive === 'off' ? undefined : ariaLive"
  >
    <span v-if="$slots.icon" class="sky-status-card__icon">
      <slot name="icon" />
    </span>

    <span class="sky-status-card__copy">
      <strong class="sky-status-card__title">
        <slot name="title">{{ title }}</slot>
      </strong>
      <small
        v-if="subtitle || $slots.subtitle"
        class="sky-status-card__subtitle"
      >
        <slot name="subtitle">{{ subtitle }}</slot>
      </small>
    </span>

    <span v-if="$slots.trailing" class="sky-status-card__trailing">
      <slot name="trailing" />
    </span>
    <span
      v-else-if="indicator"
      class="sky-status-card__indicator"
      aria-hidden="true"
    />
  </SkyCard>
</template>
