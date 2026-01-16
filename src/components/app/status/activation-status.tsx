import { cn } from '@/lib/utils'

export type ActivationStatusType = 'active' | 'inactive'

interface ActivationStatusProps {
  activationStatus: ActivationStatusType
  hideText?: boolean
}

export const statuses = [
  {
    label: 'Ativo',
    value: 'active',
    icon: StatusActiveIcon,
  },
  {
    label: 'Inativo',
    value: 'inactive',
    icon: StatusInactiveIcon,
  },
]

export function ActivationStatus({
  activationStatus,
  hideText = false,
}: ActivationStatusProps) {
  const statusItem = statuses.find((item) => item.value === activationStatus)

  if (!statusItem) {
    return null
  }

  const getStatusClasses = (activationStatus: ActivationStatusType) => {
    switch (activationStatus) {
      case 'active':
        return 'rounded-full px-2 py-0.5 text-xs text-emerald-600'
      case 'inactive':
        return 'rounded-full px-2 py-0.5 text-xs text-red-600'
      default:
        return 'rounded-full px-2 py-0.5 text-xs '
    }
  }

  return (
    <div
      className={cn('flex items-center', getStatusClasses(activationStatus))}
    >
      {statusItem.icon()}
      {hideText ? null : (
        <span className="font-medium">{statusItem.label}</span>
      )}
    </div>
  )
}

// Ícones para os status
function StatusActiveIcon() {
  return (
    <span className="mr-1.5 size-2 shrink-0 rounded-full bg-emerald-600" />
  )
}

function StatusInactiveIcon() {
  return <span className="mr-1.5 size-2 shrink-0 rounded-full bg-red-600" />
}
