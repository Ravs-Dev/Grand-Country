import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const uiDirectory = fileURLToPath(new URL('.', import.meta.url))
const rootIndexPath = join(uiDirectory, 'index.ts')

interface ComponentExport {
  exportedName: string
  moduleSpecifier: string
}

const konstaIosParity = {
  Actions: 'SkyActionSheet',
  ActionsButton: 'SkyActionButton',
  ActionsGroup: 'SkyActionGroup',
  ActionsLabel: 'SkyActionsLabel',
  App: 'SkyApp',
  Badge: 'SkyBadge',
  Block: 'SkyBlock',
  BlockFooter: 'SkyBlockFooter',
  BlockHeader: 'SkyBlockHeader',
  BlockTitle: 'SkyBlockTitle',
  Breadcrumbs: 'SkyBreadcrumbs',
  BreadcrumbsCollapsed: 'SkyBreadcrumbsCollapsed',
  BreadcrumbsItem: 'SkyBreadcrumbsItem',
  BreadcrumbsSeparator: 'SkyBreadcrumbsSeparator',
  Button: 'SkyButton',
  Card: 'SkyCard',
  Checkbox: 'SkyCheckbox',
  Chip: 'SkyChip',
  Dialog: 'SkyDialog',
  DialogButton: 'SkyDialogButton',
  Fab: 'SkyFab',
  Glass: 'SkyGlass',
  Icon: 'SkyIcon',
  Link: 'SkyLink',
  List: 'SkyList',
  ListButton: 'SkyListButton',
  ListGroup: 'SkyListGroup',
  ListGroupInner: 'SkyListGroupInner',
  ListInput: 'SkyField',
  ListItem: 'SkyListItem',
  MenuList: 'SkyMenuList',
  MenuListItem: 'SkyMenuListItem',
  Message: 'SkyMessage',
  Messagebar: 'SkyMessagebar',
  Messages: 'SkyMessages',
  MessagesTitle: 'SkyMessagesTitle',
  Navbar: 'SkyNavbar',
  NavbarBackLink: 'SkyNavbarBackLink',
  Notification: 'SkyNotification',
  Page: 'SkyAppPage',
  Panel: 'SkyPanel',
  Popover: 'SkyPopover',
  Popup: 'SkyPopup',
  Preloader: 'SkySpinner',
  Progressbar: 'SkyProgress',
  Radio: 'SkyRadio',
  Range: 'SkyRange',
  Searchbar: 'SkySearchbar',
  Segmented: 'SkySegmented',
  SegmentedButton: 'SkySegmentedButton',
  Sheet: 'SkySheet',
  Stepper: 'SkyStepper',
  Tabbar: 'SkyTabBar',
  TabbarLink: 'SkyTabButton',
  Table: 'SkyTable',
  TableBody: 'SkyTableBody',
  TableCell: 'SkyTableCell',
  TableHead: 'SkyTableHead',
  TableRow: 'SkyTableRow',
  Toast: 'SkyToast',
  Toggle: 'SkyToggle',
  Toolbar: 'SkyToolbar',
  ToolbarPane: 'SkyToolbarPane',
} as const

function displayPath(path: string): string {
  const displayed = relative(uiDirectory, path).replace(/\\/g, '/')
  return displayed || '.'
}

function componentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && /^Sky[A-Za-z0-9_]*\.vue$/.test(entry.name),
    )
    .map((entry) => entry.name)
    .sort()
}

function componentDirectories(): string[] {
  const familyDirectories = readdirSync(uiDirectory, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(uiDirectory, entry.name))
    .filter((directory) => componentFiles(directory).length > 0)
    .sort()

  return [uiDirectory, ...familyDirectories]
}

function componentExports(indexSource: string): ComponentExport[] {
  return Array.from(
    indexSource.matchAll(
      /export\s*{\s*default\s+as\s+(Sky[A-Za-z0-9_]*)\s*}\s*from\s*['"]([^'"]+\.vue)['"]/g,
    ),
    ([, exportedName, moduleSpecifier]) => ({
      exportedName,
      moduleSpecifier,
    }),
  )
}

describe('Sky UI public catalog', () => {
  it('covers every Konsta 5.3 Vue primitive with a Sky equivalent', () => {
    const componentNames = new Set(
      componentDirectories().flatMap((directory) =>
        componentFiles(directory).map((file) => basename(file, '.vue')),
      ),
    )
    const missingComponents = Object.entries(konstaIosParity)
      .filter(([, skyComponent]) => !componentNames.has(skyComponent))
      .map(
        ([konstaComponent, skyComponent]) =>
          `${konstaComponent} -> ${skyComponent}`,
      )

    expect(Object.keys(konstaIosParity)).toHaveLength(63)
    expect(missingComponents).toEqual([])
  })

  it('gives every component family its own export index', () => {
    const missingIndexes = componentDirectories()
      .map((directory) => join(directory, 'index.ts'))
      .filter((indexPath) => !existsSync(indexPath))
      .map(displayPath)

    expect(missingIndexes).toEqual([])
  })

  it('keeps SkyProvider as a Sky extension outside the Konsta catalog', () => {
    expect(readFileSync(rootIndexPath, 'utf8')).toContain(
      "export { default as SkyProvider } from './SkyProvider.vue'",
    )
  })

  it('exports every Sky component from its family index exactly once', () => {
    const failures: string[] = []

    for (const directory of componentDirectories()) {
      const indexPath = join(directory, 'index.ts')
      if (!existsSync(indexPath)) continue

      const expectedFiles = componentFiles(directory)
      const exports = componentExports(readFileSync(indexPath, 'utf8'))
      const exportedFiles = exports
        .map(({ moduleSpecifier }) => moduleSpecifier.replace(/^\.\//, ''))
        .sort()

      if (JSON.stringify(exportedFiles) !== JSON.stringify(expectedFiles)) {
        failures.push(
          `${displayPath(indexPath)} exports ${exportedFiles.join(', ') || '<none>'}; expected ${expectedFiles.join(', ') || '<none>'}`,
        )
      }

      for (const componentExport of exports) {
        const componentName = basename(componentExport.moduleSpecifier, '.vue')

        if (componentExport.exportedName !== componentName) {
          failures.push(
            `${displayPath(indexPath)} exports ${componentExport.moduleSpecifier} as ${componentExport.exportedName}; expected ${componentName}`,
          )
        }
      }
    }

    expect(failures).toEqual([])
  })

  it('re-exports every component family from the root index exactly once', () => {
    const rootIndexSource = readFileSync(rootIndexPath, 'utf8')
    const familyExports = Array.from(
      rootIndexSource.matchAll(/export\s+\*\s+from\s*['"]([^'"]+)['"]/g),
      ([, moduleSpecifier]) => moduleSpecifier.replace(/\/index$/, ''),
    )
    const failures = componentDirectories()
      .slice(1)
      .map((directory) => `./${displayPath(directory)}`)
      .filter(
        (familySpecifier) =>
          familyExports.filter((value) => value === familySpecifier).length !==
          1,
      )

    expect(failures).toEqual([])
  })

  it('keeps component names unique across public families', () => {
    const componentNames = componentDirectories().flatMap((directory) =>
      componentFiles(directory).map((file) => basename(file, '.vue')),
    )
    const duplicateNames = componentNames.filter(
      (name, index) => componentNames.indexOf(name) !== index,
    )

    expect(duplicateNames).toEqual([])
  })
})
