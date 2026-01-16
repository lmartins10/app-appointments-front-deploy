'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagFetchRecentCustomersQuery } from './get-revalidate-next-tag'

export interface FetchCustomersQueryRequest {
  queryParams: {
    page?: number
    perPage?: number
    offset?: number
    limit?: number
    orderBy?: string
    sort?: string
    filterBy?: string
    search?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }
}

export type FetchCustomersQueryResponse = {
  data: {
    userId: string
    name: string
    lastName: string
    email: string
    role: string
    permissions: {
      permissionId: string
      name: string
      status: 'active' | 'inactive'
    }[]
    customerId: string
    zipCode: string
    address: string
    number: string
    complement: string | null
    neighborhood: string
    city: string
    state: string

    createdAt: string
    createdBy: string | null
    updatedAt?: string
    updatedBy?: string | null
    inactivatedAt?: string
    inactivatedBy?: string | null
  }[]
  count: number
}

export async function fetchRecentCustomersQuery({
  page = 1,
  perPage = 20,
  offset,
  limit,
  sort,
  orderBy,
  filterBy,
  search,
  status,
  dateFrom,
  dateTo,
}: FetchCustomersQueryRequest['queryParams']) {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    throw new CustomError('Session not found', 'SESSION_NOT_FOUND')
  }

  const pageValue = offset ?? (page - 1) * perPage

  const perPageValue = limit ?? perPage

  const queryParams =
    '?' +
    createQueryParams({
      page: pageValue,
      perPage: perPageValue,
      orderBy,
      filterBy,
      search,
      sort,
      status,
      dateFrom,
      dateTo,
    })

  try {
    const request = {
      endpoint: `/customers${queryParams}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagFetchRecentCustomersQuery({ queryParams })],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const { data, count }: FetchCustomersQueryResponse = await response.json()

    const pageCount = Math.ceil(count / perPage)

    return { customers: data, pageCount }
  } catch (error) {
    console.error(error)
    return { customers: [], pageCount: 1 }
  }
}

function createQueryParams({
  page = 1,
  perPage = 20,
  orderBy,
  sort,
  filterBy,
  search,
  status,
  dateFrom,
  dateTo,
}: FetchCustomersQueryRequest['queryParams']) {
  const params = new URLSearchParams()

  page && params.set('offset', page.toString())
  perPage && params.set('limit', perPage.toString())
  orderBy && params.set('sort', orderBy)
  sort && params.set('sort', sort)
  filterBy && params.set('filterBy', filterBy)
  search && params.set('search', search)
  status && params.set('status', status)
  dateFrom && params.set('dateFrom', dateFrom)
  dateTo && params.set('dateTo', dateTo)

  return params
}
