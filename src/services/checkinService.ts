import { supabase } from '@/lib/supabase'
import { Checkin, CheckinStats, QRCodeData, CheckinsByHour } from '@/types/checkin'
import { Contact } from '@/types/contact'

export async function parseQRCode(data: string): Promise<QRCodeData> {
  try {
    const parsed = JSON.parse(data)
    if (!parsed.contactId || !parsed.eventId) {
      throw new Error('QR Code inválido')
    }
    return parsed as QRCodeData
  } catch (e) {
    throw new Error('Falha ao ler o QR Code')
  }
}

export async function recordCheckin(
  eventId: string,
  contactId: string,
  source: 'qr_scan' | 'manual',
): Promise<Checkin> {
  const dbPayload = {
    event_id: eventId,
    contact_id: contactId,
    timestamp: new Date().toISOString(),
    source,
  }

  const { data, error } = await supabase.from('checkins').insert([dbPayload]).single()

  if (error) throw error

  return {
    id: data?.id || `checkin-${Date.now()}`,
    eventId: data?.event_id || eventId,
    contactId: data?.contact_id || contactId,
    timestamp: new Date(data?.timestamp || dbPayload.timestamp),
    checkinTime: new Date(data?.timestamp || dbPayload.timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    source: data?.source || source,
    createdAt: data?.created_at || new Date().toISOString(),
  }
}

export async function getCheckinStats(
  eventId: string,
  totalContacts: number,
): Promise<CheckinStats> {
  const { data, error } = await supabase.from('checkins').select('*').eq('event_id', eventId)

  if (error) throw error

  const checkins = data || []
  const totalCheckins = checkins.length

  const hourMap: Record<string, number> = {}
  for (let i = 0; i < 24; i++) {
    hourMap[i.toString().padStart(2, '0') + ':00'] = 0
  }

  checkins.forEach((c: any) => {
    const date = new Date(c.created_at || c.timestamp || Date.now())
    if (!isNaN(date.getTime())) {
      const hour = date.getHours().toString().padStart(2, '0') + ':00'
      hourMap[hour] = (hourMap[hour] || 0) + 1
    }
  })

  const checkinsByHour: CheckinsByHour[] = Object.keys(hourMap).map((hour) => ({
    hour,
    count: hourMap[hour],
  }))

  let peakHour = '00:00'
  let maxCount = -1
  checkinsByHour.forEach((h) => {
    if (h.count > maxCount) {
      maxCount = h.count
      peakHour = h.hour
    }
  })

  const checkinRate = totalContacts > 0 ? (totalCheckins / totalContacts) * 100 : 0

  return {
    totalCheckins,
    checkinsByHour,
    checkinRate,
    peakHour: maxCount > 0 ? peakHour : '--:--',
  }
}

export async function searchContacts(eventId: string, query: string): Promise<Contact[]> {
  const { data, error } = await supabase.from('contacts').select('*').eq('event_id', eventId)

  if (error) throw error

  const q = query.toLowerCase()
  const filtered = (data || []).filter(
    (c: any) =>
      (c.first_name || '').toLowerCase().includes(q) ||
      (c.last_name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q),
  )

  return filtered.map((d: any, index: number) => ({
    id: d.id || `contact-${index}`,
    firstName: d.first_name || 'Participante',
    lastName: d.last_name || 'Exemplo',
    email: d.email || 'participante@exemplo.com',
    cpf: d.cpf || '',
    phone: d.phone || '',
    company: d.company || 'Empresa Exemplo',
    eventId: d.event_id || eventId,
    status: d.status || 'active',
    createdAt: d.created_at || new Date().toISOString(),
    updatedAt: d.updated_at || new Date().toISOString(),
  }))
}
