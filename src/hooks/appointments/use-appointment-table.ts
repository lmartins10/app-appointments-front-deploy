'use client'

import { FetchAppointmentsQueryResponse } from '@/api/queries/appointments/fetch-recent-appointments-query'
import { AppointmentMapper } from '@/mappers/appointment-mapper'
import { useQuery } from '@tanstack/react-query'

interface UseRecentAppointmentsParams {
  page: number
  perPage: number
  sort?: string
  filterBy?: string
  search?: string
  status?: 'all' | 'pending' | 'confirmed' | 'canceled'
  dateFrom?: string
  dateTo?: string
}

interface AppointmentsResponse {
  appointments: FetchAppointmentsQueryResponse['data']
  pageCount: number
}

export const useRecentAppointments = ({
  page,
  perPage,
  sort,
  filterBy,
  search,
  status,
  dateFrom,
  dateTo,
}: UseRecentAppointmentsParams) => {
  const query = useQuery({
    queryKey: ['recent-appointments', page, perPage, sort, filterBy, search, status, dateFrom, dateTo],
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

      console.log('Fetching appointments with params:', params.toString())

      const response = await fetch(`/api/appointments/recent?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }

      const data: AppointmentsResponse = await response.json()
      const mappedAppointments = data.appointments?.map(AppointmentMapper.toTable) ?? []

      return {
        appointments: mappedAppointments,
        pageCount: data.pageCount,
      }
    },
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data?.appointments ?? [],
    totalPages: query.data?.pageCount ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
