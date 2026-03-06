import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Loader2, ExternalLink, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getGoogleCalendarAuthUrl,
  getGoogleCalendarStatus,
  getGoogleCalendars,
  saveGoogleCalendar,
  removeGoogleCalendar,
} from "@/services/api";

interface GoogleCalendar {
  id: string;
  name: string;
  primary: boolean;
  access_role: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  currentCalendarId?: string | null;
  currentCalendarName?: string | null;
  onSaved: (data: { google_calendar_id: string; google_calendar_name: string }) => void;
  onDisconnected: () => void;
}

export function GoogleCalendarDialog({
  open,
  onOpenChange,
  agentId,
  currentCalendarId,
  currentCalendarName,
  onSaved,
  onDisconnected,
}: Props) {
  const { toast } = useToast();

  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>(currentCalendarId ?? "");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingCalendars, setLoadingCalendars] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadStatus();
  }, [open]);

  async function loadStatus() {
    setLoadingStatus(true);
    try {
      const status = await getGoogleCalendarStatus();
      setConnected(status.connected);
      setConnectedEmail(status.email);
      if (status.connected) {
        await loadCalendars();
      }
    } catch {
      toast({ title: "Erro ao verificar status", variant: "destructive" });
    } finally {
      setLoadingStatus(false);
    }
  }

  async function loadCalendars() {
    setLoadingCalendars(true);
    try {
      const { calendars } = await getGoogleCalendars();
      setCalendars(calendars);
      // Pré-selecionar o calendário atual ou o primário
      if (currentCalendarId) {
        setSelectedCalendarId(currentCalendarId);
      } else {
        const primary = calendars.find((c) => c.primary);
        if (primary) setSelectedCalendarId(primary.id);
      }
    } catch {
      toast({ title: "Erro ao carregar calendários", variant: "destructive" });
    } finally {
      setLoadingCalendars(false);
    }
  }

  async function handleConnect() {
    try {
      const { auth_url } = await getGoogleCalendarAuthUrl();
      window.location.href = auth_url;
    } catch {
      toast({ title: "Erro ao gerar URL de autorização", variant: "destructive" });
    }
  }

  async function handleSave() {
    if (!selectedCalendarId) return;
    const cal = calendars.find((c) => c.id === selectedCalendarId);
    if (!cal) return;

    setSaving(true);
    try {
      await saveGoogleCalendar(agentId, {
        calendar_id: cal.id,
        calendar_name: cal.name,
      });
      onSaved({ google_calendar_id: cal.id, google_calendar_name: cal.name });
      toast({ title: "Calendário salvo com sucesso!" });
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao salvar calendário", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await removeGoogleCalendar(agentId);
      onDisconnected();
      toast({ title: "Google Calendar desconectado" });
      onOpenChange(false);
    } catch {
      toast({ title: "Erro ao desconectar", variant: "destructive" });
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Google Calendar
          </DialogTitle>
        </DialogHeader>

        {loadingStatus ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !connected ? (
          /* ── Estado: não conectado ── */
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Conecte sua conta Google para que o agente possa agendar reuniões diretamente na sua agenda.
            </p>
            <Button onClick={handleConnect} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Conectar Google Calendar
            </Button>
          </div>
        ) : (
          /* ── Estado: conectado ── */
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              <CalendarCheck className="h-4 w-4 shrink-0" />
              <span>Conectado como <strong>{connectedEmail}</strong></span>
            </div>

            {loadingCalendars ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Selecione o calendário:</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {calendars.map((cal) => (
                    <label
                      key={cal.id}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-all ${
                        selectedCalendarId === cal.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/40 hover:bg-accent/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="calendar"
                        value={cal.id}
                        checked={selectedCalendarId === cal.id}
                        onChange={() => setSelectedCalendarId(cal.id)}
                        className="accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{cal.name}</p>
                        {cal.primary && (
                          <span className="text-[10px] text-primary font-semibold uppercase tracking-wide">Principal</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {connected && !loadingStatus && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 sm:mr-auto"
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
              Desconectar Google
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !selectedCalendarId || loadingCalendars}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
