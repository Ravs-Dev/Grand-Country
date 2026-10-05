<script setup lang="ts">
import { ref } from 'vue'

import { SkyBlock, SkyButton, SkyLink, SkyToolbar, SkyToolbarPane } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'

const isTop = ref(false)
</script>

<template>
  <SkyUiDemoPage title="Toolbar" :with-tabbar="!isTop">
    <SkyToolbar
      v-if="isTop"
      aria-label="Top toolbar example"
      class="sky-ui-demo-toolbar sky-ui-demo-toolbar--top"
      component="nav"
      top
    >
      <SkyToolbarPane>
        <SkyLink>Link 1</SkyLink>
        <SkyLink>Link 2</SkyLink>
      </SkyToolbarPane>
      <SkyToolbarPane><SkyLink>Link 3</SkyLink></SkyToolbarPane>
    </SkyToolbar>

    <SkyBlock class="sky-ui-demo-stack" inset strong>
      <p class="sky-ui-demo-copy">
        Toolbar supports both top and bottom positions. Click the following
        button to change its position.
      </p>
      <SkyButton rounded @click="isTop = !isTop">
        Toggle Toolbar Position
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
        tortor. Pellentesque felis eros, dictum vitae lacinia quis, lobortis
        vitae ipsum. Cras vehicula bibendum lorem quis imperdiet.
      </p>
      <p class="sky-ui-demo-copy">
        In hac habitasse platea dictumst. Etiam varius, ante vel ornare
        facilisis, velit massa rutrum dolor, ac porta magna magna lacinia nunc.
        Curabitur cursus laoreet. Aenean vel tempus augue. Pellentesque in
        imperdiet nibh. Mauris rhoncus nulla id sem suscipit volutpat.
        Pellentesque ac arcu in nisi viverra pulvinar. Nullam nulla orci,
        bibendum sed ligula non, ullamcorper iaculis mi. In hac habitasse platea
        dictumst. Praesent varius at nisl eu luctus. Cras aliquet porta est.
        Quisque elementum quis dui et consectetur. Cum sociis natoque penatibus
        et magnis dis parturient montes, nascetur ridiculus mus. Sed sed laoreet
        purus. Pellentesque eget ante ante.
      </p>
      <p class="sky-ui-demo-copy">
        Duis et ultricies nibh. Sed facilisis turpis urna, ac imperdiet erat
        venenatis eu. Proin sit amet faucibus tortor, et varius sem. Etiam vitae
        lacinia neque. Aliquam nisi purus, interdum in arcu sed, ultrices rutrum
        arcu. Nulla mi turpis, consectetur vel enim quis, facilisis viverra dui.
        Aliquam quis convallis tortor, quis semper ligula. Morbi ullamcorper
        massa at accumsan. Etiam purus odio, posuere in ligula vitae, viverra
        ultricies justo. Vestibulum nec interdum nisi. Aenean ac consectetur
        velit, non malesuada magna. Sed pharetra vehicula augue, vel venenatis
        lectus gravida eget. Curabitur lacus tellus, venenatis eu arcu in,
        interdum auctor nunc. Nunc non metus neque. Suspendisse viverra lectus
        sed risus aliquet, vel accumsan dolor feugiat.
      </p>
    </SkyBlock>

    <template #fixed>
      <SkyToolbar
        v-if="!isTop"
        aria-label="Bottom toolbar example"
        class="sky-ui-demo-toolbar sky-ui-demo-toolbar--bottom"
        component="nav"
      >
        <SkyToolbarPane>
          <SkyLink>Link 1</SkyLink>
          <SkyLink>Link 2</SkyLink>
        </SkyToolbarPane>
        <SkyToolbarPane><SkyLink>Link 3</SkyLink></SkyToolbarPane>
      </SkyToolbar>
    </template>
  </SkyUiDemoPage>
</template>

<style scoped>
.sky-ui-demo-toolbar--top {
  position: sticky;
  top: 0;
}

.sky-ui-demo-toolbar--bottom {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
