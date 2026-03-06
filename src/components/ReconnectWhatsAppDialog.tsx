import { useState, useEffect, useRef, useCallback } from "react";
import { reconnectWhatsApp, getWhatsAppStatus } from "@/services/api";
import { useAgent } from "@/contexts/AgentContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, RefreshCw, Smartphone } from "lucide-react";

const TIMER = 60;
const POLL_MS = 3_000;
const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type State = "loading" | "waiting" | "connected" | "error";

export function ReconnectWhatsAppDialog({ open, onOpenChange }: Props) {
  const { agent, reload } = useAgent();

  const [state, setState] = useState<State>("loading");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(TIMER);
  const [errorMsg, setErrorMsg] = useState("");

  const instanceIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const fetchQr = useCallback(async () => {
    if (!agent?.id) return;
    setState("loading");
    setQrCode(null);
    setCountdown(TIMER);
    stopPoll();
    try {
      const instance = await reconnectWhatsApp(agent.id);
      instanceIdRef.current = instance.instance_id;
      setQrCode(instance.qr_code);
      setState("waiting");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Erro ao gerar QR code");
      setState("error");
    }
  }, [agent?.id]);

  // Busca QR ao abrir
  useEffect(() => {
    if (open) fetchQr();
    return () => stopPoll();
  }, [open]);

  // Polling de status
  useEffect(() => {
    if (state !== "waiting") return;
    pollRef.current = setInterval(async () => {
      if (!instanceIdRef.current) return;
      try {
        const status = await getWhatsAppStatus(instanceIdRef.current);
        if (status.connected) {
          stopPoll();
          setState("connected");
          reload(); // atualiza AgentContext com novo status
          setTimeout(() => onOpenChange(false), 2500);
        }
      } catch {
        // ignora erros transitórios
      }
    }, POLL_MS);
    return stopPoll;
  }, [state]);

  // Countdown
  useEffect(() => {
    if (state !== "waiting" || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [state, countdown]);

  const timerOffset = CIRC * (1 - countdown / TIMER);
  const min = Math.floor(countdown / 60);
  const sec = countdown % 60;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) stopPoll(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Reconectar WhatsApp</DialogTitle>
        </DialogHeader>

        {/* LOADING */}
        {state === "loading" && (
          <div className="py-10 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Gerando QR code...</p>
          </div>
        )}

        {/* WAITING */}
        {state === "waiting" && (
          <div className="flex flex-col items-center gap-5 py-2">
            <Smartphone className="h-7 w-7 text-primary" />
            <p className="text-sm text-muted-foreground">
              Escaneie o código com seu celular
            </p>

            {countdown > 0 ? (
              <>
                {/* QR */}
                <div className="w-[200px] h-[200px] border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code WhatsApp" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
                  )}
                </div>

                {/* Timer circular */}
                <div className="relative flex items-center justify-center">
                  <svg width="88" height="88" className="-rotate-90">
                    <circle cx="44" cy="44" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="44" cy="44" r={RADIUS}
                      fill="none" stroke="#6366f1" strokeWidth="3"
                      strokeDasharray={CIRC}
                      strokeDashoffset={timerOffset}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-1000 linear"
                    />
                  </svg>
                  <span className="absolute text-xs text-slate-400 font-medium">
                    {min}:{sec.toString().padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Aguardando conexão...</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-sm text-muted-foreground">O código expirou</p>
                <Button size="sm" onClick={fetchQr} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Gerar Novo Código
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CONNECTED */}
        {state === "connected" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-700">WhatsApp Conectado!</p>
              <p className="text-sm text-muted-foreground mt-1">Fechando automaticamente...</p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-sm text-red-500">{errorMsg || "Erro ao gerar QR code"}</p>
            <Button size="sm" onClick={fetchQr} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Tentar Novamente
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
