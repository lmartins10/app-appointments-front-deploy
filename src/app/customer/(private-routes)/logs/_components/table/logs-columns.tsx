import { Icons } from '@/components/app/icons'
import { Badge } from '@/components/ui/badge'
import { LogMapperToTableType } from '@/mappers/log-mapper'
import { type ColumnDef } from '@tanstack/react-table'
import { LayoutGrid, Monitor, User, User2 } from 'lucide-react'
import { DataTableColumnHeader } from './data-table/data-table-column-header'

export function getColumns(): ColumnDef<LogMapperToTableType>[] {
  return [
    {
      id: 'fullName',
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      cell: ({ row }) => {
        const role = (row.original as LogMapperToTableType)?.role || ''

        return (
          <div className="flex flex-col">
            <span className="whitespace-normal font-medium">{row.getValue('fullName')}</span>
            <span className="text-sm text-muted-foreground">{role}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'type',
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center text-sm" column={column} title="Tipo de atividade" />
      ),
      cell: ({ row }) => (
        <Badge variant="logs" className="flex gap-2">
          {row.getValue('type')}
        </Badge>

      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'module',
      accessorKey: 'module',
      header: ({ column }) => (
        <DataTableColumnHeader className="flex items-center  text-sm" column={column} title="Módulo" />
      ),
      cell: ({ row }) => {
        switch (row.getValue('module')) {
          case 'Clientes':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <Icons type="customers" className="size-4" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )

          case 'Agendamentos':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <Icons type="appointments" className="size-4" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )

          case 'Salas':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <LayoutGrid className="size-5" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )

          case 'Minha Conta':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <User2 className="size-5" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )

          case 'Usuários':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <User className="size-4" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )

          case 'Portal Cliente':
          case 'Portal Administrativo':
            return (
              <div className="flex items-center whitespace-normal">
                <Badge variant="logs" className="flex gap-2">
                  <Monitor className="size-4" />
                  {row.getValue('module')}
                </Badge>
              </div>
            )
        }

        // return (
        //   <div className="flex items-center justify-center whitespace-normal">
        //     <Badge variant="logs">
        //       <Icons type={} />
        //       {row.getValue('module')}
        //     </Badge>
        //   </div>
        // )
      },
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
        <DataTableColumnHeader column={column} title="Data e horário" />
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
  ]
}
