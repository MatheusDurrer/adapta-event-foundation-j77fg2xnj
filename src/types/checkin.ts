export type CheckinSource = 'qr_scan' | 'manual'

export interface Checkin {
  id: string
  eventId: string
  contactId: string
  timestamp: Date
  checkinTime: string
  source: CheckinSource
  createdAt: string
}

export interface CheckinsByHour {
  hour: string
  count: number
}

export interface CheckinStats {
  totalCheckins: number
  checkinsByHour: CheckinsByHour[]
  checkinRate: number
  peakHour: string
}

export interface QRCodeData {
  contactId: string
  eventId: string
  firstName: string
  lastName: string
  company: string
}
