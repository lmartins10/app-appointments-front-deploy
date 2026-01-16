'use client'

import { createAppointment } from '@/api/actions/app/appointments/create-appointment'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { cn } from '@/lib/utils'
import { normalizeCepNumber } from '@/lib/utils/masks'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid } from 'date-fns'
import { CalendarDays, Check, Loader2, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { AppointmentWithRoomForm } from './appointment-form'
import { AppointmentCustomerForm } from './customer-form'
import { createAdminAppointmentSchema, CreateAdminAppointmentType } from './schema'

export function AppointmentsTabs() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('customerData')

  const skipFormErrorToastRef = useRef(false)
  const toasterId = 'appointments-form-error'

  const form = useForm<CreateAdminAppointmentType>({
    resolver: zodResolver(createAdminAppointmentSchema) as unknown as Resolver<CreateAdminAppointmentType>,
    reValidateMode: 'onBlur',
    defaultValues: {
      customerId: '',
      userId: '',
      name: '',
      lastName: '',
      email: '',
      zipCode: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',

      roomId: '',
      roomName: '',
      startAndEndTime: '',
      slotDuration: '',
      hour: '',
      date: { from: undefined, to: undefined },
    },
  })

  const hasErrors = Object.keys(form?.formState?.errors).length > 0

  const customerDataIds = useWatch({ name: ['userId', 'customerId'], control: form.control })

  const isMainDataValid = useCallback((): boolean => {
    return !!(customerDataIds?.[0] && customerDataIds?.[1])
  }, [customerDataIds])

  const isStep1Complete = isMainDataValid()

  const handleTabChange = async (value: string) => {
    if (value === 'appointmentData' && !isMainDataValid()) {
      skipFormErrorToastRef.current = true

      await form.trigger()

      toast.error('Preencha os campos obrigatórios', {
        id: toasterId,
        description: 'Complete os dados do clientes antes de prosseguir para o agendamento',
      })
      return
    }

    setActiveTab(value)
  }

  const handleSubmitWithTransition = async (formData: CreateAdminAppointmentType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: CreateAdminAppointmentType) => {
    const toasterId = 'creating-appointment'

    const appointmentDate = isValid(data.date.from)
      ? format(data?.date?.from as Date, 'yyyy-MM-dd')
      : ''

    try {
      toast.loading('Criando novo agendamento...', {
        id: toasterId,
      })

      const response = await createAppointment({
        date: appointmentDate,
        hour: data.hour,
        userId: data.userId,
        customerId: data.customerId,
        roomId: data.roomId,
      })

      toast.dismiss(toasterId)

      if (response.status === 201) {
        toast.success('Cliente criado com sucesso!')
        form.reset()
        router.push(DEFAULT_PAGES.ADMIN.appointments)

        return
      }

      if (response.status === 409) {
        toast.error('Conflito ao criar cliente.', {
          description: response?.data?.error,
          duration: 5000,
        })
        return
      }

      console.error({ response })
      toast.error('Erro ao criar cliente', {
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

  useEffect(() => {
    const errors = []

    if (hasErrors) {
      errors.push('Existem erros no formulário')
    }

    const errorMessage = errors.length === 1 ? 'Ocorreu erro no formulário: ' : 'Ocorreu erro nos formulários: '

    if (errors.length > 0) {
      // if we recently showed the required-fields toast from the tab
      // change, skip showing the form-level toast to avoid duplicates
      if (skipFormErrorToastRef.current) {
        skipFormErrorToastRef.current = false
        return
      }

      toast.error('Erro ao criar agendamento', {
        description: (
          <div className="flex flex-col gap-1">
            <span>{errorMessage} </span>
            <ul className="list-disc pl-4">
              {
                errors.map((error) => (
                  <li key={error}> {error} </li>
                ))
              }
            </ul>
          </div>
        ),
      })
    }
  }, [hasErrors])

  return (
    <Form {...form}>
      <form
        id="create-appointments-form"
        onSubmit={form.handleSubmit(handleSubmitWithTransition)}
        className="flex flex-col gap-4"
      >
        <div className="w-full">
          {/* Mobile: Accordion (visible on <lg) */}
          <div className="block lg:hidden">
            <Accordion
              type="single"
              collapsible
              value={activeTab}
              onValueChange={(value) => handleTabChange(value || '')}
              className="w-full"
            >
              <AccordionItem value="customerData">
                <AccordionTrigger className="px-0">
                  <div className={cn('flex items-center gap-2')}>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {isStep1Complete ? (
                        <Check className="size-4" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </span>
                    <span> Dados do cliente</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="py-4">
                      <AppointmentCustomerForm form={form} />
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="appointmentData">
                <AccordionTrigger className="px-0">
                  <div className={cn('flex items-center gap-2')}>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      <CalendarDays className="size-4" />
                    </span>
                    <span> Dados do agendamento </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="py-4">
                      <AppointmentWithRoomForm form={form} />
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop: Tabs (visible on lg+) */}
          <div className="hidden lg:block">
            <Tabs defaultValue="customerData" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="my-4 w-full items-center justify-start bg-background p-0">
                <TabsTrigger
                  value="customerData"
                  className={
                    cn('relative h-14 border-b-2 border-transparent px-6 data-[state=active]:border-primary')
                  }
                >
                  <div className={cn('flex items-center gap-2')}>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {isStep1Complete ? (
                        <Check className="size-4" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </span>
                    <span> Dados do cliente</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="appointmentData"
                  className={
                    cn(
                      'relative h-14 rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary ',
                    )
                  }
                >
                  <div className={cn('flex items-center gap-2')}>
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      <CalendarDays className="size-4" />
                    </span>
                    <span> Dados do agendamento </span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customerData" className="mt-0">
                <Card>
                  <CardContent className="py-4">
                    <AppointmentCustomerForm form={form} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointmentData" className="mt-0">
                <Card>
                  <CardContent className="py-4">
                    <AppointmentWithRoomForm form={form} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {
          activeTab === 'appointmentData' && (
            <Button
              id="create-appointments-form"
              type="submit"
              disabled={form.formState.isSubmitting}
              className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {
                form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )
              }
              Criar Agendamento
            </Button>
          )
        }
      </form>
    </Form>
  )
}
