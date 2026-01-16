export function getTagFetchRecentCustomersQuery({
  queryParams,
}: {
  queryParams: string
}) {
  return `fetch:customers{${queryParams}`
}
