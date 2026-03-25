import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function Campaigns() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Campanhas" />
      <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <Mail className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Gestão de Campanhas</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Crie e dispare e-mails em massa para a base de contatos do seu evento.
        </p>
      </Card>
    </div>
  )
}
