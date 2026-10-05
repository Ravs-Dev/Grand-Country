<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    active?: boolean
    disabled?: boolean
    tab?: boolean
    type?: 'button' | 'reset' | 'submit'
  }>(),
  {
    active: false,
    disabled: false,
    tab: false,
    type: 'button',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    v-bind="$attrs"
    class="sky-segmented-button"
    :class="{ 'sky-segmented-button--active': active }"
    :role="tab ? 'tab' : undefined"
    :aria-pressed="tab ? undefined : active"
    :aria-selected="tab ? active : undefined"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
