import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export const useUserPermissions = () => {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const query = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const response = await fetch('/api/permissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data) {
        throw new Error('No data received from API')
      }

      return data
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
