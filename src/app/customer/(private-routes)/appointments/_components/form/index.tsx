'use client'

import { createAppointment } from '@/api/actions/app/appointments/create-appointment'
import { CalendarDatePicker } from '@/components/app/calendar-date-picker'
import { AvailableTimesRoomDialog } from '@/components/app/dialogs/available-times-rooms/available-times-room-dialog'
import { RoomDialog } from '@/components/app/dialogs/rooms/rooms-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isBefore, isSameDay, isValid } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateCustomerAppointmentType, createCustomerAppointmentSchema } from './schema'

export function AppointmentsCustomerForms() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const session = useSession()

  const userId = session.data?.user?.id || ''
  const customerId = session.data?.user?.customerId || ''

  const form = useForm<CreateCustomerAppointmentType>({
    resolver: zodResolver(createCustomerAppointmentSchema) as Resolver<CreateCustomerAppointmentType>,
    reValidateMode: 'onBlur',
    defaultValues: {
      userId,
      customerId,

      roomId: '',
      roomName: '',
      startAndEndTime: '',
      slotDuration: '',
      hour: '',
      date: { from: undefined, to: undefined },
    },
  })

  const startDateWatch = new Date()

  const handleSubmitWithTransition = async (formData: CreateCustomerAppointmentType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: CreateCustomerAppointmentType) => {
    const toasterId = 'creating-appointment'

    const appointmentDate = isValid(data.date.from)
      ? format(data?.date?.from as Date, 'yyyy-MM-dd')
      : ''

    console.log('data', data)

    try {
      toast.loading('Criando novo agendamento...', {
        id: toasterId,
      })

      const response = await createAppointment({
        userId: data.userId,
        customerId: data.customerId,
        date: appointmentDate,
        hour: data.hour,
        roomId: data.roomId,
      })

      toast.dismiss(toasterId)

      if (response.status === 201) {
        toast.success('Cliente criado com sucesso!')
        form.reset()
        router.push(DEFAULT_PAGES.CUSTOMER.appointments)

        return
      }

      if (response.status === 409) {
        toast.error('Conflito ao criar agendamento.', {
          description: response?.data?.error,
          duration: 5000,
        })
        return
      }

      console.error({ response })
      toast.error('Erro ao criar agendamento', {
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
        id="cr-appointments-customer-form"
        onSubmit={form.handleSubmit(handleSubmitWithTransition)}
      >
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />

              <FormField
                control={form.control}
                name="roomName"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormLabel required>Sala:</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error} readOnly>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value)
                            form.clearErrors('roomName')
                          }}
                          type="text"
                          placeholder="Sala..."
                          readOnly
                        />
                        <RoomDialog crApptRoomCustomerForm={{ ...form, formId: 'cr-appt-room-customer' }} />
                      </Input.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid-cols grid gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startAndEndTime"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full lg:col-span-1">
                      <FormLabel>Horário Inicial & Horário Final:</FormLabel>
                      <FormControl>
                        <Input.Root hasError={!!error} readOnly>
                          <Input.Content
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value)
                              form.clearErrors('startAndEndTime')
                            }}
                            type="text"
                            placeholder="Horário Inicial & Horário Final..."
                            readOnly
                          />
                        </Input.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full lg:col-span-1">
                      <FormLabel>Bloco de duração:</FormLabel>
                      <FormControl>
                        <Input.Root hasError={!!error} readOnly>
                          <Input.Content
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value)
                              form.clearErrors('slotDuration')
                            }}
                            type="text"
                            placeholder="Bloco de duração da sala..."
                            readOnly
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
                name="date"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full lg:col-span-1">
                    <FormLabel className="font-medium" htmlFor="dateFrom" required>
                      Data do agendamento:
                    </FormLabel>
                    <FormControl>
                      <CalendarDatePicker
                        numberOfMonths={1}
                        closeOnSelect
                        date={field.value as { from: Date; to: Date }}
                        onDateSelect={({ from, to }) => {
                          form.setValue('date', { from, to })
                          form.clearErrors('date')
                        }}
                        calendarDisabled={(date: Date) =>
                          startDateWatch !== undefined
                            ? isBefore(date, startDateWatch) &&
                            !isSameDay(date, startDateWatch)
                            : false}
                        hasError={!!error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hour"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full">
                    <FormLabel required>Hora agendamento:</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error} readOnly>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value)
                            form.clearErrors('hour')
                          }}
                          type="text"
                          placeholder="Hora agendamento..."
                          readOnly
                        />
                        <AvailableTimesRoomDialog crAvailableTimesCustomerForm={{ ...form, formId: 'cr-avl-times-customer' }} />
                      </Input.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          id="cr-appointments-customer-form"
          type="submit"
          disabled={isPending}
          className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {
            isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )
          }
          Criar Agendamento
        </Button>
      </form>
    </Form>
  )
}
