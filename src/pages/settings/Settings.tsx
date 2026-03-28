import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, Sliders, Webhook } from 'lucide-react'

export default function Settings() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Configurações" />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Criação de novo usuário</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Configurações da plataforma</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span>Integrações do sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Criação de novo usuário</CardTitle>
              <CardDescription>
                Adicione novos membros à sua equipe e configure suas permissões.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[40vh] flex flex-col items-center justify-center border-t border-dashed bg-muted/20">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Gerenciamento de Usuários</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                A interface para convidar e gerenciar usuários será implementada aqui. Configure
                acessos e papéis dentro da plataforma.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da plataforma</CardTitle>
              <CardDescription>
                Ajuste as preferências gerais e o comportamento do seu workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[40vh] flex flex-col items-center justify-center border-t border-dashed bg-muted/20">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sliders className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Preferências Gerais</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                As configurações de aparência, fuso horário, regras de negócio e campos
                personalizados ficarão disponíveis nesta seção.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="animate-fade-in-up">
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
                Configure webhooks, gerencie chaves de API e estabeleça conexões seguras com
                serviços de terceiros essenciais para sua operação.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
