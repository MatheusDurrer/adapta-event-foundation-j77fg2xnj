import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Plus, Search, MoreHorizontal, Copy, Trash, Eye, CalendarClock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { PageHeader } from '@/components/shared/PageHeader'
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
      // Mocking eventId 123 for now
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

  const renderTable = (statusFilter: string[]) => {
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
        <div className="min-h-[40vh] flex flex-col items-center justify-center border-dashed rounded-lg border bg-muted/20 my-6">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-1">Nenhuma campanha encontrada</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Crie uma nova campanha para interagir com seus contatos.
          </p>
          <Button onClick={() => navigate('/campaigns/new')}>
            <Plus className="h-4 w-4 mr-2" /> Nova Campanha
          </Button>
        </div>
      )
    }

    return (
      <div className="bg-card rounded-md border mt-4 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Assunto</TableHead>
              <TableHead>Destinatários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">
                  {campaign.subject || (
                    <span className="italic text-muted-foreground">Sem assunto</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.recipientListId === 'all' ? 'Todos os contatos' : 'Lista Específica'}
                </TableCell>
                <TableCell>
                  {campaign.status === 'sent' && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-0">
                      Enviada
                    </Badge>
                  )}
                  {campaign.status === 'draft' && (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      Rascunho
                    </Badge>
                  )}
                  {campaign.status === 'scheduled' && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-0 flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" /> Agendada
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
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
    )
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <PageHeader title="Campanhas" />
          <p className="text-muted-foreground mt-[-1.5rem] mb-2 max-w-2xl text-base">
            Crie e envie campanhas de email para seus contatos.
          </p>
        </div>
        <Button
          size="lg"
          className="shadow-sm font-semibold h-11"
          onClick={() => navigate('/campaigns/new')}
        >
          <Plus className="mr-2 h-5 w-5" /> Nova Campanha
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar campanhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 bg-background"
          />
        </div>
      </div>

      <Tabs defaultValue="drafts" className="w-full">
        <TabsList className="h-11 w-full sm:w-auto bg-muted/50 p-1 mb-2">
          <TabsTrigger value="drafts" className="h-9 px-6 font-medium">
            Rascunhos
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="h-9 px-6 font-medium">
            Agendadas
          </TabsTrigger>
          <TabsTrigger value="sent" className="h-9 px-6 font-medium">
            Enviadas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="drafts" className="m-0 border-0 outline-none">
          {renderTable(['draft'])}
        </TabsContent>
        <TabsContent value="scheduled" className="m-0 border-0 outline-none">
          {renderTable(['scheduled'])}
        </TabsContent>
        <TabsContent value="sent" className="m-0 border-0 outline-none">
          {renderTable(['sent'])}
        </TabsContent>
      </Tabs>
    </div>
  )
}
