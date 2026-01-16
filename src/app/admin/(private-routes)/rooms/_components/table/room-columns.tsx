import { toggleRoomIsInactive } from '@/api/actions/app/rooms/inactive-room'
import { Switch } from '@/components/ui/switch'
import { formatSlotDuration } from '@/lib/utils/formatters/date-time-rooms'
import { RoomMapperToTableType } from '@/mappers/room-mapper'
import { type ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { DataTableColumnHeader } from './data-table/data-table-column-header'

export function getColumns(): ColumnDef<RoomMapperToTableType>[] {
  const handleToggleStatus = async (room: RoomMapperToTableType) => {
    const toasterId = 'room-is-inactivated'
    try {
      toast.loading(
        room.status === 'inactive'
          ? 'Ativando sala...'
          : 'Inativando sala...',
        {
          id: toasterId,
        },
      )
      const response = await toggleRoomIsInactive({
        id: room.roomId,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          room.status === 'inactive'
            ? 'Sala ativada com sucesso'
            : 'Sala inativada com sucesso',
        )

        return
      }

      console.error({ response })
      toast.error(
        room.status === 'inactive'
          ? 'Erro ao ativar a sala'
          : 'Erro ao inativar a sala',
        {
          description: 'Por favor, tente novamente.',
        },
      )
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
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Nº da sala" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <span>{row.getValue('name')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'startTime',
      accessorKey: 'startTime',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Horário de Início" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <span>{row.getValue('startTime')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'endTime',
      accessorKey: 'endTime',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Horário de Término" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <span>{row.getValue('endTime')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'slotDuration',
      accessorKey: 'slotDuration',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Bloco de Duração" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <span>{formatSlotDuration(row.getValue('slotDuration'))}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Criação" />
      ),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <span>{row.getValue('createdAt')}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: true,
      enableHiding: true,
    },

    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center justify-center text-sm" column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center whitespace-normal">
          <Switch
            checked={row.original['status'] === 'active'}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onCheckedChange={() => handleToggleStatus(row.original)}
          />
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },
  ]
}
