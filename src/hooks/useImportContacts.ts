import { useState } from 'react'
import { parseFile, ParsedContact } from '@/services/importService'
import { batchAddContactsToSupabase } from '@/services/contactService'
import { Contact } from '@/types/contact'

export function useImportContacts(eventId: string, onSuccess: (inserted: Contact[]) => void) {
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contacts, setContacts] = useState<ParsedContact[]>([])

  const handleFileUpload = async (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('O tamanho máximo do arquivo é 10MB.')
      return
    }

    setFile(selectedFile)
    setLoading(true)
    setError(null)

    try {
      const parsed = await parseFile(selectedFile)
      setContacts(parsed)
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar o arquivo.')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (id: string) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, _selected: !c._selected } : c)))
  }

  const toggleAll = (select: boolean) => {
    setContacts((prev) => prev.map((c) => (c._isValid ? { ...c, _selected: select } : c)))
  }

  const importData = async () => {
    const toImport = contacts.filter((c) => c._selected && c._isValid)
    if (toImport.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const inserted = await batchAddContactsToSupabase(
        toImport.map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          cpf: c.cpf,
          phone: c.phone,
          company: c.company,
          eventId,
          status: 'active',
        })),
      )
      onSuccess(inserted)
    } catch (err: any) {
      if (err.code === '23505' || err.message?.includes('Unique violation')) {
        const match = err.message?.match(/Unique violation: (.*)/)
        const email = match ? match[1] : 'desconhecido'
        setError(`Email ja existe: [${email}]`)
      } else if (err.message === 'Network Error') {
        setError('Erro ao conectar. Tente novamente')
      } else {
        setError('Nao foi possivel importar contatos')
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(1)
    setFile(null)
    setContacts([])
    setError(null)
  }

  return {
    step,
    file,
    loading,
    error,
    contacts,
    handleFileUpload,
    toggleSelection,
    toggleAll,
    importData,
    reset,
    setStep,
  }
}
