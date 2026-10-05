import { describe, expect, it } from 'vitest'

import type { LaunchablePhoneAppId } from '@/types/apps'
import { HOME_GRID_PAGE_SIZE, type HomeSlot } from '@/utils/homeLayout'
import { layoutSpringboardHomePages } from '@/utils/springboardLayout'

function app(id: string): LaunchablePhoneAppId {
  return id as LaunchablePhoneAppId
}

describe('springboard app page layout', () => {
  it('closes visual gaps per page while keeping page membership', () => {
    const grid = new Array<LaunchablePhoneAppId | null>(
      HOME_GRID_PAGE_SIZE * 2,
    ).fill(null)
    grid[20] = app('row-six')
    grid[24] = app('page-two')

    const pages = layoutSpringboardHomePages(grid, new Map(), 2)

    expect(pages).toHaveLength(2)
    expect(pages[0]?.cells[0]).toMatchObject({
      item: 'row-six',
      sourceIndex: 20,
    })
    expect(pages[0]?.cells[1]).toMatchObject({ item: null, sourceIndex: 1 })
    expect(pages[1]?.cells[0]).toMatchObject({
      item: 'page-two',
      sourceIndex: 24,
    })
  })

  it('reflows apps forward around widgets without swapping their order', () => {
    const grid = new Array<LaunchablePhoneAppId | null>(
      HOME_GRID_PAGE_SIZE,
    ).fill(null)
    for (let index = 0; index < 8; index += 1) grid[index] = app(`app-${index}`)

    const pages = layoutSpringboardHomePages(
      grid,
      new Map([[1, new Set([0, 1, 4, 5])]]),
      1,
    )

    expect(
      pages[0]?.cells.slice(0, 12).map((cell) => cell?.item ?? null),
    ).toEqual([
      null,
      null,
      'app-0',
      'app-1',
      null,
      null,
      'app-2',
      'app-3',
      'app-4',
      'app-5',
      'app-6',
      'app-7',
    ])
  })

  it('reflows folders as one item and keeps their source index', () => {
    const grid = new Array<HomeSlot>(HOME_GRID_PAGE_SIZE).fill(null)
    grid[0] = app('mail')
    grid[1] = {
      apps: [app('clock'), app('notes')],
      id: 'folder-tools-123456',
      name: 'Tools',
      type: 'folder',
    }

    const pages = layoutSpringboardHomePages(
      grid,
      new Map([[1, new Set([0, 1])]]),
      1,
    )

    expect(pages[0]?.cells[2]).toMatchObject({
      item: 'mail',
      sourceIndex: 0,
    })
    expect(pages[0]?.cells[3]).toMatchObject({
      item: {
        apps: ['clock', 'notes'],
        id: 'folder-tools-123456',
        type: 'folder',
      },
      sourceIndex: 1,
    })
  })

  it('maps widget overflow to the visible destination page and offset', () => {
    const grid = Array.from({ length: HOME_GRID_PAGE_SIZE }, (_, index) =>
      app(`app-${index}`),
    )
    const pages = layoutSpringboardHomePages(
      grid,
      new Map([[1, new Set([0, 1, 2, 3])]]),
      2,
    )

    expect(pages[1]?.cells[0]).toMatchObject({
      item: 'app-20',
      sourceIndex: 20,
      targetOffset: 0,
      targetPage: 2,
    })
    expect(pages[1]?.cells[1]).toMatchObject({
      item: 'app-21',
      sourceIndex: 21,
      targetOffset: 1,
      targetPage: 2,
    })
  })

  it('does not reserve a visible slot for an unavailable shortcut', () => {
    const grid = new Array<HomeSlot>(HOME_GRID_PAGE_SIZE).fill(null)
    grid[0] = app('available-one')
    grid[1] = app('unavailable')
    grid[2] = app('available-two')

    const pages = layoutSpringboardHomePages(
      grid,
      new Map(),
      1,
      (item) => typeof item !== 'string' || item !== 'unavailable',
    )

    expect(
      pages[0]?.cells.slice(0, 3).map((cell) => cell?.item ?? null),
    ).toEqual(['available-one', 'available-two', null])
    expect(pages[0]?.cells[1]).toMatchObject({ sourceIndex: 2 })
  })
})
