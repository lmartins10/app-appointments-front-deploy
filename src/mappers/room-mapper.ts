import { FetchAvailableTimesResponse } from '@/api/queries/rooms/fetch-available-times'
import { FetchRoomsQueryResponse } from '@/api/queries/rooms/fetch-recent-rooms-query'
import { GetRoomByIdResponse } from '@/api/queries/rooms/get-room-by-id'
import { formatTime } from '@/lib/utils/formatters/date-time-rooms'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export class RoomMapper {
  static toTable(data: FetchRoomsQueryResponse['data'][number]) {
    const createdAt = format(new Date(data.createdAt), 'PPP', {
      locale: ptBR,
    })

    const updatedAt = data.updatedAt
      ? format(new Date(data.updatedAt), 'PPPpp', {
          locale: ptBR,
        })
      : '-'

    const status: 'active' | 'inactive' = data.inactivatedAt
      ? 'inactive'
      : 'active'

    return {
      roomId: data.roomId,
      name: data.name,
      startTime: formatTime(data.startTime),
      endTime: formatTime(data.endTime),
      slotDuration: data.slotDuration,
      status,

      createdAt,
      updatedAt,
    }
  }

  static toView(data: GetRoomByIdResponse) {
    const status: 'active' | 'inactive' = data.inactivatedAt
      ? 'inactive'
      : 'active'

    return {
      roomId: data.roomId,
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      slotDuration: data.slotDuration.toString(),
      status,
    }
  }

  static toListLookup(data: GetRoomByIdResponse) {
    const status: 'active' | 'inactive' = data.inactivatedAt
      ? 'inactive'
      : 'active'

    return {
      roomId: data.roomId,
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      slotDuration: data.slotDuration,
      status,
    }
  }

  static toListAvailableTimes(data: FetchAvailableTimesResponse['availableTimes'][number]) {
    return {
      times: data,
    }
  }
}

export type RoomMapperToTableType = ReturnType<(typeof RoomMapper)['toTable']>
export type RoomMapperToViewType = ReturnType<(typeof RoomMapper)['toView']>
export type RoomMapperToListLookupType = ReturnType<(typeof RoomMapper)['toListLookup']>
export type RoomMapperToListAvailableTimesType = ReturnType<(typeof RoomMapper)['toListAvailableTimes']>
