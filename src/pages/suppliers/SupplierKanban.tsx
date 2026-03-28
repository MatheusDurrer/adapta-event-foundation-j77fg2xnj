import { useState } from 'react'
import { useSuppliers } from './SuppliersContext'
import { SupplierStatus } from './types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLUMNS: { id: SupplierStatus; label: string; color: string }[] = [
  { id: 'PROSPECTING', label: 'Base de Fornecedores', color: 'bg-yellow-500' },
  { id: 'ACTIVE', label: 'Ativo', color: 'bg-green-500' },
]

export function SupplierKanban() {
  const { suppliers, updateSupplierStatus } = useSuppliers()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<SupplierStatus | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, columnId: SupplierStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, columnId: SupplierStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    const supplierId = e.dataTransfer.getData('text/plain')
    if (supplierId) {
      updateSupplierStatus(supplierId, columnId)
    }
    setDraggingId(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[500px] pb-6">
      {COLUMNS.map((col) => {
        const columnSuppliers = suppliers.filter((s) => s.status === col.id)

        return (
          <div
            key={col.id}
            className={cn(
              'flex flex-col gap-4 bg-muted/40 p-4 rounded-xl border transition-colors duration-200',
              dragOverColumn === col.id ? 'bg-muted/80 border-primary shadow-sm' : '',
            )}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <h3 className="font-semibold">{col.label}</h3>
              </div>
              <Badge variant="secondary">{columnSuppliers.length}</Badge>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {columnSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, supplier.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all',
                    draggingId === supplier.id ? 'opacity-50 scale-95 ring-2 ring-primary' : '',
                  )}
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                          <h4
                            className="font-semibold text-sm line-clamp-1"
                            title={supplier.companyName}
                          >
                            {supplier.companyName}
                          </h4>
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 shrink-0">
                          {supplier.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-2 pl-6">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">{supplier.responsibleName}</span>
                      </div>
                    </div>

                    <div className="pl-6">
                      <Select
                        value={supplier.status}
                        onValueChange={(val) =>
                          updateSupplierStatus(supplier.id, val as SupplierStatus)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMNS.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">
                              Mover para {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {columnSuppliers.length === 0 && (
                <div
                  className={cn(
                    'flex-1 flex items-center justify-center text-sm text-muted-foreground/60 border-2 border-dashed rounded-lg p-6 text-center transition-colors min-h-[120px]',
                    dragOverColumn === col.id ? 'border-primary/50 text-primary bg-primary/5' : '',
                  )}
                >
                  Arraste fornecedores para cá
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
