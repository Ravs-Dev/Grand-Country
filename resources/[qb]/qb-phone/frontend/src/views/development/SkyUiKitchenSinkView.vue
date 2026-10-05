<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { usePhoneStore } from '@/stores/phone'
import { isSkyUiDemoId, type SkyUiDemoId } from './sky-ui-demo/catalog'
import {
  createSkyUiDemoTheme,
  provideSkyUiDemoContext,
  type SkyUiDemoAccent,
} from './sky-ui-demo/context'
import SkyUiDemoHome from './sky-ui-demo/SkyUiDemoHome.vue'
import './sky-ui-demo/demo.css'

const phone = usePhoneStore()
const route = useRoute()
const router = useRouter()

const initialAccent: SkyUiDemoAccent = {
  color: '#007aff',
  name: 'Blue',
  soft: 'rgba(0, 122, 255, 0.16)',
}
const dark = computed({
  get: () => phone.isDarkMode,
  set: (value: boolean) =>
    phone.setPreference('appearanceMode', value ? 'dark' : 'light'),
})
const accentChoice = ref(initialAccent)

const demoPages: Record<SkyUiDemoId, Component> = {
  'action-sheet': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ActionSheetDemo.vue'),
  ),
  badge: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/BadgeDemo.vue'),
  ),
  breadcrumbs: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/BreadcrumbsDemo.vue'),
  ),
  buttons: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ButtonsDemo.vue'),
  ),
  cards: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/CardsDemo.vue'),
  ),
  checkbox: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/CheckboxDemo.vue'),
  ),
  chips: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ChipsDemo.vue'),
  ),
  'contacts-list': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ContactsListDemo.vue'),
  ),
  'content-block': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ContentBlockDemo.vue'),
  ),
  'data-table': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/DataTableDemo.vue'),
  ),
  dialog: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/DialogDemo.vue'),
  ),
  fab: defineAsyncComponent(() => import('./sky-ui-demo/pages/FabDemo.vue')),
  'form-inputs': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/FormInputsDemo.vue'),
  ),
  list: defineAsyncComponent(() => import('./sky-ui-demo/pages/ListDemo.vue')),
  'list-button': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ListButtonDemo.vue'),
  ),
  'menu-list': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/MenuListDemo.vue'),
  ),
  messages: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/MessagesDemo.vue'),
  ),
  navbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/NavbarDemo.vue'),
  ),
  notification: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/NotificationDemo.vue'),
  ),
  'side-panels': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SidePanelsDemo.vue'),
  ),
  popover: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/PopoverDemo.vue'),
  ),
  popup: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/PopupDemo.vue'),
  ),
  preloader: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/PreloaderDemo.vue'),
  ),
  progressbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ProgressbarDemo.vue'),
  ),
  radio: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/RadioDemo.vue'),
  ),
  'range-slider': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/RangeSliderDemo.vue'),
  ),
  searchbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SearchbarDemo.vue'),
  ),
  'segmented-control': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SegmentedControlDemo.vue'),
  ),
  'sheet-modal': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SheetModalDemo.vue'),
  ),
  stepper: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/StepperDemo.vue'),
  ),
  subnavbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SubnavbarDemo.vue'),
  ),
  tabbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/TabbarDemo.vue'),
  ),
  toast: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ToastDemo.vue'),
  ),
  toggle: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ToggleDemo.vue'),
  ),
  toolbar: defineAsyncComponent(
    () => import('./sky-ui-demo/pages/ToolbarDemo.vue'),
  ),
  'sky-extensions': defineAsyncComponent(
    () => import('./sky-ui-demo/pages/SkyExtensionsDemo.vue'),
  ),
}

const requestedDemo = computed(() => route.params.demo)
const activeDemo = computed<SkyUiDemoId | null>(() =>
  isSkyUiDemoId(requestedDemo.value) ? requestedDemo.value : null,
)
const activePage = computed(() =>
  activeDemo.value ? demoPages[activeDemo.value] : SkyUiDemoHome,
)
const theme = createSkyUiDemoTheme(dark, accentChoice)

function navigate(id: SkyUiDemoId): void {
  void router.push({ name: 'development-sky-ui', params: { demo: id } })
}

function returnToCatalog(): void {
  const previousPath = window.history.state?.back
  const catalogPath = router.resolve({ name: 'development-sky-ui' }).fullPath

  if (previousPath === catalogPath) {
    router.back()
    return
  }

  void router.replace({ name: 'development-sky-ui' })
}

function exit(): void {
  router.back()
}

provideSkyUiDemoContext({
  ...theme,
  exit,
  navigate,
  returnToCatalog,
})

watch(
  requestedDemo,
  (value) => {
    if (value === undefined || isSkyUiDemoId(value)) return
    void router.replace({ name: 'development-sky-ui' })
  },
  { immediate: true },
)
</script>

<template>
  <div class="sky-ui-kitchen-sink">
    <Transition name="sky-ui-demo-page" mode="out-in">
      <component :is="activePage" :key="activeDemo ?? 'catalog'" />
    </Transition>
  </div>
</template>

<style scoped>
.sky-ui-kitchen-sink {
  width: 100%;
  height: 100%;
}

.sky-ui-demo-page-enter-active,
.sky-ui-demo-page-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.sky-ui-demo-page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.sky-ui-demo-page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (prefers-reduced-motion: reduce) {
  .sky-ui-demo-page-enter-active,
  .sky-ui-demo-page-leave-active {
    transition-duration: 0.01ms;
  }

  .sky-ui-demo-page-enter-from,
  .sky-ui-demo-page-leave-to {
    transform: none;
  }
}
</style>
