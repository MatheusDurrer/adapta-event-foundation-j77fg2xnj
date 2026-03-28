import React, { createContext, useContext, useState } from 'react'
import { Supplier, SupplierStatus } from './types'

interface SuppliersContextType {
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void
  updateSupplierStatus: (id: string, status: SupplierStatus) => void
  updateSupplier: (id: string, data: Partial<Supplier>) => void
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'Acme Corp',
    responsibleName: 'John Doe',
    cnpj: '12.345.678/0001-90',
    email: 'contact@acme.com',
    phone: '(11) 98765-4321',
    type: 'INSUMOS',
    status: 'ACTIVE',
  },
  {
    id: '2',
    companyName: 'Global Logistics',
    responsibleName: 'Jane Smith',
    cnpj: '98.765.432/0001-10',
    email: 'hello@globallogistics.com',
    phone: '(11) 91234-5678',
    type: 'LOGISTICA',
    status: 'PROSPECTING',
  },
  {
    id: '3',
    companyName: 'Fresh Foods Ltda',
    responsibleName: 'Carlos Mendes',
    cnpj: '45.123.890/0001-55',
    email: 'vendas@freshfoods.com.br',
    phone: '(11) 99887-6655',
    type: 'ALIMENTOS',
    status: 'ACTIVE',
  },
]

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined)

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    setSuppliers((prev) => [...prev, { ...supplier, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateSupplierStatus = (id: string, status: SupplierStatus) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  }

  return (
    <SuppliersContext.Provider
      value={{ suppliers, addSupplier, updateSupplierStatus, updateSupplier }}
    >
      {children}
    </SuppliersContext.Provider>
  )
}

export function useSuppliers() {
  const context = useContext(SuppliersContext)
  if (!context) {
    throw new Error('useSuppliers must be used within a SuppliersProvider')
  }
  return context
}
