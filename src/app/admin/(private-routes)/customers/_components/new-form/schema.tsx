import z from 'zod'

export const newCustomerSchema = z.object({
  name: z
    .string({ error: 'Por favor, insira um nome válido!' })
    .min(2, 'O nome deve ter no mínimo 2 caracteres.'),

  lastName: z
    .string({ error: 'Por favor, insira um sobrenome válido!' })
    .min(2, 'O sobrenome deve ter no mínimo 2 caracteres.'),

  email: z
    .email({ error: 'Por favor, insira um e-mail válido.' }),

  password: z
    .string({ error: 'Senha é obrigatória.' })
    .min(6, {
      message: 'A senha do usuário deve ter pelo menos 6 caracteres.',
    })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.',
    })
    .regex(/[a-z]/, {
      message: 'A senha deve conter pelo menos uma letra minúscula.',
    })
    .regex(/[0-9]/, {
      message: 'A senha deve conter pelo menos um número.',
    })
    .regex(/[^A-Za-z0-9]/, {
      message: 'A senha deve conter pelo menos um caractere especial.',
    }),

  zipCode: z
    .string({ error: 'CEP é obrigatório!' })
    .min(8, { message: 'CEP deve ter 8 dígitos.' })
    .transform((value) => value.replace(/\D/g, '')),

  address: z
    .string({ error: 'Endereço é obrigatório!' })
    .min(5, { message: 'Endereço deve ter no mínimo 5 caracteres.' }),

  number: z
    .string({ error: 'Número é obrigatório!' })
    .min(1, { message: 'Número deve ter no mínimo 1 caractere.' }),

  complement: z
    .string()
    .optional()
    .or(z.literal('')),

  neighborhood: z
    .string({ error: 'Bairro é obrigatório!' })
    .min(3, { message: 'Bairro deve ter no mínimo 3 caracteres.' }),

  city: z
    .string({ error: 'Cidade é obrigatória!' })
    .min(2, { message: 'Cidade deve ter no mínimo 2 caracteres.' }),

  state: z
    .string({ error: 'Estado é obrigatório!' })
    .min(2, { message: 'Estado deve ter no mínimo 2 caracteres.' }),
})

export type NewCustomerType = z.infer<typeof newCustomerSchema>
