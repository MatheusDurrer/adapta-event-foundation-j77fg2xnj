import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Plus, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AddContactDialog } from '@/components/contacts/AddContactDialog'
import { Contact } from '@/types/contact'

type Role = 'admin' | 'operacao' | 'gestor'

export default function Contacts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  // Simulated Role State for demonstration purposes
  const [userRole, setUserRole] = useState<Role>('admin')

  const handleSuccess = (newContact: Contact) => {
    setContacts((prev) => [...prev, newContact])
  }

  const canAddContact = userRole === 'admin' || userRole === 'operacao'

  return (
    <div className="animate-fade-in">
      {/* Dev Role Simulator Toolbar */}
      <div className="flex justify-end mb-4 gap-2 border-b pb-4">
        <span className="text-sm text-muted-foreground self-center mr-2">Simular Perfil:</span>
        <Button
          variant={userRole === 'admin' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUserRole('admin')}
        >
          Admin
        </Button>
        <Button
          variant={userRole === 'operacao' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUserRole('operacao')}
        >
          Operação
        </Button>
        <Button
          variant={userRole === 'gestor' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUserRole('gestor')}
        >
          Gestor
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8">
        <PageHeader title="Contatos" />

        <div className="flex items-center">
          {canAddContact ? (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Adicionar Contato
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block cursor-not-allowed">
                  <Button disabled className="gap-2 pointer-events-none">
                    <Plus className="h-4 w-4" />
                    Adicionar Contato
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Apenas Admin e Operação podem adicionar
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {contacts.length === 0 ? (
        <Card className="min-h-[60vh] flex flex-col items-center justify-center border-dashed">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-primary/40" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            Os contatos do seu evento aparecerão aqui assim que as inscrições começarem.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.id} className="animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {c.firstName} {c.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                  </div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full dark:bg-green-900/30 dark:text-green-400">
                    Ativo
                  </div>
                </div>
                <div className="space-y-2 text-sm pt-4 border-t border-dashed">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Empresa:</span>
                    <span className="font-medium">{c.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPF:</span>
                    <span className="font-medium">
                      {c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefone:</span>
                    <span className="font-medium">
                      {c.phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {canAddContact && (
        <AddContactDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          eventId="evt-123"
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
