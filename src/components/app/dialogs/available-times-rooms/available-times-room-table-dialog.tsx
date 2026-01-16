'use client'

import { fetchAvailableTimes } from '@/api/queries/rooms/fetch-available-times'
import type { UpdateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/table/data-table/form/schema'
import type { CreateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/tabs/schema'
import { CreateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/form/schema'
import { UpdateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/table/data-table/form/schema'
import { Button } from '@/components/ui/button'
import { TableWrapper } from '@/components/ui/table'
import { useRooms } from '@/contexts/rooms-context'
import { cn } from '@/lib/utils'
import { RoomMapper, type RoomMapperToListAvailableTimesType } from '@/mappers/room-mapper'
import { DialogClose } from '@radix-ui/react-dialog'
import { CheckCircle, Clock, Loader2, Moon, RefreshCwIcon, Sun, Sunset } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { SkeletonAvailableTimesRoomLookupTable } from './available-times-room-skeleton-table'

type TimePeriod = 'morning' | 'afternoon' | 'evening'

interface GroupedTimes {
  morning: RoomMapperToListAvailableTimesType[]
  afternoon: RoomMapperToListAvailableTimesType[]
  evening: RoomMapperToListAvailableTimesType[]
}

const periodConfig = {
  morning: {
    label: 'Manhã',
    icon: Sun,
    range: '06:00 - 11:59',
  },
  afternoon: {
    label: 'Tarde',
    icon: Sunset,
    range: '12:00 - 17:59',
  },
  evening: {
    label: 'Noite',
    icon: Moon,
    range: '18:00 - 23:59',
  },
}

function getTimePeriod(time: string): TimePeriod {
  const hour = Number.parseInt(time.split(':')[0], 10)
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

function groupTimesByPeriod(times: RoomMapperToListAvailableTimesType[]): GroupedTimes {
  return times.reduce<GroupedTimes>(
    (acc, item) => {
      const period = getTimePeriod(item.times)
      acc[period].push(item)
      return acc
    },
    { morning: [], afternoon: [], evening: [] },
  )
}

interface AvailableTimesRoomTableDialogProps {
  crAvailableTimesAdmForm?: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'cr-avl-times-adm' })
  upAvailableTimesAdmForm?: (UseFormReturn<UpdateAdminAppointmentType> & { formId: 'up-avl-times-adm' })

  crAvailableTimesCustomerForm?: (UseFormReturn<CreateCustomerAppointmentType> & { formId: 'cr-avl-times-customer' })
  upAvailableTimesCustomerForm?: (UseFormReturn<UpdateCustomerAppointmentType> & { formId: 'up-avl-times-customer' })
  roomId: string
  date: string
}

export function AvailableTimesRoomTableDialog({
  crAvailableTimesAdmForm,
  upAvailableTimesAdmForm,
  crAvailableTimesCustomerForm,
  upAvailableTimesCustomerForm,
  roomId,
  date,
}: AvailableTimesRoomTableDialogProps) {
  const {
    availableTimesRoomsList,
    updateAvailableTimesRoomsList,
    isPendingFetchData,
    startTransitionFetchData,
    refreshData,
    handleRefreshData,
  } = useRooms()

  const [selectedItems, setSelectedItems] = useState<RoomMapperToListAvailableTimesType[]>([])

  async function refreshDataFn() {
    handleRefreshData()
  }

  useEffect(() => {
    async function fetchData() {
      const responseData = await fetchAvailableTimes({
        roomId,
        date,
      })

      const mappedSedGenericLookup = responseData?.availableTimes?.map(RoomMapper.toListAvailableTimes) ?? []

      updateAvailableTimesRoomsList(mappedSedGenericLookup)
    }

    startTransitionFetchData(() => {
      fetchData()
    })
  }, [refreshData, startTransitionFetchData, updateAvailableTimesRoomsList, roomId, date])

  function confirmSelection() {
    if (selectedItems.length > 0) {
      const selectedItem = selectedItems[0]

      switch (crAvailableTimesAdmForm?.formId) {
        case 'cr-avl-times-adm':
          crAvailableTimesAdmForm.setValue('hour', `${selectedItem.times}`)
          crAvailableTimesAdmForm.clearErrors('hour')
      }
      switch (upAvailableTimesAdmForm?.formId) {
        case 'up-avl-times-adm':
          upAvailableTimesAdmForm.setValue('hour', `${selectedItem.times}`)
          upAvailableTimesAdmForm.clearErrors('hour')
          break
      }
      switch (crAvailableTimesCustomerForm?.formId) {
        case 'cr-avl-times-customer':
          crAvailableTimesCustomerForm.setValue('hour', `${selectedItem.times}`)
          crAvailableTimesCustomerForm.clearErrors('hour')
          break
      }
      switch (upAvailableTimesCustomerForm?.formId) {
        case 'up-avl-times-customer':
          upAvailableTimesCustomerForm.setValue('hour', `${selectedItem.times}`)
          upAvailableTimesCustomerForm.clearErrors('hour')
          break
      }
    }
  }

  const groupedTimes = groupTimesByPeriod(availableTimesRoomsList)
  const periods = Object.keys(periodConfig) as TimePeriod[]

  return (
    <div className="size-full">
      <div className="my-2 flex flex-col items-start gap-2">

        {isPendingFetchData ? (
          <SkeletonAvailableTimesRoomLookupTable />
        ) : (
          <TableWrapper className="max-h-[74vh] min-h-[70vh] w-full overflow-hidden rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-end gap-4 border-b px-4 py-3">
              {/* <div className="flex items-center gap-3">
                <Clock className="size-5 text-muted-foreground" />
                <div>
                  <h2 className="text-sm font-semibold">Horários disponíveis</h2>
                  <p className="text-xs text-muted-foreground">Selecione um horário para agendamento</p>
                </div>
              </div> */}

              <div className="flex items-center gap-2">
                <Button
                  aria-label="Atualizar dados"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    startTransitionFetchData(() => {
                      refreshDataFn()
                    })
                  }}
                  disabled={isPendingFetchData}
                  className="flex h-9 items-center"
                >
                  {isPendingFetchData ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCwIcon className="size-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:ml-2 sm:inline">Atualizar</span>
                </Button>

                <DialogClose asChild>
                  <Button
                    disabled={isPendingFetchData || selectedItems.length === 0}
                    onClick={confirmSelection}
                    className="flex items-center"
                  >
                    <CheckCircle className="size-4 sm:mr-2" />
                    <span className="hidden sm:inline">{selectedItems.length > 0 ? `Confirmar (${selectedItems.length})` : 'Confirmar'}</span>
                  </Button>
                </DialogClose>
              </div>
            </div>

            <div className="p-4">
              {availableTimesRoomsList?.length === 0 ? (
                <div className="flex h-24 items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="size-5" />
                  Nenhum horário disponível
                </div>
              ) : (
                <div className="space-y-6">
                  {periods.map((period) => {
                    const times = groupedTimes[period]
                    if (times.length === 0) return null

                    const config = periodConfig[period]
                    const Icon = config.icon

                    return (
                      <div key={period} className="space-y-3">
                        <div className="flex items-center gap-2 border-b pb-2">
                          <Icon className="size-5 text-muted-foreground" />
                          <h3 className="font-semibold">{config.label}</h3>
                          <span className="text-xs text-muted-foreground">({config.range})</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                          {times.map((item) => {
                            const isSelected = selectedItems.some((value) => value.times === item.times)

                            return (
                              <button
                                key={item.times}
                                type="button"
                                onClick={() => setSelectedItems([item])}
                                className={cn(
                                  'relative flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                                  'hover:border-primary/50 hover:bg-primary/5',
                                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                    : 'border-border bg-background text-foreground',
                                )}
                              >
                                {isSelected && <CheckCircle className="size-3.5" />}
                                {item.times}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TableWrapper>
        )}
      </div>
    </div>
  )
}
