'use client'

import { CircleUser, LayoutGrid, User2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { UserSession } from '@/types/session/user-session'
// import { LogoutButton } from '../logout'

interface UserNavProps {
  user?: UserSession
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          // variant="outlineSidebarToggle"
          size="sm"
          className="relative size-10 rounded-lg"
        >
          <CircleUser className="size-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || ''}</p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {user?.email || ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link
              href={`${DEFAULT_PAGES.ADMIN.home}`}
              className="flex items-center"
            >
              <LayoutGrid className="mr-3 size-4 text-muted-foreground" />
              Página Inicial
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href={`${DEFAULT_PAGES.ADMIN.profile}`} className="flex items-center">
              <User2 className="mr-3 size-4 text-muted-foreground" />
              Perfil de usuário
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* <LogoutButton portal="ADMIN" /> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
