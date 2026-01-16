'use client'

import { getUserByEmail } from '@/api/queries/users/get-user-by-email'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CustomerSignInFormType, customerSignInFormSchema } from './schema'

type LoginStep = 'email' | 'password'

export default function CustomerSignInForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [showPasswordText, setShowPasswordText] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<LoginStep>('email')
  const [isValidatingEmail, setIsValidatingEmail] = useState<boolean>(false)

  const form = useForm<CustomerSignInFormType>({
    resolver: zodResolver(customerSignInFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleValidateEmail = async () => {
    const emailValue = form.getValues('email')

    if (!emailValue?.trim()) {
      toast.error('Por favor, informe um e-mail válido')
      await form.trigger('email')
      return
    }

    const isEmailValid = await form.trigger('email')
    if (!isEmailValid) {
      return
    }

    setIsValidatingEmail(true)

    try {
      const response = await getUserByEmail({ email: emailValue, role: 'CUSTOMER' })
      console.log('Response from getUserByEmail:', response)
      if (response.status === 200) {
        setCurrentStep('password')
      } else {
        toast.error(response?.data?.error || 'Credenciais inválidas. Por favor, verifique e tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao validar e-mail:', error)
      toast.error('Erro ao validar e-mail. Tente novamente.')
    } finally {
      setIsValidatingEmail(false)
    }
  }

  function toggleShowPasswordText() {
    setShowPasswordText(!showPasswordText)
  }

  async function handleSubmitWithTransition(formData: CustomerSignInFormType) {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: CustomerSignInFormType) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        role: 'CUSTOMER',
        redirect: false,
      })

      if (result?.error) {
        console.error(result.error)
        if (result.error === 'CredentialsSignin') {
          toast.error('Credenciais inválidas. Tente novamente.')
          return
        }

        const resultError = result.error.split(':')
        console.log('Result Error Code:', resultError)

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

      router.replace(`${DEFAULT_PAGES.CUSTOMER.appointments}`)
    } catch (error) {
      console.error(error)
      toast.error(
        'Erro ao tentar realizar login. Por favor, tente novamente mais tarde.',
      )
    }
  }

  const isLoading = isValidatingEmail || isPending

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-full flex-col items-center justify-center gap-6"
    >
      <h1 className="text-3xl font-semibold">Entre na sua conta</h1>
      <Card className="gap-4 rounded-lg p-[30px]">
        <CardContent>
          <Form {...form}>
            <form
              id="customer-sign-in-form"
              onSubmit={form.handleSubmit(handleSubmitWithTransition)}
              className="space-y-6"
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

              {currentStep === 'password' && (
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
              )}

              <Button
                id="customer-sign-in-form"
                type={currentStep === 'email' ? 'button' : 'submit'}
                onClick={currentStep === 'email' ? handleValidateEmail : undefined}
                disabled={isLoading}
                className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {currentStep === 'email' ? 'Acessar conta' : 'Entrar'}
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-between">
            <span className="text-sm">Ainda não tem um cadastro?</span>
            <Link href={DEFAULT_PAGES.PUBLIC_ROUTES.customerSignUp}>
              <Button
                type="button"
                variant="link"
                className="text-sm font-bold"
              >
                Cadastre-se
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
