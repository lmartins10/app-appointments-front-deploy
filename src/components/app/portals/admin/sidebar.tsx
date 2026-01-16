'use client'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { useSidebar } from '@/hooks/use-sidebar'
import { useStore } from '@/hooks/use-store'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Logo } from '../../logo'
import { Menu } from './menu'
import { SidebarToggle } from './sidebar-toggle'

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full bg-background-app border-r-2 b-strokeHeader transition-[width] duration-300 ease-in-out lg:translate-x-0',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden',
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="flex h-full flex-col"
      >
        <div
          className={cn(
            'transition-transform duration-300 ease-in-out b-strokeHeader relative h-[100px] border-b-2 px-3 flex flex-shrink-0 items-center',
            !getOpenState() ? 'translate-x-1' : 'translate-x-0',
          )}
        >
          <Link href={DEFAULT_PAGES.ADMIN.home} className="inline-flex">
            <Logo size="md" />
          </Link>
        </div>

        <Menu isOpen={getOpenState()} />

      </div>
    </aside>
  )
}
