export type SupplierStatus = 'PROSPECTING' | 'ACTIVE'
export type SupplierType = 'INSUMOS' | 'ALIMENTOS' | 'LOGISTICA'

export interface Supplier {
  id: string
  responsibleName: string
  companyName: string
  cnpj: string
  phone: string
  email: string
  type: SupplierType
  status: SupplierStatus
}
