'use client'

import { fetchRecentRoomsQuery } from '@/api/queries/rooms/fetch-recent-rooms-query'
import { UpdateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/table/data-table/form/schema'
import { CreateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/tabs/schema'
import { CreateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/form/schema'
import { UpdateCustomerAppointmentType } from '@/app/customer/(private-routes)/appointments/_components/table/data-table/form/schema'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from '@/components/ui/table'
import { useRooms } from '@/contexts/rooms-context'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { formatSlotDuration, formatTime } from '@/lib/utils/formatters/date-time-rooms'
import { RoomMapper, RoomMapperToListLookupType } from '@/mappers/room-mapper'
import { DialogClose } from '@radix-ui/react-dialog'
import {
  CheckCircle,
  Loader2,
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { SkeletonRoomLookupTable } from './rooms-skeleton-table'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20

interface RoomTableDialogProps {
  crApptRoomAdminForm?: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'cr-appt-room-admin' })
  upApptRoomAdminForm?: (UseFormReturn<UpdateAdminAppointmentType> & { formId: 'up-appt-room-admin' })
  crApptRoomCustomerForm?: (UseFormReturn<CreateCustomerAppointmentType> & { formId: 'cr-appt-room-customer' })
  upApptRoomCustomerForm?: (UseFormReturn<UpdateCustomerAppointmentType> & { formId: 'up-appt-room-customer' })
}

export function RoomTableDialog({
  crApptRoomAdminForm,
  upApptRoomAdminForm,
  crApptRoomCustomerForm,
  upApptRoomCustomerForm,
}: RoomTableDialogProps) {
  const {
    roomsList,
    updateRoomsList,
    isPendingFetchData,
    startTransitionFetchData,
    refreshData,
    handleRefreshData,
  } = useRooms()

  const [selectedItems, setSelectedItems] = useState<
    RoomMapperToListLookupType[]
  >([])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 800)

  const [offset, setOffset] = useState(DEFAULT_OFFSET)
  const [ref, inView] = useInView()
  const [hasMoreData, setHasMoreData] = useState(true)

  const previousSearchRef = useRef(debouncedSearch)

  async function refreshDataFn() {
    handleRefreshData()
    setOffset(DEFAULT_OFFSET)
    setHasMoreData(true)
  }

  const fetchMore = useCallback(async () => {
    if (!hasMoreData) return

    const next = offset + DEFAULT_LIMIT

    const responseData = await fetchRecentRoomsQuery({
      offset: next,
      limit: DEFAULT_LIMIT,
      filterBy: 'name',
      search: debouncedSearch.toLowerCase(),
    })

    const mappedSedGenericLookup = responseData?.rooms?.map(
      RoomMapper.toListLookup,
    ) ?? []

    if (responseData?.rooms?.length) {
      setOffset(next)
      updateRoomsList([...roomsList, ...mappedSedGenericLookup])
    }

    if (responseData?.rooms?.length === 0) {
      setHasMoreData(false)
    }
  }, [hasMoreData, offset, debouncedSearch, updateRoomsList, roomsList])

  useEffect(() => {
    async function fetchData() {
      const searchChanged = previousSearchRef.current !== debouncedSearch

      if (searchChanged) {
        previousSearchRef.current = debouncedSearch
        setOffset(DEFAULT_OFFSET)
        setHasMoreData(true)
      }

      const responseData = await fetchRecentRoomsQuery({
        offset: 0,
        limit: DEFAULT_LIMIT,
        filterBy: 'name',
        search: debouncedSearch.toLowerCase(),
      })

      const mappedSedGenericLookup = responseData?.rooms?.map(
        RoomMapper.toListLookup,
      ) ?? []

      updateRoomsList(mappedSedGenericLookup)
    }

    startTransitionFetchData(() => {
      fetchData()
    })
  }, [refreshData, startTransitionFetchData, updateRoomsList, debouncedSearch])

  useEffect(() => {
    if (inView && hasMoreData) {
      const loadMore = async () => {
        await fetchMore()
      }
      loadMore()
    }
  }, [inView, fetchMore, hasMoreData])

  function confirmSelection() {
    if (selectedItems.length > 0) {
      const selectedItem = selectedItems[0]

      switch (crApptRoomAdminForm?.formId) {
        case 'cr-appt-room-admin':
          crApptRoomAdminForm.setValue('roomId', selectedItem.roomId)
          crApptRoomAdminForm.clearErrors('roomId')

          crApptRoomAdminForm.setValue('roomName', selectedItem.name)
          crApptRoomAdminForm.clearErrors('roomName')

          crApptRoomAdminForm.setValue('startAndEndTime', `${selectedItem.startTime} - ${selectedItem.endTime}`)
          crApptRoomAdminForm.clearErrors('startAndEndTime')

          crApptRoomAdminForm.setValue('slotDuration', formatSlotDuration(selectedItem.slotDuration))
          crApptRoomAdminForm.clearErrors('slotDuration')
      }
      switch (upApptRoomAdminForm?.formId) {
        case 'up-appt-room-admin':
          upApptRoomAdminForm.setValue('roomId', selectedItem.roomId)
          upApptRoomAdminForm.clearErrors('roomId')

          upApptRoomAdminForm.setValue('roomName', selectedItem.name)
          upApptRoomAdminForm.clearErrors('roomName')

          upApptRoomAdminForm.setValue('startAndEndTime', `${selectedItem.startTime} - ${selectedItem.endTime}`)
          upApptRoomAdminForm.clearErrors('startAndEndTime')

          upApptRoomAdminForm.setValue('slotDuration', formatSlotDuration(selectedItem.slotDuration))
          upApptRoomAdminForm.clearErrors('slotDuration')

          break
      }

      switch (crApptRoomCustomerForm?.formId) {
        case 'cr-appt-room-customer':
          crApptRoomCustomerForm.setValue('roomId', selectedItem.roomId)
          crApptRoomCustomerForm.clearErrors('roomId')

          crApptRoomCustomerForm.setValue('roomName', selectedItem.name)
          crApptRoomCustomerForm.clearErrors('roomName')

          crApptRoomCustomerForm.setValue('startAndEndTime', `${selectedItem.startTime} - ${selectedItem.endTime}`)
          crApptRoomCustomerForm.clearErrors('startAndEndTime')

          crApptRoomCustomerForm.setValue('slotDuration', formatSlotDuration(selectedItem.slotDuration))
          crApptRoomCustomerForm.clearErrors('slotDuration')

          break
      }

      switch (upApptRoomCustomerForm?.formId) {
        case 'up-appt-room-customer':
          upApptRoomCustomerForm.setValue('roomId', selectedItem.roomId)
          upApptRoomCustomerForm.clearErrors('roomId')

          upApptRoomCustomerForm.setValue('roomName', selectedItem.name)
          upApptRoomCustomerForm.clearErrors('roomName')

          upApptRoomCustomerForm.setValue('startAndEndTime', `${selectedItem.startTime} - ${selectedItem.endTime}`)
          upApptRoomCustomerForm.clearErrors('startAndEndTime')

          upApptRoomCustomerForm.setValue('slotDuration', formatSlotDuration(selectedItem.slotDuration))
          upApptRoomCustomerForm.clearErrors('slotDuration')

          break
      }
    }
  }

  return (
    <div className="size-full">
      <div className="my-2 flex flex-col items-start gap-2">
        <div className="flex w-full flex-row items-center justify-center gap-1">
          <Input.Root className="flex h-9 w-full min-w-[70px] items-center">
            <SearchIcon className="ml-2 size-4 shrink-0 text-muted-foreground" />

            <Input.Content
              placeholder="Pesquisar por N° da sala..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            // disabled={isPendingFetchData}
            />
            {search.length > 0 && (
              <X
                className="mx-2 size-4 bg-transparent text-muted-foreground hover:cursor-pointer hover:text-zinc-900"
                onClick={() => setSearch('')}
              />
            )}
          </Input.Root>

          <div className="flex items-center gap-2">
            <Button
              aria-label="Atualizar dados"
              variant="outline"
              className="h-9"
              onClick={() => {
                startTransitionFetchData(() => {
                  refreshDataFn()
                })
              }}
              disabled={isPendingFetchData}
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
                disabled={isPendingFetchData}
                onClick={confirmSelection}
              >
                <CheckCircle className="size-4 sm:mr-2" />
                <span className="hidden sm:block">Confirmar</span>
              </Button>
            </DialogClose>
          </div>
        </div>
        {isPendingFetchData ? (
          <SkeletonRoomLookupTable />
        ) : (
          <TableWrapper className="max-h-[74vh] min-h-[70vh] rounded-t-lg border-2">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                <TableRow>
                  <TableHead colSpan={5} className="table-cell whitespace-nowrap text-sm font-semibold lg:hidden">
                    Salas
                  </TableHead>
                  <TableHead className="hidden w-[50px] lg:table-cell" />
                  <TableHead className="hidden  text-sm font-semibold lg:table-cell">
                    N° da Sala
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Horário de início
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Horário de final
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Bloco de duração
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                {roomsList?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex h-24 items-center justify-center gap-2">
                        Nenhum registro encontrado
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {roomsList?.length > 0 &&
                  roomsList.map((item) => (
                    <TableRow
                      key={item.roomId}
                      data-checked={selectedItems?.some(
                        (value) => value.roomId === item.roomId,
                      )}
                      className="cursor-pointer data-[checked=true]:bg-primary/10 data-[checked=true]:hover:bg-primary/15"
                      onClick={() => {
                        setSelectedItems([item])
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some(
                            (value) => value.roomId === item.roomId,
                          )}
                          onCheckedChange={(checked) => {
                            setSelectedItems(checked ? [item] : [])
                          }}
                        />
                      </TableCell>
                      <TableCell className="table-cell lg:hidden">
                        <div className="py-2">
                          <div>
                            <span className="text-muted-foreground">
                              Nome:
                            </span>{' '}
                            {item.name}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Horário de início:
                            </span>{' '}
                            {formatTime(item.startTime)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Horário de final:
                            </span>{' '}
                            {formatTime(item.endTime)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Bloco de duração:
                            </span>{' '}
                            {formatSlotDuration(item.slotDuration)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.name}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {formatTime(item.startTime)}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {formatTime(item.endTime)}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {formatSlotDuration(item.slotDuration)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {hasMoreData && (
              <div className="flex h-24 w-full items-center justify-center">
                <Loader2Icon
                  ref={ref}
                  className={cn('size-8 animate-spin')}
                  strokeWidth={2}
                />
              </div>
            )}
          </TableWrapper>
        )}
      </div>
    </div>
  )
}
