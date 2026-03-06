import { useState } from "react";
import { Lock, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function TrialExpiredOverlay() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      {/* Overlay que bloqueia toda a interface */}
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-3xl border border-border shadow-xl p-8 text-center space-y-6">

          {/* Ícone */}
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>

          {/* Texto */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Seu trial encerrou
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O período gratuito de 7 dias chegou ao fim. Faça upgrade para continuar usando seu Funcionário de IA e não perder nenhum atendimento.
            </p>
          </div>

          {/* Benefícios rápidos */}
          <div className="bg-muted/50 rounded-2xl p-4 text-left space-y-2">
            {[
              "Atendimento via WhatsApp 24/7",
              "Histórico completo de conversas",
              "Identificação automática de leads",
              "Métricas e relatórios",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full gap-2"
              onClick={() => setUpgradeOpen(true)}
            >
              <Zap className="h-4 w-4" />
              Ver planos e fazer upgrade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair da conta
            </Button>
          </div>

        </div>
      </div>

      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </>
  );
}
