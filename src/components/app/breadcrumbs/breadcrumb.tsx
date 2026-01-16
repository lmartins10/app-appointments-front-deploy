'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DEFAULT_PAGES } from '@/constants/default-pages'
import { HomeIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export function BreadcrumbPages({ pageName }: { pageName: string }) {
  const role = useSession().data?.user?.role
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center justify-start">
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="flex items-center gap-2">
            {role === 'admin'
              ? (
                <Link href={`${DEFAULT_PAGES.ADMIN.home}`}>
                  <HomeIcon className="size-4" />
                  Página Inicial
                </Link>
                ) : (
                  <Link href={`${DEFAULT_PAGES.CUSTOMER.home}`}>
                    <HomeIcon className="size-4" />
                    Página Inicial
                  </Link>
                )}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbPage>{pageName}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
