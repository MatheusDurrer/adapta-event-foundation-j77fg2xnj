import { CampaignBlock } from '@/types/campaign'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export function EditorForm({
  block,
  onUpdate,
}: {
  block: CampaignBlock
  onUpdate: (u: any) => void
}) {
  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-3">
          <Label>Texto</Label>
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="min-h-[100px]"
            autoFocus
          />
        </div>
      )
    case 'image':
      return (
        <div className="space-y-3">
          <Label>Upload de Imagem</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                const url = URL.createObjectURL(e.target.files[0])
                onUpdate({ imageUrl: url })
              }
            }}
          />
          <div className="text-xs text-muted-foreground text-center font-medium">OU</div>
          <Label>URL da Imagem</Label>
          <Input
            value={block.imageUrl}
            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      )
    case 'button':
      return (
        <div className="space-y-3">
          <div>
            <Label>Texto do Botão</Label>
            <Input
              value={block.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <Label>Link de Destino</Label>
            <Input value={block.link} onChange={(e) => onUpdate({ link: e.target.value })} />
          </div>
          <div>
            <Label>Cor de Fundo</Label>
            <div className="flex h-10 w-full rounded-md border border-input p-1 overflow-hidden">
              <input
                type="color"
                value={block.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="h-full w-full border-0 bg-transparent p-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )
    case 'divider':
      return (
        <div className="space-y-3">
          <Label>Cor da Linha</Label>
          <div className="flex h-10 w-full rounded-md border border-input p-1 overflow-hidden">
            <input
              type="color"
              value={block.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="h-full w-full border-0 bg-transparent p-0 cursor-pointer"
            />
          </div>
        </div>
      )
    case 'spacer':
      return (
        <div className="space-y-3">
          <Label>Altura (px)</Label>
          <Input
            type="number"
            value={block.height}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 10 })}
            min={5}
            max={200}
          />
        </div>
      )
    case 'social': {
      const platforms = ['LinkedIn', 'YouTube', 'X', 'Instagram', 'Facebook', 'Pinterest']
      return (
        <div className="space-y-3">
          <Label>Redes Sociais Exibidas</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {platforms.map((p) => (
              <label
                key={p}
                className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
              >
                <Checkbox
                  checked={block.platforms.includes(p)}
                  onCheckedChange={(c) => {
                    const newPlats = c
                      ? [...block.platforms, p]
                      : block.platforms.filter((x) => x !== p)
                    onUpdate({ platforms: newPlats })
                  }}
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      )
    }
    case 'qrcode':
      return (
        <div className="text-sm text-center p-2 text-muted-foreground font-medium">
          Nenhuma configuração necessária. O QR Code será gerado automaticamente para cada
          participante no momento do envio.
        </div>
      )
    default:
      return null
  }
}
