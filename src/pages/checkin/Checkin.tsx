import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { QrCode } from 'lucide-react'

export default function Checkin() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Check-in" />
      <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <QrCode className="h-10 w-10 text-primary/40" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Controle de Acesso</h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          Prepare-se para escanear QR Codes e gerenciar a entrada dos participantes no dia do
          evento.
        </p>
      </Card>
    </div>
  )
}
