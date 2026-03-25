import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  trend: string
  trendUp: boolean
  icon: LucideIcon
  iconColor: string
  iconBg: string
  delay: number
}

export function MetricCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  iconColor,
  iconBg,
  delay,
}: MetricCardProps) {
  return (
    <Card
      className="animate-slide-up shadow-sm border-border/50 hover:border-primary/20 transition-colors"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p
          className={`text-xs ${trendUp ? 'text-green-500' : 'text-red-500'} font-medium mt-2 flex items-center gap-1`}
        >
          {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend} este mês
        </p>
      </CardContent>
    </Card>
  )
}
