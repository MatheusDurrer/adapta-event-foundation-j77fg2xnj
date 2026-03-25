import { z } from 'zod'

export const importContactSchema = z.object({
  firstName: z.string().min(1, 'obrigatório'),
  lastName: z.string().min(1, 'obrigatório'),
  email: z
    .string()
    .min(1, 'obrigatório')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'inválido'),
  cpf: z
    .string()
    .min(1, 'obrigatório')
    .regex(/^\d{11}$/, 'deve conter exatamente 11 dígitos'),
  phone: z
    .string()
    .min(1, 'obrigatório')
    .regex(/^\d{10,11}$/, 'deve conter 10 ou 11 dígitos'),
  company: z.string().min(1, 'obrigatória'),
})

export type ParsedContact = z.infer<typeof importContactSchema> & {
  id: string
  _originalRow: any
  _errors?: string[]
  _isValid: boolean
  _selected: boolean
}

export async function parseFile(file: File): Promise<ParsedContact[]> {
  return new Promise((resolve, reject) => {
    // Simulating PapaParse for CSV and xlsx library for XLSX within the current template setup
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)

        if (lines.length < 2) throw new Error('Arquivo vazio ou sem registros válidos')

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())

        const idxNome = headers.findIndex((h) => h.includes('nome') && !h.includes('sobrenome'))
        const idxSobrenome = headers.findIndex((h) => h.includes('sobrenome'))
        const idxEmail = headers.findIndex((h) => h.includes('email'))
        const idxCpf = headers.findIndex((h) => h.includes('cpf'))
        const idxTelefone = headers.findIndex(
          (h) => h.includes('telefone') || h.includes('celular'),
        )
        const idxEmpresa = headers.findIndex((h) => h.includes('empresa'))

        const parsed: ParsedContact[] = lines.slice(1).map((line, i) => {
          const cols = line
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((c) => c.replace(/^"|"$/g, '').trim())

          const raw = {
            firstName: idxNome >= 0 ? cols[idxNome] || '' : '',
            lastName: idxSobrenome >= 0 ? cols[idxSobrenome] || '' : '',
            email: idxEmail >= 0 ? cols[idxEmail] || '' : '',
            cpf: (idxCpf >= 0 ? cols[idxCpf] || '' : '').replace(/\D/g, ''),
            phone: (idxTelefone >= 0 ? cols[idxTelefone] || '' : '').replace(/\D/g, ''),
            company: idxEmpresa >= 0 ? cols[idxEmpresa] || '' : '',
          }

          const validation = importContactSchema.safeParse(raw)

          let errors: string[] = []
          if (!validation.success) {
            errors = validation.error.errors.map((err) => {
              const fieldMap: Record<string, string> = {
                firstName: 'Nome',
                lastName: 'Sobrenome',
                email: 'Email',
                cpf: 'CPF',
                phone: 'Telefone',
                company: 'Empresa',
              }
              return `${fieldMap[err.path[0] as string] || err.path[0]}: ${err.message}`
            })
          }

          return {
            ...raw,
            id: `row-${i}`,
            _originalRow: raw,
            _isValid: validation.success,
            _errors: errors,
            _selected: validation.success,
          }
        })

        // Simulate processing time for realistic UX
        setTimeout(() => resolve(parsed), 600)
      } catch (err) {
        reject(new Error('Erro ao processar o arquivo. Verifique se o formato está correto.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro de leitura do arquivo'))
    reader.readAsText(file)
  })
}
