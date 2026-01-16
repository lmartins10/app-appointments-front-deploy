'use client'

import { CalendarDatePicker } from '@/components/app/calendar-date-picker'
import { AvailableTimesRoomDialog } from '@/components/app/dialogs/available-times-rooms/available-times-room-dialog'
import { RoomDialog } from '@/components/app/dialogs/rooms/rooms-dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { isBefore, isSameDay } from 'date-fns'
import { UseFormReturn } from 'react-hook-form'
import { CreateAdminAppointmentType } from '../schema'

interface AppointmentWithRoomFormProps {
  form: UseFormReturn<CreateAdminAppointmentType>
}

export function AppointmentWithRoomForm({ form }: AppointmentWithRoomFormProps) {
  const startDateWatch = new Date()

  return (
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
                <RoomDialog crApptRoomAdminForm={{ ...form, formId: 'cr-appt-room-admin' }} />
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
                <AvailableTimesRoomDialog crAvailableTimesAdmForm={{ ...form, formId: 'cr-avl-times-adm' }} />
              </Input.Root>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
