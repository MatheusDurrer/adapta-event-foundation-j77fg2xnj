import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QrCode, LayoutDashboard, Search as SearchIcon } from 'lucide-react'
import { useCheckin } from '@/hooks/useCheckin'
import { Scanner } from '@/components/checkin/Scanner'
import { Statistics } from '@/components/checkin/Statistics'
import { ConfirmationDialog } from '@/components/checkin/ConfirmationDialog'
import { ManualCheckin } from '@/components/checkin/ManualCheckin'

// Using a fixed mock event ID for this template
const EVENT_ID = 'event-123'

export default function Checkin() {
  const {
    loading,
    statsError,
    scannedContact,
    checkinSuccess,
    stats,
    handleQRCodeScan,
    confirmCheckin,
    loadStats,
    recordManualCheckin,
    cancelCheckin,
  } = useCheckin(EVENT_ID)

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="animate-fade-in-up pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Check-in</h1>
        <p className="text-muted-foreground mt-1">
          Escaneie o QR code dos participantes para liberar o acesso.
        </p>
      </div>

      <div className="block lg:hidden mb-6">
        <Tabs defaultValue="scanner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="scanner">
              <QrCode className="h-4 w-4 mr-2" /> Scan
            </TabsTrigger>
            <TabsTrigger value="manual">
              <SearchIcon className="h-4 w-4 mr-2" /> Manual
            </TabsTrigger>
            <TabsTrigger value="stats">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="mt-0">
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <Scanner onScan={handleQRCodeScan} disabled={!!scannedContact || checkinSuccess} />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <ManualCheckin eventId={EVENT_ID} onSelectContact={recordManualCheckin} />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <Statistics
              stats={stats}
              loading={!stats && loading}
              error={statsError}
              onRetry={loadStats}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:grid grid-cols-12 gap-8">
        <div className="col-span-5 space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Câmera
            </h2>
            <Scanner onScan={handleQRCodeScan} disabled={!!scannedContact || checkinSuccess} />
          </div>

          <ManualCheckin eventId={EVENT_ID} onSelectContact={recordManualCheckin} />
        </div>

        <div className="col-span-7">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Painel de Controle
          </h2>
          <Statistics
            stats={stats}
            loading={!stats && loading}
            error={statsError}
            onRetry={loadStats}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={!!scannedContact || checkinSuccess}
        contact={scannedContact}
        loading={loading && !checkinSuccess}
        success={checkinSuccess}
        onConfirm={() =>
          scannedContact &&
          confirmCheckin(
            'id' in scannedContact ? scannedContact.id : scannedContact.contactId,
            'id' in scannedContact ? 'manual' : 'qr_scan',
          )
        }
        onCancel={cancelCheckin}
      />
    </div>
  )
}
