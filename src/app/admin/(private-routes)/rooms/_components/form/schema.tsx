import z from 'zod'

export const appointmentRoomSchema = z.object({
  roomId: z
    .string()
    .min(1, 'É obrigatório informar o nome!'),

  name: z
    .string()
    .min(1, 'É obrigatório informar o nome!'),

  startTime: z
    .string()
    .min(1, 'É obrigatório informar o horário de início!'),

  endTime: z
    .string()
    .min(1, 'É obrigatório informar o horário de término!'),

  slotDuration: z
    .string()
    .min(1, 'É obrigatório informar a duração do bloco!'),
})

export type AppointmentRoomType = z.infer<typeof appointmentRoomSchema>
