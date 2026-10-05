import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

import type { SkyUiDemoId } from './catalog'

export interface SkyUiDemoAccent {
  color: string
  name: string
  soft: string
}

export interface SkyUiDemoContext {
  accent: ComputedRef<string>
  accentChoice: Ref<SkyUiDemoAccent>
  accentSoft: ComputedRef<string>
  dark: Ref<boolean>
  exit: () => void
  navigate: (id: SkyUiDemoId) => void
  returnToCatalog: () => void
}

const skyUiDemoContextKey: InjectionKey<SkyUiDemoContext> = Symbol(
  'sky-ui-demo-context',
)

export function provideSkyUiDemoContext(context: SkyUiDemoContext): void {
  provide(skyUiDemoContextKey, context)
}

export function createSkyUiDemoTheme(
  dark: Ref<boolean>,
  accentChoice: Ref<SkyUiDemoAccent>,
): Pick<SkyUiDemoContext, 'accent' | 'accentChoice' | 'accentSoft' | 'dark'> {
  return {
    accent: computed(() => accentChoice.value.color),
    accentChoice,
    accentSoft: computed(() => accentChoice.value.soft),
    dark,
  }
}

export function useSkyUiDemoContext(): SkyUiDemoContext {
  const context = inject(skyUiDemoContextKey)
  if (!context) throw new Error('Sky UI demo context is unavailable.')
  return context
}
