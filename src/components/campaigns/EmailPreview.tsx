import { CampaignBlock } from '@/types/campaign'
import { QrCode, Linkedin, Instagram, Youtube, Twitter, Facebook } from 'lucide-react'

interface EmailPreviewProps {
  blocks: CampaignBlock[]
}

export function EmailPreview({ blocks }: EmailPreviewProps) {
  return (
    <div className="w-full bg-white shadow-subtle border-[1px] border-border rounded-md overflow-hidden flex flex-col">
      {blocks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center bg-slate-50 min-h-[400px]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
            <QrCode className="h-8 w-8 text-slate-300" />
          </div>
          <p className="font-medium text-slate-600 mb-1">Preview Vazio</p>
          <p className="text-sm text-slate-400">Os blocos adicionados aparecerão aqui.</p>
        </div>
      ) : (
        <div className="flex flex-col w-full bg-white">
          {blocks.map((block) => (
            <PreviewBlock key={block.id} block={block} />
          ))}
        </div>
      )}
    </div>
  )
}

function PreviewBlock({ block }: { block: CampaignBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="px-6 py-4" style={{ textAlign: block.align as any }}>
          <p className="text-[1rem] leading-[1.5] text-slate-700 whitespace-pre-wrap font-sans">
            {block.content}
          </p>
        </div>
      )
    case 'image':
      return (
        <div className="w-full flex justify-center">
          <img
            src={block.imageUrl}
            alt="Email banner"
            className="w-full h-auto object-cover block"
            style={{ maxWidth: '100%', border: 'none' }}
          />
        </div>
      )
    case 'button':
      return (
        <div className="px-6 py-6 flex justify-center">
          <a
            href={block.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-md text-white font-[600] text-center no-underline text-base shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: block.color || '#0f172a' }}
          >
            {block.label}
          </a>
        </div>
      )
    case 'divider':
      return (
        <div className="px-6 py-4">
          <hr className="border-t-[1px]" style={{ borderColor: block.color || '#e2e8f0' }} />
        </div>
      )
    case 'spacer':
      return <div style={{ height: `${block.height}px` }} className="w-full" />
    case 'social':
      return (
        <div className="px-6 py-6 flex flex-row justify-center gap-[1rem]">
          {block.platforms.map((p) => (
            <a
              key={p}
              href="#"
              className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
            >
              {p === 'LinkedIn' && <Linkedin className="h-5 w-5" />}
              {p === 'Instagram' && <Instagram className="h-5 w-5" />}
              {p === 'YouTube' && <Youtube className="h-5 w-5" />}
              {p === 'X' && <Twitter className="h-5 w-5" />}
              {p === 'Facebook' && <Facebook className="h-5 w-5" />}
              {p === 'Pinterest' && <div className="font-bold font-serif text-lg">P</div>}
            </a>
          ))}
        </div>
      )
    case 'qrcode':
      return (
        <div className="px-6 py-10 flex flex-col items-center justify-center bg-white text-black">
          <div
            className="w-[200px] h-[200px] bg-white border-[10px] border-white flex items-center justify-center relative shadow-sm"
            style={{ padding: '10px', boxSizing: 'border-box' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <rect
                x="5"
                y="5"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <rect x="10" y="10" width="15" height="15" />
              <rect
                x="70"
                y="5"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <rect x="75" y="10" width="15" height="15" />
              <rect
                x="5"
                y="70"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <rect x="10" y="75" width="15" height="15" />
              <rect x="40" y="5" width="10" height="10" />
              <rect x="55" y="15" width="10" height="10" />
              <rect x="5" y="40" width="10" height="10" />
              <rect x="25" y="50" width="10" height="10" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="70" y="40" width="10" height="10" />
              <rect x="85" y="50" width="10" height="10" />
              <rect x="40" y="70" width="10" height="10" />
              <rect x="55" y="85" width="10" height="10" />
              <rect x="70" y="70" width="25" height="25" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-center font-medium text-slate-700">
            QR code unico por participante sera gerado ao enviar
          </p>
        </div>
      )
    default:
      return null
  }
}
