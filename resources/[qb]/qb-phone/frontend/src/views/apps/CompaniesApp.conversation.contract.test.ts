import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./CompaniesApp.vue', import.meta.url),
  'utf8',
).replace(/\r\n/g, '\n')
const scriptSource = source.slice(0, source.indexOf('</script>'))
const requestBranchStart = source.indexOf(
  '<template v-else-if="screen === \'request\'">',
)
const requestBranchEnd = source.indexOf(
  "<SkyScrollArea\n      v-else-if=\"screen === 'manager'",
  requestBranchStart,
)
const requestBranchSource = source.slice(requestBranchStart, requestBranchEnd)
const requestScrollStart = requestBranchSource.indexOf('<SkyScrollArea')
const requestScrollEnd =
  requestBranchSource.indexOf('</SkyScrollArea>', requestScrollStart) +
  '</SkyScrollArea>'.length
const requestScrollSource = requestBranchSource.slice(
  requestScrollStart,
  requestScrollEnd,
)
const requestDockStart = requestBranchSource.indexOf(
  '<footer',
  requestScrollEnd,
)
const requestDockEnd =
  requestBranchSource.indexOf('</footer>', requestDockStart) +
  '</footer>'.length
const requestDockSource = requestBranchSource.slice(
  requestDockStart,
  requestDockEnd,
)
const styleSource = source.slice(source.indexOf('<style scoped>'))

describe('CompaniesApp request conversation contract', () => {
  it('keeps one registered scroll owner and a separate fixed conversation dock', () => {
    expect(requestBranchStart).toBeGreaterThan(-1)
    expect(requestBranchEnd).toBeGreaterThan(requestBranchStart)
    expect(requestBranchSource.match(/<SkyScrollArea\b/g)).toHaveLength(1)
    expect(requestScrollSource).toContain(
      'class="companies-content request-thread"',
    )

    expect(requestDockStart).toBeGreaterThan(requestScrollEnd)
    expect(requestScrollSource).not.toContain('request-thread-actions')
    expect(requestScrollSource).not.toContain('<SkyMessagebar')
    expect(requestDockSource).toContain('class="request-thread-dock"')
    expect(requestDockSource).toContain('class="request-thread-actions"')
    expect(requestDockSource).toContain('<SkyMessagebar')
    expect(requestDockSource.indexOf('request-thread-actions')).toBeLessThan(
      requestDockSource.indexOf('<SkyMessagebar'),
    )
  })

  it('does not introduce a nested vertical request scroller', () => {
    expect(requestBranchSource).not.toContain('request-thread-scroll')
    expect(styleSource).not.toMatch(
      /\.request-thread(?:-content|-scroll)?\s*\{[^}]*\boverflow(?:-y)?\s*:\s*(?:auto|scroll)/s,
    )
  })

  it('scrolls the sentinel after initial and newly received messages while respecting reduced motion', () => {
    expect(scriptSource).toContain(
      'const requestThreadBottom = ref<HTMLElement | null>(null)',
    )
    expect(requestScrollSource).toContain('ref="requestThreadBottom"')
    expect(requestScrollSource).toContain('class="request-thread-bottom"')
    expect(scriptSource).toContain(
      'requestThreadBottom.value?.scrollIntoView({',
    )
    expect(scriptSource).toContain(
      "window.matchMedia(\n    '(prefers-reduced-motion: reduce)',",
    )
    expect(scriptSource).toContain(
      "behavior: animate && !reduceMotion ? 'smooth' : 'auto'",
    )

    expect(scriptSource).toMatch(
      /watch\(\s*\[\s*\(\) => companies\.request\?\.id \?\? ''[\s\S]*?companies\.request\?\.messages\.length \?\? 0[\s\S]*?messages\[messages\.length - 1\]!\.id[\s\S]*?scrollRequestThreadToBottom\(requestId === previousRequestId\)[\s\S]*?\{ flush: 'post' \},\s*\)/,
    )
  })
})
