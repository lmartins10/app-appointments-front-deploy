import { v4 as uuidV4 } from 'uuid'

import {
  extractQueryParams,
  formatRequestLogMessage,
  getLogMetadata,
  maskBodyFields,
  maskQueryParams,
  type LogMetadata,
  type LogSignature,
} from './log-signature'

/**
 * Loga uma requisição HTTP com identificação automática
 *
 * @param signature Assinatura da requisição (method, path, queryParams opcionais)
 * @param details Detalhes opcionais (headers, body, metadata, sensitiveQueryParams, sensitiveBodyFields)
 * @returns ID da requisição para correlação com response
 */
export function requestLog(
  signature: LogSignature,
  details?: {
    headers?: Record<string, string>
    body?: unknown
    metadata?: LogMetadata
    sensitiveQueryParams?: string[]
    sensitiveBodyFields?: string[]
  },
): string {
  const requestId = uuidV4()

  let queryParams = signature.queryParams
  if (!queryParams && signature.path.includes('?')) {
    queryParams = extractQueryParams(signature.path)
  }

  if (queryParams) {
    queryParams = maskQueryParams(queryParams, details?.sensitiveQueryParams)
  }

  const metadata = details?.metadata ?? getLogMetadata(signature.path)

  const message = formatRequestLogMessage(
    { ...signature, queryParams, requestId },
    metadata,
  )

  let fullMessage: string = message
  if (details?.headers) {
    fullMessage += ` | Headers: ${JSON.stringify(details.headers)}`
  }

  if (details?.body) {
    const maskedBody = maskBodyFields(details.body, details?.sensitiveBodyFields)
    fullMessage += ` | Body: ${
      typeof maskedBody === 'string'
        ? maskedBody
        : JSON.stringify(maskedBody)
    }`
  }

  console.log(fullMessage)

  return requestId
}
