import { Campaign } from '@/types/campaign'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface CampaignSettingsProps {
  campaign: Partial<Campaign>
  updateField: (field: keyof Campaign, value: any) => void
}

export function CampaignSettings({ campaign, updateField }: CampaignSettingsProps) {
  const isScheduled = !!campaign.scheduledAt

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="subject">
            Assunto da Campanha <span className="text-destructive">*</span>
          </Label>
          <Input
            id="subject"
            placeholder="Ex: Último aviso para o evento..."
            value={campaign.subject || ''}
            onChange={(e) => updateField('subject', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="senderName">Nome do Remetente</Label>
            <Input
              id="senderName"
              placeholder="Sua Empresa / Evento"
              value={campaign.senderName || ''}
              onChange={(e) => updateField('senderName', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="senderEmail">Email do Remetente</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="contato@empresa.com"
              value={campaign.senderEmail || ''}
              onChange={(e) => updateField('senderEmail', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recipients">Destinatários</Label>
          <Select
            value={campaign.recipientListId || 'all'}
            onValueChange={(val) => updateField('recipientListId', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione os contatos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os contatos ativos</SelectItem>
              <SelectItem value="vip">Lista VIP</SelectItem>
              <SelectItem value="unconfirmed">Apenas não confirmados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Label className="mb-3 block text-base">Agendamento</Label>
        <RadioGroup
          value={isScheduled ? 'schedule' : 'now'}
          onValueChange={(val) => {
            if (val === 'now') updateField('scheduledAt', null)
            else
              updateField('scheduledAt', new Date(Date.now() + 86400000).toISOString().slice(0, 16))
          }}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="now" id="r-now" />
            <Label htmlFor="r-now" className="font-normal cursor-pointer">
              Enviar Agora
            </Label>
          </div>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="r-schedule" />
              <Label htmlFor="r-schedule" className="font-normal cursor-pointer">
                Agendar para data e hora
              </Label>
            </div>
            {isScheduled && (
              <div className="ml-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <Input
                  type="datetime-local"
                  className="w-auto"
                  value={campaign.scheduledAt?.slice(0, 16) || ''}
                  onChange={(e) =>
                    updateField('scheduledAt', new Date(e.target.value).toISOString())
                  }
                />
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
