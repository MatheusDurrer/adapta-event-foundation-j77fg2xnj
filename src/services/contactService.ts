import { supabase } from '@/lib/supabase'
import { Contact } from '@/types/contact'

export async function addContactToSupabase(
  contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Contact> {
  const dbPayload = {
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    cpf: contact.cpf,
    phone: contact.phone,
    company: contact.company,
    event_id: contact.eventId,
    status: contact.status || 'active',
  }

  const { data, error } = await supabase.from('contacts').insert([dbPayload]).select().single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    cpf: data.cpf,
    phone: data.phone,
    company: data.company,
    eventId: data.event_id,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function editContactInSupabase(
  contactId: string,
  eventId: string,
  contact: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'eventId'>>,
): Promise<Contact> {
  const dbPayload: any = {}
  if (contact.firstName !== undefined) dbPayload.first_name = contact.firstName
  if (contact.lastName !== undefined) dbPayload.last_name = contact.lastName
  if (contact.email !== undefined) dbPayload.email = contact.email
  if (contact.cpf !== undefined) dbPayload.cpf = contact.cpf
  if (contact.phone !== undefined) dbPayload.phone = contact.phone
  if (contact.company !== undefined) dbPayload.company = contact.company
  if (contact.status !== undefined) dbPayload.status = contact.status

  const { data, error } = await supabase
    .from('contacts')
    .update(dbPayload)
    .eq('id', contactId)
    .eq('event_id', eventId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id || contactId,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    cpf: data.cpf,
    phone: data.phone,
    company: data.company,
    eventId: data.event_id || eventId,
    status: data.status || 'active',
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at,
  }
}

export async function importContactsToSupabase(
  contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[],
): Promise<Contact[]> {
  const dbPayload = contacts.map((c) => ({
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    cpf: c.cpf,
    phone: c.phone,
    company: c.company,
    event_id: c.eventId,
    status: 'active',
  }))

  const { data, error } = await supabase.from('contacts').insert(dbPayload).select()

  if (error) {
    throw error
  }

  return (data || []).map((d: any) => ({
    id: d.id,
    firstName: d.first_name,
    lastName: d.last_name,
    email: d.email,
    cpf: d.cpf,
    phone: d.phone,
    company: d.company,
    eventId: d.event_id,
    status: d.status,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }))
}
