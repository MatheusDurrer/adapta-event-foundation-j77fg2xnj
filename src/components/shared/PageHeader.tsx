import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PageHeader({ title, backTo }: { title: string; backTo?: string }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-4 mb-8 animate-fade-in-down">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        aria-label="Voltar"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
    </div>
  )
}
