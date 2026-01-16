import { CustomersProvider } from '@/contexts/customers-context'
import { RoomsProvider } from '@/contexts/rooms-context'

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomersProvider>
      <RoomsProvider>
        {children}
      </RoomsProvider>
    </CustomersProvider>
  )
}
