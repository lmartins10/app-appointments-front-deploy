'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { useRolePermission } from '@/contexts/role-permission-context'
import { Logout } from '@/lib/auth/logout'
import { cn } from '@/lib/utils'
import { ChevronDown, Ellipsis, LogOut, LucideIcon, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { isValidElement, useState } from 'react'
import { CollapseMenuButton } from './collapse-menu-button'
import { getMenuList } from './menu-list'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const session = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const { permissions } = useRolePermission()

  const [menuOpen, setMenuOpen] = useState(false)

  const user = `${session.data?.user?.name || ''} ${session.data?.user?.lastName || ''}`.trim() || ''

  const userRole = session.data?.user?.role || ''

  const menuList = getMenuList({ pathname, permissions, userRole })

  // Função helper para renderizar o ícone
  function renderIcon(Icon: React.ReactNode | LucideIcon, className?: string): React.ReactNode {
    if (!Icon) return null

    if (isValidElement(Icon)) {
      return Icon
    }

    if (
      typeof Icon === 'object' &&
      '$$typeof' in Icon &&
      'render' in Icon
    ) {
      const IconComponent = Icon as unknown as LucideIcon
      return <IconComponent className={className} />
    }

    return null
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <ScrollArea className="grow pb-4 [&>div>div[style]]:!block">
        <nav className="mt-2 w-full">
          <ul className="flex flex-col items-start px-4">
            {menuList.map(({ groupLabel, menus }, index) => (
              <li
                className={cn('w-full', groupLabel ? 'pt-5' : '')}
                key={index}
              >
                {(isOpen && groupLabel) || isOpen === undefined ? (
                  <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-bold text-secondary">
                    {groupLabel}
                  </p>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="flex w-full items-center justify-center text-secondary">
                          <Ellipsis className="size-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="border-none bg-muted-foreground text-primary-foreground" side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="pb-2" />
                )}
                {menus.map(
                  ({ href, label, icon: Icon, active, submenus }, index) =>
                    !submenus || submenus.length === 0 ? (
                      <div
                        className="w-full font-medium text-secondary"
                        key={index}
                      >
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={
                                  (active === undefined &&
                                    pathname.startsWith(href)) ||
                                    active
                                    ? 'secondarySidebar'
                                    : 'ghostSidebar'
                                }
                                className="my-1 h-11 w-full justify-start"
                                asChild
                              >
                                <Link href={href}>
                                  <span
                                    className={cn(
                                      'flex-shrink-0 size-5 flex items-center justify-center',
                                      isOpen === false ? '' : 'mr-2',
                                    )}
                                  >
                                    {renderIcon(Icon, 'size-5')}
                                  </span>
                                  <p
                                    className={cn(
                                      'max-w-[200px] truncate',
                                      isOpen === false
                                        ? '-translate-x-96 opacity-0'
                                        : 'translate-x-0 opacity-100',
                                    )}
                                  >
                                    {label}
                                  </p>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent className="border-none bg-muted-foreground text-primary-foreground" side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full text-secondary" key={index}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={
                            active === undefined
                              ? pathname.startsWith(href)
                              : active
                          }
                          submenus={submenus}
                          isOpen={isOpen}
                        />
                      </div>
                    ),
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>

      <div className="b-strokeHeader flex h-[100px] w-full items-center justify-between border-t-2 px-4">
        {isOpen === false ? (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronDown className={cn('size-5 transition-transform', menuOpen ? 'rotate-180' : '')} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-52">
              <div className="px-3 py-2">
                <div className="truncate text-base font-semibold text-foreground">
                  {user}
                </div>
                <div className="text-sm text-muted-foreground">Admin</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={DEFAULT_PAGES.ADMIN.profile} className="flex cursor-pointer items-center">
                  <User className="mr-2 size-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                onClick={async () =>
                  await Logout({
                    redirectUrl: DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn,
                    router,
                  })}
              >
                <LogOut className="mr-2 size-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">
                {user}
              </span>
              <span className="text-sm">Admin</span>
            </div>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <ChevronDown className={cn('size-5 transition-transform', menuOpen ? 'rotate-180' : '')} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href={`${userRole === 'ADMIN' ? DEFAULT_PAGES.ADMIN.profile : DEFAULT_PAGES.CUSTOMER.profile}?profileDetailMode=view`} className="flex cursor-pointer items-center">
                    <User className="mr-2 size-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                  onClick={async () =>
                    await Logout({
                      redirectUrl: userRole === 'ADMIN' ? DEFAULT_PAGES.PUBLIC_ROUTES.adminSignIn : DEFAULT_PAGES.PUBLIC_ROUTES.customerSignIn,
                      router,
                    })}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  )
}
