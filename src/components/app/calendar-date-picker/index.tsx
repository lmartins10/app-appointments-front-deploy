/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import { cva, VariantProps } from 'class-variance-authority'
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns'
import { formatInTimeZone, toDate } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange, Matcher } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { normalizeDateYYYY } from '@/lib/utils/masks'

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const multiSelectVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-primary hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface CalendarDatePickerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof multiSelectVariants> {
  id?: string
  className?: string
  date: DateRange
  closeOnSelect?: boolean
  numberOfMonths?: 1 | 2
  yearsRange?: number
  onDateSelect: (range: {
    from: Date | undefined
    to: Date | undefined
  }) => void
  hasError?: boolean
  disabled?: boolean
  calendarDisabled?: Matcher | Matcher[] | undefined
}

export const CalendarDatePicker = React.forwardRef<
  HTMLButtonElement,
  CalendarDatePickerProps
>(
  (
    {
      id = 'calendar-date-picker',
      className,
      date,
      closeOnSelect = false,
      numberOfMonths = 2,
      yearsRange = 200,
      onDateSelect,
      variant,
      hasError,
      disabled,
      calendarDisabled,
      ...props
    },
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [selectedRange, setSelectedRange] = React.useState<string | null>(
      numberOfMonths === 2 ? 'Este ano' : 'Hoje',
    )
    const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(
      new Date(),
    )
    const [yearFrom, setYearFrom] = React.useState<number | undefined>(
      new Date().getFullYear(),
    )
    const [monthTo, setMonthTo] = React.useState<Date | undefined>(
      numberOfMonths === 2 ? date?.to : date?.from,
    )
    const [yearTo, setYearTo] = React.useState<number | undefined>(
      numberOfMonths === 2
        ? date?.to?.getFullYear()
        : date?.from?.getFullYear(),
    )
    const [highlightedPart, setHighlightedPart] = React.useState<string | null>(
      null,
    )

    const [inputValue, setInputValue] = React.useState<string | undefined>(
      date?.from && isValid(date.from) ? format(date.from, 'dd/MM/yyyy') : undefined,
    )

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const handleClose = () => setIsPopoverOpen(false)

    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev)

    const selectDateRange = (from: Date, to: Date, range: string) => {
      const startDate = startOfDay(toDate(from, { timeZone }))
      const endDate =
        numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate
      onDateSelect({ from: startDate, to: endDate })
      setSelectedRange(range)
      setMonthFrom(from)
      setYearFrom(from.getFullYear())
      setMonthTo(to)
      setYearTo(to.getFullYear())
      closeOnSelect && setIsPopoverOpen(false)
    }

    const handleInputValueChange: React.ChangeEventHandler<HTMLInputElement> = (
      e,
    ) => {
      const value = normalizeDateYYYY(e.target.value)
      setInputValue(value)
      const date = parse(value, 'dd/MM/yyyy', new Date())
      if (!isValid(date) || value.length !== 10) {
        if (value.length === 10) setInputValue('')

        return onDateSelect({ from: undefined, to: undefined })
      }

      onDateSelect({ from: date, to: date })
      setMonthFrom(date)
      setYearFrom(date.getFullYear())
    }

    const handleClear = () => {
      setInputValue('')
      onDateSelect({ from: undefined, to: undefined })
    }

    const handleDateSelect = (range: DateRange | undefined) => {
      if (range) {
        let from = startOfDay(toDate(range.from as Date, { timeZone }))
        let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from
        if (numberOfMonths === 1) {
          if (range.from !== date.from) {
            to = from
          } else {
            from = startOfDay(toDate(range.to as Date, { timeZone }))
          }
        }
        onDateSelect({ from, to })
        setInputValue(isValid(from) ? format(from, 'dd/MM/yyyy') : undefined)
        setMonthFrom(from)
        setYearFrom(from.getFullYear())
        setMonthTo(to)
        setYearTo(to.getFullYear())
      }
      setSelectedRange(null)
    }

    const handleMonthChange = (newMonthIndex: number, part: string) => {
      setSelectedRange(null)
      if (part === 'from') {
        if (yearFrom !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return
          const newMonth = new Date(yearFrom, newMonthIndex, 1)
          const from =
            numberOfMonths === 2
              ? startOfMonth(toDate(newMonth, { timeZone }))
              : date?.from
                ? new Date(
                  date.from.getFullYear(),
                  newMonth.getMonth(),
                  date.from.getDate(),
                )
                : newMonth
          const to =
            numberOfMonths === 2
              ? date.to
                ? endOfDay(toDate(date.to, { timeZone }))
                : endOfMonth(toDate(newMonth, { timeZone }))
              : from
          if (from <= to) {
            onDateSelect({ from, to })
            setMonthFrom(newMonth)
            setMonthTo(date.to)
          }
        }
      } else {
        if (yearTo !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return
          const newMonth = new Date(yearTo, newMonthIndex, 1)
          const from = date.from
            ? startOfDay(toDate(date.from, { timeZone }))
            : startOfMonth(toDate(newMonth, { timeZone }))
          const to =
            numberOfMonths === 2
              ? endOfMonth(toDate(newMonth, { timeZone }))
              : from
          if (from <= to) {
            onDateSelect({ from, to })
            setMonthTo(newMonth)
            setMonthFrom(date.from)
          }
        }
      }
    }

    const handleYearChange = (newYear: number, part: string) => {
      setSelectedRange(null)
      if (part === 'from') {
        if (years.includes(newYear)) {
          const newMonth = monthFrom
            ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1)
            : new Date(newYear, 0, 1)
          const from =
            numberOfMonths === 2
              ? startOfMonth(toDate(newMonth, { timeZone }))
              : date.from
                ? new Date(newYear, newMonth.getMonth(), date.from.getDate())
                : newMonth
          const to =
            numberOfMonths === 2
              ? date.to
                ? endOfDay(toDate(date.to, { timeZone }))
                : endOfMonth(toDate(newMonth, { timeZone }))
              : from
          if (from <= to) {
            onDateSelect({ from, to })
            setYearFrom(newYear)
            setMonthFrom(newMonth)
            setYearTo(date.to?.getFullYear())
            setMonthTo(date.to)
          }
        }
      } else {
        if (years.includes(newYear)) {
          const newMonth = monthTo
            ? new Date(newYear, monthTo.getMonth(), 1)
            : new Date(newYear, 0, 1)
          const from = date.from
            ? startOfDay(toDate(date.from, { timeZone }))
            : startOfMonth(toDate(newMonth, { timeZone }))
          const to =
            numberOfMonths === 2
              ? endOfMonth(toDate(newMonth, { timeZone }))
              : from
          if (from <= to) {
            onDateSelect({ from, to })
            setYearTo(newYear)
            setMonthTo(newMonth)
            setYearFrom(date.from?.getFullYear())
            setMonthFrom(date.from)
          }
        }
      }
    }

    const today = new Date()

    const years = Array.from(
      { length: yearsRange + 1 },
      (_, i) => today.getFullYear() - yearsRange / 2 + i,
    )

    const dateRanges = [
      { label: 'Hoje', start: today, end: today },
      { label: 'Ontem', start: subDays(today, 1), end: subDays(today, 1) },
      {
        label: 'Esta semana',
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      },
      {
        label: 'Semana passada',
        start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
        end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
      },
      { label: 'Últimos 7 dias', start: subDays(today, 6), end: today },
      {
        label: 'Este mês',
        start: startOfMonth(today),
        end: endOfMonth(today),
      },
      {
        label: 'Último mês',
        start: startOfMonth(subDays(today, today.getDate())),
        end: endOfMonth(subDays(today, today.getDate())),
      },
      { label: 'Este ano', start: startOfYear(today), end: endOfYear(today) },
      {
        label: 'Último ano',
        start: startOfYear(subDays(today, 365)),
        end: endOfYear(subDays(today, 365)),
      },
    ]

    const handleMouseOver = (part: string) => {
      setHighlightedPart(part)
    }

    const handleMouseLeave = () => {
      setHighlightedPart(null)
    }

    const handleWheel = (event: React.WheelEvent, part: string) => {
      event.preventDefault()
      setSelectedRange(null)
      if (highlightedPart === 'firstDay') {
        const newDate = new Date(date.from as Date)
        const increment = event.deltaY > 0 ? -1 : 1
        newDate.setDate(newDate.getDate() + increment)
        if (newDate <= (date.to as Date)) {
          numberOfMonths === 2
            ? onDateSelect({ from: newDate, to: new Date(date.to as Date) })
            : onDateSelect({ from: newDate, to: newDate })
          setMonthFrom(newDate)
        } else if (newDate > (date.to as Date) && numberOfMonths === 1) {
          onDateSelect({ from: newDate, to: newDate })
          setMonthFrom(newDate)
        }
      } else if (highlightedPart === 'firstMonth') {
        const currentMonth = monthFrom ? monthFrom.getMonth() : 0
        const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1)
        handleMonthChange(newMonthIndex, 'from')
      } else if (highlightedPart === 'firstYear' && yearFrom !== undefined) {
        const newYear = yearFrom + (event.deltaY > 0 ? -1 : 1)
        handleYearChange(newYear, 'from')
      } else if (highlightedPart === 'secondDay') {
        const newDate = new Date(date.to as Date)
        const increment = event.deltaY > 0 ? -1 : 1
        newDate.setDate(newDate.getDate() + increment)
        if (newDate >= (date.from as Date)) {
          onDateSelect({ from: new Date(date.from as Date), to: newDate })
          setMonthTo(newDate)
        }
      } else if (highlightedPart === 'secondMonth') {
        const currentMonth = monthTo ? monthTo.getMonth() : 0
        const newMonthIndex = currentMonth + (event.deltaY > 0 ? -1 : 1)
        handleMonthChange(newMonthIndex, 'to')
      } else if (highlightedPart === 'secondYear' && yearTo !== undefined) {
        const newYear = yearTo + (event.deltaY > 0 ? -1 : 1)
        handleYearChange(newYear, 'to')
      }
    }

    React.useEffect(() => {
      const firstDayElement = document.getElementById(`firstDay-${id}`)
      const firstMonthElement = document.getElementById(`firstMonth-${id}`)
      const firstYearElement = document.getElementById(`firstYear-${id}`)
      const secondDayElement = document.getElementById(`secondDay-${id}`)
      const secondMonthElement = document.getElementById(`secondMonth-${id}`)
      const secondYearElement = document.getElementById(`secondYear-${id}`)

      const elements = [
        firstDayElement,
        firstMonthElement,
        firstYearElement,
        secondDayElement,
        secondMonthElement,
        secondYearElement,
      ]

      const addPassiveEventListener = (element: HTMLElement | null) => {
        if (element) {
          element.addEventListener(
            'wheel',
            handleWheel as unknown as EventListener,
            {
              passive: false,
            },
          )
        }
      }

      elements.forEach(addPassiveEventListener)

      return () => {
        elements.forEach((element) => {
          if (element) {
            element.removeEventListener(
              'wheel',
              handleWheel as unknown as EventListener,
            )
          }
        })
      }
    }, [highlightedPart, date, id, handleWheel])

    const formatWithTz = (date: Date, fmt: string) =>
      formatInTimeZone(date, timeZone, fmt)

    return (
      <>
        <style>
          {`
            .date-part {
              touch-action: none;
            }
          `}
        </style>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal>
          <PopoverTrigger asChild>
            <Button
              id="date"
              ref={ref}
              {...props}
              variant="outline"
              className={cn(
                'h-9 w-full rounded-sm pl-4 text-left font-normal',
                !date?.from && 'text-muted-foreground',
                hasError && 'border-red-500',
                'disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-100',
              )}
              onClick={handleTogglePopover}
              disabled={disabled}
              suppressHydrationWarning
            >
              <span className="text-sm">
                {date?.from && isValid(date?.from) ? (
                  format(date?.from, 'dd/MM/yyyy', { locale: ptBR })
                ) : (
                  <>Selecione uma data</>
                )}
              </span>
              <CalendarIcon className="ml-auto size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent
              className="w-auto"
              avoidCollisions
              onInteractOutside={handleClose}
              onEscapeKeyDown={handleClose}
              style={{
                maxHeight: 'var(--radix-popover-content-available-height)',
                overflowY: 'auto',
              }}
            >
              <div className="flex">
                {numberOfMonths === 2 && (
                  <div className="flex flex-col gap-1 border-r border-foreground/10 pr-4 text-left">
                    {dateRanges.map(({ label, start, end }) => (
                      <Button
                        key={label}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'justify-start hover:bg-primary/90 hover:text-background',
                          selectedRange === label &&
                            'bg-primary text-background hover:bg-primary/90 hover:text-background',
                        )}
                        onClick={() => {
                          selectDateRange(start, end, label)
                          setMonthFrom(start)
                          setYearFrom(start.getFullYear())
                          setMonthTo(end)
                          setYearTo(end.getFullYear())
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <div className="ml-3 flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          handleMonthChange(months.indexOf(value), 'from')
                          setSelectedRange(null)
                        }}
                        value={
                          monthFrom ? months[monthFrom.getMonth()] : undefined
                        }
                      >
                        <SelectTrigger className="w-[122px] bg-zinc-50 font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 dark:bg-background">
                          <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, idx) => (
                            <SelectItem key={idx} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(value) => {
                          handleYearChange(Number(value), 'from')
                          setSelectedRange(null)
                        }}
                        value={yearFrom ? yearFrom.toString() : undefined}
                      >
                        <SelectTrigger className="w-[122px] bg-zinc-50 font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 dark:bg-background">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year, idx) => (
                            <SelectItem key={idx} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {numberOfMonths === 2 && (
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value) => {
                            handleMonthChange(months.indexOf(value), 'to')
                            setSelectedRange(null)
                          }}
                          value={
                            monthTo ? months[monthTo.getMonth()] : undefined
                          }
                        >
                          <SelectTrigger className="w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month, idx) => (
                              <SelectItem key={idx} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(value) => {
                            handleYearChange(Number(value), 'to')
                            setSelectedRange(null)
                          }}
                          value={yearTo ? yearTo.toString() : undefined}
                        >
                          <SelectTrigger className="w-[122px] font-medium hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year, idx) => (
                              <SelectItem key={idx} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <Calendar
                      mode="range"
                      defaultMonth={monthFrom}
                      month={monthFrom}
                      onMonthChange={setMonthFrom}
                      selected={date}
                      onSelect={handleDateSelect}
                      numberOfMonths={numberOfMonths}
                      showOutsideDays
                      className={className}
                      disabled={calendarDisabled}
                      // footer={
                      //   <div className="mt-4 flex flex-col gap-2">
                      //     <Input.Root className="">
                      //       <Input.Content
                      //         placeholder="Digite a data..."
                      //         value={inputValue || ''}
                      //         onChange={handleInputValueChange}
                      //       />
                      //       <button onClick={handleClear}>
                      //         <X className="mx-2 size-4 cursor-pointer hover:text-primary" />
                      //       </button>
                      //     </Input.Root>
                      //     <p className="px-1 text-xs normal-case text-muted-foreground">
                      //       Ex.: {format(new Date(), 'dd/MM/yyyy')} (dd/mm/yyyy)
                      //     </p>
                      //   </div>
                      // }
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </>
    )
  },
)

CalendarDatePicker.displayName = 'CalendarDatePicker'
