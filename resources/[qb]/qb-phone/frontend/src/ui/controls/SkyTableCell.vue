<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    align?: 'center' | 'end' | 'start'
    colspan?: number | string
    component?: 'td' | 'th'
    header?: boolean
    nowrap?: boolean
    numeric?: boolean
    rowspan?: number | string
    scope?: 'col' | 'colgroup' | 'row' | 'rowgroup'
  }>(),
  {
    align: 'start',
    colspan: undefined,
    component: undefined,
    header: false,
    nowrap: false,
    numeric: false,
    rowspan: undefined,
    scope: undefined,
  },
)

const cellComponent = computed(
  () => props.component ?? (props.header ? 'th' : 'td'),
)
</script>

<template>
  <component
    :is="cellComponent"
    v-bind="$attrs"
    class="sky-table-cell"
    :class="[
      `sky-table-cell--${align}`,
      {
        'sky-table-cell--header': header || cellComponent === 'th',
        'sky-table-cell--nowrap': nowrap,
        'sky-table-cell--numeric': numeric,
      },
    ]"
    :colspan="colspan"
    :rowspan="rowspan"
    :scope="cellComponent === 'th' ? scope : undefined"
  >
    <slot />
  </component>
</template>
