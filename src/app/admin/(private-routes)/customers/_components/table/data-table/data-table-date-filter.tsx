'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { normalizeDateYY } from '@/lib/utils/masks/normalize-date'
import { Column } from '@tanstack/react-table'
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  setDefaultOptions,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDaysIcon, X } from 'lucide-react'
import * as React from 'react'
import { DateRange, SelectRangeEventHandler } from 'react-day-picker'

interface DataTableDateFilterProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  column?: Column<TData, TValue>
  disabled?: boolean
}

export function DataTableDateFilter<TData, TValue>({
  id,
  column,
  label,
  className,
  disabled = false,
}: DataTableDateFilterProps<TData, TValue>) {
  setDefaultOptions({ locale: ptBR })
  const [selectedRange, setSelectedRange] = React.useState<DateRange>()
  const columnFilterValue = column?.getFilterValue() as
    | { range: [string, string] }
    | undefined

  const columnFilterValueRange = columnFilterValue?.range

  const fromValue = (columnFilterValueRange as [string, string])?.[0] ?? ''
  const toValue = (columnFilterValueRange as [string, string])?.[1] ?? ''

  const setFromValue = (value: string) => {
    column?.setFilterValue((old: { range: [string, string] }) => {
      return { range: [value, old?.range[1]] }
    })
  }

  const setToValue = (value: string) => {
    column?.setFilterValue((old: { range: [string, string] }) => {
      return { range: [old?.range[0], value] }
    })
  }

  const handleFromChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = normalizeDateYY(e.target.value)
    setFromValue(value)
    const date = parse(value, 'dd/MM/yy', new Date())
    if (!isValid(date) || value.length !== 8) {
      if (value.length === 8) setFromValue('')

      setToValue('')
      return setSelectedRange({ from: undefined, to: undefined })
    }
    if (selectedRange?.to && isAfter(date, selectedRange.to)) {
      setFromValue(format(selectedRange.to, 'dd/MM/yy'))
      setToValue(value)
      setSelectedRange({ from: selectedRange.to, to: date })
    } else {
      setSelectedRange({ from: date, to: selectedRange?.to })
    }
  }

  const handleToChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = normalizeDateYY(e.target.value)
    setToValue(value)

    const date = parse(value, 'dd/MM/yy', new Date())

    if (!isValid(date) || value.length !== 8) {
      if (value.length === 8) setToValue('')
      return setSelectedRange({ from: selectedRange?.from, to: undefined })
    }
    if (selectedRange?.from && isBefore(date, selectedRange.from)) {
      setToValue(format(selectedRange.from, 'dd/MM/yy'))
      setFromValue(value)
      setSelectedRange({ from: date, to: selectedRange.from })
    } else {
      setSelectedRange({ from: selectedRange?.from, to: date })
    }
  }

  const handleRangeSelect: SelectRangeEventHandler = (
    range: DateRange | undefined,
  ) => {
    setSelectedRange(range)
    if (range?.from) {
      setFromValue(format(range.from, 'dd/MM/yy'))
    } else {
      setFromValue('')
    }
    if (range?.to) {
      setToValue(format(range.to, 'dd/MM/yy'))
    } else {
      setToValue('')
    }
  }

  const clearDate = () => {
    setSelectedRange(undefined)
    setFromValue('')
    setToValue('')
    column?.setFilterValue(undefined)
  }

  function selectedPresetValue(preset: string | number) {
    const today = new Date()

    switch (preset) {
      case 'today': {
        setFromValue(format(new Date(), 'dd/MM/yy'))
        setToValue(format(new Date(), 'dd/MM/yy'))
        return {
          from: new Date(),
          to: new Date(),
        }
      }
      case 'last7Days': {
        setFromValue(format(subDays(new Date(), 6), 'dd/MM/yy'))
        setToValue(format(new Date(), 'dd/MM/yy'))
        return {
          from: subDays(new Date(), 6),
          to: new Date(),
        }
      }
      case 'last30Days': {
        setFromValue(format(subDays(new Date(), 29), 'dd/MM/yy'))
        setToValue(format(new Date(), 'dd/MM/yy'))
        return {
          from: subDays(new Date(), 29),
          to: new Date(),
        }
      }
      case 'last365days': {
        setFromValue(format(subDays(new Date(), 364), 'dd/MM/yy'))
        setToValue(format(new Date(), 'dd/MM/yy'))
        return {
          from: subDays(new Date(), 364),
          to: new Date(),
        }
      }
      case 'currentWeek': {
        setFromValue(format(startOfWeek(new Date()), 'dd/MM/yy'))
        setToValue(format(addDays(startOfWeek(new Date()), 6), 'dd/MM/yy'))
        return {
          from: startOfWeek(new Date()),
          to: addDays(startOfWeek(new Date()), 6),
        }
      }
      case 'currentMonth': {
        const dayStartOfMonth = startOfMonth(today)
        const dayEndOfMonth = endOfMonth(today)

        setFromValue(format(dayStartOfMonth, 'dd/MM/yy'))
        setToValue(format(dayEndOfMonth, 'dd/MM/yy'))
        return {
          from: dayStartOfMonth,
          to: dayEndOfMonth,
        }
      }
      case 'currentYear': {
        const dayStartOfYear = startOfYear(today)
        const dayEndOfYear = endOfYear(today)
        setFromValue(format(dayStartOfYear, 'dd/MM/yy'))
        setToValue(format(dayEndOfYear, 'dd/MM/yy'))
        return {
          from: dayStartOfYear,
          to: dayEndOfYear,
        }
      }
      default:
        return undefined
    }
  }

  React.useEffect(() => {
    if (selectedRange && !fromValue && !toValue) {
      setSelectedRange(undefined)
    }
  }, [selectedRange, fromValue, toValue])

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            className={cn(
              'flex w-full justify-start border-dashed',
              !selectedRange && 'text-muted-foreground',
            )}
            variant="outline"
            size="sm"
            disabled={disabled}
          >
            <CalendarDaysIcon className="mr-1 size-4" />
            <span className="mr-1">{label}</span>
            {selectedRange?.from ? (
              selectedRange.to ? (
                <span className="font-normal">
                  {format(selectedRange.from, 'dd/MM/yy')} -{' '}
                  {format(selectedRange.to, 'dd/MM/yy')}
                </span>
              ) : (
                <span className="font-normal">
                  {format(selectedRange.from, 'dd/MM/yy')}
                </span>
              )
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="-mt-1 w-auto flex-col space-y-2 p-2"
          align="end"
        >
          <Select
            onValueChange={(value) =>
              setSelectedRange(selectedPresetValue(value))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione um período..." />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="last7Days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30Days">Últimos 30 dias</SelectItem>
              <SelectItem value="last365Days">Últimos 365 dias</SelectItem>
              <SelectItem value="currentWeek">Semana atual</SelectItem>
              <SelectItem value="currentMonth">Mês atual</SelectItem>
              <SelectItem value="currentYear">Ano atual</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={new Date()}
              selected={selectedRange}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
            />
          </div>
          <div className="flex gap-2 text-sm">
            <label className="flex flex-1 items-center gap-1">
              De:
              <Input.Root className="w-full lg:h-8">
                <Input.Content
                  placeholder="dd/mm/aa"
                  value={fromValue}
                  onChange={handleFromChange}
                  className="rounded bg-white px-3"
                />
              </Input.Root>
            </label>
            <label className="flex flex-1 items-center gap-1">
              Até:
              <Input.Root className="w-full lg:h-8">
                <Input.Content
                  placeholder="dd/mm/aa"
                  value={toValue}
                  onChange={handleToChange}
                  className="rounded bg-white px-3"
                />
              </Input.Root>
            </label>
          </div>
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={clearDate}
          >
            Limpar
            <X className="ml-1 size-4" />
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
