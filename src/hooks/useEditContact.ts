import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { editContactInSupabase } from '@/services/contactService'
import { Contact } from '@/types/contact'

const contactSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório').max(50, 'Máximo de 50 caracteres'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório').max(50, 'Máximo de 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .regex(/^\d{11}$/, 'Deve conter exatamente 11 dígitos'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\d{10,11}$/, 'Deve conter 10 ou 11 dígitos'),
  company: z.string().min(1, 'Empresa é obrigatória').max(100, 'Máximo de 100 caracteres'),
})

export type EditContactFormData = z.infer<typeof contactSchema>

export function useEditContact(contact: Contact, onSuccess: (updatedContact: Contact) => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<EditContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      cpf: contact.cpf,
      phone: contact.phone,
      company: contact.company,
    },
  })

  useEffect(() => {
    form.reset({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      cpf: contact.cpf,
      phone: contact.phone,
      company: contact.company,
    })
  }, [contact, form])

  const submitData = async (data: EditContactFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const updatedContact = await editContactInSupabase(contact.id, contact.eventId, data)
      setSuccess(true)
      const finalContact = { ...contact, ...updatedContact, updatedAt: new Date().toISOString() }
      onSuccess(finalContact)
    } catch (err: any) {
      if (err.code === '23505') {
        setError('Este email já existe neste evento')
      } else if (err.message === 'Network Error') {
        setError('Erro ao conectar. Tente novamente')
      } else {
        setError('Não foi possível atualizar contato')
      }
    } finally {
      setLoading(false)
    }
  }

  return { form, loading, error, success, editContact: form.handleSubmit(submitData) }
}
