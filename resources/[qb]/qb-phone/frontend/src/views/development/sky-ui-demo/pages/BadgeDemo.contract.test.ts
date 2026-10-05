import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('./BadgeDemo.vue', import.meta.url), 'utf8')
const iconSource = readFileSync(
  new URL('../assets/BadgeIosIcon.vue', import.meta.url),
  'utf8',
)

describe('BadgeDemo', () => {
  it('uses the plain Konsta-style navbar link for the profile action', () => {
    expect(source).toContain('SkyLink,')
    expect(source).toMatch(
      /<SkyLink[\s\S]*?aria-label="Profile, 5 notifications"[\s\S]*?class="badge-demo__profile-action"[\s\S]*?icon-only[\s\S]*?>/,
    )
    expect(source).not.toContain('SkyGlass,')
  })

  it('keeps the profile action circular, accessible, and token sized', () => {
    expect(source).toMatch(
      /\.badge-demo__profile-action\s*\{[^}]*width:\s*var\(--sky-touch-target, 44px\)[^}]*height:\s*var\(--sky-touch-target, 44px\)[^}]*border:\s*0[^}]*border-radius:\s*50%[^}]*color:\s*inherit/s,
    )
    expect(source).toMatch(
      /\.badge-demo__profile-action:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--sky-app-accent, #007aff\)/s,
    )
    expect(source).toMatch(
      /\.badge-demo__list-icon\s*\{[^}]*width:\s*28px[^}]*height:\s*28px/s,
    )
  })

  it('uses the exact filled Framework7 iOS glyph geometry', () => {
    expect(source).not.toContain('lucide-vue-next')
    expect(source).toContain('<BadgeIosIcon name="person-circle-fill" />')
    expect(source).toContain('<BadgeIosIcon name="envelope-fill" />')
    expect(source).toContain('<BadgeIosIcon name="calendar" />')
    expect(source).toContain('<BadgeIosIcon name="cloud-upload-fill" />')

    expect(iconSource).toContain('fill="currentcolor"')
    expect(iconSource).toContain('viewBox="0 0 56 56"')
    expect(iconSource).toContain('M 27.9999 51.9062')
    expect(iconSource).toContain('M 28.0468 30.7070')
    expect(iconSource).toContain('M 11.9923 49.5742')
    expect(iconSource).toContain('M29.956181,36.8524845')
  })

  it('matches the reference badge colors and default primary CEO badge', () => {
    expect(source).toContain(':badge-colors="{ bg: \'#22c55e\' }"')
    expect(source.match(/:badge-colors="\{ bg: '#ef4444' \}"/g)).toHaveLength(3)
    expect(source).toMatch(
      /title="Foo Bar"[\s\S]*?<SkyBadge class="badge-demo__badge--gray">0<\/SkyBadge>/,
    )
    expect(source).toMatch(
      /title="Ivan Petrov"[\s\S]*?<SkyBadge>CEO<\/SkyBadge>/,
    )
    expect(source).not.toContain('tone="info"')
    expect(source).toMatch(
      /\.badge-demo__badge--gray\s*\{[^}]*background:\s*#6b7280[^}]*color:\s*#ffffff/s,
    )
    expect(source).toMatch(
      /\.badge-demo__badge--green\s*\{[^}]*background:\s*#22c55e/s,
    )
    expect(source).toMatch(
      /\.badge-demo__badge--yellow\s*\{[^}]*background:\s*#eab308/s,
    )
  })
})
