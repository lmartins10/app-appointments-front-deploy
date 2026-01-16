'use client'

import { useRolePermission } from '@/contexts/role-permission-context'
import { useUserPermissions } from '@/hooks/permissions/use-permissions'
import { useSidebar } from '@/hooks/use-sidebar'
import { useStore } from '@/hooks/use-store'
import { cn } from '@/lib/utils'
import React, { useEffect } from 'react'
import { Sidebar } from './sidebar'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { updatePermissions } = useRolePermission()
  const { data: permissions } = useUserPermissions()

  const sidebar = useStore(useSidebar, (x) => x)

  useEffect(() => {
    if (permissions) {
      updatePermissions(permissions)
    }
  }, [permissions, updatePermissions])

  if (!sidebar) return null
  const { getOpenState, settings } = sidebar

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-screen transition-[margin-left] duration-300 ease-in-out',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72'),
        )}
      >
        {children}
      </main>
    </>
  )
}
