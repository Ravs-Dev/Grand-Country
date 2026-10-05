import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./HealthApp.vue', import.meta.url), 'utf8')

describe('HealthApp Sky UI contract', () => {
  it('uses the shared page, navbar, scroll owner, and pill navigation', () => {
    expect(source).toContain('<SkyAppPage')
    expect(source).toContain('<SkyNavbar')
    expect(source).toContain('<SkyScrollArea')
    expect(source).toContain('padded with-tabbar')
    expect(source).toContain('with-tabbar')
    expect(source).toContain('<SkyPillNavigation')
    expect(source).not.toContain(
      'padding: 0 var(--sky-page-gutter) var(--sky-page-space)',
    )
  })

  it('keeps every user-facing label in the locale tree', () => {
    expect(source).toContain("phone.t('Apps.health.name')")
    expect(source).toContain("phone.t('Apps.health.tabs.today')")
    expect(source).toContain("phone.t('Apps.health.medicalId.title')")
  })

  it('uses the real Health NUI data flow', () => {
    expect(source).toContain('void health.load()')
    expect(source).toContain("nuiCall('calls:dial'")
    expect(source).toContain('health.saveMedicalId')
  })

  it('uses the Sky iOS action sheet instead of a native blood type select', () => {
    expect(source).toContain('<SkyActionSheet')
    expect(source).toContain('<SkyActionButton')
    expect(source).toContain('@click="selectBloodType(option.value)"')
    expect(source).not.toContain(':options="bloodTypeOptions"')
  })

  it('does not present values the phone cannot observe', () => {
    expect(source).not.toContain('healthPercent')
    expect(source).not.toContain('recoveryPercent')
    expect(source).not.toContain('conditionKey')
  })
})
