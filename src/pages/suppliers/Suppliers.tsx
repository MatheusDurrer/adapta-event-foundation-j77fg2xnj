import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Truck } from 'lucide-react'

export default function Suppliers() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Fornecedores" />
      <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <Truck className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Gestão de Fornecedores</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Mantenha o cadastro e as credenciais das equipes de montagem e parceiros.
        </p>
      </Card>
    </div>
  )
}
