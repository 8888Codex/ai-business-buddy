import { useState, useEffect } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Briefcase, Smile, Settings, Megaphone } from "lucide-react";
import { toast } from "sonner";

const tones = [
  {
    id: "formal",
    label: "Formal",
    icon: Briefcase,
    example: '"Prezado(a), como posso ajudá-lo(a)?"',
    desc: "Corporativo e respeitoso",
  },
  {
    id: "friendly",
    label: "Amigável",
    icon: Smile,
    example: '"Oi! Tudo bem? Como posso te ajudar? 😊"',
    desc: "Próximo e acolhedor",
  },
  {
    id: "technical",
    label: "Técnico",
    icon: Settings,
    example: '"Olá. Posso fornecer informações detalhadas."',
    desc: "Preciso e objetivo",
  },
  {
    id: "persuasive",
    label: "Persuasivo",
    icon: Megaphone,
    example: '"Que bom que você entrou em contato! Tenho algo especial."',
    desc: "Orientado a resultados",
  },
];

function suggestAgentName(companyName: string): string {
  if (!companyName) return "Assistente IA";
  const words = companyName.trim().split(/\s+/);
  return words[words.length - 1];
}

export default function WizardStep3() {
  const { data, updateData } = useWizard();
  const [tone, setTone] = useState(data.tone);
  const [agentName, setAgentName] = useState(
    data.agentName || suggestAgentName(data.companyName)
  );

  useEffect(() => {
    if (!data.agentName && data.companyName) {
      setAgentName(suggestAgentName(data.companyName));
    }
  }, [data.companyName, data.agentName]);

  const handleContinue = () => {
    if (!tone) {
      toast.error("Selecione o tom de voz do agente");
      return false;
    }
    if (!agentName.trim()) {
      toast.error("Informe o nome do agente");
      return false;
    }
    updateData({ tone, agentName: agentName.trim() });
    return true;
  };

  return (
    <WizardLayout
      step={3}
      title="Personalidade do Agente"
      subtitle="Escolha como seu agente se comunica"
      onContinue={handleContinue}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Tom de Voz
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tones.map((t) => {
              const Icon = t.icon;
              const selected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-xl border-2 p-5 text-left transition-all cursor-pointer",
                    selected
                      ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", selected ? "text-indigo-600" : "text-slate-600")} />
                    <span className="font-semibold text-slate-900">{t.label}</span>
                  </div>
                  <p className="text-sm italic text-slate-500">{t.example}</p>
                  <p className="text-xs text-slate-400">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Como Seu Agente Se Chama?
          </Label>
          <Input
            placeholder="Ex: Lucas"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="rounded-xl"
          />
          <p className="text-xs text-slate-400">
            Seus clientes vão interagir com esse nome
          </p>
        </div>
      </div>
    </WizardLayout>
  );
}
