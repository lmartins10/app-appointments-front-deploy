export function getTagFetchRecentAppointmentsQuery({
  queryParams,
}: {
  queryParams: string
}) {
  return `fetch:appointments{${queryParams}`
}
