import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useImportContacts } from '@/hooks/useImportContacts'
import { UploadCloud, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Contact } from '@/types/contact'

interface ImportContactsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onSuccess: (contacts: Contact[]) => void
}

export function ImportContactsDialog({
  open,
  onOpenChange,
  eventId,
  onSuccess,
}: ImportContactsDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSuccess = (inserted: Contact[]) => {
    toast({
      title: 'Sucesso!',
      description: `${inserted.length} contatos importados com sucesso!`,
    })
    onSuccess(inserted)
    onOpenChange(false)
  }

  const {
    step,
    file,
    loading,
    error,
    preview,
    handleFileUpload,
    toggleSelection,
    toggleAll,
    importData,
    reset,
    setStep,
  } = useImportContacts(eventId, handleSuccess)

  const handleOpenChange = (val: boolean) => {
    if (!loading) {
      onOpenChange(val)
      if (!val) setTimeout(reset, 200)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileUpload(droppedFile)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'transition-all duration-300',
          step === 2 ? 'sm:max-w-[850px]' : 'sm:max-w-[450px]',
        )}
      >
        <DialogHeader>
          <DialogTitle>{step === 1 ? 'Importar Contatos' : 'Revisar Contatos'}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Adicione múltiplos participantes a partir de uma planilha.'
              : 'Verifique os dados e selecione quais contatos deseja importar.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center transition-colors',
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                loading && 'opacity-50 cursor-not-allowed pointer-events-none',
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.xlsx"
                onChange={(e) => {
                  const selected = e.target.files?.[0]
                  if (selected) {
                    handleFileUpload(selected)
                    e.target.value = ''
                  }
                }}
              />
              {loading ? (
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              ) : (
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              )}
              <p className="text-sm font-medium mb-4">
                Arraste um arquivo CSV ou XLSX aqui ou clique para selecionar
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                disabled={loading}
              >
                Selecionar Arquivo
              </Button>

              <p className="text-xs text-muted-foreground mt-4">Tamanho máximo: 10MB</p>
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive flex items-center gap-2 mt-2 bg-destructive/10 p-3 rounded-md border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {file && !error && !loading && preview.length > 0 && (
              <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                Arquivo processado com sucesso: {file.name} ({preview.length} registros)
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button onClick={() => setStep(2)} disabled={loading || preview.length === 0}>
                Próximo
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {preview.filter((c) => c._selected).length} contatos para importar
              </span>
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="border rounded-md">
              <ScrollArea className="h-[350px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/95 z-10 backdrop-blur-sm shadow-sm">
                    <TableRow>
                      <TableHead className="w-[50px] pl-4">
                        <Checkbox
                          checked={
                            preview.filter((c) => c._isValid).length > 0 &&
                            preview.filter((c) => c._isValid).every((c) => c._selected)
                          }
                          onCheckedChange={(checked) => toggleAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Sobrenome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Empresa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((c) => (
                      <React.Fragment key={c.id}>
                        <TableRow
                          className={cn(
                            !c._isValid &&
                              'border-t-2 border-l-2 border-r-2 border-destructive bg-destructive/5 hover:bg-destructive/10',
                            c._isValid && 'border-b',
                          )}
                        >
                          <TableCell className="pl-4">
                            <Checkbox
                              checked={c._selected}
                              disabled={!c._isValid || loading}
                              onCheckedChange={() => toggleSelection(c.id)}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{c.firstName}</TableCell>
                          <TableCell className="whitespace-nowrap">{c.lastName}</TableCell>
                          <TableCell>{c.email}</TableCell>
                          <TableCell className="whitespace-nowrap">{c.cpf}</TableCell>
                          <TableCell className="whitespace-nowrap">{c.phone}</TableCell>
                          <TableCell>{c.company}</TableCell>
                        </TableRow>
                        {!c._isValid && (
                          <TableRow className="bg-destructive/5 hover:bg-destructive/5 border-b-2 border-l-2 border-r-2 border-destructive">
                            <TableCell
                              colSpan={7}
                              className="py-2 px-4 text-xs text-destructive font-medium"
                            >
                              Erros: {c._errors?.join(', ')}
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                    {preview.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          Nenhum contato encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        )}

        {step === 2 && (
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={loading}
              className="mr-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={importData}
              disabled={loading || preview.filter((c) => c._selected).length === 0}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
