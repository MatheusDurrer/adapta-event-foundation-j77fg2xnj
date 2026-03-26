import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  Maximize,
  Share2,
  QrCode,
  Send,
  Save,
  Smartphone,
  Monitor,
  GripVertical,
} from 'lucide-react'
import { useCampaignEditor } from '@/hooks/useCampaignEditor'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BlockType } from '@/types/campaign'

import { CampaignSettings } from '@/components/campaigns/CampaignSettings'
import { BlockEditor } from '@/components/campaigns/BlockEditor'
import { EmailPreview } from '@/components/campaigns/EmailPreview'
import { cn } from '@/lib/utils'

export default function CampaignEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    campaign,
    isSaving,
    updateField,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    reorderBlocks,
    handleSave,
    handleSend,
  } = useCampaignEditor(id)

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [draggableIndex, setDraggableIndex] = useState<number | null>(null)

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const blockOptions: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: 'text', label: 'Texto', icon: <Type className="h-4 w-4 mr-2 text-primary" /> },
    { type: 'image', label: 'Imagem', icon: <ImageIcon className="h-4 w-4 mr-2 text-primary" /> },
    {
      type: 'button',
      label: 'Botão',
      icon: <MousePointerClick className="h-4 w-4 mr-2 text-primary" />,
    },
    { type: 'divider', label: 'Divisor', icon: <Minus className="h-4 w-4 mr-2 text-primary" /> },
    {
      type: 'spacer',
      label: 'Espaçador',
      icon: <Maximize className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      type: 'social',
      label: 'Redes Sociais',
      icon: <Share2 className="h-4 w-4 mr-2 text-primary" />,
    },
    { type: 'qrcode', label: 'QR Code', icon: <QrCode className="h-4 w-4 mr-2 text-primary" /> },
  ]

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[1px] border-border pb-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/campaigns')}
            className="rounded-full shrink-0"
          >
            <ArrowLeft className="h-[1.5rem] w-[1.5rem]" />
          </Button>
          <div>
            <h1 className="text-[1.5rem] font-[700] tracking-tight leading-none text-foreground">
              Editor de Campanha
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button variant="secondary" onClick={() => handleSave('draft')} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSaving || campaign.status === 'sent'}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-2" /> {campaign.scheduledAt ? 'Agendar' : 'Enviar'}
          </Button>
        </div>
      </div>

      {/* Editor Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[1.5rem] lg:gap-[2rem]">
        {/* Settings Column */}
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-[0.875rem] font-[600] uppercase text-muted-foreground mb-4 tracking-wider">
              Configurações
            </h2>
            <CampaignSettings campaign={campaign} updateField={updateField} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[0.875rem] font-[600] uppercase text-muted-foreground tracking-wider">
                Conteúdo
              </h2>
            </div>

            <div className="space-y-4 min-h-[200px]">
              {(!campaign.content || campaign.content.length === 0) && (
                <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                  Seu email está vazio. Adicione blocos para começar.
                </div>
              )}
              {campaign.content?.map((block, i) => {
                const isDragging = draggedIndex === i
                const isDragOver = dragOverIndex === i

                return (
                  <div
                    key={block.id}
                    className={cn(
                      'drop-zone flex gap-2 relative transition-all duration-200 rounded-md',
                      isDragging && 'opacity-50 bg-secondary',
                      isDragOver && 'border-[2px] border-dashed border-primary bg-accent p-[1rem]',
                    )}
                    data-index={i}
                    draggable={draggableIndex === i}
                    onDragStart={(e) => {
                      setDraggedIndex(i)
                      e.dataTransfer.effectAllowed = 'move'
                      e.dataTransfer.setData('text/plain', i.toString())
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      if (draggedIndex !== null && draggedIndex !== i) {
                        setDragOverIndex(i)
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedIndex !== null && draggedIndex !== i) {
                        reorderBlocks(draggedIndex, i)
                      }
                      setDraggedIndex(null)
                      setDragOverIndex(null)
                      setDraggableIndex(null)
                    }}
                    onDragEnd={() => {
                      setDraggedIndex(null)
                      setDragOverIndex(null)
                      setDraggableIndex(null)
                    }}
                    onTouchStart={(e) => {
                      const target = e.target as HTMLElement
                      if (target.closest('.drag-handle')) {
                        setDraggedIndex(i)
                        document.body.style.overflow = 'hidden'
                      }
                    }}
                    onTouchMove={(e) => {
                      if (draggedIndex === null) return
                      const touch = e.touches[0]
                      const elem = document.elementFromPoint(touch.clientX, touch.clientY)
                      const dropZone = elem?.closest('.drop-zone')
                      if (dropZone) {
                        const indexStr = dropZone.getAttribute('data-index')
                        if (indexStr !== null) {
                          const index = parseInt(indexStr, 10)
                          if (index !== draggedIndex) {
                            setDragOverIndex(index)
                          } else {
                            setDragOverIndex(null)
                          }
                        }
                      } else {
                        setDragOverIndex(null)
                      }
                    }}
                    onTouchEnd={(e) => {
                      document.body.style.overflow = ''
                      if (
                        draggedIndex !== null &&
                        dragOverIndex !== null &&
                        draggedIndex !== dragOverIndex
                      ) {
                        reorderBlocks(draggedIndex, dragOverIndex)
                      }
                      setDraggedIndex(null)
                      setDragOverIndex(null)
                      setDraggableIndex(null)
                    }}
                  >
                    <div
                      className={cn(
                        'drag-handle flex flex-col items-center justify-center w-8 shrink-0 text-muted-foreground hover:text-primary transition-colors',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                      )}
                      onMouseEnter={() => setDraggableIndex(i)}
                      onMouseLeave={() => setDraggableIndex(null)}
                      onTouchStart={() => setDraggableIndex(i)}
                      onTouchEnd={() => setDraggableIndex(null)}
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className={cn('flex-1 min-w-0', isDragging && 'pointer-events-none')}>
                      <BlockEditor
                        block={block}
                        index={i}
                        totalBlocks={campaign.content!.length}
                        onChange={updateBlock}
                        onDelete={removeBlock}
                        onMove={moveBlock}
                      />
                    </div>
                  </div>
                )
              })}

              <div className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-[2px] h-12 text-muted-foreground hover:text-accent-foreground hover:bg-accent hover:border-accent-foreground/30 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Bloco
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    {blockOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.type}
                        onClick={() => addBlock(opt.type)}
                        className="cursor-pointer py-2"
                      >
                        {opt.icon} <span className="font-medium">{opt.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </section>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-[2rem] self-start flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[0.875rem] font-[600] uppercase text-muted-foreground tracking-wider">
              Preview do Email
            </h2>
            <div className="flex items-center bg-secondary rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs',
                  previewMode === 'desktop' && 'bg-background shadow-sm',
                )}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-3 w-3 mr-1.5" /> Desktop
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 px-3 text-xs',
                  previewMode === 'mobile' && 'bg-background shadow-sm',
                )}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-3 w-3 mr-1.5" /> Mobile
              </Button>
            </div>
          </div>

          <div className="bg-slate-100 rounded-lg border flex justify-center items-start p-4 md:p-8 min-h-[600px] overflow-y-auto no-scrollbar max-h-[calc(100vh-12rem)]">
            <div
              className="w-full transition-all duration-300 ease-in-out"
              style={{ maxWidth: previewMode === 'desktop' ? '37.5rem' : '20rem' }}
            >
              <EmailPreview blocks={campaign.content || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
