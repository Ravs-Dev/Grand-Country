import { describe, expect, it } from 'vitest'

import { WIDGET_REGISTRY_BY_KIND } from '@/config/widgets'
import type { WidgetKind } from '@/types/widgets'

describe('widget registry home labels', () => {
  it.each<[WidgetKind, string]>([
    ['clock', 'Apps.clock.name'],
    ['date', 'Apps.calendar.name'],
    ['weather', 'Apps.weather.name'],
    ['music', 'Apps.music.name'],
    ['wallet', 'Apps.banking.name'],
    ['transactions', 'Apps.banking.name'],
    ['contacts', 'Apps.phone.name'],
  ])('uses the host app label for %s', (kind, labelKey) => {
    expect(WIDGET_REGISTRY_BY_KIND.get(kind)?.homeLabelKey).toBe(labelKey)
  })
})
