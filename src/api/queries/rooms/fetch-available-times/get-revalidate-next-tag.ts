export function getTagFetchAvailableTimes({ roomId, date }: { roomId: string, date: string }) {
  return `get:room:${roomId}:available-times?dateTime=${date}`
}
