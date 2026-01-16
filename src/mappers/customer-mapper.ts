import { FetchCustomersQueryResponse } from '@/api/queries/customers/fetch-recent-customers-query'
import { normalizeCepNumber } from '@/lib/utils/masks'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export class CustomerMapper {
  static toTable(data: FetchCustomersQueryResponse['data'][number]) {
    const createdAt = format(new Date(data.createdAt), 'PPPpp', {
      locale: ptBR,
    })

    const updatedAt = data.updatedAt
      ? format(new Date(data.updatedAt), 'PPPpp', {
          locale: ptBR,
        })
      : '-'

    const status: 'active' | 'inactive' = data.inactivatedAt
      ? 'inactive'
      : 'active'

    const permissions = data?.permissions?.map(permission => ({
      permissionId: permission.permissionId,
      name: permission.name,
      status: permission.status,
    }))

    return {
      userId: data.userId,
      name: data.name,
      lastName: data.lastName,
      fullName: `${data.name} ${data.lastName}`,
      email: data.email,
      role: data.role,
      permissions,
      customerId: data.customerId,
      zipCode: data.zipCode,
      address: data.address,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      status,

      createdAt,
      updatedAt,
    }
  }

  static toListLookup(data: FetchCustomersQueryResponse['data'][number]) {
    const status: 'active' | 'inactive' = data.inactivatedAt
      ? 'inactive'
      : 'active'

    return {
      userId: data.userId,
      customerId: data.customerId,
      fullName: `${data.name} ${data.lastName}`,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      zipCode: normalizeCepNumber(data.zipCode),
      address: data.address,
      number: data.number,
      complement: data.complement ?? null,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,

      status,
    }
  }
}

export type CustomerMapperToTableType = ReturnType<(typeof CustomerMapper)['toTable']>
export type CustomerMapperToListLookupType = ReturnType<(typeof CustomerMapper)['toListLookup']>
