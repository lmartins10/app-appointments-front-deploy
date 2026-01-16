'use server'

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/next-auth-options'
import { api } from '@/lib/api'
import { CustomError } from '@/lib/utils/error/custom-error'
import { getServerSession } from 'next-auth'
import { getTagFetchRecentRoomsQuery } from './get-revalidate-next-tag'

export interface FetchRoomsQueryRequest {
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

export type FetchRoomsQueryResponse = {
  data: {
    roomId: string
    name: string
    startTime: string
    endTime: string
    slotDuration: number
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    inactivatedAt: string
    inactivatedBy: string
  }[]
  count: number
}

export async function fetchRecentRoomsQuery({
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
}: FetchRoomsQueryRequest['queryParams']) {
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
      endpoint: `/rooms${queryParams}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await api(request.endpoint, {
      method: request.method,
      headers: request.headers,
      next: {
        tags: [getTagFetchRecentRoomsQuery({ queryParams })],
      },
    })

    if (response.status === 500) {
      throw new Error('Error: ' + (await response.text()))
    }

    const { data, count }: FetchRoomsQueryResponse = await response.json()

    const pageCount = Math.ceil(count / perPage)

    return { rooms: data, pageCount }
  } catch (error) {
    console.error(error)
    return { rooms: [], pageCount: 1 }
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
}: FetchRoomsQueryRequest['queryParams']) {
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
