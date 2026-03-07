import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createStripeCheckout } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    highlight: false,
    messages: "1.000",
    agents: "1",
    features: [
      "1.000 mensagens/mês",
      "1 agente de IA",
      "Atendimento via WhatsApp",
      "Histórico de conversas",
      "Métricas básicas",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "R$ 197",
    period: "/mês",
    highlight: true,
    messages: "5.000",
    agents: "3",
    features: [
      "5.000 mensagens/mês",
      "3 agentes de IA",
      "Atendimento via WhatsApp",
      "Histórico completo",
      "Métricas avançadas",
      "Identificação de leads",
      "Agendamentos automáticos",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: "R$ 497",
    period: "/mês",
    highlight: false,
    messages: "Ilimitado",
    agents: "10",
    features: [
      "Mensagens ilimitadas",
      "10 agentes de IA",
      "Múltiplos WhatsApps",
      "Tudo do Pro",
      "Suporte prioritário",
      "Integração personalizada",
    ],
  },
];

export function UpgradeDialog({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    setLoadingPlan(planKey);
    try {
      const { checkout_url } = await createStripeCheckout(planKey as 'starter' | 'pro' | 'business');
      window.location.href = checkout_url;
    } catch (err: any) {
      toast({ title: "Erro ao abrir checkout", description: err.message ?? "Tente novamente.", variant: "destructive" });
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Escolha seu plano
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Expanda a capacidade do seu Funcionário de IA
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {plans.map((plan) => {
            const isCurrent = user?.plan === plan.key;
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl border p-4 flex flex-col gap-3 ${
                  plan.highlight
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                    Mais popular
                  </span>
                )}

                <div>
                  <p className="font-semibold text-foreground">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-1.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="sm"
                  disabled={isCurrent || loadingPlan !== null}
                  variant={plan.highlight ? "default" : "outline"}
                  className="w-full mt-1"
                  onClick={() => handleSubscribe(plan.key)}
                >
                  {loadingPlan === plan.key && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                  {isCurrent ? "Plano atual" : "Assinar"}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Pagamentos via PIX ou cartão. Cancele quando quiser.
        </p>
      </DialogContent>
    </Dialog>
  );
}
