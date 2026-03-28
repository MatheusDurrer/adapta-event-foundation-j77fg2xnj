import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, List } from 'lucide-react'
import { SuppliersProvider } from './SuppliersContext'
import { SupplierForm } from './SupplierForm'
import { SupplierKanban } from './SupplierKanban'
import { SupplierList } from './SupplierList'

export default function Suppliers() {
  return (
    <SuppliersProvider>
      <div className="animate-fade-in space-y-6 pb-8">
        <div>
          <PageHeader title="Fornecedores" />
          <p className="text-muted-foreground mt-1">
            Gestão do cadastro e status de parceiros e equipes de montagem.
          </p>
        </div>

        <Tabs defaultValue="kanban" className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                <span>Lista</span>
              </TabsTrigger>
            </TabsList>

            <SupplierForm />
          </div>

          <TabsContent value="kanban" className="m-0 focus-visible:outline-none">
            <SupplierKanban />
          </TabsContent>

          <TabsContent value="list" className="m-0 focus-visible:outline-none">
            <SupplierList />
          </TabsContent>
        </Tabs>
      </div>
    </SuppliersProvider>
  )
}
