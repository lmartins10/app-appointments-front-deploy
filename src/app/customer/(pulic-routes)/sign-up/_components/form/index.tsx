'use client'

import { createNewCustomer } from '@/api/actions/app/customers/create-customer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { cn } from '@/lib/utils'
import { normalizeCepNumber } from '@/lib/utils/masks'
import { BrazilianStateMapper } from '@/mappers/brazilian-state-mapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Check, ChevronsUpDown, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { CustomerSignUpFormType, customerSignUpFormSchema } from './schema'

type LoginStep = 'infoBasic' | 'address'

export default function CustomerSignUpForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [showPasswordText, setShowPasswordText] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [stateOptions, setStateOptions] = useState<string>('')

  const form = useForm<CustomerSignUpFormType>({
    resolver: zodResolver(customerSignUpFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  })

  function toggleShowPasswordText() {
    setShowPasswordText(!showPasswordText)
  }

  async function handleSubmitWithTransition(formData: CustomerSignUpFormType) {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: CustomerSignUpFormType) => {
    const toasterId = 'create-new-customer'

    try {
      toast.loading('Adicionando cliente...', {
        id: toasterId,
      })

      const response = await createNewCustomer({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        zipCode: data.zipCode,
        address: data.address,
        number: data.number,
        complement: data.complement ?? null,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        role: 'CUSTOMER',
      })

      toast.dismiss(toasterId)

      if (response.status === 201) {
        toast.success('Usuário criado com sucesso!')
        form.reset()
        router.replace(`${DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn}`)
        return
      }

      if (response.status === 409) {
        toast.error('Conflito ao adicionar cliente.', {
          description: response?.data?.error,
          duration: 5000,
        })
        return
      }

      console.error({ response })
      toast.error('Erro ao adicionar cliente', {
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

  const zipCodeValue = useWatch({
    control: form.control,
    name: 'zipCode',
  })

  const { setValue } = form

  useEffect(() => {
    if (!zipCodeValue) return

    setValue('zipCode', normalizeCepNumber(zipCodeValue))
  }, [zipCodeValue, setValue])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="my-40 flex flex-col items-center justify-center gap-6"
    >
      <h1 className="text-3xl font-semibold">Cadastre-se</h1>
      <Card className="gap-4 rounded-lg p-[30px]">
        <CardContent>
          <Form {...form}>
            <form
              id="customer-sign-up-form"
              onSubmit={form.handleSubmit(handleSubmitWithTransition)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full lg:col-span-1">
                      <FormLabel required>Nome</FormLabel>
                      <FormControl>
                        <Input.Root hasError={!!error}>
                          <Input.Content
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              form.clearErrors('name')
                            }}
                            type="text"
                            placeholder="ex: Lucas"
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
                        <Input.Root hasError={!!error}>
                          <Input.Content
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              form.clearErrors('lastName')
                            }}
                            type="text"
                            placeholder="ex: Martins"
                          />
                        </Input.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
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
                              field.onChange(e.target.value.toLowerCase())
                              form.clearErrors('email')
                            }}
                            type="text"
                            placeholder="Digite o e-mail..."
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

                <Separator />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full">
                      <FormLabel required>CEP</FormLabel>
                      <FormControl>
                        <Input.Root hasError={!!error}>
                          <Input.Content
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              form.clearErrors('zipCode')
                            }}
                            type="text"
                            placeholder="Digite o CEP..."
                            maxLength={9}
                          />
                        </Input.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {zipCodeValue && (
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input.Root hasError={!!error}>
                            <Input.Content
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.clearErrors('address')
                              }}
                              type="text"
                              placeholder="Digite o endereço..."
                            />
                          </Input.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input.Root hasError={!!error}>
                            <Input.Content
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.clearErrors('number')
                              }}
                              type="text"
                              placeholder="Digite o número..."
                            />
                          </Input.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input.Root hasError={!!error}>
                            <Input.Content
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.clearErrors('complement')
                              }}
                              type="text"
                              placeholder="Digite o complemento..."
                            />
                          </Input.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input.Root hasError={!!error}>
                            <Input.Content
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.clearErrors('neighborhood')
                              }}
                              type="text"
                              placeholder="Digite o bairro..."
                            />
                          </Input.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input.Root hasError={!!error}>
                            <Input.Content
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                                form.clearErrors('city')
                              }}
                              type="text"
                              placeholder="Digite a cidade..."
                            />
                          </Input.Root>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full lg:col-span-1">
                        <FormLabel>UF:</FormLabel>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                role="combobox"
                                variant="outline"
                                className="flex w-full justify-between"
                              >
                                {stateOptions
                                  ? BrazilianStateMapper.getFormattedLabelByCode(stateOptions)
                                  : 'Selecione o estado'}
                                <ChevronsUpDown
                                  className={cn('ml-2 h-4 w-4 shrink-0 opacity-50')}
                                />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom">
                              <Command>
                                <CommandInput placeholder="Pesquisar estado..." className="focus:outline-none focus:ring-0" />
                                <CommandList>
                                  <CommandEmpty>Nenhuma estado encontrado</CommandEmpty>
                                  <CommandGroup>
                                    {BrazilianStateMapper.getAllToComboBox().map((listState) => (
                                      <CommandItem
                                        key={listState.value}
                                        value={`${listState.value} ${listState.name}`}
                                        onSelect={() => {
                                          setValue('state', listState.value)
                                          setStateOptions(listState.value)
                                          setOpen(false)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            stateOptions === listState.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                        {listState.label?.toString()}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>

                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button
                id="customer-sign-up-form"
                type="submit"
                className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              >
                {(isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Cadastrar-se
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
