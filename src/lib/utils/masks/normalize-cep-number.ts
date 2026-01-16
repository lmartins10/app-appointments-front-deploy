export const normalizeCepNumber = (value?: string) => {
  const cepWithoutNonDigits = value?.replace(/\D/g, '')
  if (!cepWithoutNonDigits) {
    return ''
  }

  const formattedCep = cepWithoutNonDigits.replace(/^(\d{5})(\d{3})?/, '$1-$2')
  return formattedCep.slice(0, 9)
}
