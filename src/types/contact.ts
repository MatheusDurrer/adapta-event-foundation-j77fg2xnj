export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  cpf: string
  phone: string
  company: string
  eventId: string
  status: 'active' | 'inactive' | 'error'
  createdAt: string
  updatedAt: string
}
