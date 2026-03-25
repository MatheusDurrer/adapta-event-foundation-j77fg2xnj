import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export default function Help() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Ajuda" />
      <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <HelpCircle className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Central de Suporte</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Acesse tutoriais, documentação completa ou entre em contato com nossa equipe de
          especialistas.
        </p>
      </Card>
    </div>
  )
}
