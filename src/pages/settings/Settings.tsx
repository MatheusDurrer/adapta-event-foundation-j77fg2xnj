import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UserPlus, Sliders, Webhook, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

const formSchema = z.object({
  email: z.string().email('E-mail inválido. Verifique o formato.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      toast({
        title: 'Usuário criado com sucesso',
        description: `O usuário ${values.email} agora tem acesso à plataforma.`,
      })

      form.reset()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro inesperado. Verifique os dados.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Configurações" />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Criação de novo usuário</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Configurações da plataforma</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span>Integrações do sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Criação de novo usuário</CardTitle>
              <CardDescription>
                Adicione novos membros à sua equipe para que eles possam acessar a plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@exemplo.com"
                            type="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto mt-2">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Usuário
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform" className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da plataforma</CardTitle>
              <CardDescription>
                Ajuste as preferências gerais e o comportamento do seu workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[40vh] flex flex-col items-center justify-center border-t border-dashed bg-muted/20">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sliders className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Preferências Gerais</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                As configurações de aparência, fuso horário, regras de negócio e campos
                personalizados ficarão disponíveis nesta seção.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>Integrações do sistema</CardTitle>
              <CardDescription>
                Conecte a plataforma com outras ferramentas que você já usa no dia a dia.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[40vh] flex flex-col items-center justify-center border-t border-dashed bg-muted/20">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Webhook className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Integrações Externas</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Configure webhooks, gerencie chaves de API e estabeleça conexões seguras com
                serviços de terceiros essenciais para sua operação.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
