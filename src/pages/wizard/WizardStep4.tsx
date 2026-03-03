import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ShoppingCart, Headset, CalendarDays, Filter, Check } from "lucide-react";
import { toast } from "sonner";

const objectives = [
  { id: "sell", label: "Vender", icon: ShoppingCart, desc: "Qualificar leads e conduzir para a venda" },
  { id: "support", label: "Atender", icon: Headset, desc: "Responder dúvidas e resolver problemas" },
  { id: "schedule", label: "Agendar", icon: CalendarDays, desc: "Marcar reuniões, consultas ou visitas" },
  { id: "qualify", label: "Qualificar", icon: Filter, desc: "Identificar e pontuar leads promissores" },
];

const hotLeadActions = [
  "Notificar meu WhatsApp",
  "Notificar por e-mail",
  "Só registrar no sistema",
];

export default function WizardStep4() {
  const { data, updateData } = useWizard();
  const [selected, setSelected] = useState<string[]>(data.objectives);
  const [hotLeadAction, setHotLeadAction] = useState(data.hotLeadAction);

  const toggleObjective = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        toast.error("Selecione no máximo 2 objetivos");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      toast.error("Selecione pelo menos 1 objetivo");
      return false;
    }
    if (!hotLeadAction) {
      toast.error("Selecione a ação para lead quente");
      return false;
    }
    updateData({ objectives: selected, hotLeadAction });
    return true;
  };

  return (
    <WizardLayout step={4} title="Missão do Agente" onContinue={handleContinue}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Objetivo principal * <span className="text-muted-foreground font-normal">(até 2)</span></Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {objectives.map((o) => {
              const Icon = o.icon;
              const isSelected = selected.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleObjective(o.id)}
                  className={cn(
                    "relative flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all",
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-border hover:border-indigo-300"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{o.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ação ao identificar lead quente *</Label>
          <Select value={hotLeadAction} onValueChange={setHotLeadAction}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a ação" />
            </SelectTrigger>
            <SelectContent>
              {hotLeadActions.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </WizardLayout>
  );
}
