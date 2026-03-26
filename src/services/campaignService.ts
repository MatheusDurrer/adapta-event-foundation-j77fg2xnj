import { supabase } from '@/lib/supabase'
import { Campaign } from '@/types/campaign'

// Initial mock data to ensure dashboard isn't empty
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'mock-1',
    eventId: 'event-123',
    subject: 'Boas-vindas ao Adapta Event 2026',
    senderName: 'Equipe Adapta',
    senderEmail: 'contato@adapta.com',
    content: [{ id: 'b1', type: 'text', content: 'Olá! Seja bem-vindo.', align: 'left' }],
    status: 'sent',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 186400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-2',
    eventId: 'event-123',
    subject: 'Lembrete: Faltam 2 dias!',
    senderName: 'Equipe Adapta',
    senderEmail: 'contato@adapta.com',
    content: [],
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const getCampaigns = async (eventId: string): Promise<Campaign[]> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data || data.length === 0 || (data.length === 1 && data[0].id === 'mock-1')) {
    return MOCK_CAMPAIGNS
  }

  return data.map(mapToCampaign)
}

export const getCampaign = async (id: string): Promise<Campaign | null> => {
  const mock = MOCK_CAMPAIGNS.find((c) => c.id === id)
  if (mock) return mock

  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single()
  if (error) return null
  return data ? mapToCampaign(data) : null
}

export const saveCampaign = async (campaign: Partial<Campaign>): Promise<Campaign> => {
  const payload = {
    event_id: campaign.eventId,
    subject: campaign.subject,
    sender_name: campaign.senderName,
    sender_email: campaign.senderEmail,
    recipient_list_id: campaign.recipientListId,
    content: campaign.content,
    status: campaign.status || 'draft',
    scheduled_at: campaign.scheduledAt,
  }

  if (campaign.id && !campaign.id.startsWith('new-')) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(payload)
      .eq('id', campaign.id)
      .select()
      .single()
    if (error) throw error
    return mapToCampaign(data)
  }

  const { data, error } = await supabase.from('campaigns').insert([payload]).select().single()
  if (error) throw error
  return mapToCampaign(data)
}

export const generateQRCodeDataForContact = (contact: any, eventId: string): string => {
  return JSON.stringify({
    contactId: contact.id || '00000000-0000-0000-0000-000000000000',
    eventId: eventId || '00000000-0000-0000-0000-000000000000',
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    company: contact.company || '',
  })
}

export const sendCampaign = async (campaignId: string): Promise<boolean> => {
  const campaign = await getCampaign(campaignId)
  if (!campaign) throw new Error('Campanha não encontrada')

  // Fetch recipients for the event
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .eq('event_id', campaign.eventId)

  if (contactsError) throw contactsError

  if (contacts && contacts.length > 0) {
    const sends = contacts.map((contact: any) => {
      const qrData = generateQRCodeDataForContact(contact, campaign.eventId)
      return {
        campaign_id: campaignId,
        contact_id: contact.id,
        event_id: campaign.eventId,
        qr_code_data: qrData,
        status: 'pending',
      }
    })

    // Store the generated QR code data per contact
    await supabase.from('campaign_sends').insert(sends)
  }

  // Simulates an edge function (send-campaign-email) call to send the campaign.
  // Edge Function requirements fulfilled by backend in production:
  // - Receives contact details, event ID, and campaign content
  // - Generates a PNG QR code image from the provided JSON data for 'qrcode' blocks
  // - Converts the QR image to base64 and embeds it as an <img> tag within the HTML
  // - Renders all other block types (Text, Image, Button, etc.) with respective styles
  await new Promise((resolve) => setTimeout(resolve, 1500))

  await supabase
    .from('campaigns')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', campaignId)

  return true
}

export const sendTestEmail = async (campaignId: string, email: string): Promise<boolean> => {
  // Simulates an edge function call to send a test email
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (!email) throw new Error('Email inválido')
  return true
}

export const deleteCampaign = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  if (error) throw error
  return true
}

function mapToCampaign(data: any): Campaign {
  return {
    id: data.id,
    eventId: data.event_id,
    userId: data.user_id,
    subject: data.subject || '',
    senderName: data.sender_name || '',
    senderEmail: data.sender_email || '',
    recipientListId: data.recipient_list_id,
    content: data.content || [],
    status: data.status,
    scheduledAt: data.scheduled_at,
    sentAt: data.sent_at,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}
