export const DEFAULT_PAGES = {
  PUBLIC_ROUTES: {
    home: '/',
    adminSignIn: '/admin/sign-in',
    customerSignIn: '/customer/sign-in',
    customerSignUp: '/customer/sign-up',
    signoutHandler: '/signout-handler',
  },

  ADMIN: {
    home: '/admin/home',
    rooms: '/admin/rooms?page=1&per_page=20&sort=createdAt.desc&filterBy=name',
    room: '/admin/rooms',
    appointments: '/admin/appointments?page=1&per_page=20&sort=createdAt.desc&filterBy=appointmentRelations.user.name',
    appointment: '/admin/appointments',
    customers: '/admin/customers?page=1&per_page=20&sort=createdAt.desc&filterBy=customerUserLink.user.name',
    customer: '/admin/customers',
    logs: '/admin/logs?page=1&per_page=20&sort=createdAt.desc&filterBy=name',
    log: '/admin/logs',
    users: '/admin/users?page=1&per_page=20&sort=createdAt.desc&filterBy=name',
    user: '/admin/users',
    profile: '/admin/profile',
  },

  CUSTOMER: {
    home: '/customer/home?page=1&per_page=20&sort=createdAt.desc&filterBy=name',
    appointments: '/customer/appointments?page=1&per_page=20&sort=createdAt.desc&filterBy=appointmentRelations.user.name',
    logs: '/customer/logs?page=1&per_page=20&sort=createdAt.desc&filterBy=name',
    profile: '/customer/profile',
  },

}
