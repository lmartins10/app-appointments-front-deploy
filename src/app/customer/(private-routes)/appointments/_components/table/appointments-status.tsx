import { Badge } from '@/components/ui/badge'

// | 'released'
export type AppointmentsStatusType = 'pending' | 'confirmed' | 'canceled'

interface AppointmentsStatusProps {
  status: AppointmentsStatusType
}

export const statusesAppointments = [
  {
    label: 'Em análise',
    value: 'pending',
  },
  {
    label: 'Agendado',
    value: 'confirmed',
  },
  {
    label: 'Cancelado',
    value: 'canceled',
  },
]

export function AppointmentsStatus({ status }: AppointmentsStatusProps) {
  const statusItem = statusesAppointments.find((item) => item.value === status)

  if (!statusItem) {
    return null // Se o status for inválido, retorna `null`
  }

  const getStatusClasses = (status: AppointmentsStatusType) => {
    switch (status) {
      case 'pending':
        return 'px-2 py-0.5 lg:px-[15px] lg:py-[5px] text-[12px] text-[#676767] bg-[#F5F5F5] border border-[#A4AAAD]'

      case 'confirmed':
        return 'px-2 py-0.5 lg:px-[15px] lg:py-[5px] text-[12px] text-[#10C3A9] bg-[#DBFFFA] border border-[#10C3A9]'

      case 'canceled':
        return 'px-2 py-0.5 lg:px-[15px] lg:py-[5px] text-[12px] text-[#EA0000] bg-[#FFF3F3] border border-[#FF0000]'

      default:
        return 'px-2 py-0.5 lg:px-[15px] lg:py-[5px] text-xs '
    }
  }

  return (
    <Badge
      className={getStatusClasses(status)}
    >
      {statusItem.label}
    </Badge>
  )
}
