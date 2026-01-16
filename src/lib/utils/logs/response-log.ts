import {
  extractQueryParams,
  formatResponseLogMessage,
  getLogMetadata,
  maskBodyFields,
  maskQueryParams,
  type LogMetadata,
  type ResponseSignature,
} from './log-signature'

/**
 * Loga uma resposta HTTP com identificação automática
 *
 * @param signature Assinatura da resposta (method, path, statusCode, requestId, duration, queryParams opcionais)
 * @param details Detalhes opcionais (body, metadata, sensitiveQueryParams, sensitiveBodyFields)
 *
 */
export function responseLog(
  signature: ResponseSignature,
  details?: {
    body?: unknown
    metadata?: LogMetadata
    sensitiveQueryParams?: string[]
    sensitiveBodyFields?: string[]
  },
): void {
  let queryParams = signature.queryParams
  if (!queryParams && signature.path.includes('?')) {
    queryParams = extractQueryParams(signature.path)
  }

  if (queryParams) {
    queryParams = maskQueryParams(queryParams, details?.sensitiveQueryParams)
  }

  const metadata = details?.metadata ?? getLogMetadata(signature.path)

  const message = formatResponseLogMessage({ ...signature, queryParams }, metadata)

  let bodyStr: string | undefined
  if (details?.body) {
    const maskedBody = maskBodyFields(details.body, details?.sensitiveBodyFields)
    bodyStr =
      typeof maskedBody === 'string'
        ? maskedBody
        : JSON.stringify(maskedBody)
  }

  console.log(message + (bodyStr ? ` | Body: ${bodyStr}` : ''))
}
