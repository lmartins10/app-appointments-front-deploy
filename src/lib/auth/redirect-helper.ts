import { DEFAULT_PAGES } from '@/constants/default-pages'
import { UserSession } from '@/types/session/user-session'

export function getRedirectUrlByRole(role: UserSession['role']): string {
  const hasAdminRole = role === 'ADMIN'
  const hasCustomerRole = role === 'CUSTOMER'

  if (hasAdminRole) {
    return DEFAULT_PAGES.ADMIN.home
  }

  if (hasCustomerRole) {
    return DEFAULT_PAGES.CUSTOMER.home
  }

  return DEFAULT_PAGES.PUBLIC_ROUTES.home
}
