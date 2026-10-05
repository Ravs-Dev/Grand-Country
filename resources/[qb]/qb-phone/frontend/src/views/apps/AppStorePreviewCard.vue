<script setup lang="ts">
import { computed } from 'vue'

import type { AppStorePreviewVisual } from '@/utils/appStorePreviews'

const props = defineProps<{
  appName: string
  categoryLabel: string
  developer: string
  features: readonly string[]
  iconImage: string
  previewImage: string | null
  screen: 0 | 1 | 2 | 3 | 4
  tagline: string
  visual: AppStorePreviewVisual
}>()

const cardStyle = computed(() => ({
  '--preview-accent': props.visual.accent,
  '--preview-surface': props.visual.surface,
}))
</script>

<template>
  <article
    class="store-detail-preview phone-effect--expensive-shadow"
    :class="`store-detail-preview--screen-${screen}`"
    :style="cardStyle"
  >
    <img
      v-if="previewImage && screen < 3"
      class="store-detail-preview__screenshot"
      :src="previewImage"
      :alt="`${appName}: ${features[screen] ?? appName}`"
      draggable="false"
    />

    <section v-else-if="screen === 3" class="store-detail-preview__details">
      <header>
        <img :src="iconImage" alt="" draggable="false" />
        <span><strong>{{ appName }}</strong><small>{{ categoryLabel }}</small></span>
      </header>
      <ul>
        <li v-for="(feature, index) in features" :key="feature">
          <b>{{ index + 1 }}</b>
          <span>{{ feature }}</span>
        </li>
      </ul>
    </section>

    <section v-else-if="screen === 4" class="store-detail-preview__about">
      <img :src="iconImage" alt="" draggable="false" />
      <strong>{{ appName }}</strong>
      <p>{{ tagline }}</p>
      <dl>
        <div><dt>{{ developer }}</dt><dd>{{ categoryLabel }}</dd></div>
      </dl>
    </section>

    <div v-else class="store-detail-preview__fallback">
      <img :src="iconImage" alt="" draggable="false" />
      <strong>{{ appName }}</strong>
      <p>{{ tagline }}</p>
    </div>

    <footer v-if="screen < 3" class="store-detail-preview__caption">
      <img :src="iconImage" alt="" draggable="false" />
      <span>
        <strong>{{ features[screen] ?? appName }}</strong>
        <small>{{ appName }}</small>
      </span>
    </footer>
  </article>
</template>

<style scoped>
.store-detail-preview {
  --preview-accent: #4d9dff;
  --preview-surface: #0a1828;
  position: relative;
  width: 224px;
  height: 354px;
  overflow: hidden;
  flex: 0 0 224px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--sky-radius-card);
  background: var(--preview-surface);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  scroll-snap-align: start;
}

.store-detail-preview__screenshot {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
  transition: transform 180ms ease;
}

.store-detail-preview--screen-1 .store-detail-preview__screenshot {
  transform: scale(1.08);
  transform-origin: center top;
}

.store-detail-preview--screen-2 .store-detail-preview__screenshot {
  transform: scale(1.12);
  transform-origin: center bottom;
}

.store-detail-preview__fallback {
  height: 100%;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  padding: 24px;
  color: #fff;
  text-align: center;
  background:
    radial-gradient(circle at 80% 12%, var(--preview-accent), transparent 42%),
    linear-gradient(155deg, var(--preview-surface), #070a11);
}

.store-detail-preview__fallback img {
  width: 72px;
  height: 72px;
  border-radius: 18px;
}

.store-detail-preview__fallback strong {
  font-size: 22px;
}

.store-detail-preview__fallback p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 13px;
  line-height: 1.45;
}

.store-detail-preview__details,
.store-detail-preview__about {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 18px;
  color: #fff;
  background:
    radial-gradient(circle at 88% 4%, var(--preview-accent), transparent 42%),
    linear-gradient(155deg, var(--preview-surface), #070a11);
}

.store-detail-preview__details::before,
.store-detail-preview__about::before {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.06), transparent 42%);
  content: '';
  pointer-events: none;
}

.store-detail-preview__details header {
  z-index: 1;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 11px;
}

.store-detail-preview__details header img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.store-detail-preview__details header span {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.store-detail-preview__details header strong {
  overflow: hidden;
  font-size: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-detail-preview__details header small,
.store-detail-preview__about dd {
  color: rgba(255, 255, 255, 0.66);
  font-size: 10px;
}

.store-detail-preview__details ul {
  z-index: 1;
  display: grid;
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.store-detail-preview__details li {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.07);
}

.store-detail-preview__details li b {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #fff;
  background: var(--preview-accent);
  font-size: 11px;
}

.store-detail-preview__details li span {
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.store-detail-preview__about {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.store-detail-preview__about > img {
  z-index: 1;
  width: 82px;
  height: 82px;
  border-radius: 22px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
}

.store-detail-preview__about > strong {
  z-index: 1;
  margin-top: 16px;
  font-size: 22px;
}

.store-detail-preview__about > p {
  z-index: 1;
  margin: 8px 0 18px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 11px;
  line-height: 1.45;
}

.store-detail-preview__about dl {
  z-index: 1;
  width: 100%;
  margin: 0;
}

.store-detail-preview__about dl div {
  display: grid;
  gap: 3px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.07);
}

.store-detail-preview__about dt,
.store-detail-preview__about dd {
  margin: 0;
}

.store-detail-preview__about dt {
  font-size: 11px;
  font-weight: 800;
}

.store-detail-preview__caption {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 13px;
  color: #fff;
  background: rgba(7, 9, 14, 0.84);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(12px);
}

.store-detail-preview__caption img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.store-detail-preview__caption span {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.store-detail-preview__caption strong,
.store-detail-preview__caption small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-detail-preview__caption strong {
  font-size: 11px;
  line-height: 1.2;
}

.store-detail-preview__caption small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 9px;
}
</style>
