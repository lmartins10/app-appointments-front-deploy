/**
 * Validates a CNPJ number.
 *
 * @param cnpj - The CNPJ number to be validated. It can be a string, number or an array with all digits.
 * @returns - A boolean indicating whether the CNPJ is valid or not.
 */
export function validateCnpj(cnpj: string | number | number[]): boolean {
  if (!cnpj) return false

  const isString = typeof cnpj === 'string'
  const validTypes = isString || Number.isInteger(cnpj) || Array.isArray(cnpj)

  if (!validTypes) return false

  if (isString) {
    if (cnpj.length > 18) return false

    const digitsOnly = /^\d{14}$/.test(cnpj)
    const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj)

    if (!(digitsOnly || validFormat)) return false
  }

  const match = cnpj.toString().match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  if (numbers.length !== 14) return false

  const uniqueNumbers = Array.from(new Set(numbers))
  if (uniqueNumbers.length === 1) return false

  const calculateDigit = (x: number): number => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i]
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  const digits = numbers.slice(12)

  const digit0 = calculateDigit(12)
  if (digit0 !== digits[0]) return false

  const digit1 = calculateDigit(13)
  return digit1 === digits[1]
}
