'use client'

import { RoomMapperToListAvailableTimesType, RoomMapperToListLookupType } from '@/mappers/room-mapper'
import {
  createContext,
  TransitionStartFunction,
  useCallback,
  useContext,
  useState,
  useTransition,
} from 'react'

type RoomContextType = {
  startTransitionFetchData: TransitionStartFunction
  isPendingFetchData: boolean
  openFilters: boolean
  hasMoreData: boolean
  roomsList: RoomMapperToListLookupType[]
  availableTimesRoomsList: RoomMapperToListAvailableTimesType[]

  refreshData: boolean

  updateRoomsList: (
    roomsList: RoomContextType['roomsList'],
  ) => void

  updateAvailableTimesRoomsList: (
    availableTimesRoomsList: RoomContextType['availableTimesRoomsList'],
  ) => void

  handleToggleFilters: () => void
  updateHasMoreData: (value: boolean) => void

  handleRefreshData: () => void
}

const RoomContext = createContext<RoomContextType>(
  {} as RoomContextType,
)

export const RoomsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isPendingFetchData, startTransitionFetchData] = useTransition()
  const [openFilters, setOpenFilters] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)
  const [refreshData, setRefreshData] = useState(false)

  const [roomsList, setsRoomList] = useState<
    RoomContextType['roomsList']
  >([])

  const [availableTimesRoomsList, setsAvailableTimesRoomsList] = useState<
    RoomContextType['availableTimesRoomsList']
  >([])

  function handleToggleFilters() {
    setOpenFilters((prev) => !prev)
  }

  const updateRoomsList = useCallback(
    (roomsList: RoomContextType['roomsList']) => {
      setsRoomList(roomsList)
    },
    [],
  )

  const updateAvailableTimesRoomsList = useCallback(
    (availableTimesRoomsList: RoomContextType['availableTimesRoomsList']) => {
      setsAvailableTimesRoomsList(availableTimesRoomsList)
    },
    [],
  )

  const updateHasMoreData = useCallback(
    (value: RoomContextType['hasMoreData']) => {
      setHasMoreData(value)
    },
    [],
  )

  const handleRefreshData = () => {
    setRefreshData(!refreshData)
  }

  return (
    <RoomContext.Provider
      value={{
        roomsList,
        updateRoomsList,
        availableTimesRoomsList,
        updateAvailableTimesRoomsList,

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
    </RoomContext.Provider>
  )
}

export const useRooms = () => {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error('RoomsContext must be used within a RoomProvider')
  }

  const {
    roomsList,
    updateRoomsList,
    availableTimesRoomsList,
    updateAvailableTimesRoomsList,

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
    roomsList,
    updateRoomsList,
    availableTimesRoomsList,
    updateAvailableTimesRoomsList,

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
