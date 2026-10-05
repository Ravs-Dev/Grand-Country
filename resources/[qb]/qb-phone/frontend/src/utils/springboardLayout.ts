import {
  HOME_GRID_PAGE_SIZE,
  isHomeFolder,
  MAX_HOME_GRID_PAGES,
  type HomeItem,
  type HomeSlot,
} from '@/utils/homeLayout'

export type SpringboardHomeCell = {
  item: HomeItem | null
  renderKey: string
  sourceIndex: number | null
  targetOffset: number
  targetPage: number
}

export type SpringboardHomePage = {
  cells: Array<SpringboardHomeCell | null>
  page: number
}

type PendingHomeCell = Pick<
  SpringboardHomeCell,
  'item' | 'renderKey' | 'sourceIndex'
>

function homeItemRenderKey(
  item: HomeItem,
  appOccurrences: Map<string, number>,
): string {
  if (isHomeFolder(item)) return `grid-folder-${item.id}`
  const occurrence = appOccurrences.get(item) ?? 0
  appOccurrences.set(item, occurrence + 1)
  return `grid-app-${item}-${occurrence}`
}

export function layoutSpringboardHomePages(
  grid: readonly HomeSlot[],
  occupiedByPage: ReadonlyMap<number, ReadonlySet<number>>,
  minimumPageCount: number,
  isRenderable: (item: HomeItem) => boolean = () => true,
): SpringboardHomePage[] {
  const pageCount = Math.max(
    1,
    Math.min(
      MAX_HOME_GRID_PAGES,
      Math.max(minimumPageCount, Math.ceil(grid.length / HOME_GRID_PAGE_SIZE)),
    ),
  )
  const pages: SpringboardHomePage[] = []
  const pending: PendingHomeCell[] = []
  const appOccurrences = new Map<string, number>()

  const createPage = (page: number): SpringboardHomePage => {
    const pageStart = (page - 1) * HOME_GRID_PAGE_SIZE
    for (let offset = 0; offset < HOME_GRID_PAGE_SIZE; offset += 1) {
      const sourceIndex = pageStart + offset
      const item = grid[sourceIndex]
      if (!item || !isRenderable(item)) continue
      pending.push({
        item,
        renderKey: homeItemRenderKey(item, appOccurrences),
        sourceIndex,
      })
    }

    const occupied = occupiedByPage.get(page) ?? new Set<number>()
    const cells = new Array<SpringboardHomeCell | null>(
      HOME_GRID_PAGE_SIZE,
    ).fill(null)
    let targetOffset = 0
    for (let cell = 0; cell < HOME_GRID_PAGE_SIZE; cell += 1) {
      if (occupied.has(cell)) continue
      const pendingCell = pending.shift()
      cells[cell] = pendingCell
        ? { ...pendingCell, targetOffset, targetPage: page }
        : {
            item: null,
            renderKey: `grid-empty-${pageStart + targetOffset}`,
            sourceIndex: pageStart + targetOffset,
            targetOffset,
            targetPage: page,
          }
      targetOffset += 1
    }
    return { cells, page }
  }

  for (let page = 1; page <= pageCount; page += 1) {
    pages.push(createPage(page))
  }

  while (pending.length && pages.length < MAX_HOME_GRID_PAGES) {
    pages.push(createPage(pages.length + 1))
  }

  return pages
}
