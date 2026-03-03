import { Bot } from "lucide-react";

export default function Auth() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md space-y-4">
        <Bot className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Login / Registro</h1>
        <p className="text-muted-foreground">Autenticação será implementada com Supabase.</p>
      </div>
    </div>
  );
}
