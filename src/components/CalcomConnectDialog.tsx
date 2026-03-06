import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCalcomEventTypes, saveCalcomIntegration, type CalcomEventType } from "@/services/api";
import { CalendarCheck, Check, Loader2, Clock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  currentEventTypeId?: number | null;
  currentEventTypeSlug?: string | null;
  onSaved: (data: { calcom_event_type_id: number; calcom_event_type_slug: string }) => void;
}

export function CalcomConnectDialog({
  open, onOpenChange, agentId, currentEventTypeId, onSaved,
}: Props) {
  const { toast } = useToast();

  const [eventTypes, setEventTypes] = useState<CalcomEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(currentEventTypeId ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getCalcomEventTypes()
      .then((res) => setEventTypes(res.event_types))
      .catch(() => toast({ title: "Erro ao carregar tipos de reunião", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [open]);

  const handleSave = async () => {
    if (!selectedId) return;
    const et = eventTypes.find((e) => e.id === selectedId)!;
    setSaving(true);
    try {
      await saveCalcomIntegration(agentId, {
        event_type_id: et.id,
        event_type_slug: et.slug,
      });
      toast({ title: "Agendamento configurado!" });
      onSaved({ calcom_event_type_id: et.id, calcom_event_type_slug: et.slug });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Configurar agendamento
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Selecione qual tipo de reunião este agente deve oferecer quando o cliente solicitar um agendamento:
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : eventTypes.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhum tipo de reunião disponível.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {eventTypes.map((et) => {
              const isSelected = selectedId === et.id;
              return (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setSelectedId(et.id)}
                  className={`w-full text-left rounded-xl border p-3.5 transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 hover:bg-accent/30"
                  }`}
                >
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{et.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{et.length} min</span>
                      {et.description && (
                        <span className="text-xs text-muted-foreground truncate">· {et.description}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || !selectedId || loading}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
