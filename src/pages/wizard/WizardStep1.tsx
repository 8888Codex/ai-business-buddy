import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

const segments = [
  { emoji: "🏠", label: "Imobiliário" },
  { emoji: "☀️", label: "Energia Solar" },
  { emoji: "🚗", label: "Automotivo" },
  { emoji: "🏥", label: "Saúde/Clínicas" },
  { emoji: "🛍️", label: "Varejo" },
  { emoji: "💼", label: "Serviços" },
  { emoji: "💻", label: "Tecnologia" },
  { emoji: "✏️", label: "Outro" },
];

const hours = Array.from({ length: 18 }, (_, i) => {
  const h = i + 6;
  return `${String(h).padStart(2, "0")}:00`;
});

export default function WizardStep1() {
  const { data, updateData } = useWizard();
  const [companyName, setCompanyName] = useState(data.companyName);
  const [segment, setSegment] = useState(data.segment);
  const [openTime, setOpenTime] = useState(data.openTime || "08:00");
  const [closeTime, setCloseTime] = useState(data.closeTime || "18:00");

  const handleContinue = () => {
    if (!companyName.trim()) {
      toast.error("Informe o nome da empresa");
      return false;
    }
    if (!segment) {
      toast.error("Selecione o segmento");
      return false;
    }
    updateData({ companyName: companyName.trim(), segment, openTime, closeTime });
    return true;
  };

  return (
    <WizardLayout
      step={1}
      title="Sobre Seu Negócio"
      subtitle="Vamos conhecer sua empresa em 30 segundos"
      onContinue={handleContinue}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Nome da Empresa
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Ex: Clínica São Lucas"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Segmento
          </Label>
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Selecione o segmento" />
            </SelectTrigger>
            <SelectContent>
              {segments.map((s) => (
                <SelectItem key={s.label} value={s.label}>
                  {s.emoji} {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            Horário de Atendimento
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 shrink-0">Das</span>
            <Select value={openTime} onValueChange={setOpenTime}>
              <SelectTrigger className="rounded-xl flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-500 shrink-0">às</span>
            <Select value={closeTime} onValueChange={setCloseTime}>
              <SelectTrigger className="rounded-xl flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
}
