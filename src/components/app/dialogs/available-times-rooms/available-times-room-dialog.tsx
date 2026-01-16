'use client'

import { UpdateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/table/data-table/form/schema'
import { CreateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/tabs/schema'
import { CreateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/form/schema'
import { UpdateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/table/data-table/form/schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { format, isValid } from 'date-fns'
import { Search, X } from 'lucide-react'
import { Control, UseFormReturn, useWatch } from 'react-hook-form'
import { AvailableTimesRoomTableDialog } from './available-times-room-table-dialog'

interface AvailableTimesRoomDialogProps {
  crAvailableTimesAdmForm?: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'cr-avl-times-adm' })
  upAvailableTimesAdmForm?: (UseFormReturn<UpdateAdminAppointmentType> & { formId: 'up-avl-times-adm' })

  crAvailableTimesCustomerForm?: (UseFormReturn<CreateCustomerAppointmentType> & { formId: 'cr-avl-times-customer' })
  upAvailableTimesCustomerForm?: (UseFormReturn<UpdateCustomerAppointmentType> & { formId: 'up-avl-times-customer' })
}

export function AvailableTimesRoomDialog({
  crAvailableTimesAdmForm,
  upAvailableTimesAdmForm,

  crAvailableTimesCustomerForm,
  upAvailableTimesCustomerForm,
}: AvailableTimesRoomDialogProps) {
  const control = (crAvailableTimesAdmForm?.control ?? upAvailableTimesAdmForm?.control ?? crAvailableTimesCustomerForm?.control ?? upAvailableTimesCustomerForm?.control) as
    | Control<CreateAdminAppointmentType | UpdateAdminAppointmentType | CreateCustomerAppointmentType | UpdateCustomerAppointmentType>
    | undefined

  const roomId = useWatch({
    name: 'roomId',
    control,
  })

  const date = useWatch({
    name: 'date',
    control,
  })

  const hour = useWatch({
    name: 'hour',
    control,
  })

  const dateTime = isValid(date.from)
    ? format(date.from as Date, 'yyyy-MM-dd')
    : ''

  function clearAvailableTimesRoom() {
    const fieldsToReset = ['hour'] as const

    if (crAvailableTimesAdmForm) {
      fieldsToReset.forEach((field) => crAvailableTimesAdmForm.setValue(field, ''))
      return
    }

    if (upAvailableTimesAdmForm) {
      fieldsToReset.forEach((field) => upAvailableTimesAdmForm.setValue(field, ''))
      return
    }

    if (crAvailableTimesCustomerForm) {
      fieldsToReset.forEach((field) => crAvailableTimesCustomerForm.setValue(field, ''))
      return
    }

    if (upAvailableTimesCustomerForm) {
      fieldsToReset.forEach((field) => upAvailableTimesCustomerForm.setValue(field, ''))
    }
  }

  const hasAvailableTimesRoom = Boolean(hour)

  return (
    <Dialog modal>
      {hasAvailableTimesRoom ? (
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-none rounded-r-sm p-0 px-3 text-muted-foreground"
          onClick={clearAvailableTimesRoom}
        >
          <X className="size-4" />
        </Button>
      ) : (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-none rounded-r-sm p-0 px-3"
          >
            <Search className="size-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[95vh] min-h-[50vh] max-w-screen-sm overflow-y-auto overflow-x-hidden lg:max-w-screen-lg xl:max-w-screen-xl">
        <DialogHeader className="text-left">
          <DialogTitle>Horários</DialogTitle>
          <DialogDescription>Selecione o horário desejado</DialogDescription>
        </DialogHeader>
        <AvailableTimesRoomTableDialog
          crAvailableTimesAdmForm={crAvailableTimesAdmForm}
          upAvailableTimesAdmForm={upAvailableTimesAdmForm}
          crAvailableTimesCustomerForm={crAvailableTimesCustomerForm}
          upAvailableTimesCustomerForm={upAvailableTimesCustomerForm}
          roomId={roomId}
          date={dateTime}
        />
      </DialogContent>
    </Dialog>
  )
}
