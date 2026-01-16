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
import { Search, X } from 'lucide-react'
import { Control, UseFormReturn, useWatch } from 'react-hook-form'
import { RoomTableDialog } from './rooms-table-dialog'

interface RoomDialogProps {
  crApptRoomAdminForm?: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'cr-appt-room-admin' })
  upApptRoomAdminForm?: (UseFormReturn<UpdateAdminAppointmentType> & { formId: 'up-appt-room-admin' })
  crApptRoomCustomerForm?: (UseFormReturn<CreateCustomerAppointmentType> & { formId: 'cr-appt-room-customer' })
  upApptRoomCustomerForm?: (UseFormReturn<UpdateCustomerAppointmentType> & { formId: 'up-appt-room-customer' })
}

export function RoomDialog({
  crApptRoomAdminForm,
  upApptRoomAdminForm,
  crApptRoomCustomerForm,
  upApptRoomCustomerForm,
}: RoomDialogProps) {
  const control = (crApptRoomAdminForm?.control ?? upApptRoomAdminForm?.control ?? crApptRoomCustomerForm?.control ?? upApptRoomCustomerForm?.control) as
    | Control<CreateAdminAppointmentType | UpdateAdminAppointmentType | CreateCustomerAppointmentType | UpdateCustomerAppointmentType>
    | undefined

  const roomId = useWatch({
    name: 'roomId',
    control,
  })

  function clearRoom() {
    const fieldsToReset = [
      'date',
      'hour',
      'roomId',
      'roomName',
      'startAndEndTime',
      'slotDuration'] as const

    if (crApptRoomAdminForm) {
      fieldsToReset.forEach((field) => { crApptRoomAdminForm?.setValue(field, '') })
      return
    }

    if (upApptRoomAdminForm) {
      fieldsToReset.forEach((field) => { upApptRoomAdminForm?.setValue(field, '') })
      return
    }

    if (crApptRoomCustomerForm) {
      fieldsToReset.forEach((field) => { crApptRoomCustomerForm?.setValue(field, '') })
      return
    }

    if (upApptRoomCustomerForm) {
      fieldsToReset.forEach((field) => { upApptRoomCustomerForm?.setValue(field, '') })
    }
  }

  const hasRoom = Boolean(roomId)

  return (
    <Dialog modal>
      {hasRoom ? (
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-none rounded-r-sm p-0 px-3 text-muted-foreground"
          onClick={clearRoom}
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
          <DialogTitle>Salas</DialogTitle>
          <DialogDescription>Selecione a sala desejada</DialogDescription>
        </DialogHeader>
        <RoomTableDialog
          crApptRoomAdminForm={crApptRoomAdminForm}
          upApptRoomAdminForm={upApptRoomAdminForm}
          crApptRoomCustomerForm={crApptRoomCustomerForm}
          upApptRoomCustomerForm={upApptRoomCustomerForm}
        />
      </DialogContent>
    </Dialog>
  )
}
