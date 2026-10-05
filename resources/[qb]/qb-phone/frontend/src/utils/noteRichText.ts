const RICH_NOTE_PREFIX = 'sky-note-html-v1:'

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const hexadecimal = code[1]?.toLowerCase() === 'x'
      const numeric = Number.parseInt(
        code.slice(hexadecimal ? 2 : 1),
        hexadecimal ? 16 : 10,
      )
      return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : entity
    }
    return HTML_ENTITIES[code.toLowerCase()] ?? entity
  })
}

function escapeHtml(value: string): string {
  return value
    .split('&')
    .join('&amp;')
    .split('<')
    .join('&lt;')
    .split('>')
    .join('&gt;')
    .split('"')
    .join('&quot;')
    .split("'")
    .join('&#39;')
}

export function isRichNoteBody(body: string): boolean {
  return body.startsWith(RICH_NOTE_PREFIX)
}

export function noteBodyToEditorHtml(body: string): string {
  if (isRichNoteBody(body)) return body.slice(RICH_NOTE_PREFIX.length)
  if (!body) return '<p></p>'

  return body
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).split('\n').join('<br>')}</p>`,
    )
    .join('')
}

export function noteBodyToPlainText(body: string): string {
  if (!isRichNoteBody(body)) return body

  return decodeHtmlEntities(
    body
      .slice(RICH_NOTE_PREFIX.length)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p\s*>/gi, '\n')
      .replace(/<\/h[1-6]\s*>/gi, '\n')
      .replace(/<li(?:\s[^>]*)?>/gi, '• ')
      .replace(/<\/li\s*>/gi, '\n')
      .replace(/<\/blockquote\s*>/gi, '\n')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function serializeRichNoteBody(html: string): string {
  return `${RICH_NOTE_PREFIX}${html}`
}
