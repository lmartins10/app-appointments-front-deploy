'use client'

import { FetchCustomersQueryResponse } from '@/api/queries/customers/fetch-recent-customers-query'
import { CustomerMapper } from '@/mappers/customer-mapper'
import { useQuery } from '@tanstack/react-query'

interface UseRecentCustomersParams {
  page: number
  perPage: number
  sort?: string
  filterBy?: string
  search?: string
  status?: 'all' | 'active' | 'inactive'
  dateFrom?: string
  dateTo?: string
}

interface CustomersResponse {
  customers: FetchCustomersQueryResponse['data']
  pageCount: number
}

export const useRecentCustomers = ({
  page,
  perPage,
  sort,
  filterBy,
  search,
  status,
  dateFrom,
  dateTo,
}: UseRecentCustomersParams) => {
  const query = useQuery({
    queryKey: ['recent-customers', page, perPage, sort, filterBy, search, status, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      })

      if (sort) params.append('sort', sort)
      if (filterBy && search) params.append('filterBy', filterBy)
      if (search) params.append('search', search)
      if (status && status !== 'all') params.append('status', status)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await fetch(`/api/customers/recent?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data: CustomersResponse = await response.json()
      const mappedCustomers = data.customers?.map(CustomerMapper.toTable) ?? []

      return {
        customers: mappedCustomers,
        pageCount: data.pageCount,
      }
    },
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data?.customers ?? [],
    totalPages: query.data?.pageCount ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
