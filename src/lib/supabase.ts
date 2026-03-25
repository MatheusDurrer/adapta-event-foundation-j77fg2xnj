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

  public from(table: string) {
    return {
      insert: (payload: any[]) => {
        const execute = async () => {
          await new Promise((r) => setTimeout(r, 1200)) // simulate network delay

          const hasErrorEmail = payload.find(
            (d) => d.email === 'error@example.com' || d.email === 'erro@adapta.com',
          )
          if (hasErrorEmail) {
            return {
              data: null,
              error: { code: '23505', message: `Unique violation: ${hasErrorEmail.email}` },
            }
          }
          const hasNetworkError = payload.find((d) => d.email === 'network@example.com')
          if (hasNetworkError) {
            return { data: null, error: { message: 'Network Error' } }
          }

          const inserted = payload.map((d) => ({
            id: 'mock-uuid-' + Math.random().toString(36).slice(2, 11),
            ...d,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))

          return { data: inserted, error: null }
        }

        const chainable: any = {
          select: () => chainable,
          single: async () => {
            const res = await execute()
            if (res.error) return res
            return { data: res.data ? res.data[0] : null, error: null }
          },
          then: (resolve: any, reject: any) => {
            execute().then(resolve).catch(reject)
          },
        }

        return chainable
      },
      update: (payload: any) => {
        const queryBuilder = {
          eq: () => queryBuilder,
          select: () => {
            return {
              single: async () => {
                await new Promise((r) => setTimeout(r, 1200)) // simulate network delay

                if (
                  payload?.email === 'error@example.com' ||
                  payload?.email === 'erro@adapta.com'
                ) {
                  return { data: null, error: { code: '23505', message: 'Unique violation' } }
                }
                if (payload?.email === 'network@example.com') {
                  return { data: null, error: { message: 'Network Error' } }
                }

                return {
                  data: {
                    ...payload,
                    updated_at: new Date().toISOString(),
                  },
                  error: null,
                }
              },
            }
          },
        }
        return queryBuilder
      },
      select: () => {
        const chainable: any = {
          eq: () => chainable,
          neq: () => chainable,
          not: () => chainable,
          is: () => chainable,
          in: () => chainable,
          order: () => chainable,
          limit: () => chainable,
          single: async () => {
            await new Promise((r) => setTimeout(r, 800))
            return { data: {}, error: null }
          },
          then: (resolve: any) => {
            setTimeout(() => {
              let mockData: any[] = []

              if (table === 'campaign_sends') {
                mockData = Array.from({ length: 450 }).map((_, i) => ({
                  id: `send-${i}`,
                  contact_id: `contact-${i}`,
                  event_id: 'event-123',
                  sent_at: i < 410 ? new Date().toISOString() : null,
                  error_message: i >= 410 && i < 430 ? 'Bounce' : null,
                }))
              } else if (table === 'contacts') {
                mockData = Array.from({ length: 500 }).map((_, i) => ({
                  id: `contact-${i}`,
                  event_id: 'event-123',
                }))
              } else if (table === 'checkins') {
                const generateHour = () => {
                  const rand = Math.random()
                  if (rand < 0.1) return 8 + Math.floor(Math.random() * 2)
                  if (rand < 0.6) return 10 + Math.floor(Math.random() * 3)
                  if (rand < 0.8) return 13 + Math.floor(Math.random() * 4)
                  return 17 + Math.floor(Math.random() * 4)
                }

                mockData = Array.from({ length: 320 }).map((_, i) => {
                  const hour = generateHour()
                  return {
                    id: `checkin-${i}`,
                    event_id: 'event-123',
                    created_at: `2023-10-10T${hour.toString().padStart(2, '0')}:30:00Z`,
                  }
                })
              } else {
                mockData = [{ id: 'mock-1' }]
              }

              resolve({ data: mockData, error: null })
            }, 600)
          },
        }
        return chainable
      },
    }
  }

  public auth = {
    signInWithPassword: async ({ email, password }: any) => {
      await new Promise((r) => setTimeout(r, 1200))
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

    onAuthStateChange: () => {
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
  }
}

export const supabase = new MockSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
