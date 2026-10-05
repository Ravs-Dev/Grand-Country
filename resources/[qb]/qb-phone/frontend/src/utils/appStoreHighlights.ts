type HighlightCandidate = {
  id: string
}

function localDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  )
}

function nextRandom(seed: number): number {
  return (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
}

export function getDailyHighlights<T extends HighlightCandidate>(
  candidates: readonly T[],
  date = new Date(),
): T[] {
  const ordered = [...candidates].sort((left, right) =>
    left.id.localeCompare(right.id),
  )
  let seed = localDayNumber(date) >>> 0

  for (let index = ordered.length - 1; index > 0; index -= 1) {
    seed = nextRandom(seed)
    const target = seed % (index + 1)
    const current = ordered[index]
    ordered[index] = ordered[target]
    ordered[target] = current
  }

  if (ordered.length > 1) {
    const offset = localDayNumber(date) % ordered.length
    return [...ordered.slice(offset), ...ordered.slice(0, offset)]
  }

  return ordered
}
