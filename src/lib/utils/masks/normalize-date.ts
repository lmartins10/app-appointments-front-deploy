export const normalizeDateYY = (value: string | undefined): string => {
  if (!value) return ''

  const newValue = value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1')

  return newValue
}

export const normalizeDateYYYY = (value: string | undefined): string => {
  if (!value) return ''

  const newValue = value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1')

  return newValue
}
