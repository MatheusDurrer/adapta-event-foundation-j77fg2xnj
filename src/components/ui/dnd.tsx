import React, { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropResult {
  source: { index: number; droppableId: string }
  destination: { index: number; droppableId: string } | null
}

const DndContext = createContext<{
  draggedIndex: number | null
  setDraggedIndex: (idx: number | null) => void
  dragOverIndex: number | null
  setDragOverIndex: (idx: number | null) => void
  onDragEnd: (result: DropResult) => void
}>({
  draggedIndex: null,
  setDraggedIndex: () => {},
  dragOverIndex: null,
  setDragOverIndex: () => {},
  onDragEnd: () => {},
})

export function DragDropContext({
  onDragEnd,
  children,
}: {
  onDragEnd: (result: DropResult) => void
  children: ReactNode
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  return (
    <DndContext.Provider
      value={{
        draggedIndex,
        setDraggedIndex,
        dragOverIndex,
        setDragOverIndex,
        onDragEnd,
      }}
    >
      <div className={cn(draggedIndex !== null && 'select-none')}>{children}</div>
    </DndContext.Provider>
  )
}

export function Droppable({
  droppableId,
  children,
}: {
  droppableId: string
  children: (provided: any) => ReactNode
}) {
  const { draggedIndex, dragOverIndex, onDragEnd, setDraggedIndex, setDragOverIndex } =
    useContext(DndContext)

  return children({
    droppableProps: {
      'data-droppable-id': droppableId,
      onDragOver: (e: any) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      },
      onDrop: (e: any) => {
        e.preventDefault()
        if (draggedIndex !== null) {
          if (dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            onDragEnd({
              source: { index: draggedIndex, droppableId },
              destination: { index: dragOverIndex, droppableId },
            })
          } else {
            onDragEnd({
              source: { index: draggedIndex, droppableId },
              destination: null,
            })
          }
        }
        setDraggedIndex(null)
        setDragOverIndex(null)
      },
    },
    innerRef: () => {},
    placeholder: <div className="hidden" />,
  })
}

export function Draggable({
  draggableId,
  index,
  children,
}: {
  draggableId: string
  index: number
  children: (provided: any, snapshot: any) => ReactNode
}) {
  const { draggedIndex, setDraggedIndex, dragOverIndex, setDragOverIndex } = useContext(DndContext)

  const isDragging = draggedIndex === index
  const isDragOver = dragOverIndex === index

  return children(
    {
      innerRef: () => {},
      draggableProps: {
        draggable: true,
        onDragStart: (e: any) => {
          setDraggedIndex(index)
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', index.toString())
        },
        onDragEnter: (e: any) => {
          e.preventDefault()
          if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index)
          }
        },
        onDragEnd: () => {
          setDraggedIndex(null)
          setDragOverIndex(null)
        },
        style: isDragOver
          ? {
              border: '2px dashed #93c5fd', // light blue border on drag over
              backgroundColor: 'hsl(var(--accent))',
              borderRadius: '0.375rem',
            }
          : undefined,
      },
      dragHandleProps: {
        className: cn(
          'text-muted-foreground hover:text-primary transition-colors',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        ),
      },
    },
    { isDragging },
  )
}
