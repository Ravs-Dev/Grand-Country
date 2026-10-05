<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch,
} from 'vue'

import SkyLink from './controls/SkyLink.vue'
import SkySpinner from './controls/SkySpinner.vue'

const OBSERVER_ROOT_MARGIN = '0px 0px 140px 0px'

const props = defineProps({
  error: {
    default: false,
    type: [String, Boolean] as PropType<string | boolean>,
  },
  hasMore: { required: true, type: Boolean },
  loading: { required: true, type: Boolean },
  loadingLabel: { required: true, type: String },
  loadKey: {
    default: null,
    type: [String, Number] as PropType<string | number | null | undefined>,
  },
  retryLabel: { required: true, type: String },
})

const emit = defineEmits<{
  load: []
  retry: []
}>()

const sentinel = ref<HTMLElement | null>(null)
const hasError = computed(() => Boolean(props.error))
const isHidden = computed(
  () => !props.hasMore && !props.loading && !hasError.value,
)
const isVisibleState = computed(() => props.loading || hasError.value)

let observer: IntersectionObserver | null = null
let observedElement: HTMLElement | null = null
let refreshGeneration = 0
let hasRequestedKey = false
let lastRequestedKey: string | number | null | undefined

function requestNextPage(): void {
  if (!props.hasMore || props.loading || hasError.value) return
  if (hasRequestedKey && Object.is(lastRequestedKey, props.loadKey)) return

  hasRequestedKey = true
  lastRequestedKey = props.loadKey
  emit('load')
}

function handleIntersections(entries: IntersectionObserverEntry[]): void {
  const entry = entries.at(-1)
  if (entry?.isIntersecting) requestNextPage()
}

function refreshObservation(): void {
  if (!observer || !sentinel.value) return

  // Re-observing requests a fresh post-layout intersection. A cached `true`
  // from before new rows were appended could otherwise fetch one page too far.
  if (observedElement) observer.unobserve(observedElement)
  observedElement = null

  if (!props.hasMore) return

  observedElement = sentinel.value
  observer.observe(observedElement)
}

async function scheduleObservationRefresh(): Promise<void> {
  const generation = ++refreshGeneration
  await nextTick()

  if (generation !== refreshGeneration) return
  refreshObservation()
}

function retry(): void {
  if (props.loading || !hasError.value) return
  emit('retry')
}

watch(
  () => [props.hasMore, props.loading, props.error, props.loadKey] as const,
  ([hasMore]) => {
    if (!hasMore) {
      hasRequestedKey = false
      lastRequestedKey = undefined
    }

    void scheduleObservationRefresh()
  },
  { flush: 'post' },
)

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !sentinel.value) return

  const scrollRoot = sentinel.value.closest<HTMLElement>('.sky-scroll-area')
  observer = new IntersectionObserver(handleIntersections, {
    root: scrollRoot,
    rootMargin: OBSERVER_ROOT_MARGIN,
    threshold: 0,
  })
  refreshObservation()
})

onBeforeUnmount(() => {
  refreshGeneration += 1
  observer?.disconnect()
  observer = null
  observedElement = null
})
</script>

<template>
  <div
    ref="sentinel"
    class="sky-infinite-loader"
    :class="{ 'sky-infinite-loader--visible': isVisibleState }"
    :hidden="isHidden"
    aria-live="polite"
    :aria-busy="loading || undefined"
  >
    <SkySpinner v-if="loading" :label="loadingLabel" :size="18" />
    <SkyLink
      v-else-if="hasError"
      class="sky-infinite-loader__retry"
      type="button"
      @click="retry"
    >
      {{ retryLabel }}
    </SkyLink>
  </div>
</template>
