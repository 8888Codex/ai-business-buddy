import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface WizardLayoutProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onContinue: () => boolean;
  showSkip?: boolean;
  optionalBadge?: boolean;
}

const stepLabels = [
  "Negócio",
  "Produtos",
  "Personalidade",
  "Missão",
  "Regras",
  "Pronto!",
];

function ProgressIndicator({ step }: { step: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-8 pb-2">
      <div className="flex items-center justify-between relative">
        {stepLabels.map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < step;
          const isCurrent = stepNum === step;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all shrink-0 ${
                  isCompleted
                    ? "bg-indigo-500 text-white"
                    : isCurrent
                    ? "bg-indigo-500 text-white ring-4 ring-indigo-100"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>

              {i < stepLabels.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 transition-colors ${
                    stepNum < step ? "bg-indigo-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm font-medium text-slate-600 text-center mt-4">
        Passo {step} de 6 — {stepLabels[step - 1]}
      </p>
    </div>
  );
}

export default function WizardLayout({
  step,
  title,
  subtitle,
  children,
  onContinue,
  showSkip,
  optionalBadge,
}: WizardLayoutProps) {
  const navigate = useNavigate();

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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col animate-fade-in">
      <ProgressIndicator step={step} />

      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="mb-6">
            {optionalBadge && (
              <span className="inline-block bg-slate-100 text-slate-500 rounded-full px-3 py-1 text-xs font-medium mb-3">
                Opcional
              </span>
            )}
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
            )}
          </div>

          <div>{children}</div>

          {step < 6 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-1 text-slate-500"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <div className="flex gap-2">
                {showSkip && (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="gap-1 text-slate-500"
                  >
                    Pular <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={handleContinue}
                  className="gap-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6"
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
