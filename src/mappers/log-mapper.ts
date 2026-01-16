import { FetchLogsQueryResponse } from '@/api/queries/logs/fetch-recent-logs-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export class LogMapper {
  static toTable(data: FetchLogsQueryResponse['data'][number]) {
    const createdAt = format(new Date(data.createdAt), 'PPPp', {
      locale: ptBR,
    })

    return {
      logId: data.logId,
      type: data.type,
      module: data.module,
      userId: data.userId,
      fullName: `${data.name} ${data.lastName}`,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      role: data.role,

      createdAt,
    }
  }
}

export type LogMapperToTableType = ReturnType<(typeof LogMapper)['toTable']>
