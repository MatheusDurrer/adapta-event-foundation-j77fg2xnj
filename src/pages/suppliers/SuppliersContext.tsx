import { createContext, useContext, useState, ReactNode } from 'react'
import { Supplier, SupplierStatus } from './types'

interface SuppliersContextType {
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void
  updateSupplierStatus: (id: string, status: SupplierStatus) => void
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined)

export function SuppliersProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      responsibleName: 'João Silva',
      companyName: 'Silva Logística',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 98765-4321',
      email: 'joao@silvalog.com.br',
      type: 'LOGISTICA',
      status: 'ACTIVE',
    },
    {
      id: '2',
      responsibleName: 'Maria Fernanda',
      companyName: 'Sabor & Cia',
      cnpj: '98.765.432/0001-10',
      phone: '(11) 91234-5678',
      email: 'contato@saborecia.com.br',
      type: 'ALIMENTOS',
      status: 'PROSPECTING',
    },
    {
      id: '3',
      responsibleName: 'Carlos Eduardo',
      companyName: 'Insumos BR',
      cnpj: '45.678.901/0001-23',
      phone: '(11) 99876-5432',
      email: 'vendas@insumosbr.com',
      type: 'INSUMOS',
      status: 'PROSPECTING',
    },
  ])

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    setSuppliers((prev) => [...prev, { ...supplier, id: crypto.randomUUID() }])
  }

  const updateSupplierStatus = (id: string, status: SupplierStatus) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  return (
    <SuppliersContext.Provider value={{ suppliers, addSupplier, updateSupplierStatus }}>
      {children}
    </SuppliersContext.Provider>
  )
}

export const useSuppliers = () => {
  const context = useContext(SuppliersContext)
  if (!context) throw new Error('useSuppliers must be used within a SuppliersProvider')
  return context
}
