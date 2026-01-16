import { DEFAULT_PAGES } from '@/constants/default-pages'
import { rolesListPermissionsLookup } from '@/constants/roles-list-permissions-lookup'
import { RolePermissionContextType } from '@/contexts/role-permission-context'
import { canViewMenuItem } from '@/lib/can-view-menu-item'
import type { LucideIcon } from 'lucide-react'
import { Home, LayoutGrid } from 'lucide-react'
import { Icons } from '../../icons'

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  requiredPermission?: keyof typeof rolesListPermissionsLookup
}

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: React.ReactNode | LucideIcon
  submenus?: Submenu[];
  requiredPermission?: keyof typeof rolesListPermissionsLookup
}

type Group = {
  groupLabel: string;
  menus: Menu[];
}

interface MenuListProps {
  pathname: string
  userRole?: string
  permissions: RolePermissionContextType['permissions']
}

export function getMenuList({ pathname, userRole, permissions }: MenuListProps): Group[] {
  const menuList: Group[] = [
    {
      groupLabel: '',
      menus: [
        {
          href: userRole === 'ADMIN' ? DEFAULT_PAGES.ADMIN.home : DEFAULT_PAGES.CUSTOMER.home,
          label: 'Página Inicial',
          active: pathname.includes('/home'),
          icon: Home,
          submenus: [],
        },
        {
          href: userRole === 'ADMIN' ? DEFAULT_PAGES.ADMIN.appointments : DEFAULT_PAGES.CUSTOMER.appointments,
          label: 'Agendamentos',
          active: pathname.includes('/appointments'),
          icon: <Icons type="appointments" className="size-5" />,
          submenus: [],
          requiredPermission: 'appointments',
        },
        {
          href: DEFAULT_PAGES.ADMIN.customers,
          label: 'Clientes',
          active: pathname.includes('/customers'),
          icon: <Icons type="customers" className="size-5" />,
          submenus: [],
          requiredPermission: undefined,
        },
        {
          href: DEFAULT_PAGES.ADMIN.rooms,
          active: pathname.includes('/rooms'),
          label: 'Salas',
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: userRole === 'ADMIN' ? DEFAULT_PAGES.ADMIN.logs : DEFAULT_PAGES.CUSTOMER.logs,
          active: pathname.includes('/logs'),
          label: 'Logs',
          icon: <Icons type="logs" className="size-5" />,
          submenus: [],
          requiredPermission: 'logs',
        },
      ],
    },
  ]

  return menuList.reduce<Group[]>((filteredGroups, group) => {
    const filteredMenus = group.menus.reduce<Menu[]>((filteredMenus, menu) => {
      const hasAccess = canViewMenuItem(userRole, permissions, menu.href, menu.requiredPermission)

      const filteredSubmenus = (menu.submenus ?? []).filter((submenu) =>
        canViewMenuItem(userRole, permissions, submenu.href, submenu.requiredPermission),
      )

      if (hasAccess || filteredSubmenus.length > 0) {
        filteredMenus.push({ ...menu, submenus: filteredSubmenus })
      }

      return filteredMenus
    }, [])

    if (filteredMenus.length > 0) {
      filteredGroups.push({ ...group, menus: filteredMenus })
    }

    return filteredGroups
  }, [])
}
