import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'

import Layout from '@/components/Layout'
import Login from '@/pages/auth/Login'
import NotFound from '@/pages/NotFound'

// Lazy-loaded routes as per specification
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
const Contacts = lazy(() => import('@/pages/contacts/Contacts'))
const Campaigns = lazy(() => import('@/pages/campaigns/Campaigns'))
const CampaignEditor = lazy(() => import('@/pages/campaigns/CampaignEditor'))
const Checkin = lazy(() => import('@/pages/checkin/Checkin'))
const SuppliersLayout = lazy(() => import('@/pages/suppliers/SuppliersLayout'))
const Suppliers = lazy(() => import('@/pages/suppliers/Suppliers'))
const SupplierEdit = lazy(() => import('@/pages/suppliers/SupplierEdit'))
const Settings = lazy(() => import('@/pages/settings/Settings'))
const Help = lazy(() => import('@/pages/help/Help'))

const GlobalLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
    <p className="text-muted-foreground font-medium">Carregando...</p>
  </div>
)

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
            <Suspense fallback={<GlobalLoader />}>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes inside Layout */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/campaigns/new" element={<CampaignEditor />} />
                  <Route path="/campaigns/:id" element={<CampaignEditor />} />
                  <Route path="/checkin" element={<Checkin />} />
                  <Route element={<SuppliersLayout />}>
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/suppliers/:id" element={<SupplierEdit />} />
                  </Route>
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

export default App
