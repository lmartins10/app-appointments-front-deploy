import z from 'zod'

export const createCustomerAppointmentSchema = z.object({
  userId: z
    .string(),

  customerId: z
    .string(),

  roomId: z
    .string(),

  roomName: z
    .string()
    .min(1, 'É obrigatório informar o nome da sala!'),

  startAndEndTime: z
    .string(),

  slotDuration: z
    .string(),

  hour: z
    .string()
    .min(1, 'É obrigatório informar a hora do agendamento!'),

  date: z.preprocess(
    (value) => value ?? {},
    z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .refine(
        ({ from }) => {
          return !!from
        },
        { message: 'É obrigatório preencher o campo data do agendamento!' },
      ),
  ),
})

export type CreateCustomerAppointmentType = z.infer<typeof createCustomerAppointmentSchema>
