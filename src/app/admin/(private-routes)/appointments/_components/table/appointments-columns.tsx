import { appointmentStatusChange } from '@/api/actions/app/appointments/appointment-status-change'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AppointmentMapperToTableType } from '@/mappers/appointment-mapper'
import { type ColumnDef } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { AppointmentsStatus, AppointmentsStatusType } from './appointments-status'
import { DataTableColumnHeader } from './data-table/data-table-column-header'

export function getColumns(): ColumnDef<AppointmentMapperToTableType>[] {
  async function handleAppointmentStatusChange({ appointmentId, status }: { appointmentId: string, status: AppointmentsStatusType }) {
    const toasterId = 'appointment-status-change'

    try {
      toast.loading('Processando...', { id: toasterId })

      const response = await appointmentStatusChange({
        appointmentId,
        status: status as 'canceled' | 'confirmed',
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success('Agendamento atualizado com sucesso!')

        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar o agendamento', {
        description: 'Por favor, tente novamente.',
      })
    } catch (error) {
      console.error(error)
      toast.dismiss(toasterId)
      toast.error('Ocorreu um erro inesperado', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return [
    {
      id: 'dateTime',
      accessorKey: 'dateTime',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data agendamento" />
      ),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <span>{row.getValue('dateTime')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      sortingFn: 'datetime',
      enableSorting: true,
      enableHiding: true,
    },

    {
      id: 'fullName',
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <span>{row.getValue('fullName')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'roomName',
      accessorKey: 'roomName',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Sala de agendamento" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <Badge variant="room">
            Sala <span className="font-bold">{row.getValue('roomName')}</span>
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Status transação" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as AppointmentsStatusType

        return (
          <div className="flex items-center justify-center">
            <AppointmentsStatus status={status} />
          </div>
        )
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="flex justify-center text-sm"
          column={column}
          title="Ações"
        />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,

      cell: ({ row }) => {
        const appointmentId = String(row.original.appointmentId)

        return (
          <div className="flex items-center justify-center gap-2">
            {['pending'].includes(row.getValue('status')) && (
              <>
                <Button
                  variant="default"
                  className="flex size-8 items-center justify-center rounded-full"
                  onClick={() => handleAppointmentStatusChange({ appointmentId, status: 'canceled' })}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>

                <Button
                  variant="default"
                  className="flex size-8 items-center justify-center rounded-full"
                  onClick={() => handleAppointmentStatusChange({ appointmentId, status: 'confirmed' })}
                >
                  <Check className="size-4" aria-hidden="true" />
                </Button>
              </>
            )}

            {['confirmed'].includes(row.getValue('status')) && (
              <Button
                variant="default"
                className="flex size-8 items-center justify-center rounded-full"
                onClick={() => handleAppointmentStatusChange({ appointmentId, status: 'canceled' })}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            )}

            {['canceled'].includes(row.getValue('status')) && (
              <span className="text-sm text-muted-foreground">
                -
              </span>
            )}
          </div>
        )
      },
    },
  ]
}
