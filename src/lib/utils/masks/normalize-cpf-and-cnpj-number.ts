import { normalizeCnpjNumber, normalizeCpfNumber } from '.'

export const normalizeCpfAndCNPJNumber = (value: string | undefined) => {
  if (!value) return ''

  const onlyNumbers = value.replace(/\D/g, '')

  if (onlyNumbers.length === 11) {
    const cpf = normalizeCpfNumber(onlyNumbers)
    return cpf
  }

  if (onlyNumbers.length === 14) {
    const cnpj = normalizeCnpjNumber(onlyNumbers)
    return cnpj
  }

  if (onlyNumbers.length > 14) {
    const cnpj = normalizeCnpjNumber(onlyNumbers)
    return cnpj
  }

  return onlyNumbers
}
