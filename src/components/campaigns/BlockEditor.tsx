import { CampaignBlock } from '@/types/campaign'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUp, ArrowDown, Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface BlockEditorProps {
  block: CampaignBlock
  index: number
  totalBlocks: number
  onChange: (id: string, updates: Partial<CampaignBlock>) => void
  onDelete: (id: string) => void
  onMove: (index: number, direction: 'up' | 'down') => void
}

export function BlockEditor({
  block,
  index,
  totalBlocks,
  onChange,
  onDelete,
  onMove,
}: BlockEditorProps) {
  const update = (updates: any) => onChange(block.id, updates)

  const renderFields = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={block.align === 'left' ? 'secondary' : 'outline'}
                onClick={() => update({ align: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={block.align === 'center' ? 'secondary' : 'outline'}
                onClick={() => update({ align: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={block.align === 'right' ? 'secondary' : 'outline'}
                onClick={() => update({ align: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => update({ content: e.target.value })}
              placeholder="Digite seu texto..."
              rows={4}
            />
          </div>
        )
      case 'image':
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>URL da Imagem</Label>
              <Input
                value={block.imageUrl}
                onChange={(e) => update({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        )
      case 'button':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Texto</Label>
                <Input value={block.label} onChange={(e) => update({ label: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Cor</Label>
                <div className="flex h-10 w-full rounded-md border border-input p-1">
                  <input
                    type="color"
                    value={block.color}
                    onChange={(e) => update({ color: e.target.value })}
                    className="h-full w-full border-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Link</Label>
              <Input value={block.link} onChange={(e) => update({ link: e.target.value })} />
            </div>
          </div>
        )
      case 'divider':
        return (
          <div className="space-y-1">
            <Label>Cor da Linha</Label>
            <div className="flex h-10 w-full max-w-[100px] rounded-md border border-input p-1">
              <input
                type="color"
                value={block.color}
                onChange={(e) => update({ color: e.target.value })}
                className="h-full w-full border-0 bg-transparent"
              />
            </div>
          </div>
        )
      case 'spacer':
        return (
          <div className="space-y-1">
            <Label>Altura (px)</Label>
            <Input
              type="number"
              value={block.height}
              onChange={(e) => update({ height: parseInt(e.target.value) || 10 })}
              min={5}
              max={200}
            />
          </div>
        )
      case 'social':
        const platforms = ['LinkedIn', 'YouTube', 'X', 'Instagram', 'Facebook', 'Pinterest']
        return (
          <div className="space-y-2">
            <Label>Plataformas</Label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox
                    id={`social-${block.id}-${p}`}
                    checked={block.platforms.includes(p)}
                    onCheckedChange={(checked) => {
                      const newPlats = checked
                        ? [...block.platforms, p]
                        : block.platforms.filter((x) => x !== p)
                      update({ platforms: newPlats })
                    }}
                  />
                  <Label htmlFor={`social-${block.id}-${p}`} className="font-normal text-sm">
                    {p}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )
      case 'qrcode':
        return (
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            O QR code único por participante será gerado automaticamente no momento do envio.
          </p>
        )
    }
  }

  return (
    <Card className="mb-4 relative group border-slate-200">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10 bg-background rounded-md shadow-sm border p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={() => onMove(index, 'down')}
          disabled={index === totalBlocks - 1}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(block.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <CardContent className="p-4 pt-5">
        <div className="mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-1 rounded-sm">
            {block.type}
          </span>
        </div>
        {renderFields()}
      </CardContent>
    </Card>
  )
}
