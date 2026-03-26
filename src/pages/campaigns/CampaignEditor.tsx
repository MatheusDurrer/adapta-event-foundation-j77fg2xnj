import { useParams, useNavigate } from 'react-router-dom'
import { useCampaignEditor } from '@/hooks/useCampaignEditor'
import { BlockEditor } from '@/components/campaigns/BlockEditor'
import { EmailPreview } from '@/components/campaigns/EmailPreview'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@/components/ui/strict-mode-droppable'
import { Button } from '@/components/ui/button'
import {
  GripHorizontal,
  ArrowLeft,
  Send,
  Save,
  Type,
  Image as ImageIcon,
  Link2,
  Minus,
  LayoutList,
  Share2,
  QrCode,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { BlockType } from '@/types/campaign'

export default function CampaignEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    campaign,
    isLoading,
    isSaving,
    updateField,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    handleSave,
    handleSend,
  } = useCampaignEditor(id)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    reorderBlocks(sourceIndex, destinationIndex)
  }

  const blockTypes: { type: BlockType; icon: React.ElementType; label: string }[] = [
    { type: 'text', icon: Type, label: 'Texto' },
    { type: 'image', icon: ImageIcon, label: 'Imagem' },
    { type: 'button', icon: Link2, label: 'Botão' },
    { type: 'divider', icon: Minus, label: 'Divisor' },
    { type: 'spacer', icon: LayoutList, label: 'Espaçamento' },
    { type: 'social', icon: Share2, label: 'Social' },
    { type: 'qrcode', icon: QrCode, label: 'QR Code' },
  ]

  if (isLoading) {
    return (
      <div className="p-8 text-center animate-pulse text-muted-foreground">
        Carregando editor...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
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

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[450px] flex flex-col border-r bg-muted/10 overflow-hidden">
          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b px-4 h-12 bg-transparent">
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="settings" className="space-y-4 m-0 animate-fade-in">
                <div className="space-y-2">
                  <Label>Assunto do Email</Label>
                  <Input
                    value={campaign.subject || ''}
                    onChange={(e) => updateField('subject', e.target.value)}
                    placeholder="Digite o assunto..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Remetente</Label>
                  <Input
                    value={campaign.senderName || ''}
                    onChange={(e) => updateField('senderName', e.target.value)}
                    placeholder="Ex: Equipe Adapta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email do Remetente</Label>
                  <Input
                    value={campaign.senderEmail || ''}
                    onChange={(e) => updateField('senderEmail', e.target.value)}
                    placeholder="contato@empresa.com"
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 m-0 animate-fade-in">
                <div className="grid grid-cols-2 gap-2">
                  {blockTypes.map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 bg-background"
                      onClick={() => addBlock(type)}
                    >
                      <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {label}
                    </Button>
                  ))}
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Blocos Adicionados
                  </Label>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <StrictModeDroppable droppableId="campaign-blocks">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            'min-h-[200px] transition-all duration-200 ease-in-out rounded-md',
                            snapshot.isDraggingOver &&
                              'border-2 border-dashed border-primary bg-accent',
                          )}
                        >
                          {(campaign.content || []).map((block, index) => (
                            <Draggable key={block.id} draggableId={block.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    'mb-3 flex items-start border-[1px] border-solid border-border p-4 rounded-md bg-card transition-all duration-200 ease-in-out',
                                    snapshot.isDragging && 'opacity-50 bg-secondary',
                                  )}
                                >
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out flex items-center justify-center mr-[0.75rem] p-[0.5rem] mt-1"
                                    title="Arraste para reordenar"
                                  >
                                    <GripHorizontal
                                      style={{ width: '1.25rem', height: '1.25rem' }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <BlockEditor
                                      block={block}
                                      onChange={updateBlock}
                                      onDelete={removeBlock}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </StrictModeDroppable>
                  </DragDropContext>

                  {(!campaign.content || campaign.content.length === 0) && (
                    <div className="text-center p-8 border border-dashed rounded-md bg-muted/20 text-muted-foreground text-sm">
                      Nenhum bloco adicionado. <br />
                      Clique nos botões acima para adicionar.
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex-1 bg-muted/30 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[600px] animate-fade-in-up">
            <EmailPreview blocks={campaign.content || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
