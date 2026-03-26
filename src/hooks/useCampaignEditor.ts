import { useState, useCallback, useEffect } from 'react'
import { Campaign, CampaignBlock, BlockType } from '@/types/campaign'
import { saveCampaign, sendCampaign, sendTestEmail, getCampaign } from '@/services/campaignService'
import { useToast } from '@/hooks/use-toast'

export function useCampaignEditor(initialId?: string) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [campaign, setCampaign] = useState<Partial<Campaign>>({
    id: initialId || `new-${Date.now()}`,
    eventId: 'event-123',
    subject: '',
    senderName: '',
    senderEmail: '',
    status: 'draft',
    content: [],
  })

  useEffect(() => {
    if (initialId && !initialId.startsWith('new-')) {
      loadCampaign(initialId)
    }
  }, [initialId])

  const loadCampaign = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await getCampaign(id)
      if (data) setCampaign(data)
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar campanha.' })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = useCallback((field: keyof Campaign, value: any) => {
    setCampaign((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addBlock = useCallback((type: BlockType) => {
    const newBlock = createDefaultBlock(type)
    setCampaign((prev) => ({ ...prev, content: [...(prev.content || []), newBlock] }))
  }, [])

  const updateBlock = useCallback((id: string, updates: Partial<CampaignBlock>) => {
    setCampaign((prev) => ({
      ...prev,
      content: (prev.content || []).map((b) =>
        b.id === id ? ({ ...b, ...updates } as CampaignBlock) : b,
      ),
    }))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setCampaign((prev) => ({ ...prev, content: (prev.content || []).filter((b) => b.id !== id) }))
  }, [])

  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    setCampaign((prev) => {
      const blocks = [...(prev.content || [])]
      if (direction === 'up' && index > 0) {
        ;[blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]]
      } else if (direction === 'down' && index < blocks.length - 1) {
        ;[blocks[index + 1], blocks[index]] = [blocks[index], blocks[index + 1]]
      }
      return { ...prev, content: blocks }
    })
  }, [])

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setCampaign((prev) => {
      const blocks = [...(prev.content || [])]
      if (fromIndex < 0 || fromIndex >= blocks.length || toIndex < 0 || toIndex >= blocks.length) {
        return prev
      }
      if (fromIndex === toIndex) return prev

      const [movedBlock] = blocks.splice(fromIndex, 1)
      blocks.splice(toIndex, 0, movedBlock)

      return { ...prev, content: blocks }
    })
  }, [])

  const handleSave = async (status: 'draft' | 'scheduled' = 'draft') => {
    if (!campaign.subject) {
      toast({ variant: 'destructive', title: 'Atenção', description: 'O assunto é obrigatório.' })
      return false
    }
    setIsSaving(true)
    try {
      const saved = await saveCampaign({ ...campaign, status })
      setCampaign(saved)
      toast({ title: 'Sucesso', description: 'Campanha salva com sucesso!' })
      return true
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao salvar. Tente novamente.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleSend = async () => {
    const saved = await handleSave('sent')
    if (saved && campaign.id) {
      setIsSaving(true)
      try {
        await sendCampaign(campaign.id)
        toast({ title: 'Sucesso', description: 'Campanha enviada com sucesso!' })
        return true
      } catch (e) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao enviar campanha.' })
      } finally {
        setIsSaving(false)
      }
    }
    return false
  }

  const handleSendTest = async (email: string) => {
    if (!email) return
    try {
      await sendTestEmail(campaign.id || '', email)
      toast({ title: 'Sucesso', description: `Email de teste enviado para ${email}!` })
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao enviar teste.' })
    }
  }

  return {
    campaign,
    isLoading,
    isSaving,
    updateField,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    reorderBlocks,
    handleSave,
    handleSend,
    handleSendTest,
  }
}

function createDefaultBlock(type: BlockType): CampaignBlock {
  const id = `block-${Math.random().toString(36).substr(2, 9)}`
  switch (type) {
    case 'text':
      return { id, type, content: 'Novo texto', align: 'left' }
    case 'image':
      return { id, type, imageUrl: 'https://img.usecurling.com/p/600/300?q=placeholder' }
    case 'button':
      return { id, type, label: 'Clique Aqui', link: 'https://', color: '#0f172a' }
    case 'divider':
      return { id, type, color: '#e2e8f0' }
    case 'spacer':
      return { id, type, height: 20 }
    case 'social':
      return { id, type, platforms: ['LinkedIn', 'Instagram'] }
    case 'qrcode':
      return { id, type }
  }
}
