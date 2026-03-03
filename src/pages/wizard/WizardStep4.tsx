import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ShoppingCart, Headphones, CalendarCheck, Filter, Check } from "lucide-react";
import { toast } from "sonner";

const objectives = [
  { id: "sell", label: "Vender", icon: ShoppingCart, desc: "Qualificar leads e conduzir para venda" },
  { id: "support", label: "Atender", icon: Headphones, desc: "Responder dúvidas e resolver problemas" },
  { id: "schedule", label: "Agendar", icon: CalendarCheck, desc: "Marcar reuniões, consultas ou visitas" },
  { id: "qualify", label: "Qualificar", icon: Filter, desc: "Identificar e pontuar leads promissores" },
];

const hotLeadActions = [
  { id: "whatsapp", emoji: "📱", label: "Notificar meu WhatsApp" },
  { id: "email", emoji: "📧", label: "Notificar por e-mail" },
  { id: "system", emoji: "📊", label: "Só registrar no sistema" },
];

export default function WizardStep4() {
  const { data, updateData } = useWizard();
  const [selected, setSelected] = useState<string[]>(data.objectives);
  const [hotLeadAction, setHotLeadAction] = useState(data.hotLeadAction);

  const toggleObjective = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        toast.error("Máximo 2 objetivos");
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
    <WizardLayout
      step={4}
      title="Missão do Agente"
      subtitle="O que seu agente deve fazer quando um cliente manda mensagem?"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Objetivo Principal <span className="normal-case tracking-normal text-slate-400">(até 2)</span>
          </Label>
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
                    "relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-5 text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {/* Checkbox circle */}
                  <div
                    className={cn(
                      "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", isSelected ? "text-indigo-600" : "text-slate-600")} />
                    <span className="font-semibold text-slate-900">{o.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">{o.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Quando Identificar um Lead Quente:
          </Label>
          <div className="space-y-2">
            {hotLeadActions.map((a) => {
              const isActive = hotLeadAction === a.label;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setHotLeadAction(a.label)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all cursor-pointer",
                    isActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  {/* Radio dot */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      isActive ? "border-indigo-500" : "border-slate-300"
                    )}
                  >
                    {isActive && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  <span className="text-sm text-slate-700">
                    {a.emoji} {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </WizardLayout>
  );
}
