import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./CompaniesApp.vue', import.meta.url),
  'utf8',
)
const navigationSource = source.slice(
  source.indexOf('<SkyPillNavigation'),
  source.indexOf('</SkyPillNavigation>') + '</SkyPillNavigation>'.length,
)
const requestFilterSource = source.slice(
  source.indexOf('<div class="companies-segment-wrap">'),
  source.indexOf(
    '</div>',
    source.indexOf('<div class="companies-segment-wrap">'),
  ) + '</div>'.length,
)
const availabilitySources =
  source.match(
    /<SkySegmented\s+class=\x22availability-segmented\x22[\s\S]*?<\/SkySegmented>/g,
  ) ?? []

describe('CompaniesApp Sky pill navigation contract', () => {
  it('uses the full-width sliding glass navigation on the root screen', () => {
    expect(source).not.toContain('<SkyTabBar')
    expect(source).not.toContain('<SkyTabButton')
    expect(source).toContain('<SkyPillNavigation')
    expect(source).toContain('v-if="screen === \'root\'"')
    expect(source).toContain('layout="full"')
    expect(source).toContain('<SkySegmented')
    expect(source).toContain('navigation')
    expect(source).toContain(':active-index="activeTabIndex"')
    expect(source).toContain(':data-active-tab="activeTab"')
    expect(source).toContain(':item-count="3"')
    expect(navigationSource.match(/<SkySegmentedButton\b/g)).toHaveLength(3)
    expect(navigationSource).not.toContain('compact')
  })

  it('keeps directory, requests and work actions with unread badges', () => {
    expect(source).toContain("selectTab('directory')")
    expect(source).toContain("selectTab('requests')")
    expect(source).toContain("selectTab('work')")
    expect(source).toContain("phone.t('Apps.companies.tabs.directory')")
    expect(source).toContain("phone.t('Apps.companies.tabs.requests')")
    expect(source).toContain("phone.t('Apps.companies.tabs.work')")
    expect(source).toContain('companies.customerUnreadCount')
    expect(source).toContain('companies.workUnreadCount')
  })

  it('retains tabbar-aware padding on all three root scroll owners', () => {
    expect(source.match(/with-tabbar/g)).toHaveLength(3)
  })

  it('uses the shared sliding Glass system for the request-state filter', () => {
    expect(requestFilterSource).toContain('<SkySegmented')
    expect(requestFilterSource).toContain('compact')
    expect(requestFilterSource).toContain('navigation')
    expect(requestFilterSource).toContain('strong')
    expect(requestFilterSource).toContain(':item-count="2"')
    expect(requestFilterSource).toContain(
      ':active-index="requestList === \'open\' ? 0 : 1"',
    )
    expect(requestFilterSource).toContain(
      ':aria-label="phone.t(\'Apps.companies.tabs.requests\')"',
    )
    expect(requestFilterSource.match(/<SkySegmentedButton\b/g)).toHaveLength(2)
  })

  it('uses compact sliding Glass for both availability controls', () => {
    expect(availabilitySources).toHaveLength(2)
    for (const availabilitySource of availabilitySources) {
      expect(availabilitySource).toContain('compact')
      expect(availabilitySource).toContain('navigation')
      expect(availabilitySource).toContain('strong')
    }
    expect(source.match(/class="availability-segmented"/g)).toHaveLength(2)
    expect(
      source.match(
        /:active-index="availabilityValues\.indexOf\(workCompany\.availability\)"/g,
      ),
    ).toHaveLength(2)
    expect(
      source.match(/:item-count="availabilityValues\.length"/g),
    ).toHaveLength(2)
    expect(source.match(/\s+compact\s+navigation/g)).toHaveLength(3)
    expect(source).toContain(
      ':aria-label="phone.t(\'Apps.companies.work.publicAvailability\')"',
    )
    expect(source).toContain(
      ':aria-label="phone.t(\'Apps.companies.manager.availability\')"',
    )
  })
})
