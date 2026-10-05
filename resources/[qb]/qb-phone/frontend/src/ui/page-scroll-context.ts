import {
  inject,
  provide,
  shallowRef,
  type InjectionKey,
  type ShallowRef,
} from 'vue'

interface SkyPageScrollContext {
  collapseOffset: ShallowRef<number>
  element: ShallowRef<HTMLElement | null>
  register: (element: HTMLElement) => () => void
}

const skyPageScrollKey: InjectionKey<SkyPageScrollContext> =
  Symbol('sky-ui-page-scroll')

export function provideSkyPageScroll(): SkyPageScrollContext {
  const collapseOffset = shallowRef(0)
  const elements = shallowRef<HTMLElement[]>([])
  const element = shallowRef<HTMLElement | null>(null)

  const register = (nextElement: HTMLElement): (() => void) => {
    elements.value = [
      ...elements.value.filter((candidate) => candidate !== nextElement),
      nextElement,
    ]
    element.value = nextElement

    return () => {
      elements.value = elements.value.filter(
        (candidate) => candidate !== nextElement,
      )
      element.value = elements.value.at(-1) ?? null
    }
  }

  const context: SkyPageScrollContext = { collapseOffset, element, register }
  provide(skyPageScrollKey, context)
  return context
}

export function useSkyPageScroll(): SkyPageScrollContext | null {
  return inject(skyPageScrollKey, null)
}
