import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('./FlipTokApp.vue', import.meta.url),
  'utf8',
)
const serverSource = readFileSync(
  new URL('../../../../sky_phone/source/server/fliptok.lua', import.meta.url),
  'utf8',
)
const migrationSource = readFileSync(
  new URL(
    '../../../../sky_phone/source/server/db_migrate.lua',
    import.meta.url,
  ),
  'utf8',
)
const youtubeSource = readFileSync(
  new URL(
    '../../../../sky_phone/source/server/media_metadata.lua',
    import.meta.url,
  ),
  'utf8',
)
const mockServerSource = readFileSync(
  new URL('../../../testserver/index.cjs', import.meta.url),
  'utf8',
)

describe('FlipTokApp Sky UI contract', () => {
  it('uses first-party Sky UI without direct Konsta markup', () => {
    expect(source).not.toContain("from 'konsta/vue'")
    expect(source).not.toMatch(/<\/?k-[a-z]/)
    expect(source).toContain('<SkyAppPage')
    expect(source).toContain('<SkyNavbar')
    expect(source).toContain('<SkyScrollArea')
    expect(source).toContain('<SkySearchbar')
    expect(source).toContain('<SkyPillNavigation')
    expect(source).toContain('<SkyMessagebar')
  })

  it('uses the SkyUI navigation pill and native navbar back action', () => {
    expect(source).toMatch(
      /<SkySegmented[\s\S]*?:item-count="5"[\s\S]*?navigation/,
    )
    expect(source).toContain(':show-back="Boolean(store.viewedProfile)"')
    expect(source).toContain('back-appearance="surface"')
    expect(source).toMatch(/\.fliptok-navbar\s*\{[^}]*transform:\s*none/s)
  })

  it('shows timestamps and supports replies and likes on comments', () => {
    expect(source).not.toContain('formatTimestamp(video.created_at)')
    expect(source).toContain('formatTimestamp(thread.comment.created_at)')
    expect(source).toContain('@click="startReply(thread.comment)"')
    expect(source).toContain('@click="reactCommentWithPulse(thread.comment)"')
    expect(source).toContain('comment-like-pulse')
    expect(source).toContain('@keyframes comment-heart-pop')
    expect(source).toContain('class="comment-row comment-row--reply"')
    expect(source).toContain(
      'v-show="expandedCommentThreads.has(thread.comment.id)"',
    )
    expect(source).toContain("t('showReplies'")
    expect(source).toContain("t('hideReplies', {")
    expect(source).toContain(
      'const expandedCommentThreads = ref(new Set<string>())',
    )
    expect(source).toContain('form.comments-composer')
  })

  it('sends reports to Discord and keeps moderation out of the phone UI', () => {
    expect(source).not.toContain('moderationOpen')
    expect(source).toContain('reportDiscordNote')
    expect(serverSource).toContain('Config.FlipTok.ReportWebhookConvar')
    expect(serverSource).toContain('PerformHttpRequest(webhook')
    expect(serverSource).not.toContain(
      'INSERT IGNORE INTO `sky_phone_fliptok_reports`',
    )
  })

  it('exposes follower lists and editable profile photos', () => {
    expect(source).toContain("openConnections('following')")
    expect(source).toContain("openConnections('followers')")
    expect(source).toContain("openProfileMedia('photos')")
    expect(source).toContain("openProfileMedia('camera')")
    expect(source).toContain('@click="removeProfilePhoto"')
    expect(source).toContain('profilePhotoSheetOpen')
    expect(source).toContain('avatarMediaId')
    expect(source).toContain('class="overlay-screen connections-screen"')
    expect(source).toContain('class="connections-tabs"')
  })

  it('supports camera videos, photo slides, and a safe composer return path', () => {
    expect(source).toContain("chooseVideo('camera')")
    expect(source).toContain("choosePhotoSlideshow('photos')")
    expect(source).toContain("'/apps/fliptok?compose=1'")
    expect(source).toContain("route.query.compose === '1'")
    expect(source).toContain('mediaIds,')
    expect(source).toContain('class="photo-slideshow"')
    expect(source).toContain(
      '@pointerdown="beginPhotoSlideDrag(video.id, $event)"',
    )
    expect(source).toContain('@pointermove="updatePhotoSlideDrag"')
    expect(source).toContain('@pointerup="endPhotoSlideDrag(video, $event)"')
    expect(source).not.toContain('photo-slideshow__arrow')
    expect(source).toContain(
      'window.requestAnimationFrame(() => renderPhotoSlideDrag(drag))',
    )
    expect(source).toContain('function settlePhotoSlide(')
    expect(source).toContain('class="photo-slideshow__track"')
    expect(source).toContain('const animation = track.animate(')
    expect(source).toContain("easing: 'cubic-bezier(0.22, 1, 0.36, 1)'")
    expect(source).toMatch(
      /updatePhotoSlideIndex\(videoId, index\)[\s\S]*?const animation = track\.animate\(/,
    )
    expect(source).toContain('startIndex: photoSlideIndex(videoId)')
    expect(source).not.toContain('element.scrollLeft')
    expect(source).toContain('moveComposerPhoto(1)')
    expect(source).toContain('video-shade--passive')
    expect(migrationSource).toContain('sky_phone_fliptok_video_media')
    expect(serverSource).toContain(
      'if not Bridge.Database.Transaction(queries) then',
    )
    expect(serverSource).toContain(
      'return { success = false, error = "request_failed" }',
    )
    expect(source).toMatch(
      /\.media-source-grid button strong\s*\{[^}]*width:\s*100%;[^}]*overflow-wrap:\s*anywhere;/s,
    )
  })

  it('shows a centered transient follow control', () => {
    expect(source).toContain('followFeedbackIds')
    expect(source).toContain('follow-dot--confirmed')
    expect(source).toContain('@click.stop="followFromFeed(video)"')
    expect(source).toContain(
      'video.is_following || followPendingIds.has(video.id)',
    )
    expect(source).toMatch(
      /\.video-actions \.follow-dot\s*\{[^}]*bottom:\s*-2px;[^}]*min-width: 20px !important;[^}]*min-height: 20px !important;[^}]*place-items: center;/s,
    )
    expect(source).toMatch(
      /\.video-profile-action\s*\{[^}]*width:\s*44px;[^}]*min-height:\s*48px;[^}]*justify-items:\s*center;/s,
    )
  })

  it('keeps full-screen media inside FlipTok and raises Discover', () => {
    expect(source).toMatch(
      /\.video-feed\s*\{[^}]*position: absolute;[^}]*inset: 0;[^}]*height: 100%;/s,
    )
    expect(source).toContain('class="fliptok-navbar fliptok-discover-navbar"')
    expect(source).toMatch(
      /\.fliptok-discover-navbar\.sky-navbar--no-navigation\s*\{[^}]*padding-top:/s,
    )
  })

  it('uses separate profile action boxes and disables duplicate follows', () => {
    expect(source).toContain('class="fliptok-navbar fliptok-profile-navbar"')
    expect(source).toMatch(
      /\.profile-navbar-actions :deep\(\.sky-link\)\s*\{[^}]*width: 38px;[^}]*border:/s,
    )
    expect(source).toContain(':disabled="connectionIsFollowing(profile)"')
    expect(source).toContain("connectionsMode.value === 'following'")
    expect(source).toContain('@click="followConnection(profile)"')
  })

  it('hides authentication header names and centers avatar fallbacks', () => {
    expect(source).toContain(
      ":aria-label=\"t(authMode === 'login' ? 'login' : 'register')\"",
    )
    expect(source).not.toContain(
      ":title=\"t(authMode === 'login' ? 'login' : 'register')\"",
    )
    expect(source).toContain('class="connection-avatar__fallback"')
    expect(source).toMatch(
      /\.connections-list \.connection-avatar__fallback\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*display:\s*grid;[^}]*place-items:\s*center;/s,
    )
  })

  it('supports validated custom audio links in the composer', () => {
    expect(source).toContain('function validCustomMusicUrl')
    expect(source).toContain('customMusicDraftUrl')
    expect(source).toContain('customMusicLoadFailed')
    expect(source).toContain('type="url"')
    expect(source).toContain('@click="chooseCustomMusic"')
    expect(source).toContain(
      "customMusicUrl: musicTrack.value ? '' : customMusicUrl.value",
    )
    expect(source).toContain('v-if="composerMusicUrl"')
    expect(source).toContain('function parseYoutubeVideoId')
    expect(source).toContain("'fliptok:music-metadata'")
    expect(source).toContain('playFlipTokYoutube')
  })

  it('validates and persists custom audio links on the server', () => {
    expect(serverSource).toContain('local function valid_custom_music_url')
    expect(serverSource).toContain('error = "invalid_music_url"')
    expect(serverSource).toContain('v.`custom_music_url`')
    expect(serverSource).toContain('video.custom_music_url = nil')
    expect(migrationSource).toContain('name = "custom_music_url"')
    expect(migrationSource).toContain('name = "custom_music_title"')
    expect(migrationSource).toContain('name = "custom_music_artist"')
    expect(migrationSource).toContain('collation = "ascii_bin"')
    expect(youtubeSource).toContain('function SkyPhoneYouTube.ParseId')
    expect(youtubeSource).toContain('function SkyPhoneYouTube.FetchMetadata')
    expect(youtubeSource).toContain('www.youtube.com/oembed')
  })

  it('keeps report and profile editing surfaces rounded and safe', () => {
    expect(source).toContain('class="report-sheet__actions"')
    expect(source).toContain('class="profile-account-list"')
    expect(source).toMatch(
      /\.report-sheet\s*\{[^}]*padding-bottom:\s*calc\(var\(--sky-safe-area-bottom\)/s,
    )
    expect(source).toMatch(
      /\.profile-form-list,[\s\S]*?\.profile-account-list\s*\{[^}]*border-radius:\s*var\(--sky-radius-card\)/,
    )
  })

  it('keeps private video actions behind one server access check', () => {
    expect(serverSource).toContain('local function load_accessible_video')
    expect(
      serverSource.match(/load_accessible_video\(/g)?.length,
    ).toBeGreaterThan(6)
    expect(serverSource).toContain("v.`visibility` = 'followers'")
    expect(serverSource).toContain('profile_follow.`follower_id` = ?')
  })

  it('surfaces failed actions and lets owners remove their own videos', () => {
    expect(source).toContain('if (!(await store.loadComments(video.id)))')
    expect(source).toContain('if (!response.success) {')
    expect(source).toContain('function requestDeleteVideo')
    expect(source).toContain('store.deleteVideo(selectedVideo.value.id)')
    expect(source).toContain('v-if="selectedVideo?.is_owner"')
    expect(source).toContain('v-if="selectedVideo?.comments_enabled"')
  })

  it('keeps discovery localized and cancels delayed searches on close', () => {
    expect(source).toContain("labelKey: 'trendLosSantos'")
    expect(source).toContain('@click="search = trend.value"')
    expect(source).toContain('new Intl.NumberFormat(phone.lang')
    expect(source).toContain('new Intl.DateTimeFormat(phone.lang')
    expect(source).toContain(
      'if (searchTimer !== null) window.clearTimeout(searchTimer)',
    )
  })

  it('restores the feed after a discovery preview and safely notifies on comments', () => {
    expect(source).toContain(
      'const feedBeforePreview = ref<FlipTokVideo[] | null>(null)',
    )
    expect(source).toContain('store.feed = feedBeforePreview.value')
    expect(source).toContain('@click="openFeedTab"')
    expect(serverSource).toContain(
      'parent_id = parents[1].parent_id or parents[1].id',
    )
    expect(serverSource).toContain('if owner_id ~= profile.id then')
    expect(serverSource).not.toContain('videos[1].profile_id')
  })

  it('keeps photo slides and scoped comments functional in the browser mock', () => {
    expect(mockServerSource).toContain("media_type: 'photo'")
    expect(mockServerSource).toContain('comment.video_id === video.id')
    expect(mockServerSource).toContain(
      "request.body.mediaType === 'photo' ? 'photo' : 'video'",
    )
    expect(mockServerSource).toContain("endpoint === 'fliptok:delete'")
  })
})
