import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Plus, Search, MoreHorizontal, Copy, Trash, Eye, CalendarClock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getCampaigns, deleteCampaign } from '@/services/campaignService'
import { Campaign } from '@/types/campaign'
import { useToast } from '@/hooks/use-toast'

export default function Campaigns() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoading(true)
    try {
      const data = await getCampaigns('event-123')
      setCampaigns(data)
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao carregar campanhas.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta campanha?')) return
    try {
      await deleteCampaign(id)
      setCampaigns((prev) => prev.filter((c) => c.id !== id))
      toast({ title: 'Excluída', description: 'Campanha removida com sucesso.' })
    } catch {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao excluir.' })
    }
  }

  const filtered = campaigns.filter((c) => c.subject?.toLowerCase().includes(search.toLowerCase()))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge className="bg-accent text-accent-foreground px-3 py-1 text-[0.75rem] rounded-full font-medium border-0 hover:bg-accent/80">
            Rascunho
          </Badge>
        )
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-900 px-3 py-1 text-[0.75rem] rounded-full font-medium border-0 hover:bg-blue-200">
            <CalendarClock className="h-3 w-3 mr-1 inline-block" /> Agendada
          </Badge>
        )
      case 'sent':
        return (
          <Badge className="bg-green-100 text-green-900 px-3 py-1 text-[0.75rem] rounded-full font-medium border-0 hover:bg-green-200">
            Enviada
          </Badge>
        )
      default:
        return null
    }
  }

  const renderContent = (statusFilter: string[]) => {
    const items = filtered.filter((c) => statusFilter.includes(c.status))

    if (isLoading) {
      return (
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      )
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-[3rem] border-dashed rounded-lg border bg-muted/10 my-6 text-center">
          <div className="h-[3rem] w-[3rem] text-muted-foreground mb-4">
            <Mail className="h-full w-full opacity-60" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-1">Nenhuma campanha encontrada</h2>
          <p className="text-[0.875rem] text-muted-foreground mb-6 max-w-md">
            Você ainda não possui campanhas nesta aba. Crie uma nova para interagir com seus
            contatos.
          </p>
          <Button onClick={() => navigate('/campaigns/new')}>
            <Plus className="h-4 w-4 mr-2" /> Nova Campanha
          </Button>
        </div>
      )
    }

    return (
      <div className="mt-4">
        {/* Desktop Table View */}
        <div className="hidden md:block bg-card rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/50 font-[600]">
              <TableRow>
                <TableHead className="w-[26%]">Assunto</TableHead>
                <TableHead className="w-[21%]">Destinatários</TableHead>
                <TableHead className="w-[16%]">Status</TableHead>
                <TableHead className="w-[21%]">Data de Criação</TableHead>
                <TableHead className="w-[16%] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="hover:bg-secondary/30 transition-colors border-b-[1px]"
                >
                  <TableCell className="font-medium">
                    {campaign.subject || (
                      <span className="italic text-muted-foreground">Sem assunto</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[0.875rem]">
                    {campaign.recipientListId === 'all' ? 'Todos os contatos' : 'Lista Específica'}
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-[0.875rem] text-muted-foreground">
                    {format(new Date(campaign.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Editar/Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/campaigns/new?duplicate=${campaign.id}`)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden space-y-4">
          {items.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden border border-border">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Assunto
                    </span>
                    <span className="font-medium text-base leading-snug">
                      {campaign.subject || 'Sem assunto'}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 shrink-0 -mt-1 -mr-2">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> Editar/Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col">
                  <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Destinatários
                  </span>
                  <span className="text-sm">
                    {campaign.recipientListId === 'all' ? 'Todos os contatos' : 'Lista Específica'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-start">
                    <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Status
                    </span>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.75rem] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Data de Criação
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(campaign.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2rem] font-[700] text-foreground mb-1 leading-tight">Campanhas</h1>
        <p className="text-[0.875rem] text-muted-foreground max-w-2xl">
          Crie, agende e envie comunicações profissionais por email.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[1rem] mb-6">
        <div className="relative w-full sm:max-w-[20rem]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar campanhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full bg-background"
          />
        </div>
        <div className="flex-1" />
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-[1rem] py-[0.625rem] rounded-md h-auto"
          onClick={() => navigate('/campaigns/new')}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Campanha
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="flex w-full justify-start h-auto p-0 bg-transparent border-b-[1px] border-border rounded-none">
          <TabsTrigger
            value="drafts"
            className="rounded-none border-b-[2px] border-transparent px-4 py-2.5 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Rascunhos
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="rounded-none border-b-[2px] border-transparent px-4 py-2.5 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Agendadas
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="rounded-none border-b-[2px] border-transparent px-4 py-2.5 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Enviadas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="drafts" className="m-0 border-0 outline-none">
          {renderContent(['draft'])}
        </TabsContent>
        <TabsContent value="scheduled" className="m-0 border-0 outline-none">
          {renderContent(['scheduled'])}
        </TabsContent>
        <TabsContent value="sent" className="m-0 border-0 outline-none">
          {renderContent(['sent'])}
        </TabsContent>
      </Tabs>
    </div>
  )
}
