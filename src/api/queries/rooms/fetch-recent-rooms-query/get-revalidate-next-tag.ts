export function getTagFetchRecentRoomsQuery({
  queryParams,
}: {
  queryParams: string
}) {
  return `fetch:rooms{${queryParams}`
}
