import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

interface InputRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hasError?: boolean
  readOnly?: boolean
}

function InputRoot({
  className,
  children,
  readOnly,
  hasError,
}: InputRootProps,
) {
  return (
    <div
      className={cn(
        'm-1 flex h-9 items-center justify-around rounded border border-input bg-white lg:h-9',
        'focus-within:outline-none focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0',
        readOnly && 'bg-zinc-100',
        hasError &&
        'ring-1 ring-destructive focus-within:ring-2 focus-within:ring-destructive',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const inputContentVariants = cva(
  [
    'size-full text-sm outline-none',
    'rounded bg-white px-3',
    'read-only:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        fullGhost: [
          'border-0 bg-transparent',
          'read-only:bg-transparent disabled:cursor-auto disabled:opacity-100',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputContentVariants> { }

const InputContent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        autoComplete="off"
        type={type}
        className={cn(inputContentVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

InputContent.displayName = 'InputContent'

export const Input = {
  Root: InputRoot,
  Content: InputContent,
}
