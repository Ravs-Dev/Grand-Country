import { describe, expect, it } from 'vitest'

import {
  normalizeBankingAmountInput,
  parseBankingAmount,
} from '@/utils/bankingAmount'

describe('banking amount input', () => {
  it('uses a decimal comma and strips native number-input noise', () => {
    expect(normalizeBankingAmountInput('1.')).toBe('1,')
    expect(normalizeBankingAmountInput('12.00')).toBe('12,00')
    expect(normalizeBankingAmountInput('EUR 12,00')).toBe('12,00')
    expect(normalizeBankingAmountInput('12,0,0')).toBe('12,00')
  })

  it('keeps the server-authoritative whole-money contract', () => {
    expect(parseBankingAmount('125')).toBe(125)
    expect(parseBankingAmount('125,00')).toBe(125)
    expect(parseBankingAmount('125,50')).toBeNull()
    expect(parseBankingAmount('0')).toBeNull()
    expect(parseBankingAmount('')).toBeNull()
  })
})
