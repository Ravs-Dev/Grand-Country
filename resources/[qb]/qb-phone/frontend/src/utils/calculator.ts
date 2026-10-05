export type CalculatorOperator =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'root'

export type CalculatorUnaryOperation =
  | 'reciprocal'
  | 'square'
  | 'cube'
  | 'exp'
  | 'tenPower'
  | 'sqrt'
  | 'cbrt'
  | 'ln'
  | 'log10'
  | 'factorial'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'sinh'
  | 'cosh'
  | 'tanh'

export type CalculatorState = {
  accumulator: number | null
  calculation: string
  display: string
  error: boolean
  pendingOperator: CalculatorOperator | null
  waitingForOperand: boolean
}

export const INITIAL_CALCULATOR_STATE: CalculatorState = {
  accumulator: null,
  calculation: '',
  display: '0',
  error: false,
  pendingOperator: null,
  waitingForOperand: false,
}

const OPERATOR_SYMBOLS: Record<CalculatorOperator, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  root: 'ʸ√',
}

export function formatCalculatorNumber(value: number): string {
  if (!Number.isFinite(value)) return 'Error'
  const rounded = Number(value.toPrecision(12))
  const rendered = String(rounded)
  return rendered.length <= 12 ? rendered : rounded.toExponential(6)
}

export function calculate(
  left: number,
  right: number,
  operator: CalculatorOperator,
): number | null {
  if (operator === 'add') return left + right
  if (operator === 'subtract') return left - right
  if (operator === 'multiply') return left * right
  if (operator === 'divide') return right === 0 ? null : left / right
  if (operator === 'power') return left ** right
  if (left === 0) return null
  return right < 0 && left % 2 === 0
    ? null
    : Math.sign(right) * Math.abs(right) ** (1 / left)
}

export function applyCalculatorUnary(
  value: number,
  operation: CalculatorUnaryOperation,
  angleUnit: 'degrees' | 'radians' = 'radians',
): number | null {
  const angle = angleUnit === 'degrees' ? (value * Math.PI) / 180 : value
  let result: number
  if (operation === 'reciprocal') return value === 0 ? null : 1 / value
  if (operation === 'square') result = value ** 2
  else if (operation === 'cube') result = value ** 3
  else if (operation === 'exp') result = Math.exp(value)
  else if (operation === 'tenPower') result = 10 ** value
  else if (operation === 'sqrt')
    result = value < 0 ? Number.NaN : Math.sqrt(value)
  else if (operation === 'cbrt') result = Math.cbrt(value)
  else if (operation === 'ln')
    result = value <= 0 ? Number.NaN : Math.log(value)
  else if (operation === 'log10')
    result = value <= 0 ? Number.NaN : Math.log10(value)
  else if (operation === 'factorial') {
    if (value < 0 || !Number.isInteger(value) || value > 170) return null
    result = 1
    for (let factor = 2; factor <= value; factor += 1) result *= factor
  } else if (operation === 'sin') result = Math.sin(angle)
  else if (operation === 'cos') result = Math.cos(angle)
  else if (operation === 'tan') result = Math.tan(angle)
  else if (operation === 'asin') {
    result = Math.asin(value)
    if (angleUnit === 'degrees') result = (result * 180) / Math.PI
  } else if (operation === 'acos') {
    result = Math.acos(value)
    if (angleUnit === 'degrees') result = (result * 180) / Math.PI
  } else if (operation === 'atan') {
    result = Math.atan(value)
    if (angleUnit === 'degrees') result = (result * 180) / Math.PI
  } else if (operation === 'sinh') result = Math.sinh(value)
  else if (operation === 'cosh') result = Math.cosh(value)
  else result = Math.tanh(value)
  return Number.isFinite(result) ? result : null
}

export function clearCalculator(): CalculatorState {
  return { ...INITIAL_CALCULATOR_STATE }
}

export function inputDigit(
  state: CalculatorState,
  digit: string,
): CalculatorState {
  if (!/^\d$/.test(digit)) return state
  if (state.error || state.waitingForOperand) {
    return {
      ...state,
      calculation: state.pendingOperator ? state.calculation : '',
      display: digit,
      error: false,
      waitingForOperand: false,
    }
  }
  if (state.display === '0') return { ...state, display: digit }
  if (state.display.replace('-', '').replace('.', '').length >= 10) return state
  return { ...state, display: `${state.display}${digit}` }
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.error || state.waitingForOperand) {
    return {
      ...state,
      calculation: state.pendingOperator ? state.calculation : '',
      display: '0.',
      error: false,
      waitingForOperand: false,
    }
  }
  return state.display.includes('.')
    ? state
    : { ...state, display: `${state.display}.` }
}

export function toggleCalculatorSign(state: CalculatorState): CalculatorState {
  if (state.error || state.display === '0') return state
  return {
    ...state,
    display: state.display.startsWith('-')
      ? state.display.slice(1)
      : `-${state.display}`,
  }
}

export function calculatorPercent(state: CalculatorState): CalculatorState {
  if (state.error) return state
  return {
    ...state,
    display: formatCalculatorNumber(Number(state.display) / 100),
  }
}

export function chooseCalculatorOperator(
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState {
  if (state.error) return clearCalculator()
  const input = Number(state.display)
  let accumulator = state.accumulator
  let calculation = state.calculation

  if (state.pendingOperator && state.waitingForOperand) {
    return {
      ...state,
      calculation: `${calculation.slice(0, -1)}${OPERATOR_SYMBOLS[operator]}`,
      pendingOperator: operator,
    }
  }

  if (
    accumulator !== null &&
    state.pendingOperator &&
    !state.waitingForOperand
  ) {
    const result = calculate(accumulator, input, state.pendingOperator)
    if (result === null)
      return { ...clearCalculator(), display: 'Error', error: true }
    accumulator = result
    calculation = `${calculation} ${state.display} ${OPERATOR_SYMBOLS[operator]}`
  } else if (accumulator === null) {
    accumulator = input
    calculation = `${state.display} ${OPERATOR_SYMBOLS[operator]}`
  }

  return {
    accumulator,
    calculation,
    display: formatCalculatorNumber(accumulator),
    error: false,
    pendingOperator: operator,
    waitingForOperand: true,
  }
}

export function resolveCalculator(state: CalculatorState): CalculatorState {
  if (state.error || state.accumulator === null || !state.pendingOperator)
    return state
  const result = calculate(
    state.accumulator,
    Number(state.display),
    state.pendingOperator,
  )
  if (result === null)
    return { ...clearCalculator(), display: 'Error', error: true }
  return {
    accumulator: null,
    calculation: `${state.calculation} ${state.display} =`,
    display: formatCalculatorNumber(result),
    error: false,
    pendingOperator: null,
    waitingForOperand: true,
  }
}
