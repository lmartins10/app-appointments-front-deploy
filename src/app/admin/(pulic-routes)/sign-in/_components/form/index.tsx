'use client'

import { Logo } from '@/components/app/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AdminSignInFormType, adminSignInFormSchema } from './schema'

export default function AdminSignInForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [showPasswordText, setShowPasswordText] = useState<boolean>(false)

  const form = useForm<AdminSignInFormType>({
    resolver: zodResolver(adminSignInFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function toggleShowPasswordText() {
    setShowPasswordText(!showPasswordText)
  }

  const handleSubmitWithTransition = async (formData: AdminSignInFormType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: AdminSignInFormType) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        role: 'ADMIN',
        redirect: false,
      })

      if (result?.error) {
        console.error(result.error)
        if (result.error === 'CredentialsSignin') {
          toast.error('Credenciais inválidas. Tente novamente.')
          return
        }

        const resultError = result.error.split(':')

        if (resultError[0] === '401') {
          toast.error(resultError[1] || 'Credenciais inválidas. Tente novamente.')
          return
        }

        if (resultError[0] === '403') {
          toast.error(resultError[1] || 'Usuário não autorizado!')
          return
        }

        if (resultError[0] === '404') {
          toast.error(resultError[1] || 'Usuário não encontrado. Por favor, verifique e tente novamente.')
          return
        }

        toast.error('Erro inesperado ao realizar login', {
          description: 'Verifique com o administrador.',
        })
        return
      }

      toast.success('Login realizado com sucesso', {
        description: (
          <div className="flex gap-1">
            <Loader className="size-4 animate-spin" />
            <span>Redirecionando para o painel...</span>
          </div>
        ),
      })

      router.replace(`${DEFAULT_PAGES.ADMIN.appointments}`)
    } catch (error) {
      console.error(error)
      toast.error(
        'Erro ao tentar realizar login. Por favor, tente novamente mais tarde.',
      )
    }
  }

  const isLoading = isPending

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center">
        <Logo className="flex size-12" />

        <h1 className="py-[30px] text-2xl font-semibold">
          Login Admin
        </h1>
      </div>

      <Card className="w-[448px] gap-4 rounded-lg p-8">
        <CardContent>
          <Form {...form}>
            <form
              id="admin-sign-in-form"
              onSubmit={form.handleSubmit(handleSubmitWithTransition)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormLabel required>E-mail</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error}>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase()
                            field.onChange(value)
                            form.clearErrors('email')
                          }}
                          type="text"
                          placeholder="Insira seu e-mail..."
                        />
                      </Input.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel required>Senha:</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error}>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            form.clearErrors('password')
                          }}
                          type={showPasswordText ? 'text' : 'password'}
                          placeholder="Digite sua senha"
                        />
                        <div onClick={toggleShowPasswordText}>
                          {showPasswordText ? (
                            <EyeOff className="z-1 mr-2 size-4 cursor-pointer text-primary/80 lg:size-5" />
                          ) : (
                            <Eye className="z-1 mr-2 size-4 cursor-pointer text-primary lg:size-5" />
                          )}
                        </div>
                      </Input.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                id="admin-sign-in-form"
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Acessar conta
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
