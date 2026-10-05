<script setup lang="ts">
import {
  SkyBlockTitle,
  SkyCard,
  SkyLink,
  SkyList,
  SkyListItem,
  SkyMediaCard,
} from '@/ui'

import SkyUiDemoPage from '../SkyUiDemoPage.vue'
import mountainsImage from '../assets/nature-1000x600-3.jpg'
import peopleImage from '../assets/people-1000x600-6.jpg'
</script>

<template>
  <SkyUiDemoPage title="Cards">
    <SkyBlockTitle>Simple Cards</SkyBlockTitle>
    <SkyCard>
      This is a simple card with plain text, but cards can also contain their
      own header, footer, list view, image, or any other element.
    </SkyCard>
    <SkyCard footer="Card footer" header="Card header">
      Card with header and footer. Card headers are used to display card titles
      and footers for additional information or just for custom actions.
    </SkyCard>
    <SkyCard>
      Another card. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse feugiat sem est, non tincidunt ligula volutpat sit amet.
      Mauris aliquet magna justo.
    </SkyCard>

    <SkyBlockTitle>Outline Cards</SkyBlockTitle>
    <SkyCard outline>
      This is a simple card with plain text, but cards can also contain their
      own header, footer, list view, image, or any other element.
    </SkyCard>
    <SkyCard footer="Card footer" header="Card header" outline>
      Card with header and footer. Card headers are used to display card titles
      and footers for additional information or just for custom actions.
    </SkyCard>
    <SkyCard outline>
      Another card. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse feugiat sem est, non tincidunt ligula volutpat sit amet.
      Mauris aliquet magna justo.
    </SkyCard>

    <SkyBlockTitle>Outline With Dividers</SkyBlockTitle>
    <SkyCard
      footer="Card footer"
      footer-divider
      header="Card header"
      header-divider
      outline
    >
      Card with header and footer. Card headers are used to display card titles
      and footers for additional information or just for custom actions.
    </SkyCard>

    <SkyBlockTitle>Raised Cards</SkyBlockTitle>
    <SkyCard raised>
      This is a simple card with plain text, but cards can also contain their
      own header, footer, list view, image, or any other element.
    </SkyCard>
    <SkyCard footer="Card footer" header="Card header" raised>
      Card with header and footer. Card headers are used to display card titles
      and footers for additional information or just for custom actions.
    </SkyCard>
    <SkyCard raised>
      Another card. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Suspendisse feugiat sem est, non tincidunt ligula volutpat sit amet.
      Mauris aliquet magna justo.
    </SkyCard>

    <SkyBlockTitle>Card With List View</SkyBlockTitle>
    <SkyCard :content-wrap="false">
      <SkyList flush nested>
        <SkyListItem
          v-for="index in 5"
          :key="index"
          link
          :title="`Link ${index}`"
        />
      </SkyList>
    </SkyCard>

    <SkyBlockTitle>Styled Cards</SkyBlockTitle>
    <div>
      <SkyMediaCard
        meta="Posted on January 21, 2021"
        outline
        title="Journey To Mountains"
      >
        <template #media>
          <img :src="mountainsImage" alt="" height="600" width="1000" />
        </template>
        <p>
          Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies
          efficitur vitae non felis. Phasellus quis nibh hendrerit...
        </p>
        <template #actions>
          <SkyLink>Like</SkyLink>
          <SkyLink>Read more</SkyLink>
        </template>
      </SkyMediaCard>

      <SkyMediaCard meta="Posted on January 21, 2021" title="Lorem Ipsum">
        <template #media>
          <img :src="peopleImage" alt="" height="600" width="1000" />
        </template>
        <p>
          Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies
          efficitur vitae non felis. Phasellus quis nibh hendrerit...
        </p>
        <template #actions>
          <SkyLink>Like</SkyLink>
          <SkyLink>Read more</SkyLink>
        </template>
      </SkyMediaCard>
    </div>
  </SkyUiDemoPage>
</template>
