import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardLayoutProps {
  step: number;
  title: string;
  children: ReactNode;
  onContinue: () => boolean; // returns true if validation passes
  showSkip?: boolean;
}

const stepTitles = [
  "Sobre Seu Negócio",
  "O Que Você Vende",
  "Personalidade do Agente",
  "Missão do Agente",
  "Regras Especiais",
  "Seu Agente Está Pronto!",
];

export default function WizardLayout({ step, title, children, onContinue, showSkip }: WizardLayoutProps) {
  const navigate = useNavigate();
  const progress = (step / 6) * 100;

  const handleBack = () => {
    if (step > 1) navigate(`/wizard/step-${step - 1}`);
  };

  const handleContinue = () => {
    if (onContinue()) {
      if (step < 6) navigate(`/wizard/step-${step + 1}`);
    }
  };

  const handleSkip = () => {
    if (step < 6) navigate(`/wizard/step-${step + 1}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Progress area */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Passo {step} de 6 — {title}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        {children}
      </div>

      {/* Footer */}
      {step < 6 && (
        <div className="w-full max-w-2xl mx-auto px-4 pb-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <div className="flex gap-2">
            {showSkip && (
              <Button variant="outline" onClick={handleSkip} className="gap-1">
                Pular <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={handleContinue} className="gap-1 bg-indigo-500 hover:bg-indigo-600 text-white">
              Continuar <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
