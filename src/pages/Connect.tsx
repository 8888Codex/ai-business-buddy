import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QrCode, CheckCircle2, XCircle, Smartphone, ArrowRight, RefreshCw } from "lucide-react";

type ConnectionState = "waiting" | "connected" | "error";

export default function Connect() {
  const navigate = useNavigate();
  const [state, setState] = useState<ConnectionState>("waiting");
  const [countdown, setCountdown] = useState(60);
  const [redirectProgress, setRedirectProgress] = useState(0);

  // Countdown timer for QR expiration
  useEffect(() => {
    if (state !== "waiting" || countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [state, countdown]);

  // Auto-redirect after connection
  useEffect(() => {
    if (state !== "connected") return;
    const start = Date.now();
    const duration = 3000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setRedirectProgress(progress);
      if (elapsed >= duration) {
        clearInterval(interval);
        navigate("/dashboard");
      }
    }, 50);
    return () => clearInterval(interval);
  }, [state, navigate]);

  const handleRetry = useCallback(() => {
    setCountdown(60);
    setState("waiting");
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8">
          {state === "waiting" && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-2xl font-bold">Conecte Seu WhatsApp</h1>
                <p className="text-muted-foreground mt-1">Escaneie o QR Code com seu celular</p>
              </div>

              {/* QR Placeholder */}
              <div className="mx-auto w-64 h-64 border-2 border-dashed border-muted-foreground/30 rounded-xl flex items-center justify-center bg-muted/30">
                <QrCode className="h-20 w-20 text-muted-foreground/50" />
              </div>

              {/* Instructions */}
              <div className="text-left space-y-3">
                {[
                  "Abra o WhatsApp no seu celular",
                  "Toque em ⋮ → Dispositivos Conectados → Conectar Dispositivo",
                  "Aponte a câmera para o QR Code acima",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              {/* Status */}
              {countdown > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
                    </span>
                    <span className="text-sm text-muted-foreground">Aguardando conexão...</span>
                  </div>
                  <p className="text-xs text-muted-foreground">QR Code expira em {countdown}s</p>
                </div>
              ) : (
                <Button onClick={handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Gerar Novo QR Code
                </Button>
              )}
            </div>
          )}

          {state === "connected" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">WhatsApp Conectado!</h1>
                <p className="text-muted-foreground mt-1">Seu Funcionário de IA já está ativo</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">+55 11 9XXXX-XXXX</span>
              </div>
              <div className="space-y-2">
                <Progress value={redirectProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">Redirecionando para o Dashboard...</p>
              </div>
              <Button onClick={() => navigate("/dashboard")} className="gap-2">
                Ir para o Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Falha na Conexão</h1>
                <p className="text-muted-foreground mt-1">Não foi possível conectar. Tente novamente.</p>
              </div>
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Tentar Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug controls */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-card border rounded-lg p-2 shadow-lg">
          <Button size="sm" variant={state === "waiting" ? "default" : "outline"} onClick={() => { setState("waiting"); setCountdown(60); }}>
            Waiting
          </Button>
          <Button size="sm" variant={state === "connected" ? "default" : "outline"} onClick={() => setState("connected")}>
            Connected
          </Button>
          <Button size="sm" variant={state === "error" ? "default" : "outline"} onClick={() => setState("error")}>
            Error
          </Button>
        </div>
      )}
    </div>
  );
}
