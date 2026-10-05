import { defineStore } from 'pinia'

import {
  applyCalculatorUnary,
  calculatorPercent,
  chooseCalculatorOperator,
  clearCalculator,
  formatCalculatorNumber,
  inputDecimal,
  inputDigit,
  resolveCalculator,
  toggleCalculatorSign,
  type CalculatorOperator,
  type CalculatorState,
  type CalculatorUnaryOperation,
} from '@/utils/calculator'

export type CalculatorHistoryEntry = {
  id: string
  expression: string
  result: string
  createdAt: number
}

type CalculatorParentFrame = Pick<
  CalculatorState,
  'accumulator' | 'calculation' | 'pendingOperator' | 'waitingForOperand'
>

const HISTORY_KEY = 'sky_phone_calculator_history_v1'

function loadHistory(): CalculatorHistoryEntry[] {
  if (typeof localStorage === 'undefined') return []
  const stored = localStorage.getItem(HISTORY_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored) as CalculatorHistoryEntry[]
    return Array.isArray(parsed) ? parsed.slice(0, 50) : []
  } catch {
    console.warn('[Calculator] Ignored invalid persisted history.')
    return []
  }
}

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    ...clearCalculator(),
    angleUnit: 'radians' as 'degrees' | 'radians',
    history: loadHistory(),
    memory: 0,
    parentFrames: [] as CalculatorParentFrame[],
    second: false,
  }),
  actions: {
    backspace(): void {
      if (this.error || this.waitingForOperand) return
      this.display = this.display.length > 1 ? this.display.slice(0, -1) : '0'
    },
    chooseOperator(operator: CalculatorOperator): void {
      Object.assign(this, chooseCalculatorOperator(this.$state, operator))
    },
    clear(): void {
      Object.assign(this, clearCalculator())
      this.parentFrames = []
    },
    decimal(): void {
      Object.assign(this, inputDecimal(this.$state))
    },
    digit(value: string): void {
      Object.assign(this, inputDigit(this.$state, value))
    },
    equals(): void {
      const expression = this.calculation
      const next = resolveCalculator(this.$state)
      Object.assign(this, next)
      if (!expression || next.error || next.calculation === expression) return
      this.history.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        expression: next.calculation.replace(/\s*=\s*$/, ''),
        result: next.display,
        createdAt: Date.now(),
      })
      this.history = this.history.slice(0, 50)
      this.persistHistory()
    },
    percent(): void {
      Object.assign(this, calculatorPercent(this.$state))
    },
    toggleSign(): void {
      Object.assign(this, toggleCalculatorSign(this.$state))
    },
    unary(operation: CalculatorUnaryOperation): void {
      const result = applyCalculatorUnary(
        Number(this.display),
        operation,
        this.angleUnit,
      )
      if (result === null) {
        Object.assign(this, {
          ...clearCalculator(),
          display: 'Error',
          error: true,
        })
        return
      }
      this.display = formatCalculatorNumber(result)
      this.waitingForOperand = true
    },
    constant(value: number): void {
      this.display = formatCalculatorNumber(value)
      this.error = false
      this.waitingForOperand = true
    },
    random(): void {
      this.display = formatCalculatorNumber(Math.random())
      this.error = false
      this.waitingForOperand = true
    },
    memoryClear(): void {
      this.memory = 0
    },
    memoryAdd(): void {
      this.memory += Number(this.display) || 0
    },
    memorySubtract(): void {
      this.memory -= Number(this.display) || 0
    },
    memoryRecall(): void {
      this.constant(this.memory)
    },
    openParenthesis(): void {
      this.parentFrames.push({
        accumulator: this.accumulator,
        calculation: this.calculation,
        pendingOperator: this.pendingOperator,
        waitingForOperand: this.waitingForOperand,
      })
      Object.assign(this, clearCalculator())
    },
    closeParenthesis(): void {
      const frame = this.parentFrames.pop()
      if (!frame) return
      const inner = this.pendingOperator
        ? resolveCalculator(this.$state)
        : { ...this.$state }
      const innerExpression = (inner.calculation || inner.display).replace(
        /\s*=\s*$/,
        '',
      )
      Object.assign(this, {
        ...frame,
        display: inner.display,
        calculation: frame.calculation
          ? `${frame.calculation} (${innerExpression})`
          : `(${innerExpression})`,
        error: inner.error,
        waitingForOperand: false,
      })
    },
    toggleAngleUnit(): void {
      this.angleUnit = this.angleUnit === 'radians' ? 'degrees' : 'radians'
    },
    toggleSecond(): void {
      this.second = !this.second
    },
    removeHistory(id: string): void {
      this.history = this.history.filter((entry) => entry.id !== id)
      this.persistHistory()
    },
    clearHistory(): void {
      this.history = []
      this.persistHistory()
    },
    useHistory(entry: CalculatorHistoryEntry): void {
      Object.assign(this, {
        ...clearCalculator(),
        display: entry.result,
        calculation: entry.expression,
        waitingForOperand: true,
      })
    },
    persistHistory(): void {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history))
    },
  },
})
