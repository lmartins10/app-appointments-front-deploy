import z from 'zod'

export const createAdminAppointmentSchema = z.object({
  customerId: z
    .string(),

  userId: z
    .string(),

  name: z
    .string({ error: 'Por favor, insira um nome válido!' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres.'),

  lastName: z
    .string({ error: 'Por favor, insira um sobrenome válido!' })
    .min(2, 'O sobrenome deve ter no mínimo 2 caracteres.'),

  email: z
    .email({ error: 'Por favor, insira um e-mail válido.' }),

  zipCode: z
    .string({ error: 'CEP é obrigatório!' }),

  address: z
    .string({ error: 'Endereço é obrigatório!' }),

  number: z
    .string({ error: 'Número é obrigatório!' }),

  complement: z
    .string()
    .optional()
    .or(z.literal('')),

  neighborhood: z
    .string({ error: 'Bairro é obrigatório!' }),

  city: z
    .string({ error: 'Cidade é obrigatória!' }),

  state: z
    .string({ error: 'Estado é obrigatório!' }),

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

export type CreateAdminAppointmentType = z.infer<typeof createAdminAppointmentSchema>
