import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const flareServer = readFileSync(
  new URL('../../sky_phone/source/server/flare.lua', import.meta.url),
  'utf8',
)
const mediaServer = readFileSync(
  new URL('../../sky_phone/source/server/media.lua', import.meta.url),
  'utf8',
)

function sourceBlock(source: string, startMarker: string, endMarker: string) {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)

  expect(start).toBeGreaterThanOrEqual(0)
  expect(end).toBeGreaterThan(start)
  return source.slice(start, end)
}

describe('Flare server profile photo invariants', () => {
  it('requires one to six unique owned photos for every profile save', () => {
    const validation = sourceBlock(
      flareServer,
      'local function validate_profile(source, data)',
      'local function load_match',
    )

    expect(validation).toContain('type(data.photoMediaIds) ~= "table"')
    expect(validation).toContain('or #data.photoMediaIds < 1')
    expect(validation).toContain('or #data.photoMediaIds > 6')
    expect(validation).toContain('or seen_media[media_id]')
    expect(validation).toContain(
      'SkyPhoneMedia.ResolveOwnedMedia(source, media_id, "photo")',
    )
    expect(validation).toContain('replace_photos = true')
  })

  it('filters profiles without a valid owned HTTPS photo before limiting suggestions', () => {
    const suggestions = sourceBlock(
      flareServer,
      'local function list_suggestions(account_id, profile)',
      'local function list_likes',
    )
    const exists = suggestions.indexOf('AND EXISTS (')
    const order = suggestions.indexOf('ORDER BY target.`updated_at`')
    const limit = suggestions.indexOf('LIMIT 30')

    expect(suggestions).toContain('type(profile.photo_urls) ~= "table"')
    expect(suggestions).toContain('or #profile.photo_urls < 1')
    expect(exists).toBeGreaterThanOrEqual(0)
    expect(exists).toBeLessThan(order)
    expect(order).toBeLessThan(limit)
    expect(suggestions).toContain(
      'target_media.`account_id` = target.`account_id`',
    )
    expect(suggestions).toContain("target_media.`media_type` = 'photo'")
    expect(suggestions).toContain("target_media.`url` LIKE 'https://%'")
  })

  it('protects the last valid Flare photo for single and sequential bulk deletes', () => {
    const deletion = sourceBlock(
      mediaServer,
      'local function is_required_flare_profile_photo(media_id)',
      'function SkyPhoneMedia.GetDeviceRemoteIds',
    )

    expect(deletion).toContain('other_photo.`media_id` <> photo.`media_id`')
    expect(deletion).toContain(
      'other_media.`account_id` = profile.`account_id`',
    )
    expect(deletion).toContain("other_media.`media_type` = 'photo'")
    expect(deletion).toContain("other_media.`url` LIKE 'https://%'")
    expect(deletion).toContain(
      'row.media_type == "photo" and is_required_flare_profile_photo(media_id)',
    )
    expect(deletion).toContain('return false, "profile_photo_required"')
    expect(deletion).toMatch(
      /for _, media_id in ipairs\(media_ids\) do[\s\S]*?delete_owned_media\(src, owner, media_id\)/,
    )
  })
})
