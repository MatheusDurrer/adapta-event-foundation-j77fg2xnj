import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, UserCheck, Clock } from 'lucide-react'
import { QRCodeData } from '@/types/checkin'
import { Contact } from '@/types/contact'

interface ConfirmationDialogProps {
  open: boolean
  contact: QRCodeData | Contact | null
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
  success: boolean
}

export function ConfirmationDialog({
  open,
  contact,
  loading,
  onConfirm,
  onCancel,
  success,
}: ConfirmationDialogProps) {
  if (!contact) return null

  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const firstName = 'firstName' in contact ? contact.firstName : contact.firstName
  const lastName = 'lastName' in contact ? contact.lastName : contact.lastName
  const company = 'company' in contact ? contact.company : contact.company

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !loading && onCancel()}>
      <DialogContent className="sm:max-w-md text-center">
        {success ? (
          <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <UserCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Check-in Realizado!</h2>
            <p className="text-muted-foreground">O acesso foi liberado com sucesso.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Confirmar Entrada</DialogTitle>
              <DialogDescription className="text-center">
                Verifique os dados do participante
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center bg-muted/30 rounded-lg border my-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-1">
                {firstName} {lastName}
              </h3>
              <p className="text-lg text-muted-foreground font-medium">{company}</p>

              <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-background rounded-full shadow-sm border">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-medium">{currentTime}</span>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-center">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirmar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
