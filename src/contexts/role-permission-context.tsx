'use client'
import { ReactNode, createContext, useContext, useState } from 'react'

export interface RolePermissionContextType {
  permissions: {
    id: string;
    name: string
    status: string
  }[]
  updatePermissions: (
    permissions: RolePermissionContextType['permissions'],
  ) => void
}

const RolePermissionContext = createContext<
  RolePermissionContextType | undefined
>(undefined)

export function RolePermissionProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<
    RolePermissionContextType['permissions']
  >([])

  function updatePermissions(
    permissions: RolePermissionContextType['permissions'],
  ) {
    setPermissions(permissions)
  }

  return (
    <RolePermissionContext.Provider value={{ permissions, updatePermissions }}>
      {children}
    </RolePermissionContext.Provider>
  )
}

export const useRolePermission = () => {
  const context = useContext(RolePermissionContext)
  if (!context) {
    throw new Error(
      'useRolePermission must be used within a RolePermissionProvider',
    )
  }
  return context
}
