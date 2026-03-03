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
    desc: "Linguagem corporativa e respeitosa",
    example: '"Prezado(a), como posso ajudá-lo(a)?"',
  },
  {
    id: "friendly",
    label: "Amigável",
    icon: Smile,
    desc: "Próximo e descontraído",
    example: '"Oi! Tudo bem? Como posso te ajudar?"',
  },
  {
    id: "technical",
    label: "Técnico",
    icon: Settings,
    desc: "Preciso e detalhado",
    example: '"Olá. Posso fornecer informações técnicas sobre nossos serviços."',
  },
  {
    id: "persuasive",
    label: "Persuasivo",
    icon: Megaphone,
    desc: "Orientado a vendas",
    example: '"Que bom que você entrou em contato! Tenho uma oportunidade incrível para você."',
  },
];

function suggestAgentName(companyName: string): string {
  if (!companyName) return "Assistente IA";
  const words = companyName.trim().split(/\s+/);
  const last = words[words.length - 1];
  return `${last} IA`;
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
    <WizardLayout step={3} title="Personalidade do Agente" onContinue={handleContinue}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Tom de voz *</Label>
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
                    "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all",
                    selected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-border hover:border-indigo-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{t.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                  <p className="text-xs italic text-muted-foreground mt-1">{t.example}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="agentName">Nome do agente *</Label>
          <Input
            id="agentName"
            placeholder="Ex: Lucas IA"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
        </div>
      </div>
    </WizardLayout>
  );
}
