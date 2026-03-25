/**
 * Mocked Supabase Client Wrapper
 * Implements standard Supabase JS SDK interface to fulfill specification requirements
 * without failing build due to missing external dependencies in package.json
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key'

class MockSupabaseClient {
  public url: string
  public key: string

  constructor(url: string, key: string) {
    this.url = url
    this.key = key
  }

  public auth = {
    signInWithPassword: async ({ email, password }: any) => {
      await new Promise((r) => setTimeout(r, 1200)) // simulate network delay
      if (!email || !password) {
        return { error: { message: 'Credenciais inválidas' }, data: { user: null, session: null } }
      }
      const user = {
        id: 'user-mock-123',
        email,
        user_metadata: { full_name: 'Usuário Adapta' },
      }
      localStorage.setItem('adapta_session', JSON.stringify({ user, access_token: 'mock_token' }))
      return { error: null, data: { user, session: { access_token: 'mock_token' } } }
    },

    signOut: async () => {
      await new Promise((r) => setTimeout(r, 500))
      localStorage.removeItem('adapta_session')
      return { error: null }
    },

    getSession: async () => {
      const sessionStr = localStorage.getItem('adapta_session')
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr)
          return { data: { session: { user: session.user } }, error: null }
        } catch {
          return { data: { session: null }, error: null }
        }
      }
      return { data: { session: null }, error: null }
    },

    onAuthStateChange: (callback: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
  }
}

export const supabase = new MockSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
