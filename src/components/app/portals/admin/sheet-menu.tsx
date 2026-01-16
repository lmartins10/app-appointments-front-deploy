import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { Menu as MenuIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Logo } from '../../logo'
import { Menu as SidebarMenu } from './menu'

export function SheetMenu() {
  const session = useSession()

  const role = session.data?.user.role as string

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col border-none bg-background-app px-3 sm:w-72"
        side="left"
        // bg-gradient-to-t from-nta-green-800 via-nta-green-500 to-nta-green-900
      >
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-8"
            variant="link"
            asChild
          >
            <Link
              href={role === 'ADMIN' ? `${DEFAULT_PAGES.ADMIN.home}` : `${DEFAULT_PAGES.CUSTOMER.home}`}
              className="flex items-center gap-2"
            >
              <SheetTitle className="text-lg font-bold">
                <Logo className="h-11 w-fit" />
              </SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <SidebarMenu isOpen />
      </SheetContent>
    </Sheet>
  )
}
