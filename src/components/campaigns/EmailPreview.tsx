import { CampaignBlock } from '@/types/campaign'
import { QrCode, Linkedin, Instagram, Youtube, Twitter, Facebook } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

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
    case 'qrcode': {
      const qrData = JSON.stringify({
        contactId: '00000000-0000-0000-0000-000000000000',
        eventId: '00000000-0000-0000-0000-000000000000',
        firstName: 'Preview',
        lastName: 'User',
        company: 'Company',
      })

      return (
        <div className="px-6 py-10 flex flex-col items-center justify-center bg-white text-black">
          <div
            className="bg-white flex items-center justify-center relative shadow-sm overflow-hidden"
            style={{ width: '200px', height: '200px', padding: '10px' }}
          >
            <QRCodeSVG
              value={qrData}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin={false}
            />
          </div>
        </div>
      )
    }
    default:
      return null
  }
}
