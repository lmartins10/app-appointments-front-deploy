/**
 * Validates a CPF number.
 *
 * @param cpf - The CPF number to be validated. It can be a string, number or an array with all digits.
 * @returns - A boolean indicating whether the CPF is valid or not.
 */
export function validateCpf(cpf: string | number | number[]): boolean {
  if (!cpf) return false

  const validTypes =
    typeof cpf === 'string' || Number.isInteger(cpf) || Array.isArray(cpf)
  if (!validTypes) return false

  const digitsOnly = cpf.toString().match(/\d/g)
  const digits = Array.isArray(digitsOnly) ? digitsOnly.map(Number) : []
  if (digits.length !== 11) return false

  const uniqueDigits = Array.from(new Set(digits))
  if (uniqueDigits.length === 1) return false

  const base = digits.slice(0, 9)
  const verificationDigits = digits.slice(9)

  const calculate = (digit: number, index: number, length: number): number =>
    digit * (length - index)

  const sum = (accumulator: number, digit: number): number =>
    accumulator + digit

  const calculateVerificationDigit = (number: number): number => {
    const remainder = number % digits.length
    return remainder < 2 ? 0 : digits.length - remainder
  }

  const calculatedBase = base
    .map((digit, index) => calculate(digit, index, digits.length - 1))
    .reduce(sum, 0)
  const calculatedVerificationDigit0 =
    calculateVerificationDigit(calculatedBase)

  if (calculatedVerificationDigit0 !== verificationDigits[0]) return false

  const calculatedBaseWithVerificationDigit = base.concat(
    calculatedVerificationDigit0,
  )
  const calculatedVerificationDigit1 = calculatedBaseWithVerificationDigit
    .map((digit, index) => calculate(digit, index, digits.length))
    .reduce(sum, 0)
  const calculatedVerificationDigit2 = calculateVerificationDigit(
    calculatedVerificationDigit1,
  )

  return calculatedVerificationDigit2 === verificationDigits[1]
}

export function isCpf(value: string): boolean {
  const onlyNumbers = value.replace(/\D/g, '')

  if (onlyNumbers.length !== 11) {
    return false
  }

  return true
}
