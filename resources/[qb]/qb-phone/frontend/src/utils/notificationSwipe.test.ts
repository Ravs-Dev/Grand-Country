import { describe, expect, it } from 'vitest'

import {
  clampNotificationSwipeOffset,
  NOTIFICATION_SWIPE_ACTION_WIDTH,
  resolveNotificationSwipeAxis,
  shouldRevealNotificationAction,
} from '@/utils/notificationSwipe'

describe('lock-screen notification swipe gestures', () => {
  it('waits for a clear horizontal or vertical direction', () => {
    expect(resolveNotificationSwipeAxis(5, 2)).toBeNull()
    expect(resolveNotificationSwipeAxis(-24, 5)).toBe('horizontal')
    expect(resolveNotificationSwipeAxis(-10, 18)).toBe('vertical')
  })

  it('only allows a resisted swipe to the left', () => {
    expect(clampNotificationSwipeOffset(40)).toBe(0)
    expect(clampNotificationSwipeOffset(-60)).toBe(-60)
    expect(clampNotificationSwipeOffset(-240)).toBeGreaterThan(
      -NOTIFICATION_SWIPE_ACTION_WIDTH - 17,
    )
  })

  it('reveals clear after enough distance or a deliberate flick', () => {
    expect(shouldRevealNotificationAction(-41, -0.2)).toBe(false)
    expect(shouldRevealNotificationAction(-42, -0.2)).toBe(true)
    expect(shouldRevealNotificationAction(-20, -0.5)).toBe(true)
    expect(shouldRevealNotificationAction(-12, -0.8)).toBe(false)
  })
})
