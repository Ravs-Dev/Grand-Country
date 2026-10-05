export function normalizeBankingAmountInput(value: string): string {
  const normalizedSeparators = value.replace(/\./g, ',')
  const digitsAndSeparators = normalizedSeparators.replace(/[^\d,]/g, '')
  const separatorIndex = digitsAndSeparators.indexOf(',')

  if (separatorIndex < 0) return digitsAndSeparators

  const whole = digitsAndSeparators.slice(0, separatorIndex)
  const decimal = digitsAndSeparators
    .slice(separatorIndex + 1)
    .replace(/,/g, '')
    .slice(0, 2)

  return `${whole},${decimal}`
}

export function parseBankingAmount(value: string): number | null {
  if (!/^\d+(?:,\d{1,2})?$/.test(value)) return null

  const amount = Number(value.replace(',', '.'))
  if (!Number.isSafeInteger(amount) || amount <= 0) return null

  return amount
}
