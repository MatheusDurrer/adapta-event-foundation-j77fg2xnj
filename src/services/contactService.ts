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
