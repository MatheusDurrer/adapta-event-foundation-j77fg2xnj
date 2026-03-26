import { CampaignBlock } from '@/types/campaign'
import { Linkedin, Instagram, Youtube, Twitter, Facebook } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export function BlockPreview({ block }: { block: CampaignBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="px-6 py-4" style={{ textAlign: block.align as any }}>
          <p className="text-[1rem] leading-[1.5] text-slate-700 whitespace-pre-wrap font-sans">
            {block.content || 'Digite seu texto...'}
          </p>
        </div>
      )
    case 'image':
      return (
        <div className="w-full flex justify-center">
          <img
            src={block.imageUrl || 'https://img.usecurling.com/p/600/300?q=placeholder'}
            alt="Email banner"
            className="w-full h-auto object-cover block"
            style={{ maxWidth: '100%', border: 'none' }}
          />
        </div>
      )
    case 'button':
      return (
        <div className="px-6 py-6 flex justify-center">
          <span
            className="inline-block px-8 py-3 rounded-md text-white font-[600] text-center no-underline text-base shadow-sm"
            style={{ backgroundColor: block.color || '#0f172a' }}
          >
            {block.label || 'Clique Aqui'}
          </span>
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
            <span
              key={p}
              className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"
            >
              {p === 'LinkedIn' && <Linkedin className="h-5 w-5" />}
              {p === 'Instagram' && <Instagram className="h-5 w-5" />}
              {p === 'YouTube' && <Youtube className="h-5 w-5" />}
              {p === 'X' && <Twitter className="h-5 w-5" />}
              {p === 'Facebook' && <Facebook className="h-5 w-5" />}
              {p === 'Pinterest' && <div className="font-bold font-serif text-lg">P</div>}
            </span>
          ))}
        </div>
      )
    case 'qrcode': {
      const qrData = JSON.stringify({ preview: true })
      return (
        <div className="px-6 py-10 flex flex-col items-center justify-center bg-white text-black">
          <div className="flex items-center justify-center bg-white border-[2px] border-solid border-border rounded-md shadow-sm w-[200px] h-[200px]">
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
