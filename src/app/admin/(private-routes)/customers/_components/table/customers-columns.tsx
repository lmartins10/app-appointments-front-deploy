import { toggleUserIsInactive } from '@/api/actions/app/customers/inactive-customer'
import { updateUserPermissions } from '@/api/actions/app/users/update-user-permissions'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { CustomerMapperToTableType } from '@/mappers/customer-mapper'
import { type ColumnDef } from '@tanstack/react-table'
import * as React from 'react'
import { toast } from 'sonner'
import { DataTableColumnHeader } from './data-table/data-table-column-header'

export function getColumns(): ColumnDef<CustomerMapperToTableType>[] {
  async function handleUpdateUserPermissions(
    customer: CustomerMapperToTableType,
    permissionId: string,
  ) {
    const toasterId = 'update-user-permissions'
    try {
      const permission = customer.permissions?.find(
        (p: { permissionId: string; name: string; status: string }) => p.permissionId === permissionId,
      )

      if (!permission) {
        toast.error('Permissão não encontrada')
        return
      }

      const newStatus = permission.status === 'active' ? 'inactive' : 'active'

      toast.loading('Atualizando permissões do cliente...', { id: toasterId })

      const response = await updateUserPermissions({
        userId: customer.userId,
        permission: {
          id: permission.permissionId,
          status: newStatus,
        },
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          newStatus === 'active'
            ? 'Permissão ativada com sucesso'
            : 'Permissão desativada com sucesso',
        )

        return
      }

      if (response.status === 403) {
        toast.error('Você não tem permissão para realizar esta ação')
        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar a permissão', {
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

  async function handleToggleStatus(customer: CustomerMapperToTableType) {
    const toasterId = 'customer-is-inactivated'
    try {
      toast.loading(
        customer.status === 'inactive'
          ? 'Ativando usuário...'
          : 'Inativando usuário...',
        {
          id: toasterId,
        },
      )
      const response = await toggleUserIsInactive({
        id: customer.customerId,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success(
          customer.status === 'inactive'
            ? 'Usuário ativado com sucesso'
            : 'Usuário inativado com sucesso',
        )

        return
      }

      if (response.status === 403) {
        toast.error('Não é possível inativar o próprio usuário')
        return
      }

      console.error({ response })
      toast.error(
        customer.status === 'inactive'
          ? 'Erro ao ativar o usuário'
          : 'Erro ao inativar o usuário',
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
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de cadastro" />
      ),
      cell: ({ row }) => (
        <div className="whitespace-normal">
          <span>{row.getValue('createdAt')}</span>
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
      cell: ({ row }) => {
        const role = (row.original as CustomerMapperToTableType)?.role || ''

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
      id: 'address',
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Endereço" />
      ),
      cell: ({ row }) => {
        const number = (row.original as CustomerMapperToTableType)?.number || ''
        const neighborhood = (row.original as CustomerMapperToTableType)?.neighborhood || ''
        const city = (row.original as CustomerMapperToTableType)?.city || ''
        const state = (row.original as CustomerMapperToTableType)?.state || ''

        const mainAddress = `${row.getValue('address')}, ${number}`
        const secondaryAddress = `${neighborhood} - ${city}/${state}`

        return (
          <div className="flex flex-col">
            <span className="whitespace-normal font-medium">{mainAddress}</span>
            <span className="whitespace-normal text-sm text-muted-foreground">
              {secondaryAddress}
            </span>
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
      id: 'permissions',
      accessorKey: 'permissions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Permissões" />
      ),
      cell: ({ row }) => {
        const permissionsData = row.getValue('permissions') as { permissionId: string; name: string; status: string }[]

        return (
          <div className="flex flex-wrap gap-2">
            {permissionsData?.map((permission: { permissionId: string; name: string; status: string }) => (
              <Badge
                key={permission.permissionId}
                variant={permission.status === 'active' ? 'default' : 'outline'}
                className="rounded-full p-1.5 px-4 text-sm hover:cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUpdateUserPermissions(row.original, permission.permissionId)
                }}
              >
                {permission.name}
              </Badge>
            ))}
          </div>
        )
      },
      enableSorting: false,
      enableHiding: true,
    },

    {
      id: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="flex items-center justify-center text-sm"
          column={column}
          title="Status"
        />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,

      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center whitespace-normal">
            <Switch
              checked={row.original['status'] === 'active'}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              onCheckedChange={() => handleToggleStatus(row.original)}
            />
          </div>
        )
      },
    },
  ]
}
