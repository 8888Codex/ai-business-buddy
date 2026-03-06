import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "@/contexts/WizardContext";
import {
  createOrUpdateBusiness,
  createOrGetAgent,
  createWhatsAppInstance,
  getWhatsAppStatus,
  reconnectWhatsApp,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Smartphone,
  ArrowRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

type ConnectionState = "saving" | "waiting" | "connected" | "error";

const TIMER_DURATION = 60;
const POLL_INTERVAL_MS = 3_000;
const CIRCLE_RADIUS = 40;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function Connect() {
  const navigate = useNavigate();
  const { data: wizardData } = useWizard();

  const [state, setState] = useState<ConnectionState>("saving");
  const [countdown, setCountdown] = useState(TIMER_DURATION);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);

  // Refs para evitar race conditions
  const agentIdRef = useRef<string | null>(null);
  const instanceIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redireciona para wizard se dados não estão preenchidos
  useEffect(() => {
    if (!wizardData.companyName) {
      navigate("/wizard/step-1");
    }
  }, [wizardData.companyName, navigate]);

  // ── Salvar business + agent + criar instância WhatsApp ──────────────────────
  useEffect(() => {
    if (state !== "saving" || !wizardData.companyName) return;

    async function setup() {
      try {
        // 1. Business
        const businessId = await createOrUpdateBusiness({
          name: wizardData.companyName,
          segment: wizardData.segment,
          hours_open: wizardData.openTime,
          hours_close: wizardData.closeTime,
        });

        // 2. Agent (cria ou reutiliza existente se plano atingiu limite)
        const agent = await createOrGetAgent({
          name: wizardData.agentName || `Assistente ${wizardData.companyName}`,
          type: "attendant",
          system_prompt: wizardData.generatedPrompt || undefined,
          business_id: businessId,
          objectives: wizardData.objectives,
          lead_action: wizardData.hotLeadAction || undefined,
        });
        agentIdRef.current = agent.id;

        // 3. Criar instância WhatsApp → recebe QR code real
        const instance = await createWhatsAppInstance(agent.id);
        instanceIdRef.current = instance.instance_id;
        setQrCode(instance.qr_code);
        setState("waiting");
      } catch (err: any) {
        setErrorMessage(err.message || "Erro ao configurar agente");
        setState("error");
      }
    }

    setup();
  }, [state, wizardData]);

  // ── Polling de status ───────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "waiting") return;

    pollRef.current = setInterval(async () => {
      if (!instanceIdRef.current) return;
      try {
        const status = await getWhatsAppStatus(instanceIdRef.current);
        if (status.connected) {
          clearInterval(pollRef.current!);
          setConnectedPhone(status.phone);
          setState("connected");
        }
      } catch {
        // ignora erros transitórios de polling
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state]);

  // ── Countdown ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "waiting" || countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(interval);
  }, [state, countdown]);

  // ── Redirect após conectar ──────────────────────────────────────────────────
  useEffect(() => {
    if (state !== "connected") return;
    const start = Date.now();
    const duration = 3_000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setRedirectProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed >= duration) {
        clearInterval(interval);
        navigate("/dashboard");
      }
    }, 50);
    return () => clearInterval(interval);
  }, [state, navigate]);

  // ── Gerar novo QR code ──────────────────────────────────────────────────────
  const handleRetry = useCallback(async () => {
    if (!agentIdRef.current) return;
    setQrCode(null);
    setCountdown(TIMER_DURATION);
    try {
      const instance = await reconnectWhatsApp(agentIdRef.current);
      instanceIdRef.current = instance.instance_id;
      setQrCode(instance.qr_code);
      setState("waiting");
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao gerar novo QR code");
      setState("error");
    }
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timerOffset = CIRCLE_CIRCUMFERENCE * (1 - countdown / TIMER_DURATION);

  const cardBase =
    "bg-white rounded-2xl shadow-sm border p-8 text-center max-w-md mx-auto transition-all duration-500";
  const cardClass =
    state === "connected"
      ? `${cardBase} border-emerald-500 bg-emerald-50`
      : state === "error"
      ? `${cardBase} border-red-200 bg-red-50`
      : `${cardBase} border-slate-200`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 animate-fade-in">
      <div className={cardClass}>

        {/* ── SAVING ── */}
        {state === "saving" && (
          <div className="space-y-6">
            <Loader2 className="w-10 h-10 text-indigo-500 mx-auto animate-spin" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Salvando seu agente...</h1>
              <p className="text-slate-500 text-sm mt-1">Aguarde enquanto configuramos tudo</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm text-slate-400">Conectando ao servidor...</span>
            </div>
          </div>
        )}

        {/* ── WAITING ── */}
        {state === "waiting" && (
          <div className="space-y-6">
            <Smartphone className="w-10 h-10 text-indigo-500 mx-auto" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Conecte Seu WhatsApp</h1>
              <p className="text-slate-500 text-sm mt-1">Escaneie o código com seu celular</p>
            </div>

            {countdown > 0 ? (
              <>
                {/* QR Code real ou loading */}
                <div className="mx-auto w-[220px] h-[220px] border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
                  {qrCode ? (
                    <img
                      src={qrCode}
                      alt="QR Code WhatsApp"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                  )}
                </div>

                {/* Timer circular */}
                <div className="flex justify-center relative">
                  <svg width="100" height="100" className="-rotate-90">
                    <circle cx="50" cy="50" r={CIRCLE_RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="50" cy="50" r={CIRCLE_RADIUS}
                      fill="none" stroke="#6366f1" strokeWidth="3"
                      strokeDasharray={CIRCLE_CIRCUMFERENCE}
                      strokeDashoffset={timerOffset}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-1000 linear"
                    />
                  </svg>
                  <span className="absolute top-[38px] text-sm text-slate-400 font-medium">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>
              </>
            ) : (
              <div className="py-8">
                <p className="text-sm text-slate-400 mb-4">O código expirou</p>
                <Button onClick={handleRetry} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Gerar Novo Código
                </Button>
              </div>
            )}

            {/* Instruções */}
            <div className="space-y-3 text-left">
              {[
                "Abra o WhatsApp no celular",
                "Toque em ⋮ → Aparelhos Conectados",
                "Escaneie o código acima",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>

            {countdown > 0 && (
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm text-slate-400">Aguardando conexão...</span>
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTED ── */}
        {state === "connected" && (
          <div className="space-y-6 animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <div>
              <h1 className="text-xl font-bold text-emerald-700">WhatsApp Conectado!</h1>
              <p className="text-emerald-600 text-sm mt-1">Seu Funcionário de IA está ativo</p>
            </div>
            {connectedPhone && (
              <span className="inline-block font-mono text-slate-600 bg-slate-100 px-4 py-2 rounded-lg text-sm">
                +{connectedPhone}
              </span>
            )}
            <div className="space-y-2">
              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${redirectProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Redirecionando para o Dashboard...</p>
            </div>
            <Button onClick={() => navigate("/dashboard")} className="gap-2">
              Ir para o Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── ERROR ── */}
        {state === "error" && (
          <div className="space-y-6 animate-fade-in">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
              <h1 className="text-xl font-bold text-red-700">Erro ao configurar</h1>
              <p className="text-red-500 text-sm mt-1">
                {errorMessage || "Verifique sua conexão e tente novamente"}
              </p>
            </div>
            <Button
              onClick={() => { setState("saving"); setErrorMessage(""); }}
              className="gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCw className="h-4 w-4" /> Tentar Novamente
            </Button>
          </div>
        )}
      </div>

      {/* Debug (apenas dev) */}
      {import.meta.env.DEV && (
        <div className="mt-8 flex gap-3">
          {(["waiting", "connected", "error"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setState(s);
                if (s === "waiting") setCountdown(TIMER_DURATION);
              }}
              className={`text-xs transition-colors ${
                state === s ? "text-slate-500 font-medium" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
