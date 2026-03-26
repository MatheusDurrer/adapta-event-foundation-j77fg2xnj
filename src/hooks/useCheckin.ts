import { useState, useCallback } from 'react'
import { CheckinStats, QRCodeData } from '@/types/checkin'
import { Contact } from '@/types/contact'
import { parseQRCode, recordCheckin, getCheckinStats } from '@/services/checkinService'
import { useToast } from '@/hooks/use-toast'

export function useCheckin(eventId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState(false)
  const [scannedContact, setScannedContact] = useState<QRCodeData | Contact | null>(null)
  const [checkinSuccess, setCheckinSuccess] = useState(false)
  const [stats, setStats] = useState<CheckinStats | null>(null)
  const { toast } = useToast()

  const loadStats = useCallback(async () => {
    setLoading(true)
    setStatsError(false)
    try {
      const data = await getCheckinStats(eventId, 500)
      setStats(data)
    } catch (err: any) {
      setStatsError(true)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  const handleQRCodeScan = useCallback(
    async (data: string) => {
      try {
        const parsed = await parseQRCode(data)
        if (parsed.eventId !== eventId) {
          throw new Error('QR Code pertence a outro evento')
        }
        setScannedContact(parsed)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Erro ao ler QR Code')
        toast({
          variant: 'destructive',
          title: 'Erro de leitura',
          description: err.message || 'Falha ao processar QR Code',
        })
      }
    },
    [eventId, toast],
  )

  const confirmCheckin = useCallback(
    async (contactId: string, source: 'qr_scan' | 'manual' = 'qr_scan') => {
      setLoading(true)
      setError(null)
      try {
        await recordCheckin(eventId, contactId, source)
        setCheckinSuccess(true)
        toast({
          title: 'Sucesso',
          description: 'Check-in realizado com sucesso!',
        })
        setTimeout(() => {
          setCheckinSuccess(false)
          setScannedContact(null)
        }, 2000)
        await loadStats()
      } catch (err: any) {
        setError('Erro ao registrar check-in')
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível registrar o check-in.',
        })
      } finally {
        setLoading(false)
      }
    },
    [eventId, loadStats, toast],
  )

  const recordManualCheckin = useCallback((contact: Contact) => {
    setScannedContact(contact)
  }, [])

  const cancelCheckin = useCallback(() => {
    setScannedContact(null)
    setError(null)
  }, [])

  return {
    loading,
    error,
    statsError,
    scannedContact,
    checkinSuccess,
    stats,
    handleQRCodeScan,
    confirmCheckin,
    loadStats,
    recordManualCheckin,
    cancelCheckin,
  }
}
