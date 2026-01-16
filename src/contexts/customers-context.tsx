'use client'

import { CustomerMapperToListLookupType } from '@/mappers/customer-mapper'
import {
  createContext,
  TransitionStartFunction,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react'

type CustomersContextType = {
  startTransitionFetchData: TransitionStartFunction
  isPendingFetchData: boolean
  openFilters: boolean
  hasMoreData: boolean
  customersList: CustomerMapperToListLookupType[]

  refreshData: boolean

  updateCustomersList: (
    customersList: CustomersContextType['customersList'],
  ) => void

  handleToggleFilters: () => void
  updateHasMoreData: (value: boolean) => void

  handleRefreshData: () => void
}

const CustomersContext = createContext<CustomersContextType>(
  {} as CustomersContextType,
)

export const CustomersProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isPendingFetchData, startTransitionFetchData] = useTransition()
  const [openFilters, setOpenFilters] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)
  const [refreshData, setRefreshData] = useState(false)

  const [customersList, setCustomersList] = useState<
    CustomersContextType['customersList']
  >([])

  function handleToggleFilters() {
    setOpenFilters((prev) => !prev)
  }

  const updateCustomersList = useCallback(
    (customersList: CustomersContextType['customersList']) => {
      setCustomersList(customersList)
    },
    [],
  )

  const updateHasMoreData = useCallback(
    (value: CustomersContextType['hasMoreData']) => {
      setHasMoreData(value)
    },
    [],
  )

  const handleRefreshData = () => {
    setRefreshData(!refreshData)
  }

  return (
    <CustomersContext.Provider
      value={{
        customersList,
        updateCustomersList,

        isPendingFetchData,
        startTransitionFetchData,
        openFilters,
        handleToggleFilters,
        hasMoreData,
        updateHasMoreData,
        refreshData,
        handleRefreshData,
      }}
    >
      {children}
    </CustomersContext.Provider>
  )
}

export const useCustomers = () => {
  const context = useContext(CustomersContext)

  if (!context) {
    throw new Error('CustomersContext must be used within a CustomersProvider')
  }

  const {
    customersList,
    updateCustomersList,

    isPendingFetchData,
    startTransitionFetchData,
    openFilters,
    handleToggleFilters,
    hasMoreData,
    updateHasMoreData,
    refreshData,
    handleRefreshData,
  } = context

  return {
    customersList,
    updateCustomersList,

    isPendingFetchData,
    startTransitionFetchData,
    openFilters,
    handleToggleFilters,
    hasMoreData,
    updateHasMoreData,
    refreshData,
    handleRefreshData,
  }
}
