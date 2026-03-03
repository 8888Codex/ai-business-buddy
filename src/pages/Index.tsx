import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl space-y-6">
        <div className="flex justify-center">
          <Bot className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Funcionário de IA
        </h1>
        <p className="text-lg text-muted-foreground">
          Crie agentes de IA para WhatsApp em 15 minutos, sem saber programar.
          Automatize o atendimento do seu negócio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link to="/auth">Começar Grátis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard">Ver Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
