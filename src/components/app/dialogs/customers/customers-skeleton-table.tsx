import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from '@/components/ui/table'

export function SkeletonCustomersLookupTable() {
  const items = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
  }))

  return (
    <TableWrapper className="max-h-[74vh] min-h-[70vh] rounded-t-lg border-2">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
          <TableRow>
            <TableHead colSpan={3} className="table-cell whitespace-nowrap text-sm font-semibold lg:hidden">
              <Skeleton className="h-5 w-20" />
            </TableHead>
            <TableHead className="hidden w-[50px] lg:table-cell">
              <Skeleton className="h-5 w-8" />
            </TableHead>
            <TableHead className="hidden text-sm font-semibold lg:table-cell">
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead className="hidden text-sm font-semibold lg:table-cell">
              <Skeleton className="h-5 w-32" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {items.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="size-4 rounded" />
              </TableCell>

              <TableCell className="table-cell lg:hidden">
                <div className="py-2">
                  <div className="mb-2">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden text-sm lg:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="hidden text-sm lg:table-cell">
                <Skeleton className="h-4 w-44" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  )
}
