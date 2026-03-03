import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function WizardStep5() {
  const { data, updateData } = useWizard();
  const [faqs, setFaqs] = useState(data.faqs);
  const [restrictions, setRestrictions] = useState(data.restrictions);
  const [extras, setExtras] = useState(data.extras);

  const handleContinue = () => {
    updateData({ faqs: faqs.trim(), restrictions: restrictions.trim(), extras: extras.trim() });
    return true;
  };

  return (
    <WizardLayout step={5} title="Regras Especiais" onContinue={handleContinue} showSkip>
      <div className="space-y-5">
        <Badge variant="secondary">Opcional — você pode pular e adicionar depois</Badge>

        <div className="space-y-2">
          <Label>Perguntas frequentes</Label>
          <Textarea
            placeholder={"Cole aqui perguntas e respostas que seus clientes sempre fazem. Ex:\nP: Vocês aceitam cartão?\nR: Sim, aceitamos todas as bandeiras."}
            value={faqs}
            onChange={(e) => setFaqs(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>O que o agente NUNCA deve dizer</Label>
          <Textarea
            placeholder="Ex: Nunca dar desconto sem autorização, nunca falar mal de concorrentes"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Informações extras</Label>
          <Textarea
            placeholder="Link do site, redes sociais, informações adicionais"
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </WizardLayout>
  );
}
