import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, UserPlus, Loader2 } from 'lucide-react'
import { Contact } from '@/types/contact'
import { searchContacts } from '@/services/checkinService'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ManualCheckinProps {
  eventId: string
  onSelectContact: (contact: Contact) => void
}

export function ManualCheckin({ eventId, onSelectContact }: ManualCheckinProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    async function fetchContacts() {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const data = await searchContacts(eventId, debouncedQuery)
        setResults(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [debouncedQuery, eventId])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Check-in Manual</CardTitle>
        <CardDescription>Procure participantes não credenciados ou sem QR Code</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar participante por nome ou email..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[300px] px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contact.email} • {contact.company}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => onSelectContact(contact)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nenhum participante encontrado.
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center">
              <Search className="h-8 w-8 mb-2 opacity-20" />
              Digite pelo menos 2 caracteres para buscar.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
