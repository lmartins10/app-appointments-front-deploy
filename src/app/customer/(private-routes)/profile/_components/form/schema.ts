import { z } from 'zod'

export const customerUserProfileFormSchema = z.object({
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
    })
    .optional()
    .or(z.literal('')),
})

export type CustomerUserProfileFormType = z.infer<typeof customerUserProfileFormSchema>
