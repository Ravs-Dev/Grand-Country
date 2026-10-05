<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  SkyBlock,
  SkyBlockHeader,
  SkyBlockTitle,
  SkyLink,
  SkyList,
  SkyListItem,
  SkyRadio,
  SkyToggle,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

type NavbarSize = 'Default' | 'Large' | 'Medium'

const size = ref<NavbarSize>('Default')
const isTransparent = ref(false)
const navbarVariant = computed<'compact' | 'large' | 'medium'>(() => {
  if (size.value === 'Large') return 'large'
  if (size.value === 'Medium') return 'medium'
  return 'compact'
})
const sizeOptions: NavbarSize[] = ['Default', 'Medium', 'Large']
const paragraphs = [
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto tempore ratione unde accusantium distinctio nulla quia numquam earum odio, optio, nisi rem deserunt. Molestiae delectus, ut assumenda numquam magni enim.',
  'Architecto molestias cum dolor dolorem provident consequuntur incidunt sunt fugiat tenetur odio, recusandae placeat rem veniam. Voluptates, repellendus odit, magni nesciunt, optio laborum asperiores repudiandae consectetur suscipit ab cupiditate eum.',
  'Aliquam, iste accusamus deleniti temporibus exercitationem neque perferendis optio, blanditiis quisquam molestias perspiciatis cumque harum tenetur veniam. Dolorum fugit doloribus est, deserunt, eligendi, quaerat quidem itaque tempore laborum non illum?',
  'Rerum magni sunt quis veniam, dolor ratione saepe ducimus tempore voluptatum porro quod commodi? Aperiam laudantium deleniti totam dolorum qui accusantium iste saepe facere optio, soluta maxime mollitia deserunt cumque.',
  'Iusto tempore quis provident, saepe illum ex ipsum cupiditate explicabo ratione unde facere nemo delectus harum, blanditiis eius sit asperiores nam. Aut cupiditate est tempore officia, perspiciatis esse asperiores repudiandae?',
  'Consequuntur itaque harum eos vero, reiciendis dolorum iure non earum molestias tenetur sint enim, maxime recusandae ad perferendis repudiandae! Sit, quos exercitationem beatae numquam laborum nobis natus. Obcaecati, ea inventore.',
  'Fugit culpa labore sapiente excepturi reiciendis, nulla, nihil neque ut veritatis quis quibusdam dolorum? Voluptatibus animi officia perspiciatis doloremque cum voluptatem, quia ratione modi vero, consequatur ipsum, praesentium quibusdam amet?',
  'Laudantium nihil sint nam placeat, nemo rerum ipsam explicabo iusto dolores molestiae expedita eos consequuntur ut architecto consequatur soluta ad maiores voluptatem tenetur in velit. Minima quia molestiae nobis voluptatibus.',
  'Expedita soluta quia inventore et placeat id exercitationem quisquam eligendi est eius sapiente quo, cum nesciunt mollitia, sit veniam ducimus tempora culpa adipisci commodi in autem nihil voluptatem corporis? Perspiciatis.',
  'Molestias, est? Eligendi vero distinctio voluptatem cumque id voluptatibus, officia minima repellendus sit illo tempora labore provident? Eum tenetur consectetur quae, in facilis autem ipsam doloribus voluptate vitae suscipit nobis.',
  'Obcaecati optio iste hic, soluta minus ullam, perferendis pariatur non possimus autem nostrum libero sapiente. Corporis quo cum iusto exercitationem velit. Non beatae eveniet asperiores ipsa consequuntur temporibus sapiente earum!',
  'Temporibus, omnis. Excepturi dolorum expedita laudantium quasi quod id adipisci, esse, nam atque in, incidunt ex ab distinctio repellendus beatae voluptatem alias odit illum quis. Illo numquam voluptatibus error voluptatum!',
]
</script>

<template>
  <SkyUiDemoPage
    :subtitle="'Subtitle'"
    title="Navbar"
    :transparent="isTransparent"
    :variant="navbarVariant"
  >
    <template #navbarRight><SkyLink>Right</SkyLink></template>

    <SkyBlock inset strong>
      <p class="sky-ui-demo-copy">
        Navbar is a fixed area at the top of a screen that contains Page title
        and navigation elements.
      </p>
    </SkyBlock>

    <SkyBlockTitle>Size</SkyBlockTitle>
    <SkyBlockHeader>
      Medium and Large will collapse to usual size on page scroll
    </SkyBlockHeader>
    <SkyList inset strong>
      <SkyListItem
        v-for="option in sizeOptions"
        :key="option"
        label
        :title="option"
      >
        <template #after>
          <SkyRadio v-model="size" name="navbar-size" :value="option" />
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlockTitle>Transparent</SkyBlockTitle>
    <SkyBlockHeader>
      When navbar is transparent, its title and background will become visible
      on page scroll
    </SkyBlockHeader>
    <SkyList inset strong>
      <SkyListItem title="Transparent">
        <template #after>
          <SkyToggle v-model="isTransparent" aria-label="Transparent navbar" />
        </template>
      </SkyListItem>
    </SkyList>

    <SkyBlock class="sky-ui-demo-stack" inset strong>
      <p
        v-for="paragraph in paragraphs"
        :key="paragraph"
        class="sky-ui-demo-copy"
      >
        {{ paragraph }}
      </p>
    </SkyBlock>
  </SkyUiDemoPage>
</template>
