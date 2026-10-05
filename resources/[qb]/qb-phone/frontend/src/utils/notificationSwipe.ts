export type NotificationSwipeAxis = 'horizontal' | 'vertical'

export const NOTIFICATION_SWIPE_ACTION_WIDTH = 76
export const NOTIFICATION_SWIPE_AXIS_LOCK = 8
export const NOTIFICATION_SWIPE_TRIGGER = 42

export function resolveNotificationSwipeAxis(
  deltaX: number,
  deltaY: number,
): NotificationSwipeAxis | null {
  const horizontalDistance = Math.abs(deltaX)
  const verticalDistance = Math.abs(deltaY)
  if (
    Math.max(horizontalDistance, verticalDistance) <
    NOTIFICATION_SWIPE_AXIS_LOCK
  ) {
    return null
  }

  return horizontalDistance > verticalDistance * 1.15
    ? 'horizontal'
    : 'vertical'
}

export function clampNotificationSwipeOffset(deltaX: number): number {
  if (deltaX >= 0) return 0

  const distance = Math.abs(deltaX)
  const resistedDistance =
    distance <= NOTIFICATION_SWIPE_ACTION_WIDTH
      ? distance
      : NOTIFICATION_SWIPE_ACTION_WIDTH +
        (distance - NOTIFICATION_SWIPE_ACTION_WIDTH) * 0.16

  return -Math.min(resistedDistance, NOTIFICATION_SWIPE_ACTION_WIDTH + 16)
}

export function shouldRevealNotificationAction(
  offset: number,
  velocityX: number,
): boolean {
  return (
    offset <= -NOTIFICATION_SWIPE_TRIGGER ||
    (offset <= -18 && velocityX <= -0.45)
  )
}
