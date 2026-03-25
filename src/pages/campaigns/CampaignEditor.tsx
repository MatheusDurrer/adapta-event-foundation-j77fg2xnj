import { useState } from 'react'
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
  FlaskConical,
} from 'lucide-react'
import { useCampaignEditor } from '@/hooks/useCampaignEditor'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useIsMobile } from '@/hooks/use-mobile'
import { BlockType } from '@/types/campaign'

import { CampaignSettings } from '@/components/campaigns/CampaignSettings'
import { BlockEditor } from '@/components/campaigns/BlockEditor'
import { EmailPreview } from '@/components/campaigns/EmailPreview'

export default function CampaignEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const {
    campaign,
    isSaving,
    updateField,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    handleSave,
    handleSend,
    handleSendTest,
  } = useCampaignEditor(id)

  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const blockOptions: { type: BlockType; label: string; icon: React.ReactNode }[] = [
    { type: 'text', label: 'Texto', icon: <Type className="h-4 w-4 mr-2" /> },
    { type: 'image', label: 'Imagem', icon: <ImageIcon className="h-4 w-4 mr-2" /> },
    { type: 'button', label: 'Botão', icon: <MousePointerClick className="h-4 w-4 mr-2" /> },
    { type: 'divider', label: 'Divisor', icon: <Minus className="h-4 w-4 mr-2" /> },
    { type: 'spacer', label: 'Espaçador', icon: <Maximize className="h-4 w-4 mr-2" /> },
    { type: 'social', label: 'Redes Sociais', icon: <Share2 className="h-4 w-4 mr-2" /> },
    { type: 'qrcode', label: 'QR Code', icon: <QrCode className="h-4 w-4 mr-2" /> },
  ]

  const EditorContent = () => (
    <div className="space-y-8 pb-20">
      <section className="bg-card rounded-xl border p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Configurações</h2>
        <CampaignSettings campaign={campaign} updateField={updateField} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conteúdo (Blocos)</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                <Plus className="h-4 w-4 mr-1" /> Adicionar Bloco
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {blockOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.type}
                  onClick={() => addBlock(opt.type)}
                  className="cursor-pointer"
                >
                  {opt.icon} {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 min-h-[200px]">
          {(!campaign.content || campaign.content.length === 0) && (
            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
              Adicione blocos para construir sua campanha.
            </div>
          )}
          {campaign.content?.map((block, i) => (
            <BlockEditor
              key={block.id}
              block={block}
              index={i}
              totalBlocks={campaign.content!.length}
              onChange={updateBlock}
              onDelete={removeBlock}
              onMove={moveBlock}
            />
          ))}
        </div>
      </section>
    </div>
  )

  return (
    <div className="animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/campaigns')}
            className="rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Campanha</h1>
            <p className="text-sm text-muted-foreground">
              {campaign.status === 'sent' ? 'Visualização' : 'Rascunho'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowTestDialog(true)}>
            <FlaskConical className="h-4 w-4 mr-2" /> Teste
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" /> Salvar
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSaving || campaign.status === 'sent'}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-2" /> {campaign.scheduledAt ? 'Agendar' : 'Enviar'}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      {isMobile ? (
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="m-0">
            <EditorContent />
          </TabsContent>
          <TabsContent value="preview" className="m-0">
            <EmailPreview blocks={campaign.content || []} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-[1fr_500px] lg:grid-cols-[1fr_600px] gap-8">
          <div className="pr-2 border-r">
            <EditorContent />
          </div>
          <div className="sticky top-6 self-start h-[calc(100vh-100px)] overflow-y-auto no-scrollbar rounded-lg border bg-slate-50/50 p-4">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
              Preview
            </h3>
            <EmailPreview blocks={campaign.content || []} />
          </div>
        </div>
      )}

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Email de Teste</DialogTitle>
            <DialogDescription>
              Receba uma cópia da campanha para verificar como ficou.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleSendTest(testEmail)
                setShowTestDialog(false)
              }}
            >
              Enviar Teste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
