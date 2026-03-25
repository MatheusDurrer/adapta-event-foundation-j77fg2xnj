import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-8 animate-float">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-7xl font-bold mb-4 tracking-tighter text-primary">404</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Página não encontrada. O recurso que você está procurando não existe ou foi movido.
      </p>
      <Button size="lg" onClick={() => navigate('/')} className="font-semibold px-8 h-12">
        Voltar para o Início
      </Button>
    </div>
  )
}
