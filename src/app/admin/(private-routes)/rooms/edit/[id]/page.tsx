import { getRoomById } from '@/api/queries/rooms/get-room-by-id'
import { AdminContentLayout } from '@/components/app/portals/admin/content-layout'
import { Card, CardContent } from '@/components/ui/card'
import { RoomMapper } from '@/mappers/room-mapper'
import { AppointmentRoomForm } from '../../_components/form'

interface RoomEditPageProps {
  params: Promise<{ id: string }>
}

export default async function RoomEditPage({ params }: RoomEditPageProps) {
  const { id } = await params

  const roomResponse = await getRoomById({ id })

  if (!roomResponse?.room) {
    console.error('Room not found', roomResponse)

    return (
      <AdminContentLayout title="Editar sala" description="Realize a edição da sala">
        <section className="flex h-[calc(100vh-10rem)] items-start justify-center">
          <Card className="w-[448px]">
            <CardContent>Sala não encontrada</CardContent>
          </Card>
        </section>
      </AdminContentLayout>
    )
  }

  const mappedData = RoomMapper.toView(roomResponse.room)

  return (
    <AdminContentLayout title="Editar sala" description="Realize a edição da sala">
      <section className="flex h-[calc(100vh-10rem)] items-start justify-center">
        <Card className="w-[448px]">
          <CardContent>
            <AppointmentRoomForm data={mappedData} />
          </CardContent>
        </Card>
      </section>
    </AdminContentLayout>
  )
}
