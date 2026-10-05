<script setup lang="ts">
import { SkyBlock, SkySegmented, SkySegmentedButton } from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
</script>

<template>
  <SkyUiDemoPage class="subnavbar-demo" title="Subnavbar">
    <template #subnavbar>
      <SkySegmented
        :active-index="0"
        aria-label="Subnavbar buttons"
        class="subnavbar-demo__segmented"
        :item-count="3"
        rounded
        strong
      >
        <SkySegmentedButton active>Button</SkySegmentedButton>
        <SkySegmentedButton>Button</SkySegmentedButton>
        <SkySegmentedButton>Button</SkySegmentedButton>
      </SkySegmented>
    </template>

    <div class="subnavbar-demo__content">
      <SkyBlock inset strong>
        <p>
          Subnavbar is useful when you need to put any additional elements into
          Navbar, like Tab Links or Search Bar. It also remains visible when
          Navbar hidden.
        </p>
      </SkyBlock>
      <SkyBlock class="subnavbar-demo__copy" inset strong>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione
          consequuntur numquam quia labore eligendi asperiores obcaecati neque
          sapiente fugit vel praesentium accusantium, earum corporis officiis
          tempora est delectus fugiat laudantium?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
          possimus, magni excepturi molestias consequatur commodi nihil velit
          quo odit adipisci voluptatibus quam fugit nesciunt repellat
          accusantium libero repudiandae consectetur alias!
        </p>
        <p>
          Nihil unde iusto ab animi eum? Quia natus provident fugit, molestias
          ea numquam qui distinctio ex perferendis fuga! Fugit voluptates
          obcaecati ipsa recusandae eos saepe ducimus repudiandae. Explicabo,
          fuga obcaecati!
        </p>
        <p>
          Neque voluptas eius, quod consequatur officia dolor sunt cupiditate,
          animi commodi cumque nam ex totam autem ipsum doloribus! Possimus
          eligendi unde provident, esse molestias amet minus! Laboriosam veniam
          alias eum.
        </p>
        <p>
          Dicta obcaecati, architecto at ducimus suscipit dolor ea praesentium
          sint? Deleniti ipsam magni dolorem amet quibusdam temporibus pariatur
          suscipit voluptas, quas harum nesciunt culpa facere consequuntur id et
          accusamus exercitationem!
        </p>
        <p>
          Officiis, quibusdam reprehenderit corporis non nisi debitis magnam.
          Deleniti, recusandae iusto repellendus dicta magni exercitationem
          labore natus reiciendis sapiente error dolorum necessitatibus maxime
          laborum esse suscipit praesentium ratione. Ex, in.
        </p>
      </SkyBlock>
    </div>
  </SkyUiDemoPage>
</template>

<style scoped>
.subnavbar-demo__segmented {
  width: 100%;
}

.subnavbar-demo :deep(.sky-navbar) {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.subnavbar-demo :deep(.sky-navbar__inner) {
  margin-bottom: 0;
}

.subnavbar-demo :deep(.sky-ui-demo-page__scroll::before) {
  height: calc(
    max(16px, var(--sky-safe-area-top)) + var(--sky-navbar-height) + 56px
  );
}

.subnavbar-demo__content {
  position: relative;
}

.subnavbar-demo__copy {
  display: grid;
  gap: var(--sky-space-4);
}

p {
  margin: 0;
}
</style>
