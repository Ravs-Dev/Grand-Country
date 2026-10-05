<script setup lang="ts">
import { CalendarDays, CloudUpload, Mail } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import {
  SkyBlock,
  SkyIcon,
  SkyList,
  SkyListItem,
  SkyTabBar,
  SkyTabButton,
  SkyToggle,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

type TabId = 'tab-1' | 'tab-2' | 'tab-3'

const activeTab = ref<TabId>('tab-1')
const isTabbarLabels = ref(true)
const isTabbarIcons = ref(true)
const tabs = [
  { icon: Mail, id: 'tab-1', label: 'Tab 1' },
  { icon: CalendarDays, id: 'tab-2', label: 'Tab 2' },
  { icon: CloudUpload, id: 'tab-3', label: 'Tab 3' },
] as const
const tabCopy: Record<TabId, string[]> = {
  'tab-1': [
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias accusantium necessitatibus, nihil quas praesentium at quibusdam cupiditate possimus et repudiandae dolorum delectus quo, similique voluptatem magni explicabo adipisci magnam ratione!',
    'Quod praesentium consequatur autem veritatis, magni alias consectetur ut quo, voluptatum earum in repellat! Id, autem! Minus suscipit, ad possimus non voluptatem aliquam praesentium earum corrupti optio velit tenetur numquam?',
    'Illo id ipsa natus quidem dignissimos odio dolore veniam, accusamus vel assumenda nulla aliquam amet distinctio! Debitis deserunt, et, cum voluptate similique culpa assumenda inventore, facilis eveniet iure optio velit.',
    'Maiores minus laborum placeat harum impedit, saepe veniam iusto voluptates delectus omnis consectetur tenetur ex ipsa error debitis aspernatur amet et alias! Sit odit cum voluptas quae? Est, omnis eos?',
  ],
  'tab-2': [
    'Dicta beatae repudiandae ab pariatur mollitia praesentium fuga ipsum adipisci, quia nam expedita, est dolore eveniet, dolorum obcaecati? Veniam repellendus mollitia sapiente minus saepe voluptatibus necessitatibus laboriosam incidunt nihil autem.',
    'Officia pariatur qui, deleniti eum, et minus nisi aliquam nobis hic provident quisquam quidem voluptatem eveniet ducimus. Commodi ea dolorem, impedit eaque dolor, sint blanditiis magni accusantium natus reprehenderit minima?',
    'Dicta reiciendis ut vitae laborum aut repellendus quasi beatae nulla sapiente et. Quod distinctio velit, modi ipsam exercitationem iste quia eaque blanditiis neque rerum optio, nulla tenetur pariatur ex officiis.',
    'Consectetur accusamus delectus sit voluptatem at esse! Aperiam unde maxime est nemo dicta minus autem esse nobis quibusdam iusto, reprehenderit harum, perferendis quae. Ipsum sit fugit similique recusandae quas inventore?',
  ],
  'tab-3': [
    'Vero esse ab natus neque commodi aut quidem nobis. Unde, quam asperiores. A labore quod commodi autem explicabo distinctio saepe ex amet iste recusandae porro consectetur, sed dolorum sapiente voluptatibus?',
    'Commodi ipsum, voluptatem obcaecati voluptatibus illum hic aliquam veritatis modi natus unde, assumenda expedita, esse eum fugit? Saepe aliquam ipsam illum nihil facilis, laborum quia, eius ea dolores molestias dicta.',
    'Consequatur quam laudantium, magnam facere ducimus tempora temporibus omnis cupiditate obcaecati tempore? Odit qui a, voluptas eveniet similique, doloribus eum dolorum ad, enim ea itaque voluptates porro minima. Omnis, magnam.',
    'Debitis, delectus! Eligendi excepturi rem veritatis, ad exercitationem tempore eveniet voluptates aut labore harum dolorem nemo repellendus accusantium quibusdam neque? Itaque iusto quisquam reprehenderit aperiam maiores dicta iure necessitatibus est.',
  ],
}
const activeCopy = computed(() => tabCopy[activeTab.value])
const activeLabel = computed(
  () => tabs.find((tab) => tab.id === activeTab.value)?.label ?? '',
)
</script>

<template>
  <SkyUiDemoPage title="Tabbar" with-tabbar>
    <SkyList inset strong>
      <SkyListItem title="Tabbar Labels">
        <template #after>
          <SkyToggle v-model="isTabbarLabels" aria-label="Show tabbar labels" />
        </template>
      </SkyListItem>
      <SkyListItem title="Tabbar Icons">
        <template #after>
          <SkyToggle v-model="isTabbarIcons" aria-label="Show tabbar icons" />
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlock aria-live="polite" class="sky-ui-demo-stack" inset strong>
      <p class="sky-ui-demo-tabbar__title">
        <b>{{ activeLabel }}</b>
      </p>
      <p class="sky-ui-demo-tabbar__copy">
        <span v-for="paragraph in activeCopy" :key="paragraph"
          >{{ paragraph }}{{ ' ' }}</span
        >
      </p>
    </SkyBlock>

    <template #fixed>
      <SkyTabBar
        :icons="isTabbarIcons"
        label="Demo tabs"
        :labels="isTabbarLabels"
      >
        <SkyTabButton
          v-for="tab in tabs"
          :key="tab.id"
          :active="activeTab === tab.id"
          :aria-label="tab.label"
          :label="isTabbarLabels ? tab.label : ''"
          @click="activeTab = tab.id"
        >
          <template v-if="isTabbarIcons" #icon>
            <SkyIcon :size="26"><component :is="tab.icon" /></SkyIcon>
          </template>
        </SkyTabButton>
      </SkyTabBar>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.sky-ui-demo-tabbar__title,
.sky-ui-demo-tabbar__copy {
  margin: 0;
}

.sky-ui-demo-tabbar__copy {
  display: block;
}
</style>
