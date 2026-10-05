import type { ComputedRef, InjectionKey } from 'vue'

export interface SkyListContext {
  dividers: boolean
  nested: boolean
}

export const skyListContextKey: InjectionKey<ComputedRef<SkyListContext>> =
  Symbol('sky-list-context')
