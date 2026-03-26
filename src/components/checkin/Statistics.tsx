import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckinStats } from '@/types/checkin'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Percent, Clock, BarChart3, SearchX } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Button } from '@/components/ui/button'

interface StatisticsProps {
  stats: CheckinStats | null
  loading: boolean
  error?: boolean
  onRetry?: () => void
}

export function Statistics({ stats, loading, error, onRetry }: StatisticsProps) {
  if (error) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center border rounded-xl bg-card">
        <p className="text-destructive mb-4">Erro ao carregar os dados estatísticos.</p>
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Check-ins
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCheckins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Check-in
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkinRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horário de Pico
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.peakHour}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribuição por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.totalCheckins > 0 ? (
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  count: {
                    label: 'Check-ins',
                    color: 'hsl(var(--primary))',
                  },
                }}
                className="h-full w-full"
              >
                <BarChart
                  data={stats.checkinsByHour}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(val) => val.substring(0, 2) + 'h'}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground animate-in fade-in">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <SearchX className="h-8 w-8 opacity-50" />
              </div>
              <p>Nenhum check-in realizado ainda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
