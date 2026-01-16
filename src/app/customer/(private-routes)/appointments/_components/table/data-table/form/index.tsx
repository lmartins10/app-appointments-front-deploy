import { updateAppointment } from '@/api/actions/app/appointments/update-appointment'
import { CalendarDatePicker } from '@/components/app/calendar-date-picker'
import { AvailableTimesRoomDialog } from '@/components/app/dialogs/available-times-rooms/available-times-room-dialog'
import { RoomDialog } from '@/components/app/dialogs/rooms/rooms-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useQueryString } from '@/hooks/use-query-string'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isBefore, isSameDay, isValid } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { updateCustomerAppointmentSchema, UpdateCustomerAppointmentType } from './schema'

interface AppointmentFormProps {
  data: UpdateCustomerAppointmentType
  onClose?: () => void
}

export function AppointmentTableForm({ data, onClose }: AppointmentFormProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const mode = searchParams?.get('appointmentDetailsMode')
  const isViewing = (mode === 'view') || pathname.includes('view')
  const { createQueryString } = useQueryString(searchParams as unknown as URLSearchParams)

  const form = useForm<UpdateCustomerAppointmentType>({
    resolver: zodResolver(updateCustomerAppointmentSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      appointmentId: data.appointmentId,
      date: data.date,
      hour: data.hour,
      fullName: data.fullName,
      roomName: data.roomName,
      startAndEndTime: data.startAndEndTime,
      slotDuration: data.slotDuration,
      status: data.status,
      roomId: data.roomId,
      userId: data.userId,
      customerId: data.customerId,
    },
  })

  const startDateWatch = new Date()

  const handleSubmitWithTransition = async (formData: UpdateCustomerAppointmentType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: UpdateCustomerAppointmentType) => {
    const toasterId = 'updating-appointment'

    const appointmentDate = isValid(data.date.from)
      ? format(data?.date?.from as Date, 'yyyy-MM-dd')
      : ''

    try {
      toast.loading('Atualizando agendamento...', {
        id: toasterId,
      })

      const response = await updateAppointment({
        appointmentId: data.appointmentId,
        date: appointmentDate,
        hour: data.hour,
        roomId: data.roomId,
        userId: data.userId,
        customerId: data.customerId,
      })

      toast.dismiss(toasterId)

      if (response.status === 204) {
        toast.success('Agendamento atualizado com sucesso!')
        form.reset()
        onClose?.()
        router.refresh()

        return
      }

      if (response.status === 400) {
        toast.error('Erro ao atualizar agendamento', {
          duration: 10000,
        })
        return
      }

      console.error({ response })
      toast.error('Erro ao atualizar agendamento', {
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

  const isCanceled = useWatch({ control: form.control, name: 'status' }) === 'canceled'

  return (
    <Form {...form}>
      <form
        id="update-appointment-form"
        onSubmit={form.handleSubmit(handleSubmitWithTransition)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Nome:</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value)
                      form.clearErrors('fullName')
                    }}
                    type="text"
                    placeholder="Nome..."
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
                  {!isCanceled && !isViewing && (
                    <RoomDialog upApptRoomCustomerForm={{ ...form, formId: 'up-appt-room-customer' }} />
                  )}
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
                  disabled={isCanceled}
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
                  {!isCanceled && !isViewing && (
                    <AvailableTimesRoomDialog upAvailableTimesCustomerForm={{ ...form, formId: 'up-avl-times-customer' }} />
                  )}
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isViewing && !isCanceled ? (
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.push(
                  `${pathname}?${createQueryString({ appointmentDetailsMode: 'view', roomId: data.roomId })}`,
                  { scroll: false },
                )

                onClose?.()
              }}
            >
              Voltar
            </Button>

            <Button
              type="button"
              onClick={() => {
                router.push(
                  `${pathname}?${createQueryString({ appointmentDetailsMode: 'edit', roomId: data.roomId })}`,
                  { scroll: false },
                )
              }}
            >
              Editar agendamento
            </Button>
          </div>
        ) : (
          !isCanceled && (
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.push(
                    `${pathname}?${createQueryString({ appointmentDetailsMode: 'view', roomId: data.roomId })}`,
                    { scroll: false },
                  )
                }}
              >
                Voltar
              </Button>

              <Button
                id="update-appointment-form"
                type="submit"
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Atualizar Agendamento
              </Button>
            </div>
          )
        )}
      </form>
    </Form>
  )
}
