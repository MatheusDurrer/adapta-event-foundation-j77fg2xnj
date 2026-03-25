import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Algo deu errado.</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
          </p>
          <Button size="lg" onClick={() => window.location.reload()}>
            Recarregar a página
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
