export type BlockType = 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'social' | 'qrcode'

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  content: string
  align: 'left' | 'center' | 'right'
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  imageUrl: string
  width?: number
  height?: number
}

export interface ButtonBlock extends BaseBlock {
  type: 'button'
  label: string
  link: string
  color: string
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
  color: string
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer'
  height: number
}

export interface SocialBlock extends BaseBlock {
  type: 'social'
  platforms: string[]
}

export interface QRCodeBlock extends BaseBlock {
  type: 'qrcode'
}

export type CampaignBlock =
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | SocialBlock
  | QRCodeBlock

export type CampaignStatus = 'draft' | 'scheduled' | 'sent'

export interface Campaign {
  id: string
  eventId: string
  userId?: string
  subject: string
  senderName: string
  senderEmail: string
  recipientListId?: string
  content: CampaignBlock[]
  status: CampaignStatus
  scheduledAt?: string | null
  sentAt?: string | null
  createdAt: string
  updatedAt: string
}
