export interface UserSession {
  id: string
  name: string
  lastName: string
  email: string
  role: string
  customerId?: string
  accessToken: string
}
