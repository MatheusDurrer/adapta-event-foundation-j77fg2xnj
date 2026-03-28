import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Database, Mail } from 'lucide-react'

export function IntegrationsSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações do sistema</CardTitle>
        <CardDescription>
          Visualize e entenda os propósitos dos serviços externos conectados à aplicação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="supabase" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Database className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-medium leading-none mb-1.5">Supabase</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Banco de Dados e Infraestrutura
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-[4rem] text-muted-foreground">
              O Supabase é a espinha dorsal da nossa aplicação. Ele é responsável por armazenar{' '}
              <strong className="font-semibold text-foreground">
                toda a base de dados dos participantes
              </strong>
              , gerenciar a autenticação segura dos usuários e manter o estado em tempo real da
              plataforma.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resend" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-base font-medium leading-none mb-1.5">Resend</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Plataforma de E-mail
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-[4rem] text-muted-foreground">
              O Resend atua como a nossa{' '}
              <strong className="font-semibold text-foreground">
                plataforma de envio de emails em massa
              </strong>
              . Ele garante que as comunicações do sistema, desde convites de eventos até alertas
              cruciais, cheguem com alta confiabilidade e rapidez à caixa de entrada dos
              destinatários.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
