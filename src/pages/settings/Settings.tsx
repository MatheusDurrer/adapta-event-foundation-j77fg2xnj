import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, Sliders, Webhook } from 'lucide-react'

import { PlatformSettings } from './PlatformSettings'
import { UserCreation } from './UserCreation'
import { IntegrationsSettings } from './IntegrationsSettings'

export default function Settings() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Configurações" />

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Configurações da plataforma</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Criação de novo usuário</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span>Integrações do sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="animate-fade-in-up">
          <PlatformSettings />
        </TabsContent>

        <TabsContent value="users" className="animate-fade-in-up">
          <UserCreation />
        </TabsContent>

        <TabsContent value="integrations" className="animate-fade-in-up">
          <IntegrationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
