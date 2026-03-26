import { useRef, useEffect } from 'react'
import { CampaignBlock } from '@/types/campaign'
import {
  GripHorizontal,
  Trash2,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { QRCodeSVG } from 'qrcode.react'
import { EditorForm } from './EditorForm'

interface Props {
  block: CampaignBlock
  isSelected?: boolean
  onSelect?: () => void
  onClickOutside?: () => void
  onUpdate?: (id: string, updates: Partial<CampaignBlock>) => void
  onDelete?: (id: string) => void
  dragHandleProps?: any
  isEditingEnabled?: boolean
}

export function BlockPreview({
  block,
  isSelected,
  onSelect,
  onClickOutside,
  onUpdate,
  onDelete,
  dragHandleProps,
  isEditingEnabled = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEditingEnabled) return
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelected && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClickOutside?.()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSelected, onClickOutside, isEditingEnabled])

  const renderContent = () => {
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

  if (!isEditingEnabled) {
    return renderContent()
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative group transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-[2px] border-primary bg-accent/30'
          : 'border-[2px] border-transparent hover:border-purple-300',
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
    >
      <div
        {...dragHandleProps}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-grab active:cursor-grabbing text-muted-foreground p-1 bg-background shadow-sm border rounded-md"
      >
        <GripHorizontal className="h-5 w-5" />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(block.id)
          }}
          className="p-1.5 text-destructive bg-background shadow-sm border hover:bg-destructive hover:text-white rounded-md transition-colors cursor-pointer"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className={cn('pointer-events-none transition-opacity', isSelected && 'opacity-60')}>
        {renderContent()}
      </div>

      {isSelected && onUpdate && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 min-w-[320px] max-w-[90%] bg-white border-[1px] border-primary rounded-md p-4 shadow-xl cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <EditorForm block={block} onUpdate={(updates) => onUpdate(block.id, updates)} />
        </div>
      )}
    </div>
  )
}
