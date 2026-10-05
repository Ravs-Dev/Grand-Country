<script setup lang="ts">
import { Image, MapPin, Music2, Play, UserRound } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { getPhoneApp, getPhoneAppLabel } from '@/config/apps'
import { usePhoneStore } from '@/stores/phone'
import type { EasySharePayload } from '@/types/easyshare'
import { openEasySharePayload } from '@/utils/easyshare'

const props = withDefaults(
  defineProps<{
    compact?: boolean
    payload: EasySharePayload
    variant?: 'darkchat' | 'flare' | 'messages'
  }>(),
  { compact: false, variant: 'messages' },
)
const phone = usePhoneStore()
const router = useRouter()
const imageFailed = ref(false)
const sourceApp = computed(() => getPhoneApp(props.payload.appId))
const isVideo = computed(
  () =>
    props.payload.kind === 'video' ||
    (props.payload.appId === 'fliptok' && props.payload.kind === 'post'),
)
const fallbackIcon = computed(() => {
  if (props.payload.kind === 'location') return MapPin
  if (props.payload.kind === 'profile') return UserRound
  if (props.payload.kind === 'track' || props.payload.kind === 'playlist') {
    return Music2
  }
  if (props.payload.kind === 'video') return Play
  return Image
})

watch(
  () => props.payload.imageUrl,
  () => {
    imageFailed.value = false
  },
)
</script>

<template>
  <article
    class="shared-content-card"
    :class="[
      `shared-content-card--${variant}`,
      { 'shared-content-card--compact': compact },
    ]"
    role="button"
    tabindex="0"
    @click="openEasySharePayload(router, payload)"
    @keydown.enter.prevent="openEasySharePayload(router, payload)"
    @keydown.space.prevent="openEasySharePayload(router, payload)"
  >
    <div class="shared-content-card__source">
      <img v-if="sourceApp?.iconImage" :src="sourceApp.iconImage" alt="" />
      <span>
        <b>{{
          sourceApp ? getPhoneAppLabel(sourceApp, phone.t) : payload.appId
        }}</b>
        <small>{{ phone.t(`Apps.easyShare.kinds.${payload.kind}`) }}</small>
      </span>
    </div>
    <div class="shared-content-card__media">
      <video
        v-if="payload.imageUrl && !imageFailed && isVideo"
        :src="payload.imageUrl"
        muted
        playsinline
        preload="metadata"
        @error="imageFailed = true"
      />
      <img
        v-else-if="payload.imageUrl && !imageFailed"
        :src="payload.imageUrl"
        alt=""
        loading="lazy"
        @error="imageFailed = true"
      />
      <span v-else><component :is="fallbackIcon" :size="30" /></span>
    </div>
    <div class="shared-content-card__copy">
      <small v-if="payload.subtitle">{{ payload.subtitle }}</small>
      <strong>{{ payload.title }}</strong>
      <p v-if="payload.copyText !== payload.title">{{ payload.copyText }}</p>
    </div>
  </article>
</template>

<style scoped>
.shared-content-card {
  width: min(262px, 100%);
  width: min(262px, 73cqw);
  overflow: hidden;
  border: 1px solid rgb(60 60 67 / 13%);
  border-radius: 20px;
  color: #171719;
  background: rgb(255 255 255 / 96%);
  box-shadow: 0 8px 24px rgb(19 45 78 / 13%);
  cursor: pointer;
}

.shared-content-card:focus-visible {
  outline: 3px solid #0a84ff;
  outline-offset: 2px;
}

.shared-content-card__source {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
}

.shared-content-card__source > img {
  width: 27px;
  height: 27px;
  border-radius: 7px;
  object-fit: cover;
}

.shared-content-card__source b,
.shared-content-card__source small {
  display: block;
  line-height: 1.1;
}

.shared-content-card__source b {
  font-size: 12px;
}

.shared-content-card__source small {
  margin-top: 2px;
  color: #8e8e93;
  font-size: 10px;
}

.shared-content-card__media {
  height: 142px;
  overflow: hidden;
  background: linear-gradient(145deg, #dcecff, #b9d5ff);
}

.shared-content-card__media > img,
.shared-content-card__media > video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.shared-content-card__media > span {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #0a84ff;
}

.shared-content-card__copy {
  padding: 10px 12px 12px;
}

.shared-content-card__copy small,
.shared-content-card__copy strong,
.shared-content-card__copy p {
  display: block;
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
}

.shared-content-card__copy small {
  margin-bottom: 3px;
  color: #0a84ff;
  font-size: 10px;
  font-weight: 650;
}

.shared-content-card__copy strong {
  display: -webkit-box;
  font-size: 14px;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.shared-content-card__copy p {
  display: -webkit-box;
  margin-top: 5px;
  color: #636366;
  font-size: 11px;
  line-height: 1.3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.shared-content-card--compact {
  width: 100%;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  border-radius: 16px;
  box-shadow: none;
}

.shared-content-card--compact .shared-content-card__source {
  grid-column: 2;
  padding: 7px 9px 0;
}

.shared-content-card--compact .shared-content-card__media {
  grid-row: 1 / span 2;
  height: 78px;
}

.shared-content-card--compact .shared-content-card__copy {
  grid-column: 2;
  padding: 5px 9px 8px;
}

.shared-content-card--compact .shared-content-card__copy p,
.shared-content-card--compact .shared-content-card__source small {
  display: none;
}

.shared-content-card--darkchat {
  border-color: rgb(255 255 255 / 10%);
  color: #f5f5f7;
  background: linear-gradient(155deg, #302c3d, #1b1922);
  box-shadow: 0 9px 25px rgb(0 0 0 / 28%);
}

.shared-content-card--darkchat .shared-content-card__media {
  background: linear-gradient(145deg, #392f5c, #201c31);
}

.shared-content-card--darkchat .shared-content-card__media > span,
.shared-content-card--darkchat .shared-content-card__copy small {
  color: #bf9cff;
}

.shared-content-card--darkchat .shared-content-card__copy p {
  color: #beb9c8;
}

.shared-content-card--flare {
  border-color: rgb(255 255 255 / 58%);
  background: linear-gradient(155deg, #fff, #fff0f6);
  box-shadow: 0 8px 24px rgb(245 71 132 / 15%);
}

.shared-content-card--flare .shared-content-card__media {
  background: linear-gradient(145deg, #ffd4e4, #ffc1d5);
}

.shared-content-card--flare .shared-content-card__media > span,
.shared-content-card--flare .shared-content-card__copy small {
  color: #ef3f7c;
}

:global(.phone-app.dark) .shared-content-card--messages {
  border-color: rgb(255 255 255 / 10%);
  color: #f5f5f7;
  background: linear-gradient(155deg, #34363b, #242a33);
}

:global(.phone-app.dark) .shared-content-card--messages .shared-content-card__copy p {
  color: #b8b8bd;
}
</style>
