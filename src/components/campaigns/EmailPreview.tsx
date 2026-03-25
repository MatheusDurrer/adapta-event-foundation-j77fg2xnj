import { CampaignBlock } from '@/types/campaign'
import { QrCode, Linkedin, Instagram, Youtube, Twitter, Facebook } from 'lucide-react'

interface EmailPreviewProps {
  blocks: CampaignBlock[]
}

export function EmailPreview({ blocks }: EmailPreviewProps) {
  return (
    <div className="w-full bg-slate-100 min-h-[600px] flex justify-center py-8 px-4 rounded-lg border">
      <div className="w-full max-w-[600px] bg-white shadow-sm rounded-md overflow-hidden flex flex-col">
        {blocks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <QrCode className="h-8 w-8 text-slate-300" />
            </div>
            <p>Seu email está vazio.</p>
            <p className="text-sm">Adicione blocos para começar a montar sua campanha.</p>
          </div>
        ) : (
          blocks.map((block) => <PreviewBlock key={block.id} block={block} />)
        )}
      </div>
    </div>
  )
}

function PreviewBlock({ block }: { block: CampaignBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="px-6 py-4" style={{ textAlign: block.align as any }}>
          <p className="text-slate-800 whitespace-pre-wrap">{block.content}</p>
        </div>
      )
    case 'image':
      return (
        <div className="w-full flex justify-center">
          <img
            src={block.imageUrl}
            alt="Email banner"
            style={{ width: block.width || '100%', height: block.height || 'auto' }}
            className="max-w-full object-cover"
          />
        </div>
      )
    case 'button':
      return (
        <div className="px-6 py-4 flex justify-center">
          <a
            href={block.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded text-white font-medium text-center no-underline"
            style={{ backgroundColor: block.color || '#0f172a' }}
          >
            {block.label}
          </a>
        </div>
      )
    case 'divider':
      return (
        <div className="px-6 py-2">
          <hr style={{ borderColor: block.color || '#e2e8f0' }} />
        </div>
      )
    case 'spacer':
      return <div style={{ height: `${block.height}px` }} />
    case 'social':
      return (
        <div className="px-6 py-4 flex justify-center gap-4">
          {block.platforms.map((p) => (
            <div
              key={p}
              className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"
            >
              {p === 'LinkedIn' && <Linkedin className="h-4 w-4" />}
              {p === 'Instagram' && <Instagram className="h-4 w-4" />}
              {p === 'YouTube' && <Youtube className="h-4 w-4" />}
              {p === 'X' && <Twitter className="h-4 w-4" />}
              {p === 'Facebook' && <Facebook className="h-4 w-4" />}
            </div>
          ))}
        </div>
      )
    case 'qrcode':
      return (
        <div className="px-6 py-8 flex flex-col items-center justify-center bg-slate-50 border-y border-slate-100">
          <div className="p-4 bg-white border border-slate-200 rounded shadow-sm mb-3">
            <QrCode className="h-24 w-24 text-slate-800" />
          </div>
          <p className="text-xs text-slate-500 max-w-[250px] text-center">
            QR code único por participante será gerado automaticamente no envio.
          </p>
        </div>
      )
    default:
      return null
  }
}
