import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
} from 'vue'

export interface SkyThemeContext {
  accent: ComputedRef<string>
  accentSoft: ComputedRef<string>
  dark: ComputedRef<boolean>
  safeAreas: ComputedRef<boolean>
}

interface SkyThemeSource {
  accent: () => string
  accentSoft: () => string
  dark: () => boolean
  safeAreas: () => boolean
}

const skyThemeKey: InjectionKey<SkyThemeContext> = Symbol('sky-ui-theme')

export function provideSkyTheme(source: SkyThemeSource): SkyThemeContext {
  const context: SkyThemeContext = {
    accent: computed(source.accent),
    accentSoft: computed(source.accentSoft),
    dark: computed(source.dark),
    safeAreas: computed(source.safeAreas),
  }

  provide(skyThemeKey, context)
  return context
}

export function useSkyTheme(): SkyThemeContext | null {
  return inject(skyThemeKey, null)
}
