import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getPhoneApp,
  isExternalPhoneApp,
  replaceExternalPhoneApps,
} from '@/config/apps'
import {
  normalizeExternalPhoneApp,
  useAppCatalogStore,
} from '@/stores/app-catalog'

const mocks = vi.hoisted(() => ({
  ensureAppNotificationPreferences: vi.fn(),
  reconcileCatalog: vi.fn(),
}))

vi.mock('@/stores/app-store', () => ({
  useAppStoreStore: () => ({ reconcileCatalog: mocks.reconcileCatalog }),
}))
vi.mock('@/stores/phone', () => ({
  usePhoneStore: () => ({
    ensureAppNotificationPreferences: mocks.ensureAppNotificationPreferences,
  }),
}))

function validApp(overrides: Record<string, unknown> = {}) {
  return {
    bundled: false,
    category: 'utilities',
    icon: 'https://cfx-nui-example/web/icon.webp',
    id: 'example-app',
    name: 'Example App',
    ownerResource: 'example_resource',
    ui: 'https://cfx-nui-example/web/index.html',
    ...overrides,
  }
}

describe('custom app catalog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    replaceExternalPhoneApps([])
    mocks.ensureAppNotificationPreferences.mockReset()
    mocks.reconcileCatalog.mockReset()
  })

  afterEach(() => {
    replaceExternalPhoneApps([])
    vi.restoreAllMocks()
  })

  it('normalizes a validated external iframe app', () => {
    const app = normalizeExternalPhoneApp(
      validApp({
        compatibility: { fixBlur: true, unsafe: () => undefined },
        defaultInstalled: true,
        iconBackground: '#1d4ed8',
        permissions: ['app.close', 'app.close', 'device.storage'],
      }),
    )

    expect(app).toMatchObject({
      bridgeMode: 'legacy',
      capabilities: ['app.close', 'device.storage'],
      compatibility: { fixBlur: true },
      defaultInstalled: true,
      id: 'example-app',
      iconBackground: '#1d4ed8',
      kind: 'external',
      readyTimeoutMs: 8000,
      removable: true,
      route: '/apps/example-app',
    })
  })

  it('accepts only color-shaped icon backgrounds', () => {
    expect(
      normalizeExternalPhoneApp(
        validApp({ iconBackground: 'hsl(221 83% 53%)' }),
      ),
    ).toMatchObject({ iconBackground: 'hsl(221 83% 53%)' })
    expect(
      normalizeExternalPhoneApp(
        validApp({
          iconBackground: 'url(https://attacker.test/tracker.png)',
        }),
      ),
    ).not.toHaveProperty('iconBackground')
  })

  it('rejects unsafe URLs and built-in id collisions', () => {
    expect(
      normalizeExternalPhoneApp(validApp({ ui: 'javascript:alert(1)' })),
    ).toBeNull()
    expect(normalizeExternalPhoneApp(validApp({ id: 'phone' }))).toBeNull()
    expect(
      normalizeExternalPhoneApp(validApp({ readyTimeoutMs: 31_000 })),
    ).toMatchObject({ readyTimeoutMs: 8000 })
  })

  it('replaces the runtime entries and reconciles dependent stores', () => {
    const catalog = useAppCatalogStore()

    catalog.replaceCatalog({
      apps: [
        validApp(),
        validApp(),
        validApp({ id: 'invalid', ui: 'http://example.test' }),
      ],
    })

    const app = getPhoneApp('example-app')
    expect(isExternalPhoneApp(app)).toBe(true)
    expect(catalog.externalApps).toHaveLength(1)
    expect(mocks.ensureAppNotificationPreferences).toHaveBeenCalledWith([
      'example-app',
    ])
    expect(mocks.reconcileCatalog).toHaveBeenCalledOnce()
  })

  it('queues messages only for registered external apps', () => {
    const catalog = useAppCatalogStore()
    catalog.replaceCatalog({ apps: [validApp()] })

    expect(catalog.queueHostMessage('example-app', { hello: 'world' })).toBe(
      true,
    )
    expect(catalog.queueHostMessage('phone', {})).toBe(false)
    expect(catalog.hostMessages['example-app']).toMatchObject([
      { payload: { hello: 'world' }, sequence: 1 },
    ])
  })
})
