'use client'

import { updateUser } from '@/api/actions/app/users/update-user'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { useQueryString } from '@/hooks/use-query-string'
import { Session } from '@/types/session'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AdminUserProfileFormType, adminUserProfileFormSchema } from './schema'

export function AdminUserProfileForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: sessionData, update } = useSession()

  const userId = sessionData?.user?.id as string

  const [isPending, startTransition] = useTransition()
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false)

  const isViewing = searchParams.get('profileDetailMode') === 'view'

  const { createQueryString } = useQueryString(searchParams as URLSearchParams)

  const form = useForm<AdminUserProfileFormType>({
    resolver: zodResolver(adminUserProfileFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: sessionData?.user?.name,
      lastName: sessionData?.user?.lastName,
      email: sessionData?.user?.email,
      password: '',
    },
  })

  function toggleShowPasswordText() {
    setShowPasswordText(!showPasswordText)
  }

  const handleSubmitWithTransition = async (formData: AdminUserProfileFormType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: AdminUserProfileFormType) => {
    const toasterId = 'updating-user-profile'

    try {
      toast.loading('Atualizando perfil do usuário...', {
        id: toasterId,
      })

      const response = await updateUser({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success('Perfil do usuário atualizado com sucesso!')

        update({
          ...(sessionData ?? {}),
          user: {
            ...(sessionData?.user ?? {}),
            id: userId,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
          },
        } as Session)

        form.reset({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          password: '',
        })
        router.push(`${DEFAULT_PAGES.ADMIN.profile}?${createQueryString({ profileDetailMode: 'view' })}`, { scroll: false })

        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar perfil do usuário', {
        description: 'Por favor, tente novamente.',
      })
    } catch (error) {
      console.error(error)
      toast.dismiss(toasterId)
      toast.error('Ocorreu um erro inesperado', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        id="up-admin-user-form"
        onSubmit={form.handleSubmit(handleSubmitWithTransition)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full lg:col-span-1">
                <FormLabel required>Nome</FormLabel>
                <FormControl>
                  <Input.Root hasError={!!error} readOnly={isViewing}>
                    <Input.Content
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        form.clearErrors('name')
                      }}
                      type="text"
                      placeholder="ex: Lucas"
                      readOnly={isViewing}
                    />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState: { error } }) => (
              <FormItem className="w-full lg:col-span-1">
                <FormLabel required>Sobrenome</FormLabel>
                <FormControl>
                  <Input.Root hasError={!!error} readOnly={isViewing}>
                    <Input.Content
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                        form.clearErrors('lastName')
                      }}
                      type="text"
                      placeholder="ex: Martins"
                      readOnly={isViewing}
                    />
                  </Input.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel required>E-mail</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly={isViewing}>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toLowerCase())
                      form.clearErrors('email')
                    }}
                    type="text"
                    placeholder="Digite o e-mail..."
                    readOnly={isViewing}
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
                <Input.Root hasError={!!error} readOnly={isViewing}>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('password')
                    }}
                    type={showPasswordText ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    readOnly={isViewing}
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

        {isViewing ? (
          <Button
            type="button"
            className="h-11 bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              router.push(
                  `${DEFAULT_PAGES.ADMIN.profile}?${createQueryString({ profileDetailMode: 'edit' })}`,
                  { scroll: false },
              )
            }}
          >
            Editar perfil
          </Button>

        ) : (
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                router.push(
                  `${DEFAULT_PAGES.ADMIN.profile}?${createQueryString({ profileDetailMode: 'view' })}`,
                  { scroll: false },
                )
              }}
            >
              Voltar
            </Button>

            <Button
              id="up-admin-user-form"
              type="submit"
              disabled={isPending}
              variant="default"
              className="disabled:cursor-not-allowed disabled:opacity-50"
              size="lg"
            >
              {isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Atualizar perfil
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
