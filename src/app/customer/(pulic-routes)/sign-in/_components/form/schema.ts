import { z } from 'zod'

export const customerSignInFormSchema = z.object({
  email: z
    .email({ error: 'Por favor, insira um e-mail válido.' })
    .min(1, { message: 'É necessário inserir um e-mail válido' }),

  password: z
    .string({ error: 'Senha é obrigatória.' })
    .min(6, {
      message: 'A senha do usuário deve ter pelo menos 6 caracteres',
    })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/[a-z]/, {
      message: 'A senha deve conter pelo menos uma letra minúscula',
    })
    .regex(/[0-9]/, {
      message: 'A senha deve conter pelo menos um número',
    })
    .regex(/[^A-Za-z0-9]/, {
      message: 'A senha deve conter pelo menos um caractere especial',
    }),
})

export type CustomerSignInFormType = z.infer<typeof customerSignInFormSchema>
