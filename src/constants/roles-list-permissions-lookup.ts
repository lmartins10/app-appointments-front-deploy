export const rolesListPermissionsLookup = {
  appointments: 'Visualizar Agendamentos',
  logs: 'Visualizar Logs',

} as const

export function RolesListPermissionsLookups(name: string): string {
  return (
    rolesListPermissionsLookup[
      name as keyof typeof rolesListPermissionsLookup
    ] || name
  )
}
