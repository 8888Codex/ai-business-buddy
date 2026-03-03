import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

const segments = [
  "Imobiliário",
  "Energia Solar",
  "Automotivo",
  "Saúde/Clínicas",
  "Varejo",
  "Serviços",
  "Tecnologia",
  "Outro",
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
    <WizardLayout step={1} title="Sobre Seu Negócio" onContinue={handleContinue}>
      <div className="flex items-start gap-6">
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da empresa *</Label>
            <Input
              id="companyName"
              placeholder="Ex: Clínica São Lucas"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Segmento *</Label>
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o segmento" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Horário de atendimento</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Select value={openTime} onValueChange={setOpenTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Abre às" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="self-center text-muted-foreground">até</span>
              <div className="flex-1">
                <Select value={closeTime} onValueChange={setCloseTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fecha às" />
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
        </div>

        <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-2xl bg-indigo-50 text-indigo-400 shrink-0 mt-6">
          <Building2 className="h-16 w-16" />
        </div>
      </div>
    </WizardLayout>
  );
}
