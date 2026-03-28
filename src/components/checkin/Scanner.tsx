import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, RefreshCcw, QrCode } from 'lucide-react'

interface ScannerProps {
  onScan: (data: string) => void
  disabled?: boolean
}

export function Scanner({ onScan, disabled }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const startCamera = useCallback(async () => {
    stopCamera()
    setHasPermission(null)

    if (!navigator?.mediaDevices?.getUserMedia) {
      setHasPermission(false)
      setErrorMsg('Erro ao acessar câmera. Verifique as permissões.')
      return
    }

    try {
      // Use "ideal" to support devices (like desktops) that might not have a specific facingMode
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
      })
      streamRef.current = stream
      setHasPermission(true)
      setErrorMsg('')
    } catch (err) {
      setHasPermission(false)
      setErrorMsg('Erro ao acessar câmera. Verifique as permissões.')
    }
  }, [facingMode, stopCamera])

  useEffect(() => {
    if (!disabled) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [disabled, startCamera, stopCamera])

  useEffect(() => {
    if (hasPermission === true && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [hasPermission])

  // Mock scan for testing purposes since external scanner libraries are disabled
  const simulateScan = () => {
    onScan(
      JSON.stringify({
        contactId: 'mock-contact-123',
        eventId: 'event-123',
        firstName: 'João',
        lastName: 'Silva',
        company: 'Adapta Tech',
      }),
    )
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center">
      {hasPermission === false && (
        <div className="text-center p-6 space-y-4">
          <div className="h-16 w-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <Camera className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{errorMsg}</p>
          <Button onClick={startCamera}>Tentar Novamente</Button>
        </div>
      )}

      {hasPermission === true && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

          <div className="relative z-20 w-64 h-64 sm:w-72 sm:h-72 border-2 border-primary rounded-2xl pointer-events-none">
            {/* Corner indicators */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -mt-1 -ml-1" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -mt-1 -mr-1" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -mb-1 -ml-1" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -mb-1 -mr-1" />

            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/80 shadow-[0_0_8px_2px_rgba(var(--primary),0.5)] animate-[scan_2s_ease-in-out_infinite]" />
          </div>

          <div className="absolute bottom-4 right-4 z-30 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/80 backdrop-blur"
              onClick={() =>
                setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
              }
            >
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </div>

          {/* Development mock button */}
          <div className="absolute top-4 right-4 z-30">
            <Button size="sm" variant="secondary" onClick={simulateScan}>
              <QrCode className="mr-2 h-4 w-4" /> Simular Scan
            </Button>
          </div>
        </>
      )}

      {hasPermission === null && (
        <div className="animate-pulse flex flex-col items-center text-muted-foreground">
          <Camera className="h-10 w-10 mb-4 opacity-50" />
          <p>Iniciando câmera...</p>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(16rem); }
          100% { transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(18rem); }
            100% { transform: translateY(0); }
          }
        }
      `,
        }}
      />
    </div>
  )
}
