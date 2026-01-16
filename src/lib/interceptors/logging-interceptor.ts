import { extractPath } from '@/lib/utils/logs/log-signature'
import { requestLog } from '@/lib/utils/logs/request-log'
import { responseLog } from '@/lib/utils/logs/response-log'

export function createLoggingInterceptor(
  maskSensitiveHeaders: string[] = ['access_token', 'authorization'],
  maskSensitiveQueryParams: string[] = [
    'token',
    'password',
    'apiKey',
    'api_key',
    'secret',
    'refresh_token',
  ],
  maskSensitiveBodyFields: string[] = [
    'password',
    'token',
    'refresh_token',
    'access_token',
    'apiKey',
    'api_key',
    'secret',
    'authorization',
    'bearer',
  ],
) {
  let requestId: string
  let startTime: number

  /**
   * Interceptador de requisição que registra a requisição
   */
  const requestInterceptor = async (
    url: string,
    init?: RequestInit,
  ): Promise<[string, RequestInit?]> => {
    startTime = Date.now()
    const path = extractPath(url)
    const method = init?.method ?? 'GET'

    const headers = init?.headers as Record<string, string> | undefined
    const maskedHeaders = maskHeaders(headers, maskSensitiveHeaders)

    const body = init?.body

    requestId = requestLog(
      {
        method,
        path,
      },
      {
        headers: maskedHeaders,
        sensitiveQueryParams: maskSensitiveQueryParams,
        sensitiveBodyFields: maskSensitiveBodyFields,
        body,
      },
    )

    return [url, init]
  }

  /**
   * Interceptador de resposta que registra a resposta
   */
  const responseInterceptor = async (response: Response): Promise<Response> => {
    try {
      const duration = Date.now() - startTime
      const path = extractPath(response.url)

      const contentType = response.headers.get('content-type')
      let responseBody: string

      if (contentType?.includes('application/json')) {
        const data = await response.clone().json()
        responseBody = JSON.stringify(data)
      } else {
        responseBody = await response.clone().text()
      }

      responseLog(
        {
          method: 'UNKNOWN',
          path,
          statusCode: response.status,
          requestId,
          duration,
        },
        {
          body: responseBody,
          sensitiveQueryParams: maskSensitiveQueryParams,
          sensitiveBodyFields: maskSensitiveBodyFields,
        },
      )
    } catch {
      const duration = Date.now() - startTime
      const path = extractPath(response.url)

      responseLog(
        {
          method: 'UNKNOWN',
          path,
          statusCode: response.status,
          requestId,
          duration,
        },
        {
          sensitiveQueryParams: maskSensitiveQueryParams,
          sensitiveBodyFields: maskSensitiveBodyFields,
        },
      )
    }

    return response
  }

  return {
    requestInterceptor,
    responseInterceptor,
  }
}

/**
 * Mascara headers sensíveis para não expor dados confidenciais nos logs
 */
function maskHeaders(
  headers: Record<string, string> | undefined,
  sensitivePaths: string[],
): Record<string, string> {
  if (!headers) return {}

  const masked: Record<string, string> = {}

  Object.entries(headers).forEach(([key, value]) => {
    const isSensitive = sensitivePaths.some((path) =>
      key.toLowerCase().includes(path.toLowerCase()),
    )
    masked[key] = isSensitive ? '****' : value
  })

  return masked
}
