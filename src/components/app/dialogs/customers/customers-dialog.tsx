import { CreateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/tabs/schema'
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
import { UseFormReturn } from 'react-hook-form'
import { CustomersTableDialog } from './customers-table-dialog'

interface CustomersDialogProps {
  form: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'dlg-customer-create-form' })
}

export function CustomersDialog({
  form,
}: CustomersDialogProps) {
  function clearCustomer() {
    const fieldsToReset = [
      'customerId',
      'userId',
      'name',
      'lastName',
      'email',
      'zipCode',
      'address',
      'number',
      'complement',
      'neighborhood',
      'city',
      'state',
    ] as const

    fieldsToReset.forEach((field) => {
      form.setValue(field, '')
    })
  }

  const hasCustomer = Boolean((form as UseFormReturn<CreateAdminAppointmentType>).watch('customerId')) || Boolean((form as UseFormReturn<CreateAdminAppointmentType>).watch('userId'))

  return (
    <Dialog modal>
      {hasCustomer ? (
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-none rounded-r-sm p-0 px-3 text-muted-foreground"
          onClick={clearCustomer}
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
          <DialogTitle>Clientes</DialogTitle>
          <DialogDescription>Selecione o cliente desejado</DialogDescription>
        </DialogHeader>
        <CustomersTableDialog form={form} />
      </DialogContent>
    </Dialog>
  )
}
