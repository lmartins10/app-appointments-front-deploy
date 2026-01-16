import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatSlotDuration(slotDurationInMinutes: number): string {
  const hours = Math.floor(slotDurationInMinutes / 60)
  const minutes = slotDurationInMinutes % 60

  const hoursPart =
    hours > 0 ? `${hours} ${hours === 1 ? 'hora' : 'horas'}` : ''
  const minutesPart =
    minutes > 0 ? `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}` : ''

  if (hoursPart && minutesPart) {
    return `${hoursPart} e ${minutesPart}`
  }

  return hoursPart || minutesPart || '0 minutos'
}

export function formatDate(date: string): string {
  return format(
    parse(date, 'yyyy-MM-dd', new Date()),
    'dd/MM/yyyy',
    { locale: ptBR },
  )
}

export function formatTime(data: string): string {
  return format(
    parse(data, 'HH:mm:ss', new Date()),
    'HH:mm',
    { locale: ptBR },
  )
}

export type SlotDurationFormattedType = ReturnType<typeof formatSlotDuration>
