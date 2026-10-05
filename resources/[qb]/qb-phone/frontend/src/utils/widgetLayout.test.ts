import { describe, expect, it, vi } from 'vitest'

import {
  addWidget,
  createDefaultWidgetLayout,
  deleteWidgetPage,
  MAX_WIDGET_HOME_PAGES,
  moveWidget,
  parseWidgetLayout,
  removeWidget,
  resizeWidget,
  widgetOccupiedCells,
  widgetKeyboardTarget,
} from '@/utils/widgetLayout'

describe('widget layout', () => {
  it('creates a non-overlapping default layout across both surfaces', () => {
    const layout = createDefaultWidgetLayout()

    expect(layout.instances).toHaveLength(7)
    expect(widgetOccupiedCells(layout.instances, 0).size).toBe(32)
    expect(widgetOccupiedCells(layout.instances, 1).size).toBe(16)
  })

  it('adds a widget to the first free snapped position', () => {
    vi.spyOn(Date, 'now').mockReturnValue(42)
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const layout = createDefaultWidgetLayout()
    const next = addWidget(layout, 'wallet', 'small', 1)
    const added = next.instances.find((instance) =>
      instance.id.startsWith('wallet-'),
    )

    expect(added).toMatchObject({ column: 0, page: 1, row: 4, size: 'small' })
  })

  it('moves a widget and reflows a displaced neighbor', () => {
    const layout = createDefaultWidgetLayout()
    const next = moveWidget(layout, 'home-clock', 1, 2, 0)
    const clock = next.instances.find(
      (instance) => instance.id === 'home-clock',
    )
    const weather = next.instances.find(
      (instance) => instance.id === 'home-weather',
    )

    expect(clock).toMatchObject({ column: 2, page: 1, row: 0 })
    expect(weather).toMatchObject({ column: 0, page: 1, row: 0 })
    expect(next.instances).toHaveLength(layout.instances.length)
  })

  it('provides bounded keyboard targets for each widget size', () => {
    const layout = createDefaultWidgetLayout()
    const clock = layout.instances.find(
      (instance) => instance.id === 'home-clock',
    )!
    const music = layout.instances.find(
      (instance) => instance.id === 'home-music',
    )!

    expect(widgetKeyboardTarget(clock, 'right')).toEqual({ column: 1, row: 0 })
    expect(widgetKeyboardTarget(clock, 'up')).toBeNull()
    expect(widgetKeyboardTarget(music, 'right')).toBeNull()
    expect(widgetKeyboardTarget(music, 'down')).toEqual({ column: 0, row: 3 })
  })

  it('allows a small widget in the center with app cells on both sides', () => {
    const layout = createDefaultWidgetLayout()
    const moved = moveWidget(layout, 'home-clock', 2, 1, 1)

    expect(
      moved.instances.find((instance) => instance.id === 'home-clock'),
    ).toMatchObject({ column: 1, page: 2, row: 1 })
    expect([...widgetOccupiedCells(moved.instances, 2)]).toEqual([5, 6, 9, 10])
    expect(widgetOccupiedCells(moved.instances, 2).has(4)).toBe(false)
    expect(widgetOccupiedCells(moved.instances, 2).has(7)).toBe(false)
  })

  it('moves a widget across pages into the sixth widget row', () => {
    const layout = createDefaultWidgetLayout()
    const moved = moveWidget(layout, 'home-clock', 2, 2, 4)

    expect(
      moved.instances.find((instance) => instance.id === 'home-clock'),
    ).toMatchObject({ column: 2, page: 2, row: 4 })
    expect([...widgetOccupiedCells(moved.instances, 2)]).toEqual([
      18, 19, 22, 23,
    ])
  })

  it('bounds persisted and requested widget pages to the home page limit', () => {
    const parsed = parseWidgetLayout({
      instances: [
        {
          column: 0,
          id: 'clock-too-far',
          kind: 'clock',
          page: 999,
          row: 0,
          settings: {},
          size: 'small',
        },
      ],
      version: 1,
    })
    const moved = moveWidget(parsed, 'clock-too-far', 999, 0, 4)

    expect(parsed.instances[0]?.page).toBe(MAX_WIDGET_HOME_PAGES)
    expect(moved.instances[0]).toMatchObject({
      page: MAX_WIDGET_HOME_PAGES,
      row: 4,
    })
  })

  it('keeps the original layout when displaced widgets cannot be reflowed', () => {
    const layout = createDefaultWidgetLayout()
    const packed = {
      instances: [
        layout.instances.find((instance) => instance.id === 'home-clock')!,
        ...Array.from({ length: 5 }, (_, index) => ({
          column: 0,
          id: `packed-${index}`,
          kind: 'date' as const,
          page: 0,
          row: index * 2,
          settings: {},
          size: 'medium' as const,
        })),
      ],
      version: 1 as const,
    }

    expect(moveWidget(packed, 'home-clock', 0, 0, 0)).toBe(packed)
  })

  it('resizes and removes widgets without changing unrelated settings', () => {
    const layout = createDefaultWidgetLayout()
    const resized = resizeWidget(layout, 'home-clock', 'medium')
    const removed = removeWidget(resized, 'home-weather')

    expect(
      resized.instances.find((instance) => instance.id === 'home-clock'),
    ).toMatchObject({ settings: { showDate: true }, size: 'medium' })
    expect(
      removed.instances.some((instance) => instance.id === 'home-weather'),
    ).toBe(false)
  })

  it('rejects unsupported and duplicate persisted entries', () => {
    const parsed = parseWidgetLayout({
      instances: [
        {
          column: 0,
          id: 'clock-a',
          kind: 'clock',
          page: 1,
          row: 0,
          settings: { showDate: true },
          size: 'large',
        },
        {
          column: 2,
          id: 'clock-a',
          kind: 'clock',
          page: 1,
          row: 0,
          settings: {},
          size: 'small',
        },
      ],
      version: 1,
    })

    expect(parsed.instances).toHaveLength(1)
    expect(parsed.instances[0]?.size).toBe('small')
  })

  it('deletes a home page and preserves its widgets on remaining pages', () => {
    const layout = createDefaultWidgetLayout()
    const moved = moveWidget(layout, 'home-clock', 2, 1, 1)
    const deleted = deleteWidgetPage(moved, 2, 1)

    expect(deleted).not.toBe(moved)
    expect(
      deleted.instances.find((instance) => instance.id === 'home-clock')?.page,
    ).toBe(1)
    expect(deleted.instances).toHaveLength(moved.instances.length)
  })
})
