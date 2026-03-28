import { useSuppliers } from './SuppliersContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SupplierStatus } from './types'

const STATUS_MAP: Record<
  SupplierStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  PROSPECTING: { label: 'Prospecção', variant: 'secondary' },
  CONTRACTED: { label: 'Contratado', variant: 'outline' },
  ACTIVE: { label: 'Ativo', variant: 'default' },
}

export function SupplierList() {
  const { suppliers } = useSuppliers()

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Nenhum fornecedor cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.companyName}</TableCell>
                <TableCell>{supplier.responsibleName}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.cnpj}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{supplier.phone}</span>
                    <span className="text-muted-foreground text-xs">{supplier.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {supplier.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_MAP[supplier.status].variant}>
                    {STATUS_MAP[supplier.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
