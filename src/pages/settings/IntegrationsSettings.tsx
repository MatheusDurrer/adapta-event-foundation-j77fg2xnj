import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Webhook } from 'lucide-react'

export function IntegrationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações do sistema</CardTitle>
        <CardDescription>
          Conecte a plataforma com outras ferramentas que você já usa no dia a dia.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[40vh] flex flex-col items-center justify-center border-t border-dashed bg-muted/20">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Webhook className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-1">Integrações Externas</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Configure webhooks, gerencie chaves de API e estabeleça conexões seguras com serviços de
          terceiros essenciais para sua operação.
        </p>
      </CardContent>
    </Card>
  )
}
