import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Loader2, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function PlatformSettings() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const { data } = await supabase.from('users').select('*')
      if (data) setUsers(data)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleDeleteUser(id: string) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      const { error } = await supabase.from('users').delete().eq('id', id)
      if (error) throw error

      toast({ title: 'Usuário excluído com sucesso' })

      if (user?.id === id) {
        await signOut()
        navigate('/login')
      } else {
        fetchUsers()
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao excluir', description: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>Personalize a aparência visual do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(val) => setTheme(val as 'light' | 'dark')}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Label
              htmlFor="theme-light"
              className={cn(
                'cursor-pointer flex flex-col items-center justify-center p-4 rounded-md border-2 border-muted hover:border-primary transition-colors',
                theme === 'light' && 'border-primary bg-primary/5',
              )}
            >
              <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              <Sun className="h-6 w-6 mb-2" />
              <span>Claro</span>
            </Label>
            <Label
              htmlFor="theme-dark"
              className={cn(
                'cursor-pointer flex flex-col items-center justify-center p-4 rounded-md border-2 border-muted hover:border-primary transition-colors',
                theme === 'dark' && 'border-primary bg-primary/5',
              )}
            >
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              <Moon className="h-6 w-6 mb-2" />
              <span>Escuro</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie os usuários autorizados na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.user_metadata?.full_name || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(u.id)}
                            title="Excluir"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
