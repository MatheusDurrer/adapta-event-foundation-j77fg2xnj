import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, BookOpen, Settings, Link as LinkIcon } from 'lucide-react'

export default function Help() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader title="Central de Ajuda" />

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6 border-b border-border/50 bg-muted/20">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Perguntas Frequentes (FAQ)</CardTitle>
            <CardDescription className="text-base mt-1">
              Encontre respostas rápidas para as dúvidas mais comuns sobre o sistema e suas
              funcionalidades.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem
              value="overview"
              className="border rounded-lg px-4 border-border/50 data-[state=open]:bg-muted/10 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <div className="flex items-center gap-3 font-semibold text-base">
                  <BookOpen className="h-5 w-5 text-primary/70" />
                  Qual é o propósito geral da plataforma?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-base">
                O Adapta Event é uma fundação completa para gestão de eventos. Nossa plataforma
                permite o controle centralizado de métricas, gestão de contatos, campanhas de
                comunicação em massa, check-in de participantes e controle de fornecedores. Tudo
                isso em uma interface moderna, responsiva e projetada para otimizar a organização e
                execução do seu evento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="settings"
              className="border rounded-lg px-4 border-border/50 data-[state=open]:bg-muted/10 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <div className="flex items-center gap-3 font-semibold text-base">
                  <Settings className="h-5 w-5 text-primary/70" />
                  Como funcionam as Configurações da plataforma?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-base space-y-4">
                <p>
                  A aba de configurações permite personalizar sua experiência e administrar os
                  acessos ao sistema:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong className="text-foreground font-medium">Aparência do Sistema:</strong>{' '}
                    Você pode alternar facilmente entre o tema <strong>Claro</strong> e o tema{' '}
                    <strong>Escuro</strong> (Dark mode). O tema escuro é ideal para ambientes com
                    pouca iluminação, reduzindo o cansaço visual.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">
                      Gerenciamento de Usuários:
                    </strong>{' '}
                    Fornecemos uma lista completa e detalhada de todos os usuários com acesso ao
                    sistema. A partir dessa lista, os administradores têm a capacidade de visualizar
                    informações cadastrais e excluir usuários que não devem mais ter acesso à
                    plataforma.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="integrations"
              className="border rounded-lg px-4 border-border/50 data-[state=open]:bg-muted/10 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <div className="flex items-center gap-3 font-semibold text-base">
                  <LinkIcon className="h-5 w-5 text-primary/70" />
                  Para que servem as Integrações do sistema?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 text-base space-y-4">
                <p>
                  O sistema se conecta de forma segura a ferramentas externas essenciais para
                  garantir alto desempenho:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong className="text-foreground font-medium">
                      Supabase (Banco de Dados):
                    </strong>{' '}
                    Atua como nosso banco de dados central. É nele que todas as informações
                    críticas, como a lista de participantes, contatos e usuários, são armazenadas
                    com segurança e alta disponibilidade.
                  </li>
                  <li>
                    <strong className="text-foreground font-medium">Resend (Comunicação):</strong> É
                    a infraestrutura de envios integrada ao sistema, utilizada exclusivamente para
                    processar os e-mails em massa gerados pelas suas campanhas de comunicação,
                    garantindo alta taxa de entrega.
                  </li>
                </ul>
                <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20 flex items-start gap-3">
                  <span className="text-xl leading-none pt-0.5">💡</span>
                  <div>
                    <strong className="text-foreground block mb-1">Dica de uso interativo:</strong>
                    <span className="text-sm">
                      Na página de Configurações, na seção de integrações, você pode clicar
                      diretamente sobre os "cards" (cartões) de cada serviço. Essa ação revelará
                      mais detalhes de conexão e configurações avançadas de cada provedor.
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
