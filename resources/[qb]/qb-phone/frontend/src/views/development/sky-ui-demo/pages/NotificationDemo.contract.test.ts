import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./NotificationDemo.vue', import.meta.url),
  'utf8',
)

describe('NotificationDemo Konsta parity', () => {
  it('keeps all four reference interactions and the auto-close timing', () => {
    expect(source).toContain("openNotification('notificationFull')")
    expect(source).toContain("openNotification('notificationWithButton')")
    expect(source).toContain("openNotification('notificationCloseOnClick')")
    expect(source).toContain("openNotification('notificationCallbackOnClose')")
    expect(source).toContain('}, 3000)')
    expect(source).toContain('@click="opened.notificationWithButton = false"')
    expect(source).toContain('@click="closeWithCallback"')
    expect(source).toContain('content="Notification closed"')
  })

  it('uses the exact iOS close affordance and page rhythm', () => {
    const notificationBlocks = source.match(
      /<SkyNotification[\s\S]*?<\/SkyNotification>/g,
    )
    const fullNotification = notificationBlocks?.find((block) =>
      block.includes('opened.notificationFull'),
    )
    const closeNotification = notificationBlocks?.find((block) =>
      block.includes('opened.notificationWithButton'),
    )

    expect(fullNotification).not.toContain('<template #button />')
    expect(closeNotification).toContain('<template #button />')
    expect(source).toContain('gap: var(--sky-space-4)')
    expect(source).toMatch(
      /\.sky-ui-demo-notification__icon\s*\{[\s\S]*?width:\s*28px;[\s\S]*?height:\s*28px;/,
    )
  })
})
