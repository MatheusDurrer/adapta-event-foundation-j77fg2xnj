import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function Contacts() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Contatos" />
      <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <Users className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Os contatos do seu evento aparecerão aqui assim que as inscrições começarem.
        </p>
      </Card>
    </div>
  )
}
