'use client'

import { createAppointmentRoom } from '@/api/actions/app/rooms/create-appointment-room'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { NewAppointmentRoomType, newAppointmentRoomSchema } from './schema'

export function NewAppointmentRoomForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewAppointmentRoomType>({
    resolver: zodResolver(newAppointmentRoomSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      startTime: '',
      endTime: '',
      slotDuration: '',
    },
  })

  const handleSubmitWithTransition = async (formData: NewAppointmentRoomType) => {
    startTransition(() => {
      handleSubmit(formData)
    })
  }

  const handleSubmit = async (data: NewAppointmentRoomType) => {
    const toasterId = 'creating-appointment-room'

    try {
      toast.loading('Criando sala de agendamento...', {
        id: toasterId,
      })

      const response = await createAppointmentRoom({
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDuration: Number(data.slotDuration),
      })

      toast.dismiss(toasterId)

      if (response.status === 201) {
        toast.success('Sala de agendamento criada com sucesso!')
        form.reset()
        router.refresh()
        return
      }

      if (response.status === 409) {
        toast.error('Conflito ao criar sala de agendamento.', {
          description: response?.responseData?.error,
          duration: 5000,
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

  return (
    <Form {...form}>
      <form
        id="new-appointment-room-form"
        onSubmit={form.handleSubmit(handleSubmitWithTransition)}
      >
        <Card>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="w-full">
                  <FormLabel required>Nº da Sala</FormLabel>
                  <FormControl>
                    <Input.Root hasError={!!error}>
                      <Input.Content
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value)
                          form.clearErrors('name')
                        }}
                        type="text"
                        placeholder="Nº da Sala..."
                      />
                    </Input.Root>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid-cols grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full lg:col-span-1">
                    <FormLabel required>Horário Inicial</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error}>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value)
                            form.clearErrors('startTime')
                          }}
                          type="text"
                          placeholder="Horário Inicial..."
                        />
                      </Input.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="w-full lg:col-span-1">
                    <FormLabel required>Horário Final</FormLabel>
                    <FormControl>
                      <Input.Root hasError={!!error}>
                        <Input.Content
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value)
                            form.clearErrors('endTime')
                          }}
                          type="text"
                          placeholder="Horário Final..."
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
              name="slotDuration"
              render={({ field }) => (
                <FormItem className="w-full lg:col-span-1">
                  <FormLabel required>Bloco de duração</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="h-9 w-full rounded-sm">
                        <SelectValue placeholder="Bloco de duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            Selecione a duração do bloco
                          </SelectLabel>
                          <SelectItem value="15">
                            15 Minutos
                          </SelectItem>
                          <SelectItem value="30">
                            30 Minutos
                          </SelectItem>
                          <SelectItem value="60">
                            1 Hora
                          </SelectItem>
                          <SelectItem value="90">
                            1 Hora e 30 Minutos
                          </SelectItem>
                          <SelectItem value="120">
                            2 Horas
                          </SelectItem>
                          <SelectItem value="240">
                            4 Horas
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              id="new-appointment-room-form"
              type="submit"
              disabled={isPending}
              className="h-11 w-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Criar sala
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
