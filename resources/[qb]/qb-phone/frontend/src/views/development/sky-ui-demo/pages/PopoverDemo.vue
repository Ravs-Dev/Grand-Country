<script setup lang="ts">
import { ref } from 'vue'

import {
  SkyBlock,
  SkyButton,
  SkyDropdown,
  SkyLink,
  SkyList,
  SkyListItem,
  SkyPopover,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const popoverOpened = ref(false)
const popoverTarget = ref<string | null>(null)
const dropdownOpened = ref(false)
const dropdownItems = [
  { checked: true, id: 'newest', label: 'Newest First' },
  { checked: false, id: 'oldest', label: 'Oldest First' },
  {
    checked: true,
    id: 'all',
    label: 'All Items',
    separatorBefore: true,
  },
  { checked: false, id: 'favorites', label: 'Favorites' },
]

function openPopover(target: string): void {
  popoverTarget.value = target
  popoverOpened.value = true
}

function closePopover(): void {
  popoverOpened.value = false
}

function selectDropdownItem(): void {
  dropdownOpened.value = false
}
</script>

<template>
  <SkyUiDemoPage title="Popover">
    <template #navbarRight>
      <SkyLink
        id="sky-ui-demo-popover-navbar"
        @click="openPopover('#sky-ui-demo-popover-navbar')"
      >
        Popover
      </SkyLink>
    </template>

    <SkyBlock class="sky-ui-demo-stack" inset strong>
      <SkyButton
        id="sky-ui-demo-popover-button"
        rounded
        @click="openPopover('#sky-ui-demo-popover-button')"
      >
        Open popover on me
      </SkyButton>
      <SkyButton
        id="sky-ui-demo-dropdown-button"
        rounded
        @click="dropdownOpened = true"
      >
        Open dropdown
      </SkyButton>
    </SkyBlock>

    <SkyBlock class="sky-ui-demo-stack" inset strong>
      <p class="sky-ui-demo-copy">
        Mauris fermentum neque et luctus venenatis. Vivamus a sem rhoncus,
        ornare tellus eu, euismod mauris. In porta turpis at semper convallis.
        Duis adipiscing leo eu nulla lacinia, quis rhoncus metus condimentum.
        Etiam nec malesuada nibh. Maecenas quis lacinia nisl, vel posuere dolor.
        Vestibulum condimentum, nisl ac vulputate egestas, neque enim dignissim
        elit, rhoncus volutpat magna enim a est. Aenean sit amet ligula neque.
        Cras suscipit rutrum enim. Nam a odio facilisis, elementum tellus non,
        <SkyLink
          id="sky-ui-demo-popover-link-1"
          @click="openPopover('#sky-ui-demo-popover-link-1')"
          >popover</SkyLink
        >
        tortor. Pellentesque felis eros, dictum vitae lacinia quis, lobortis
        vitae ipsum. Cras vehicula bibendum lorem quis imperdiet.
      </p>
      <p class="sky-ui-demo-copy">
        In hac habitasse platea dictumst. Etiam varius, ante vel ornare
        facilisis, velit massa rutrum dolor, ac porta magna magna lacinia nunc.
        Curabitur
        <SkyLink
          id="sky-ui-demo-popover-link-2"
          @click="openPopover('#sky-ui-demo-popover-link-2')"
          >popover!</SkyLink
        >
        cursus laoreet. Aenean vel tempus augue. Pellentesque in imperdiet nibh.
        Mauris rhoncus nulla id sem suscipit volutpat. Pellentesque ac arcu in
        nisi viverra pulvinar. Nullam nulla orci, bibendum sed ligula non,
        ullamcorper iaculis mi. In hac habitasse platea dictumst. Praesent
        varius at nisl eu luctus. Cras aliquet porta est. Quisque elementum quis
        dui et consectetur. Cum sociis natoque penatibus et magnis dis
        parturient montes, nascetur ridiculus mus. Sed sed laoreet purus.
        Pellentesque eget ante ante.
      </p>
      <p class="sky-ui-demo-copy">
        Duis et ultricies nibh. Sed facilisis turpis urna, ac imperdiet erat
        venenatis eu. Proin sit amet faucibus tortor, et varius sem. Etiam vitae
        lacinia neque. Aliquam nisi purus, interdum in arcu sed, ultrices rutrum
        arcu. Nulla mi turpis, consectetur vel enim quis, facilisis viverra dui.
        Aliquam quis convallis tortor, quis semper ligula. Morbi ullamcorper
        <SkyLink
          id="sky-ui-demo-popover-link-3"
          @click="openPopover('#sky-ui-demo-popover-link-3')"
          >one more popover</SkyLink
        >
        massa at accumsan. Etiam purus odio, posuere in ligula vitae, viverra
        ultricies justo. Vestibulum nec interdum nisi. Aenean ac consectetur
        velit, non malesuada magna. Sed pharetra vehicula augue, vel venenatis
        lectus gravida eget. Curabitur lacus tellus, venenatis eu arcu in,
        interdum auctor nunc. Nunc non metus neque. Suspendisse viverra lectus
        sed risus aliquet, vel accumsan dolor feugiat.
      </p>
    </SkyBlock>

    <template #fixed>
      <SkyPopover
        aria-label="Popover menu"
        :opened="popoverOpened"
        role="dialog"
        :target="popoverTarget"
        @backdropclick="closePopover"
        @escape="closePopover"
      >
        <SkyList component="div" nested>
          <SkyListItem
            v-for="item in [
              'Item 1',
              'List Item 2',
              'Item 3',
              'List Item 4',
              'Item 5',
            ]"
            :key="item"
            component="div"
            link
            :title="item"
            @click="closePopover"
          />
        </SkyList>
      </SkyPopover>
      <SkyDropdown
        :items="dropdownItems"
        label="Dropdown menu"
        :opened="dropdownOpened"
        target="#sky-ui-demo-dropdown-button"
        @backdropclick="dropdownOpened = false"
        @escape="dropdownOpened = false"
        @select="selectDropdownItem"
      />
    </template>
  </SkyUiDemoPage>
</template>
