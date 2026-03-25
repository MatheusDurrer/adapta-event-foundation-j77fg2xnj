import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

type User = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, pass: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        setUser(data.session.user as User)
      }
      setIsLoading(false)
    }
    loadSession()
  }, [])

  const signIn = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de Autenticação',
        description: error.message,
      })
      throw error
    }
    if (data.user) {
      setUser(data.user as User)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
