import { FetchAppointmentsQueryResponse } from '@/api/queries/appointments/fetch-recent-appointments-query'
import { formatDate, formatSlotDuration, formatTime } from '@/lib/utils/formatters/date-time-rooms'

export class AppointmentMapper {
  static toTable(data: FetchAppointmentsQueryResponse['data'][number]) {
    return {
      appointmentId: data.appointmentId,
      date: formatDate(data.date),
      hour: formatTime(data.time),
      dateTime: `${formatDate(data.date)} às ${formatTime(data.time)}`,
      status: data.transactionStatus,

      roomId: data.room.roomId,
      roomName: data.room.name,
      startAndEndTime: `${formatTime(data.room.startTime)} - ${formatTime(data.room.endTime)}`,
      slotDuration: formatSlotDuration(data.room.slotDuration),

      userId: data.user.userId,
      customerId: data.customer.customerId,
      fullName: `${data.user.name} ${data.user.lastName}`,
    }
  }
}

export type AppointmentMapperToTableType = ReturnType<(typeof AppointmentMapper)['toTable']>
