import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import WizardLayout from "@/components/wizard/WizardLayout";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionSectionProps {
  emoji: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function AccordionSection({ emoji, title, placeholder, value, onChange }: AccordionSectionProps) {
  const [open, setOpen] = useState(!!value);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-slate-100 last:border-b-0">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 text-left group cursor-pointer">
        <span className="text-sm font-medium text-slate-700">
          {emoji} {title}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[80px] rounded-xl"
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

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
    <WizardLayout
      step={5}
      title="Regras Especiais"
      subtitle="Personalize ainda mais. Ou pule e adicione depois."
      onContinue={handleContinue}
      showSkip
      optionalBadge
    >
      <div>
        <AccordionSection
          emoji="📋"
          title="Perguntas Frequentes"
          placeholder="Cole perguntas e respostas que seus clientes sempre fazem..."
          value={faqs}
          onChange={setFaqs}
        />
        <AccordionSection
          emoji="🚫"
          title="Restrições"
          placeholder="O que o agente NUNCA deve dizer ou fazer..."
          value={restrictions}
          onChange={setRestrictions}
        />
        <AccordionSection
          emoji="ℹ️"
          title="Informações Extras"
          placeholder="Link do site, redes sociais, horários especiais..."
          value={extras}
          onChange={setExtras}
        />
      </div>
    </WizardLayout>
  );
}
