import { describe, expect, it } from 'vitest'

import { isTrustedRootMessageSource } from '@/utils/windowMessages'

describe('root window message source', () => {
  it('accepts native NUI messages and messages posted by trusted host windows', () => {
    const parentWindow = {} as Window
    const topWindow = {} as Window
    const rootWindow = {
      parent: parentWindow,
      top: topWindow,
    } as Window

    expect(isTrustedRootMessageSource(null, rootWindow)).toBe(true)
    expect(isTrustedRootMessageSource(rootWindow, rootWindow)).toBe(true)
    expect(isTrustedRootMessageSource(parentWindow, rootWindow)).toBe(true)
    expect(isTrustedRootMessageSource(topWindow, rootWindow)).toBe(true)
  })

  it('rejects messages posted by child frames', () => {
    const rootWindow = {
      parent: {} as Window,
      top: {} as Window,
    } as Window
    const childFrame = {} as Window

    expect(isTrustedRootMessageSource(childFrame, rootWindow)).toBe(false)
  })
})
