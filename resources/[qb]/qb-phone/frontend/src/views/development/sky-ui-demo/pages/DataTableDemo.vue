<script setup lang="ts">
import {
  SkyBlock,
  SkyBlockTitle,
  SkyCard,
  SkyTable,
  SkyTableBody,
  SkyTableCell,
  SkyTableHead,
  SkyTableRow,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const desserts = [
  {
    calories: 159,
    carbs: 24,
    fat: '6.0',
    name: 'Frozen yogurt',
    protein: '4.0',
  },
  {
    calories: 237,
    carbs: 37,
    fat: '9.0',
    name: 'Ice cream sandwich',
    protein: '4.4',
  },
  { calories: 262, carbs: 24, fat: '16.0', name: 'Eclair', protein: '6.0' },
  { calories: 305, carbs: 67, fat: '3.7', name: 'Cupcake', protein: '4.3' },
]
</script>

<template>
  <SkyUiDemoPage title="Data Table">
    <SkyBlockTitle>Plain table</SkyBlockTitle>
    <SkyBlock class="data-table-demo__scroll">
      <SkyTable aria-label="Dessert nutrition plain table">
        <SkyTableHead>
          <SkyTableRow header>
            <SkyTableCell header nowrap scope="col">
              Dessert (100g serving)
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Calories
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Fat (g)
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Carbs
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Protein (g)
            </SkyTableCell>
          </SkyTableRow>
        </SkyTableHead>
        <SkyTableBody>
          <SkyTableRow v-for="dessert in desserts" :key="dessert.name">
            <SkyTableCell nowrap>{{ dessert.name }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.calories }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.fat }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.carbs }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.protein }}</SkyTableCell>
          </SkyTableRow>
        </SkyTableBody>
      </SkyTable>
    </SkyBlock>

    <SkyBlockTitle>Within card</SkyBlockTitle>
    <SkyCard class="data-table-demo__scroll" :content-wrap="false">
      <SkyTable aria-label="Dessert nutrition card table">
        <SkyTableHead>
          <SkyTableRow header>
            <SkyTableCell header nowrap scope="col">
              Dessert (100g serving)
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Calories
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Fat (g)
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Carbs
            </SkyTableCell>
            <SkyTableCell align="end" header nowrap scope="col">
              Protein (g)
            </SkyTableCell>
          </SkyTableRow>
        </SkyTableHead>
        <SkyTableBody>
          <SkyTableRow v-for="dessert in desserts" :key="dessert.name">
            <SkyTableCell nowrap>{{ dessert.name }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.calories }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.fat }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.carbs }}</SkyTableCell>
            <SkyTableCell numeric>{{ dessert.protein }}</SkyTableCell>
          </SkyTableRow>
        </SkyTableBody>
      </SkyTable>
    </SkyCard>
  </SkyUiDemoPage>
</template>

<style scoped>
.data-table-demo__scroll {
  overflow-x: auto;
}

.data-table-demo__scroll :deep(.sky-table) {
  min-width: 520px;
}
</style>
