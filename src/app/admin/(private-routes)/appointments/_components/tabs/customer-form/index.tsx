'use client'

import { CustomersDialog } from '@/components/app/dialogs/customers/customers-dialog'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { normalizeCepNumber } from '@/lib/utils/masks'
import { BrazilianStateMapper } from '@/mappers/brazilian-state-mapper'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { CreateAdminAppointmentType } from '../schema'

interface AppointmentCustomerFormProps {
  form: UseFormReturn<CreateAdminAppointmentType>
}

export function AppointmentCustomerForm({ form }: AppointmentCustomerFormProps) {
  const [open, setOpen] = useState(false)

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
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />

      <FormField
        control={form.control}
        name="userId"
        render={({ field }) => (
          <input type="hidden" {...field} />
        )}
      />

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full lg:col-span-1">
              <FormLabel required>Nome</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('name')
                    }}
                    type="text"
                    placeholder="ex: Lucas"
                    readOnly
                  />
                  <CustomersDialog form={{ ...form, formId: 'dlg-customer-create-form' }} />
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
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('lastName')
                    }}
                    type="text"
                    placeholder="ex: Martins"
                    readOnly
                  />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full lg:col-span-2">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.toLowerCase())
                      form.clearErrors('email')
                    }}
                    type="text"
                    placeholder="Digite o e-mail..."
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
          name="zipCode"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full lg:col-span-1">
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('zipCode')
                    }}
                    type="text"
                    placeholder="Digite o CEP..."
                    maxLength={9}
                    readOnly
                  />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-5">
        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full lg:col-span-4">
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('address')
                    }}
                    type="text"
                    placeholder="Digite o endereço..."
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
          name="number"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full lg:col-span-1">
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('number')
                    }}
                    type="text"
                    placeholder="Número..."
                    readOnly
                  />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <FormField
          control={form.control}
          name="complement"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('complement')
                    }}
                    type="text"
                    placeholder="Digite o complemento..."
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
          name="neighborhood"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('neighborhood')
                    }}
                    type="text"
                    placeholder="Digite o bairro..."
                    readOnly
                  />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <FormField
          control={form.control}
          name="city"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="w-full">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input.Root hasError={!!error} readOnly>
                  <Input.Content
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      form.clearErrors('city')
                    }}
                    type="text"
                    placeholder="Digite a cidade..."
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
          name="state"
          render={({ field }) => (
            <FormItem className="w-full lg:col-span-1">
              <FormLabel>UF:</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      role="combobox"
                      variant="outline"
                      className="flex w-full justify-between disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-muted-foreground disabled:opacity-90"
                      disabled
                    >
                      {field.value
                        ? BrazilianStateMapper.getFormattedLabelByCode(field.value)
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
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === listState.value
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
    </div>
  )
}
