<script setup lang="ts">
withDefaults(
  defineProps<{
    avatar?: string
    component?: string
    footer?: string
    header?: string
    id?: string
    name?: string
    text?: string
    textFooter?: string
    textHeader?: string
    type?: 'received' | 'sent'
  }>(),
  {
    component: 'div',
    name: '',
    textFooter: '',
    textHeader: '',
    type: 'sent',
  },
)
</script>

<template>
  <component
    :is="component"
    :id="id"
    class="sky-message"
    :class="`sky-message--${type}`"
  >
    <span v-if="avatar || $slots.avatar" class="sky-message__avatar">
      {{ avatar }}<slot name="avatar" />
    </span>
    <div class="sky-message__content">
      <div v-if="name || $slots.name" class="sky-message__name">
        {{ name }}<slot name="name" />
      </div>
      <div v-if="header || $slots.header" class="sky-message__header">
        {{ header }}<slot name="header" />
      </div>
      <div class="sky-message__bubble">
        <div
          v-if="textHeader || $slots.textHeader"
          class="sky-message__text-header"
        >
          {{ textHeader }}<slot name="textHeader" />
        </div>
        <div
          v-if="text || $slots.text || $slots.default"
          class="sky-message__text"
        >
          <slot name="text"
            ><slot>{{ text }}</slot></slot
          >
        </div>
        <div
          v-if="textFooter || $slots.textFooter"
          class="sky-message__text-footer"
        >
          {{ textFooter }}<slot name="textFooter" />
        </div>
        <div v-if="footer || $slots.footer" class="sky-message__footer">
          {{ footer }}<slot name="footer" />
        </div>
      </div>
    </div>
  </component>
</template>
