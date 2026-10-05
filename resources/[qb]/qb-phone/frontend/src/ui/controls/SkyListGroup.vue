<script setup lang="ts">
import SkyList from './SkyList.vue'
import SkyListGroupInner from './SkyListGroupInner.vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    density?: 'compact' | 'regular'
    dividers?: boolean
    flush?: boolean
    inset?: boolean
    menuList?: boolean
    outline?: boolean
    strong?: boolean
  }>(),
  {
    density: 'regular',
    dividers: true,
    flush: false,
    inset: false,
    menuList: false,
    outline: false,
    strong: false,
  },
)
</script>

<template>
  <li v-bind="$attrs" class="sky-list-group">
    <SkyList
      class="sky-list-group__list"
      :density="density"
      :dividers="dividers"
      :flush="flush"
      :inset="inset"
      :menu="menuList"
      nested
      :outline="outline"
      :strong="strong"
    >
      <SkyListGroupInner>
        <slot />
      </SkyListGroupInner>
    </SkyList>
  </li>
</template>
