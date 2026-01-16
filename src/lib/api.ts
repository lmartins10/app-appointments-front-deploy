import { env } from '@/env'
import { FetchInterceptor } from './fetch-interceptor'
import { authenticationInterceptor } from './interceptors/authentication-interceptor'
import { createLoggingInterceptor } from './interceptors/logging-interceptor'

export async function api(path: string, init?: RequestInit) {
  const baseUrl = env.API_BASE_URL
  const apiPrefix = env.API_URL_PREFIX ?? ''

  const url = new URL(apiPrefix.concat(path), baseUrl)

  const fetchInterceptor = new FetchInterceptor()

  fetchInterceptor.useRequestInterceptor(authenticationInterceptor)

  const { requestInterceptor, responseInterceptor } = createLoggingInterceptor([
    'authorization',
    'access_token',
    'Bearer',
  ])

  fetchInterceptor.useRequestInterceptor(requestInterceptor)
  fetchInterceptor.useResponseInterceptor(responseInterceptor)

  return fetchInterceptor.interceptFetch(url.toString(), init)
}
