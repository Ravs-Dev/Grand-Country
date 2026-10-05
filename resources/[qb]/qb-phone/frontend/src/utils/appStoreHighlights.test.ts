import { describe, expect, it } from 'vitest'

import { getDailyHighlights } from '@/utils/appStoreHighlights'

const candidates = [
  { id: 'banking' },
  { id: 'feather' },
  { id: 'snake' },
  { id: 'music' },
  { id: 'picstagram' },
]

describe('daily App Store highlights', () => {
  it('keeps the generated order stable throughout one local day', () => {
    const morning = getDailyHighlights(candidates, new Date(2026, 7, 14, 8, 15))
    const evening = getDailyHighlights(
      candidates,
      new Date(2026, 7, 14, 22, 45),
    )

    expect(evening).toEqual(morning)
    expect(morning).toHaveLength(candidates.length)
  })

  it('generates a different curation for the next local day', () => {
    const today = getDailyHighlights(candidates, new Date(2026, 7, 14))
    const tomorrow = getDailyHighlights(candidates, new Date(2026, 7, 15))

    expect(tomorrow.map((app) => app.id)).not.toEqual(
      today.map((app) => app.id),
    )
  })
})
