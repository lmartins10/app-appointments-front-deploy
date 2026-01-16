export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
  count?: number
}

export interface DataTableFilterField<TData> {
  label: string
  type: 'faceted' | 'search' | 'date'
  value: keyof TData | 'search'
  placeholder?: string
  onlyOnColumn?: boolean
  options?: Option[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData | 'search'
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}
