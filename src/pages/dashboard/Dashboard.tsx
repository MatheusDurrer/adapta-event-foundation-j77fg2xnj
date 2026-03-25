import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Ticket, CheckCircle2, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Métricas" backTo="/" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Inscritos', value: '2.350', icon: Users, trend: '+12%' },
          { title: 'Ingressos Vendidos', value: '1.842', icon: Ticket, trend: '+8%' },
          { title: 'Check-ins', value: '940', icon: CheckCircle2, trend: '+24%' },
          { title: 'Receita', value: 'R$ 45.200', icon: TrendingUp, trend: '+18%' },
        ].map((stat, i) => (
          <Card
            key={i}
            className="animate-slide-up shadow-sm border-border/50 hover:border-primary/20 transition-colors"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-green-500 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.trend} este mês
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card
          className="min-h-[400px] flex flex-col justify-center items-center border-dashed border-2 animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BarChartPlaceholder className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Gráfico de Inscrições</p>
          <p className="text-sm text-muted-foreground/60">Área reservada para widget detalhado</p>
        </Card>

        <Card
          className="min-h-[400px] flex flex-col justify-center items-center border-dashed border-2 animate-slide-up"
          style={{ animationDelay: '500ms' }}
        >
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <PieChartPlaceholder className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Origem dos Participantes</p>
          <p className="text-sm text-muted-foreground/60">Área reservada para widget detalhado</p>
        </Card>
      </div>
    </div>
  )
}

function BarChartPlaceholder(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function PieChartPlaceholder(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}
