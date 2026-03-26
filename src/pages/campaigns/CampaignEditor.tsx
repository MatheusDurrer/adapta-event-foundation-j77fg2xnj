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
  GripHorizontal,
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
import { DragDropContext, Droppable, Draggable } from '@/components/ui/dnd'
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

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    reorderBlocks(result.source.index, result.destination.index)
  }

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

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="email-blocks">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        'space-y-4 rounded-md transition-colors border-2 border-transparent',
                        snapshot.isDraggingOver && 'bg-accent border-dashed border-primary',
                      )}
                    >
                      {campaign.content?.map((block, i) => (
                        <Draggable key={block.id} draggableId={`block-${block.id}`} index={i}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                'flex relative transition-all duration-200 rounded-md',
                                snapshot.isDragging && 'opacity-50 bg-secondary/50',
                              )}
                              style={provided.draggableProps.style}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={cn(
                                  'flex flex-col items-center justify-center shrink-0 mr-[0.75rem]',
                                  snapshot.isDragging ? 'cursor-grabbing' : 'cursor-grab',
                                  provided.dragHandleProps?.className,
                                )}
                              >
                                <GripHorizontal className="h-[1.25rem] w-[1.25rem] text-muted-foreground hover:text-primary transition-colors" />
                              </div>

                              <div
                                className={cn(
                                  'flex-1 min-w-0',
                                  snapshot.isDragging && 'pointer-events-none',
                                )}
                              >
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

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
