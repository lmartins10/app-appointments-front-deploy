import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ActionButtonProps {
  className?: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'table' | 'dialog' | 'button-onClick'
  icon?: React.ReactNode
  openInNewTab?: boolean
  title?: string
  description?: string
  children?: React.ReactNode
  dialogContentClassName?: string
}

export function ActionButton({
  className,
  onClick,
  href,
  variant = 'default',
  icon,
  openInNewTab = false,
  title = '',
  description,
  children,
  dialogContentClassName,
}: ActionButtonProps) {
  const media = useMediaQuery('(min-width: 425px)')

  switch (variant) {
    case 'button-onClick':
      return (
        <Button
          type="button"
          className={cn('h-9 items-center justify-center text-muted-foreground hover:text-foreground', className)}
          variant="outline"
          onClick={() => {
            onClick?.()
          }}
          aria-label={title}
        >
          {icon}
        </Button>
      )

    case 'dialog':
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className={cn('gap-2', className)} variant="default">
              {icon}
              <span className={cn('hidden lg:flex')}>{title}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className={cn(dialogContentClassName)}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )

    case 'table':
      return (
        <Button
          variant="outline"
          className={cn(className)}
          asChild
        >
          <Link
            className={cn('gap-2')}
            href={href ?? '#'} target={openInNewTab ? '_blank' : '_self'} rel="noreferrer noopener"
          >
            {icon}
            <span className={cn('flex', media ? 'hidden' : '')}>
              {title}
            </span>
          </Link>
        </Button>
      )

    default:
      return (
        <>
          <Button className={cn('gap-2', className)} variant="default" asChild>
            <Link href={href ?? '#'} target={openInNewTab ? '_blank' : '_self'} rel="noreferrer noopener">
              {icon}
              <span className={cn('hidden lg:flex')}>{title}</span>
            </Link>
          </Button>
        </>
      )
  }
}
