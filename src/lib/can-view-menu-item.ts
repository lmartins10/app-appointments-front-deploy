import { DEFAULT_PAGES } from '@/constants/default-pages'

type Permission = { id: string; name: string; status: string }

export function canViewMenuItem(
  userRole: string | undefined,
  permissions: Permission[] | undefined,
  href?: string,
  requiredPermission?: string,
): boolean {
  const permissionNames = permissions?.map((p) => p.name) ?? []

  if (userRole === 'CUSTOMER') {
    const isHome = href === DEFAULT_PAGES.CUSTOMER.home
    if (isHome) return true

    const isAppointments = href === DEFAULT_PAGES.CUSTOMER.appointments || requiredPermission === 'appointments'
    const isLogs = href === DEFAULT_PAGES.CUSTOMER.logs || requiredPermission === 'logs'

    if (isAppointments) return permissionNames.includes('appointments')
    if (isLogs) return permissionNames.includes('logs')

    return false
  }

  return true
}
