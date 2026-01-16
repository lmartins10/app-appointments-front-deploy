export function getTagFetchRecentLogsQuery({
  queryParams,
}: {
  queryParams: string
}) {
  return `fetch:logs{${queryParams}`
}
