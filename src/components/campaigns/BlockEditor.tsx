import { useState } from 'react'
import { CampaignBlock } from '@/types/campaign'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, AlignLeft, AlignCenter, AlignRight, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface BlockEditorProps {
  block: CampaignBlock
  onChange: (id: string, updates: Partial<CampaignBlock>) => void
  onDelete: (id: string) => void
}

export function BlockEditor({ block, onChange, onDelete }: BlockEditorProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [localData, setLocalData] = useState<CampaignBlock>(block)

  const handleSave = () => {
    onChange(block.id, localData)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setLocalData(block)
    setIsOpen(false)
  }

  const update = (updates: any) => setLocalData((prev) => ({ ...prev, ...updates }))

  const renderFields = () => {
    switch (localData.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">Alinhamento</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={localData.align === 'left' ? 'secondary' : 'outline'}
                  onClick={() => update({ align: 'left' })}
                  className="h-9 w-12"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={localData.align === 'center' ? 'secondary' : 'outline'}
                  onClick={() => update({ align: 'center' })}
                  className="h-9 w-12"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={localData.align === 'right' ? 'secondary' : 'outline'}
                  onClick={() => update({ align: 'right' })}
                  className="h-9 w-12"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">Conteúdo</Label>
              <Textarea
                value={localData.content}
                onChange={(e) => update({ content: e.target.value })}
                placeholder="Digite seu texto..."
                className="min-h-[6rem] resize-y"
              />
            </div>
          </div>
        )
      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">URL da Imagem</Label>
              <Input
                value={localData.imageUrl}
                onChange={(e) => update({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        )
      case 'button':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[0.875rem] font-[500]">Texto</Label>
                <Input
                  value={localData.label}
                  onChange={(e) => update({ label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[0.875rem] font-[500]">Cor do Botão</Label>
                <div className="flex h-[2.5rem] w-full rounded-md border-[1px] border-input p-1 overflow-hidden">
                  <input
                    type="color"
                    value={localData.color}
                    onChange={(e) => update({ color: e.target.value })}
                    className="h-full w-full border-0 bg-transparent p-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">Link de Destino</Label>
              <Input
                value={localData.link}
                onChange={(e) => update({ link: e.target.value })}
                placeholder="https://"
              />
            </div>
          </div>
        )
      case 'divider':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">Cor da Linha</Label>
              <div className="flex h-[2.5rem] w-full max-w-[120px] rounded-md border-[1px] border-input p-1">
                <input
                  type="color"
                  value={localData.color}
                  onChange={(e) => update({ color: e.target.value })}
                  className="h-full w-full border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>
        )
      case 'spacer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[0.875rem] font-[500]">Altura (px)</Label>
              <Input
                type="number"
                value={localData.height}
                onChange={(e) => update({ height: parseInt(e.target.value) || 10 })}
                min={5}
                max={200}
                className="max-w-[120px]"
              />
            </div>
          </div>
        )
      case 'social': {
        const platforms = ['LinkedIn', 'YouTube', 'X', 'Instagram', 'Facebook', 'Pinterest']
        return (
          <div className="space-y-4">
            <Label className="text-[0.875rem] font-[500]">Plataformas Exibidas</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-md border border-border">
              {platforms.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox
                    id={`social-${block.id}-${p}`}
                    checked={localData.platforms.includes(p)}
                    onCheckedChange={(checked) => {
                      const newPlats = checked
                        ? [...localData.platforms, p]
                        : localData.platforms.filter((x) => x !== p)
                      update({ platforms: newPlats })
                    }}
                    className="flex-shrink-0"
                  />
                  <Label
                    htmlFor={`social-${block.id}-${p}`}
                    className="font-normal text-sm cursor-pointer"
                  >
                    {p}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )
      }
      case 'qrcode':
        return (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm text-primary/80 text-center font-medium">
              O QR Code único do participante será gerado automaticamente durante o envio. Nenhuma
              configuração necessária.
            </p>
          </div>
        )
    }
  }

  return (
    <Card className="bg-card p-0 border-[1px] border-border rounded-md overflow-hidden transition-all duration-200">
      {!isOpen && (
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 group"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
              {block.type}
            </span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {block.type === 'text' && block.content}
              {block.type === 'button' && block.label}
              {block.type === 'image' && 'Imagem configurada'}
              {(block.type === 'divider' ||
                block.type === 'spacer' ||
                block.type === 'qrcode' ||
                block.type === 'social') &&
                'Configuração de bloco'}
            </span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(block.id)
              }}
              title="Remover bloco"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="p-[1.5rem] bg-secondary/20">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-md">
                {block.type}
              </span>
              <span className="text-sm text-muted-foreground font-medium">Editando bloco</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive ml-2"
                onClick={() => onDelete(block.id)}
                title="Remover bloco"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-8">{renderFields()}</div>

          <div className="flex items-center gap-[0.75rem] justify-end pt-4 border-t border-border/50">
            <Button variant="secondary" onClick={handleCancel} className="text-sm">
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="text-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-2" /> Salvar
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
