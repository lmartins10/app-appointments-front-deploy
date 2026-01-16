/**
 * Log Signature - Sistema de identificação e categorização de APIs
 *
 * Utiliza path + method como identificador natural, fornecendo:
 * - Inferência automática de categorias e módulos
 * - Formatação padronizada de logs com timestamps detalhados
 * - Melhor rastreabilidade através de request IDs
 *
 */

/**
 * Categorias de endpoints
 * Define os tipos de operações suportadas pelo sistema
 */
export type EndpointCategory =
  | 'authentication' // Login, logout, token refresh
  | 'lookup' // Dropdowns, listas, selects
  | 'integration' // Integrações externas
  | 'system' // Health, status, metadata

/**
 * Módulos do sistema
 * Define as áreas funcionais da aplicação
 */
export type SystemModule =
  | 'auth' // Autenticação e autorização
  | 'lookup' // Dados de lookup e catálogos
  | 'system' // Sistema e metadados
  | 'unknown' // Módulo desconhecido

/**
 * Assinatura de uma requisição HTTP
 * Identifica univocamente uma chamada de API pelo método, caminho e request ID
 */
export interface LogSignature {
  /** Método HTTP (GET, POST, PUT, DELETE, PATCH) */
  method: string
  /** Caminho da requisição (com ou sem query parameters) */
  path: string
  /** Query parameters extraídos da URL */
  queryParams?: Record<string, string>
  /** Identificador único da requisição para rastreamento */
  requestId?: string
}

/**
 * Assinatura de uma resposta HTTP
 * Estende LogSignature com informações de resultado
 */
export interface ResponseSignature extends LogSignature {
  /** Código de status HTTP */
  statusCode: number
  /** Duração da requisição em milissegundos */
  duration?: number
}

/**
 * Metadados automáticos para categorizar e organizar logs
 * Inferidos automaticamente a partir do caminho da requisição
 */
export interface LogMetadata {
  /** Categoria do endpoint (tipo de operação) */
  category: EndpointCategory
  /** Módulo que o endpoint pertence */
  module: SystemModule
}

/**
 * Extrai o caminho (path + query) de uma URL completa
 * Exemplo: "https://api.example.com/approvers/auth?foo=bar" → "/approvers/auth?foo=bar"
 */
export function extractPath(url: string): string {
  try {
    const urlObj = new URL(url)
    // Retorna pathname + search (sem hash ou host)
    return urlObj.pathname + urlObj.search
  } catch {
    // Se não for uma URL válida, retorna como está
    return url
  }
}

/**
 * Remove query parameters de um caminho
 * Exemplo: "/approvers/auth?foo=bar" → "/approvers/auth"
 */
export function extractPathWithoutQuery(path: string): string {
  return path.split('?')[0]
}

/**
 * Extrai query parameters de um caminho
 * Exemplo: "/approvers/auth?foo=bar&baz=qux" → { foo: "bar", baz: "qux" }
 *
 * @param path - Caminho da requisição (com ou sem query parameters)
 * @returns Objeto com os query parameters, ou undefined se não houver
 */
export function extractQueryParams(path: string): Record<string, string> | undefined {
  try {
    const queryIndex = path.indexOf('?')
    if (queryIndex === -1) return undefined

    const queryString = path.substring(queryIndex + 1)
    const params: Record<string, string> = {}

    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
      }
    })

    return Object.keys(params).length > 0 ? params : undefined
  } catch {
    return undefined
  }
}

/**
 * Mascara query parameters sensíveis para não expor dados confidenciais nos logs
 * Parâmetros não presentes na lista de sensíveis permanecem visíveis
 *
 * @param params - Objeto com os query parameters
 * @param sensitiveParams - Lista de nomes de parâmetros que devem ser mascarados
 * @returns Objeto com os parâmetros mascarados (sensíveis aparecem como "****")
 */
export function maskQueryParams(
  params: Record<string, string> | undefined,
  sensitiveParams: string[] = ['token', 'password', 'apiKey', 'api_key', 'secret', 'refresh_token'],
): Record<string, string> | undefined {
  if (!params) return undefined

  const masked: Record<string, string> = {}

  Object.entries(params).forEach(([key, value]) => {
    const isSensitive = sensitiveParams.some((param) =>
      key.toLowerCase().includes(param.toLowerCase()),
    )
    masked[key] = isSensitive ? '****' : value
  })

  return masked
}

/**
 * Mascara campos sensíveis em um objeto de body (JSON)
 * Recursivamente procura por campos sensíveis em todo o objeto
 *
 * @param body - Objeto ou string do body
 * @param sensitiveFields - Lista de nomes de campos que devem ser mascarados
 * @returns Body com campos sensíveis mascarados
 *
 * @example
 * maskBodyFields(
 *   { password: 'secret123', email: 'user@example.com' },
 *   ['password', 'token']
 * )
 * // { password: '****', email: 'user@example.com' }
 */
export function maskBodyFields(
  body: unknown,
  sensitiveFields: string[] = [
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
): unknown {
  if (!body) return body

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body)
      return JSON.stringify(maskBodyObject(parsed, sensitiveFields))
    } catch {
      return body
    }
  }

  if (typeof body === 'object') {
    return maskBodyObject(body, sensitiveFields)
  }

  return body
}

/**
 * Mascara campos sensíveis recursivamente em um objeto
 * @internal
 */
function maskBodyObject(
  obj: unknown,
  sensitiveFields: string[],
): unknown {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => maskBodyObject(item, sensitiveFields))
  }

  if (typeof obj === 'object') {
    const masked: Record<string, unknown> = {}

    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const isSensitive = sensitiveFields.some((field) =>
        key.toLowerCase().includes(field.toLowerCase()),
      )

      if (isSensitive) {
        masked[key] = '****'
      } else if (typeof value === 'object') {
        masked[key] = maskBodyObject(value, sensitiveFields)
      } else {
        masked[key] = value
      }
    })

    return masked
  }

  return obj
}

/**
 * Reconstrói um path com query parameters mascarados
 * Exemplo: "/api/users?token=abc123&name=john" → "/api/users?token=****&name=john"
 *
 * @param path - Caminho original (com ou sem query parameters)
 * @param maskedParams - Query parameters já mascarados
 * @returns Path com query parameters mascarados reconstituídos
 */
export function rebuildPathWithMaskedParams(
  path: string,
  maskedParams: Record<string, string> | undefined,
): string {
  if (!maskedParams) return path

  const cleanPath = extractPathWithoutQuery(path)
  const queryString = Object.entries(maskedParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return queryString ? `${cleanPath}?${queryString}` : cleanPath
}

/**
 * Infere a categoria de um endpoint baseado no caminho
 * Usado para organizar logs por tipo de operação
 *
 * @param path - Caminho da requisição (com ou sem query parameters)
 * @returns Categoria do endpoint inferida automaticamente
 */
export function inferCategory(path: string): EndpointCategory {
  const cleanPath = extractPathWithoutQuery(path).toLowerCase()

  // Authentication endpoints
  if (
    cleanPath.includes('auth') ||
    cleanPath.includes('password') ||
    cleanPath.includes('token') ||
    cleanPath.includes('login') ||
    cleanPath.includes('logout')
  ) {
    return 'authentication'
  }

  // Lookup endpoints (listas, combos, dropdowns)
  if (
    cleanPath.includes('lookup') ||
    cleanPath.includes('filiais') ||
    cleanPath.includes('branches') ||
    cleanPath.includes('select') ||
    cleanPath.includes('companies')
  ) {
    return 'lookup'
  }

  // External integrations
  if (
    cleanPath.includes('/rest/api/') ||
    cleanPath.includes('oauth2')
  ) {
    return 'integration'
  }

  // System endpoints
  if (
    cleanPath.includes('health') ||
    cleanPath.includes('status') ||
    cleanPath.includes('metadata')
  ) {
    return 'system'
  }

  return 'system'
}

/**
 * Infere o módulo de um endpoint baseado no caminho
 * Usado para organizar logs por módulo/área funcional
 *
 * @param path - Caminho da requisição (com ou sem query parameters)
 * @returns Módulo do sistema inferido automaticamente
 */
export function inferModule(path: string): SystemModule {
  const cleanPath = extractPathWithoutQuery(path).toLowerCase()

  // Authentication module
  if (
    cleanPath.includes('auth') ||
    cleanPath.includes('password') ||
    cleanPath.includes('login') ||
    cleanPath.includes('token')
  ) {
    return 'auth'
  }

  // System module
  if (
    cleanPath.includes('health') ||
    cleanPath.includes('status') ||
    cleanPath.includes('metadata')
  ) {
    return 'system'
  }

  return 'unknown'
}

/**
 * Obtém metadados completos para um endpoint
 */
export function getLogMetadata(path: string): LogMetadata {
  return {
    category: inferCategory(path),
    module: inferModule(path),
  }
}

/**
 * Formata um timestamp completo com data e hora em uma única linha
 * Otimizado para logs em CloudWatch (sem quebras de linha)
 *
 * @param timestamp - Data a ser formatada (padrão: data/hora atual)
 * @returns String formatada como "DD/MM/YYYY HH:MM:SS.mmm" sem quebras de linha
 *
 */
export function formatTimestamp(timestamp: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZone: 'America/Sao_Paulo',
  })

  return formatter.format(timestamp)
}

/**
 * Cria uma string formatada para log de requisição em uma única linha
 * Otimizado para CloudWatch (sem quebras de linha)
 *
 * Aplica máscara de query parameters sensíveis diretamente no path
 *
 * @param signature - Assinatura da requisição (método, path, requestId, queryParams)
 * @param metadata - Metadados opcionais (categoria, módulo)
 * @returns String formatada em uma única linha para logging
 *
 */
export function formatRequestLogMessage(
  signature: LogSignature,
  metadata?: LogMetadata,
): string {
  const timestamp = formatTimestamp()
  const requestId = signature.requestId ?? 'pending'
  const moduleLabel = metadata ? metadata.module.toUpperCase() : undefined
  const categoryLabel = metadata ? metadata.category.toUpperCase() : undefined

  const pathWithMaskedParams = signature.queryParams
    ? rebuildPathWithMaskedParams(signature.path, signature.queryParams)
    : signature.path

  if (moduleLabel && categoryLabel) {
    return `[${timestamp}] [Request] [${moduleLabel} - ${categoryLabel}] - ${signature.method} ${pathWithMaskedParams} [ID: ${requestId}]`
  }

  return `[${timestamp}] [Request] ${signature.method} ${pathWithMaskedParams} [ID: ${requestId}]`
}

/**
 * Cria uma string formatada para log de resposta em uma única linha
 * Otimizado para CloudWatch (sem quebras de linha)
 *
 * Aplica máscara de query parameters sensíveis diretamente no path
 *
 * @param signature - Assinatura da resposta (método, path, statusCode, duration, requestId, queryParams)
 * @param metadata - Metadados opcionais (categoria, módulo)
 * @returns String formatada em uma única linha para logging
 *
 */
export function formatResponseLogMessage(
  signature: ResponseSignature,
  metadata?: LogMetadata,
): string {
  const timestamp = formatTimestamp()
  const isSuccess = signature.statusCode < 400
  const statusIcon = isSuccess ? '[OK]' : '[ERROR]'
  const duration = signature.duration ? ` [${signature.duration}ms]` : ''
  const requestId = signature.requestId ?? 'unknown'
  const moduleLabel = metadata ? metadata.module.toUpperCase() : undefined
  const categoryLabel = metadata ? metadata.category.toUpperCase() : undefined

  const pathWithMaskedParams = signature.queryParams
    ? rebuildPathWithMaskedParams(signature.path, signature.queryParams)
    : signature.path

  if (moduleLabel && categoryLabel) {
    return `[${timestamp}] [Response] [${moduleLabel} - ${categoryLabel}] ${statusIcon} ${signature.method} ${pathWithMaskedParams} [Status: ${signature.statusCode}]${duration} [ID: ${requestId}]`
  }

  return `[${timestamp}] [Response] ${statusIcon} ${signature.method} ${pathWithMaskedParams} [Status: ${signature.statusCode}]${duration} [ID: ${requestId}]`
}
