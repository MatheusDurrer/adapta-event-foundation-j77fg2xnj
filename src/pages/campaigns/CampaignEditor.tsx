import { useParams, useNavigate } from 'react-router-dom'
import { useCampaignEditor } from '@/hooks/useCampaignEditor'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@/components/ui/strict-mode-droppable'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Send,
  Save,
  Plus,
  Type,
  Image as ImageIcon,
  Link2,
  Minus,
  LayoutList,
  Share2,
  QrCode,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineBlockEditor } from '@/components/campaigns/InlineBlockEditor'

export default function CampaignEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    campaign,
    isLoading,
    isSaving,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    handleSave,
    handleSend,
  } = useCampaignEditor(id)

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (result.source.index === result.destination.index) return
    reorderBlocks(result.source.index, result.destination.index)
  }

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Texto' },
    { type: 'image', icon: ImageIcon, label: 'Imagem' },
    { type: 'button', icon: Link2, label: 'Botão' },
    { type: 'divider', icon: Minus, label: 'Divisor' },
    { type: 'spacer', icon: LayoutList, label: 'Espaçador' },
    { type: 'social', icon: Share2, label: 'Social' },
    { type: 'qrcode', icon: QrCode, label: 'QR Code' },
  ] as const

  if (isLoading) {
    return (
      <div className="p-8 text-center animate-pulse text-muted-foreground">
        Carregando editor...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/20">
      <div className="flex flex-col bg-background border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/campaigns')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              {campaign.subject || 'Nova Campanha'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button onClick={handleSend} disabled={isSaving}>
              <Send className="h-4 w-4 mr-2" /> Enviar Agora
            </Button>
          </div>
        </div>
        <div className="px-6 pb-2 flex justify-center">
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto relative p-8 pb-32 flex justify-center"
        onClick={() => setSelectedBlockId(null)}
      >
        <div
          className={cn(
            'bg-background shadow-lg transition-all duration-300 min-h-[500px] border',
            previewMode === 'mobile'
              ? 'w-[375px] rounded-[2rem] border-[8px] border-slate-800'
              : 'w-full max-w-[600px] rounded-md',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="email-blocks">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    'min-h-[400px] h-full flex flex-col',
                    snapshot.isDraggingOver && 'ring-[2px] ring-primary/50 bg-primary/5',
                  )}
                >
                  {(campaign.content || []).map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn('transition-opacity', snapshot.isDragging && 'opacity-50')}
                          style={provided.draggableProps.style}
                        >
                          <InlineBlockEditor
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => setSelectedBlockId(block.id)}
                            onClickOutside={() => setSelectedBlockId(null)}
                            onUpdate={updateBlock}
                            onDelete={removeBlock}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {(!campaign.content || campaign.content.length === 0) &&
                    !snapshot.isDraggingOver && (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center bg-slate-50 min-h-[400px]">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                          <Plus className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-600 mb-1">Email Vazio</p>
                        <p className="text-sm text-slate-400">
                          Clique no botão flutuante para adicionar conteúdo.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>

        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="h-14 w-14 rounded-full shadow-xl">
                <Plus className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mb-2">
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => {
                    addBlock(type)
                    setSelectedBlockId(null)
                  }}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
