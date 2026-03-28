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
import { User } from 'lucide-react'

const COLUMNS: { id: SupplierStatus; label: string; color: string }[] = [
  { id: 'PROSPECTING', label: 'Base de Fornecedores', color: 'bg-yellow-500' },
  { id: 'CONTRACTED', label: 'Contratado', color: 'bg-blue-500' },
  { id: 'ACTIVE', label: 'Ativo', color: 'bg-green-500' },
]

export function SupplierKanban() {
  const { suppliers, updateSupplierStatus } = useSuppliers()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px] pb-6">
      {COLUMNS.map((col) => {
        const columnSuppliers = suppliers.filter((s) => s.status === col.id)

        return (
          <div key={col.id} className="flex flex-col gap-4 bg-muted/40 p-4 rounded-xl border">
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
                  className="cursor-default shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h4
                          className="font-semibold text-sm line-clamp-1"
                          title={supplier.companyName}
                        >
                          {supplier.companyName}
                        </h4>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                          {supplier.type}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5 mt-2">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">{supplier.responsibleName}</span>
                      </div>
                    </div>

                    <Select
                      value={supplier.status}
                      onValueChange={(val) =>
                        updateSupplierStatus(supplier.id, val as SupplierStatus)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
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
                  </CardContent>
                </Card>
              ))}

              {columnSuppliers.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/60 border-2 border-dashed rounded-lg p-6 text-center">
                  Nenhum fornecedor nesta coluna
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
