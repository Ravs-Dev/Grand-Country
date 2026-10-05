export type DatabaseDateValue = string | number

export function parseDatabaseDate(value: DatabaseDateValue): Date {
  if (typeof value === 'number') {
    const timestamp = Math.abs(value) < 1_000_000_000_000 ? value * 1000 : value
    return new Date(timestamp)
  }

  const normalized = value.replace(' ', 'T').replace(/(\.\d{3})\d+$/, '$1')
  return new Date(normalized)
}
