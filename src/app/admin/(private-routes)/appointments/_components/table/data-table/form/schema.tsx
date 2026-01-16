import z from 'zod'

export const updateAdminAppointmentSchema = z.object({
  appointmentId: z
    .string(),

  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine(
      ({ from }) => {
        if (!from) {
          return false
        }
        return true
      },
      { message: 'É obrigatório preencher o campo data do agendamento!' },
    ),

  hour: z
    .string()
    .min(1, 'É obrigatório informar a hora!'),

  customerId: z
    .string(),

  userId: z
    .string(),

  fullName: z
    .string(),

  roomId: z
    .string(),

  roomName: z
    .string()
    .min(1, 'É obrigatório informar a sala!'),

  startAndEndTime: z
    .string()
    .min(1, 'É obrigatório informar a sala!'),

  slotDuration: z
    .string()
    .min(1, 'É obrigatório informar a sala!'),

  status: z
    .string(),
})

export type UpdateAdminAppointmentType = z.infer<typeof updateAdminAppointmentSchema>
