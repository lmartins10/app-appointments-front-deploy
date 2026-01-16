export function statusAppointmentsLookup(statusLabel: string): string {
  const statusLookup: Record<string, string> = {
    pending: 'Em análise',
    confirmed: 'Agendado',
    canceled: 'Cancelado',
  }

  return statusLookup[statusLabel as keyof typeof statusLookup] || statusLabel
}
