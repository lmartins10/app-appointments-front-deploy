'use client'

import { fetchRecentCustomersQuery } from '@/api/queries/customers/fetch-recent-customers-query'
import { CreateAdminAppointmentType } from '@/app/admin/(private-routes)/appointments/_components/tabs/schema'
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
import { useCustomers } from '@/contexts/customers-context'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { normalizeCepNumber } from '@/lib/utils/masks'
import { CustomerMapper, CustomerMapperToListLookupType } from '@/mappers/customer-mapper'
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
import { SkeletonCustomersLookupTable } from './customers-skeleton-table'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20

interface CustomersTableDialogProps {
  form: (UseFormReturn<CreateAdminAppointmentType> & { formId: 'dlg-customer-create-form' })
}

export function CustomersTableDialog({ form }: CustomersTableDialogProps) {
  const {
    customersList,
    updateCustomersList,
    isPendingFetchData,
    startTransitionFetchData,
    refreshData,
    handleRefreshData,
  } = useCustomers()

  const [selectedItems, setSelectedItems] = useState<
    CustomerMapperToListLookupType[]
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

    const responseData = await fetchRecentCustomersQuery({
      offset: next,
      limit: DEFAULT_LIMIT,
      filterBy: 'customerUserLink.user.name',
      search: debouncedSearch.toLowerCase(),
      status: 'active',
    })

    const mappedDataLookup = responseData?.customers?.map(
      CustomerMapper.toTable,
    ) ?? []

    if (responseData?.customers?.length) {
      setOffset(next)
      updateCustomersList([...customersList, ...mappedDataLookup])
    }

    if (responseData?.customers?.length === 0) {
      setHasMoreData(false)
    }
  }, [hasMoreData, offset, debouncedSearch, updateCustomersList, customersList])

  useEffect(() => {
    async function fetchData() {
      const searchChanged = previousSearchRef.current !== debouncedSearch

      if (searchChanged) {
        previousSearchRef.current = debouncedSearch
        setOffset(DEFAULT_OFFSET)
        setHasMoreData(true)
      }

      const responseData = await fetchRecentCustomersQuery({
        offset: 0,
        limit: DEFAULT_LIMIT,
        filterBy: 'customerUserLink.user.name',
        search: debouncedSearch.toLowerCase(),
        status: 'active',
      })

      const mappedDataLookup = responseData?.customers?.map(
        CustomerMapper.toTable,
      ) ?? []

      updateCustomersList(mappedDataLookup)
    }

    startTransitionFetchData(() => {
      fetchData()
    })
  }, [refreshData, startTransitionFetchData, updateCustomersList, debouncedSearch])

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

      switch (form.formId) {
        case 'dlg-customer-create-form':
          form.setValue('customerId', selectedItem.customerId)
          form.clearErrors('customerId')

          form.setValue('userId', selectedItem.userId)
          form.clearErrors('userId')

          form.setValue('name', selectedItem.name)
          form.clearErrors('name')

          form.setValue('lastName', selectedItem.lastName)
          form.clearErrors('lastName')

          form.setValue('email', selectedItem.email)
          form.clearErrors('email')

          form.setValue('zipCode', selectedItem.zipCode)
          form.clearErrors('zipCode')

          form.setValue('address', selectedItem.address)
          form.clearErrors('address')

          form.setValue('number', selectedItem.number)
          form.clearErrors('number')

          form.setValue('complement', selectedItem.complement ?? '')
          form.clearErrors('complement')

          form.setValue('neighborhood', selectedItem.neighborhood)
          form.clearErrors('neighborhood')

          form.setValue('city', selectedItem.city)
          form.clearErrors('city')

          form.setValue('state', selectedItem.state)
          form.clearErrors('state')

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
              placeholder="Pesquisar por nome..."
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
          <SkeletonCustomersLookupTable />
        ) : (
          <TableWrapper className="max-h-[74vh] min-h-[70vh] rounded-t-lg border-2">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                <TableRow>
                  <TableHead colSpan={5} className="table-cell whitespace-nowrap text-sm font-semibold lg:hidden">
                    Clientes
                  </TableHead>
                  <TableHead className="hidden w-[50px] lg:table-cell" />
                  <TableHead className="hidden  text-sm font-semibold lg:table-cell">
                    Nome
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    E-mail
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Cep
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Endereço
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Complemento
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Bairro
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Cidade
                  </TableHead>
                  <TableHead className="hidden text-sm font-semibold lg:table-cell">
                    Estado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                {customersList?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="flex h-24 items-center justify-center gap-2">
                        Nenhum registro encontrado
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {customersList?.length > 0 &&
                  customersList.map((item) => (
                    <TableRow
                      key={item.customerId}
                      data-checked={selectedItems?.some(
                        (value) => value.customerId === item.customerId,
                      )}
                      className="cursor-pointer data-[checked=true]:bg-primary/10 data-[checked=true]:hover:bg-primary/15"
                      onClick={() => {
                        setSelectedItems([item])
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some(
                            (value) => value.customerId === item.customerId,
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
                            {item.fullName}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              E-mail:
                            </span>{' '}
                            {item.email}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Cep:
                            </span>{' '}
                            {normalizeCepNumber(item.zipCode)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Endereço:
                            </span>{' '}
                            {item.address}, {item.number}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Complemento:
                            </span>{' '}
                            {item.complement ?? null}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Bairro:
                            </span>{' '}
                            {item.neighborhood}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Cidade:
                            </span>{' '}
                            {item.city}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Estado:
                            </span>{' '}
                            {item.state}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.fullName}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.email}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {normalizeCepNumber(item.zipCode)}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.address}, {item.number}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.complement ?? null}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.neighborhood}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.city}
                      </TableCell>
                      <TableCell className="hidden text-sm lg:table-cell">
                        {item.state}
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
