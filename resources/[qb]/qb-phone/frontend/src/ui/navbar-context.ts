import { inject, provide, type InjectionKey } from 'vue'

const skyNavbarKey: InjectionKey<boolean> = Symbol('sky-ui-navbar')

export function provideSkyNavbar(): void {
  provide(skyNavbarKey, true)
}

export function useSkyNavbar(): boolean {
  return inject(skyNavbarKey, false)
}
