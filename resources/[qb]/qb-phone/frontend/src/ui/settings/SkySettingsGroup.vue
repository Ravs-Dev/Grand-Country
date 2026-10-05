<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
    density?: 'compact' | 'regular'
    footer?: string
    title?: string
  }>(),
  {
    ariaLabel: '',
    density: 'regular',
    footer: '',
    title: '',
  },
)

const slots = useSlots()
const generatedId = useId()
const titleId = `${generatedId}-title`
const footerId = `${generatedId}-footer`
const hasTitle = computed(() => Boolean(props.title || slots.header))
const hasFooter = computed(() => Boolean(props.footer || slots.footer))
</script>

<template>
  <section
    v-bind="$attrs"
    class="sky-settings-group"
    :class="`sky-settings-group--${density}`"
    :aria-label="!hasTitle && ariaLabel ? ariaLabel : undefined"
    :aria-labelledby="hasTitle ? titleId : undefined"
    :aria-describedby="hasFooter ? footerId : undefined"
  >
    <h2 v-if="hasTitle" :id="titleId" class="sky-settings-group__title">
      <slot name="header">{{ title }}</slot>
    </h2>

    <ul class="sky-settings-group__list">
      <slot />
    </ul>

    <p v-if="hasFooter" :id="footerId" class="sky-settings-group__footer">
      <slot name="footer">{{ footer }}</slot>
    </p>
  </section>
</template>
