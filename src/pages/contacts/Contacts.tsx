import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Users, Plus, ShieldAlert, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AddContactDialog } from '@/components/contacts/AddContactDialog'
import { Contact } from '@/types/contact'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

type Role = 'admin' | 'operacao' | 'gestor'

const MOCK_CONTACTS: Contact[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `mock-${i}`,
  firstName: 'Participante',
  lastName: `${i + 1}`,
  email: `part${i + 1}@adapta.com`,
  cpf: '12345678901',
  phone: '11999999999',
  company: 'Adapta Corp',
  eventId: 'evt-123',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}))

export default function Contacts() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [allContacts, setAllContacts] = useState<Contact[]>(MOCK_CONTACTS)
  const [displayedContacts, setDisplayedContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [userRole, setUserRole] = useState<Role>('admin')

  const totalPages = Math.max(1, Math.ceil(allContacts.length / pageSize))
  const canAddContact = userRole === 'admin' || userRole === 'operacao'

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const start = (page - 1) * pageSize
      setDisplayedContacts(allContacts.slice(start, start + pageSize))
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [page, pageSize, allContacts])

  const handleSuccess = (newContact: Contact) => {
    setAllContacts((prev) => [newContact, ...prev])
    setPage(1)
  }

  const handleDelete = (id: string) => {
    setAllContacts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex justify-end mb-4 gap-2 border-b pb-4">
        <span className="text-sm text-muted-foreground self-center mr-2">Simular Perfil:</span>
        {(['admin', 'operacao', 'gestor'] as Role[]).map((r) => (
          <Button
            key={r}
            variant={userRole === r ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUserRole(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <PageHeader title="Contatos" />
        <div className="flex items-center">
          {canAddContact ? (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" /> Adicionar Contato
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block cursor-not-allowed">
                  <Button disabled className="gap-2 pointer-events-none">
                    <Plus className="h-4 w-4" /> Adicionar Contato
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" /> Apenas Admin e Operação podem
                  adicionar
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {allContacts.length === 0 && !loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center border-dashed border-2 rounded-lg bg-card text-card-foreground">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-primary/40" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h2>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            Os contatos aparecerão aqui assim que as inscrições começarem.
          </p>
          {canAddContact && (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" /> Adicionar Contato
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    Nome
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    Sobrenome
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    Email
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700 dark:text-slate-300">
                    CPF
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-700 dark:text-slate-300">
                    Telefone
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    Empresa
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : displayedContacts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{c.firstName}</TableCell>
                        <TableCell>{c.lastName}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {c.phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}
                        </TableCell>
                        <TableCell>{c.company}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(c.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="text-sm text-muted-foreground">
              {allContacts.length} contatos encontrados
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Por página</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(v) => {
                    setPageSize(Number(v))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1
                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => setPage(p)}
                            className="cursor-pointer h-8 w-8"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (p === page - 2 || p === page + 2) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationEllipsis className="h-8 w-8" />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={
                        page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
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
