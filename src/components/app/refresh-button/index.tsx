'use client'

import { revalidatePathAction } from '@/api/actions/revalidate/revalidate-path-action'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'
import { Loader2, RefreshCwIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface RefreshButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  showText?: boolean
  refreshByPath?: string
  refreshDataAction?: () => Promise<void>
  children?: React.ReactNode
  variant?: VariantProps<typeof buttonVariants>['variant']
  isLoading?: boolean
  onRefreshStart?: () => void
  onRefreshEnd?: () => void
}

export function RefreshButton({
  refreshByPath,
  refreshDataAction,
  text = 'Atualizar',
  children,
  showText,
  variant = 'outline',
  className,
  disabled,
  isLoading,
  onRefreshStart,
  onRefreshEnd,
  ...props
}: RefreshButtonProps) {
  const [isPendingFetchData, startTransitionFetchData] = useTransition()

  async function refreshData() {
    onRefreshStart?.()

    if (refreshByPath) {
      toast.loading('Atualizando dados...', { id: 'refresh' })

      await revalidatePathAction(refreshByPath)
        .then(() => {
          toast.dismiss('refresh')
          toast.success('Dados atualizados com sucesso!')
        })
        .catch(() => {
          toast.dismiss('refresh')
          toast.error('Erro ao atualizar dados')
        })
        .finally(() => {
          onRefreshEnd?.()
        })

      return
    }

    if (refreshDataAction) {
      toast.promise(refreshDataAction(), {
        loading: 'Atualizando dados',
        success: 'Dados atualizados com sucesso!',
        error: 'Erro ao atualizar dados',
      })

      await refreshDataAction().finally(() => {
        onRefreshEnd?.()
      })

      return
    }

    toast.error('Erro ao atualizar dados', {
      description: 'Nenhuma ação de atualização de dados foi definida',
    })
    onRefreshEnd?.()
  }

  return (
    <Button
      aria-label="Atualizar dados"
      variant={variant}
      onClick={() => {
        startTransitionFetchData(() => {
          refreshData()
        })
      }}
      disabled={isPendingFetchData || disabled || isLoading}
      className={cn(className, 'gap-2 h-9')}
      {...props}
    >
      {isPendingFetchData || isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RefreshCwIcon className="size-[14px]" aria-hidden="true" />
      )}
      {showText && <span className="ml-2 hidden lg:inline">{text}</span>}
      {children}
    </Button>
  )
}
