'use client'

import {
  isServer,
  QueryClient,
  QueryClientProvider as QueryClientProviderPrimitive,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryClientProviderProps {
  children: React.ReactNode
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // 2 minutos
        gcTime: 1000 * 60 * 5, // 5 minutos
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function QueryClientProvider({
  children,
}: QueryClientProviderProps) {
  // const [queryClient] = useState(getQueryClient())
  const queryClient = getQueryClient()

  return (
    <QueryClientProviderPrimitive client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProviderPrimitive>
  )
}
