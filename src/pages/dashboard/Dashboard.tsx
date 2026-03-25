import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail, AlertTriangle, XCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { MetricCard } from '@/components/dashboard/MetricCard'

const CURRENT_EVENT_ID = 'event-123'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    emailsEnviados: 0,
    emailsErro: 0,
    emailsNaoRecebidos: 0,
    checkins: 0,
  })

  const [chartData, setChartData] = useState<{ hour: string; checkins: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignResponse, contactsResponse, checkinsResponse] = await Promise.all([
          supabase.from('campaign_sends').select('*').eq('event_id', CURRENT_EVENT_ID),
          supabase.from('contacts').select('id, event_id').eq('event_id', CURRENT_EVENT_ID),
          supabase
            .from('checkins')
            .select('id, event_id, created_at')
            .eq('event_id', CURRENT_EVENT_ID),
        ])

        const sends = campaignResponse.data || []
        const contacts = contactsResponse.data || []
        const checkins = checkinsResponse.data || []

        const sentEmails = sends.filter((s: any) => s.sent_at !== null && s.sent_at !== undefined)
        const errorEmails = sends.filter(
          (s: any) => s.error_message !== null && s.error_message !== undefined,
        )

        const contactedIds = new Set(sends.map((s: any) => s.contact_id))
        const notReceivedEmails = contacts.filter((c: any) => !contactedIds.has(c.id))

        setMetrics({
          emailsEnviados: sentEmails.length,
          emailsErro: errorEmails.length,
          emailsNaoRecebidos: notReceivedEmails.length,
          checkins: checkins.length,
        })

        const hourCounts: Record<number, number> = {}
        for (let i = 0; i < 24; i++) {
          hourCounts[i] = 0
        }

        checkins.forEach((c: any) => {
          if (c.created_at) {
            const date = new Date(c.created_at)
            const hour = date.getHours()
            hourCounts[hour] = (hourCounts[hour] || 0) + 1
          }
        })

        const formattedChartData = Object.entries(hourCounts).map(([h, count]) => ({
          hour: `${h.toString().padStart(2, '0')}:00`,
          checkins: count,
        }))

        setChartData(formattedChartData)
      } catch (err) {
        console.error('Erro ao carregar métricas', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const maxCheckins = Math.max(...chartData.map((d) => d.checkins), 1)

  return (
    <div className="animate-fade-in pb-8">
      <PageHeader title="Métricas" backTo="/" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Emails Enviados"
          value={isLoading ? '-' : metrics.emailsEnviados.toString()}
          trend="+15%"
          trendUp={true}
          icon={Mail}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          delay={0}
        />
        <MetricCard
          title="Emails com Erro"
          value={isLoading ? '-' : metrics.emailsErro.toString()}
          trend="-5%"
          trendUp={true}
          icon={AlertTriangle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-900/30"
          delay={100}
        />
        <MetricCard
          title="Emails Nao Recebidos"
          value={isLoading ? '-' : metrics.emailsNaoRecebidos.toString()}
          trend="+2%"
          trendUp={false}
          icon={XCircle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-900/30"
          delay={200}
        />
        <MetricCard
          title="Check-ins"
          value={isLoading ? '-' : metrics.checkins.toString()}
          trend="+24%"
          trendUp={true}
          icon={CheckCircle2}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          delay={300}
        />
      </div>

      <div className="mt-8">
        <Card
          className="animate-slide-up shadow-sm border-border/50"
          style={{ animationDelay: '400ms' }}
        >
          <CardHeader>
            <CardTitle className="text-xl">Mapa de Horario de Check-in</CardTitle>
            <CardDescription>Visualizacao de chegadas por horario</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[350px] w-full flex flex-col gap-3 items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                <p>Processando dados de check-in...</p>
              </div>
            ) : (
              <ChartContainer
                config={{ checkins: { label: 'Check-ins', color: 'hsl(var(--primary))' } }}
                className="h-[350px] w-full"
              >
                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="checkins" fill="var(--color-checkins)" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.checkins === maxCheckins && maxCheckins > 0
                            ? 'var(--color-checkins)'
                            : 'hsl(var(--primary) / 0.4)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
