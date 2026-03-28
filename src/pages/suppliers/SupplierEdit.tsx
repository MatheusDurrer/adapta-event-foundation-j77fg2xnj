import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSuppliers } from './SuppliersContext'

const schema = z.object({
  responsibleName: z.string().min(2, 'Nome muito curto'),
  companyName: z.string().min(2, 'Nome muito curto'),
  cnpj: z.string().min(18, 'CNPJ incompleto'),
  phone: z.string().min(14, 'Telefone incompleto'),
  email: z.string().email('E-mail inválido'),
  type: z.enum(['INSUMOS', 'ALIMENTOS', 'LOGISTICA']),
})

type FormData = z.infer<typeof schema>

const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18)
}

const formatPhone = (value: string) => {
  const v = value.replace(/\D/g, '')
  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14)
  }
  return v
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15)
}

export default function SupplierEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { suppliers, updateSupplier } = useSuppliers()

  const supplier = suppliers.find((s) => s.id === id)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      responsibleName: '',
      companyName: '',
      cnpj: '',
      phone: '',
      email: '',
      type: 'INSUMOS',
    },
  })

  useEffect(() => {
    if (supplier) {
      form.reset({
        responsibleName: supplier.responsibleName,
        companyName: supplier.companyName,
        cnpj: supplier.cnpj,
        phone: supplier.phone,
        email: supplier.email,
        type: supplier.type,
      })
    }
  }, [supplier, form])

  if (!supplier) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Fornecedor não encontrado</h2>
        <Button onClick={() => navigate('/suppliers')}>Voltar para Fornecedores</Button>
      </div>
    )
  }

  function onSubmit(data: FormData) {
    if (id) {
      updateSupplier(id, data)
      navigate('/suppliers')
    }
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Fornecedor</h1>
          <p className="text-muted-foreground">Atualize os dados de {supplier.companyName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Silva Logística" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00.000.000/0000-00"
                          {...field}
                          onChange={(e) => field.onChange(formatCNPJ(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Fornecedor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INSUMOS">Insumos</SelectItem>
                          <SelectItem value="ALIMENTOS">Alimentos</SelectItem>
                          <SelectItem value="LOGISTICA">Logística</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsibleName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome do Responsável</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(11) 90000-0000"
                          {...field}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => navigate('/suppliers')}>
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" /> Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
