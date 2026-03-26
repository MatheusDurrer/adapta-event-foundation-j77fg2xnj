import { useRef, useEffect } from 'react'
import { CampaignBlock } from '@/types/campaign'
import { GripHorizontal, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BlockPreview } from './BlockPreview'
import { EditorForm } from './EditorForm'

interface Props {
  block: CampaignBlock
  isSelected: boolean
  onSelect: () => void
  onClickOutside: () => void
  onUpdate: (id: string, updates: Partial<CampaignBlock>) => void
  onDelete: (id: string) => void
  dragHandleProps?: any
}

export function InlineBlockEditor({
  block,
  isSelected,
  onSelect,
  onClickOutside,
  onUpdate,
  onDelete,
  dragHandleProps,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSelected && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClickOutside()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSelected, onClickOutside])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative group transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-[2px] border-primary bg-accent/30'
          : 'border-[2px] border-transparent hover:border-primary/50',
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div
        {...dragHandleProps}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-grab active:cursor-grabbing text-muted-foreground p-1 bg-background shadow-sm border rounded-md"
      >
        <GripHorizontal className="h-4 w-4" />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(block.id)
          }}
          className="p-1.5 text-destructive bg-background shadow-sm border hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className={cn('pointer-events-none transition-opacity', isSelected && 'opacity-60')}>
        <BlockPreview block={block} />
      </div>

      {isSelected && (
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
