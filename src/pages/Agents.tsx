import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAgents, getAgentMetrics, updateAgent } from "@/services/api";
import { ReconnectWhatsAppDialog } from "@/components/ReconnectWhatsAppDialog";
import { GoogleCalendarDialog } from "@/components/GoogleCalendarDialog";
import { removeGoogleCalendar } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Loader2,
  Plus,
  RefreshCw,
  Settings,
  MessageSquare,
  Users,
  CalendarCheck,
  Wifi,
  WifiOff,
  Zap,
  Link2,
  Unlink,
  Check,
  ShoppingCart,
  Headphones,
  Filter,
} from "lucide-react";

const OBJECTIVES = [
  { id: "sell",     label: "Vender",    icon: ShoppingCart, desc: "Qualificar leads e conduzir para venda" },
  { id: "support",  label: "Atender",   icon: Headphones,   desc: "Responder dúvidas e resolver problemas" },
  { id: "schedule", label: "Agendar",   icon: CalendarCheck, desc: "Marcar reuniões, consultas ou visitas" },
  { id: "qualify",  label: "Qualificar", icon: Filter,      desc: "Identificar e pontuar leads promissores" },
];

const LEAD_ACTIONS = [
  { label: "Notificar meu WhatsApp", emoji: "📱" },
  { label: "Notificar por e-mail",   emoji: "📧" },
  { label: "Só registrar no sistema", emoji: "📊" },
];

interface AgentData {
  id: string;
  name: string;
  type: string;
  status: string;
  system_prompt: string | null;
  whatsapp_connected: boolean;
  whatsapp_instance_id: string | null;
  business_id: string;
  objectives: string[];
  lead_action: string | null;
  google_calendar_id: string | null;
  google_calendar_name: string | null;
  created_at?: string;
}

interface AgentMetricsTotals {
  messages_sent: number;
  messages_received: number;
  leads_identified: number;
  appointments: number;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  attendant: { label: "Atendente",  color: "bg-blue-100 text-blue-700" },
  sdr:       { label: "SDR",        color: "bg-violet-100 text-violet-700" },
  followup:  { label: "Follow-up",  color: "bg-amber-100 text-amber-700" },
};

export default function Agents() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agents, setAgents] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsByAgent, setMetricsByAgent] = useState<Record<string, AgentMetricsTotals>>({});

  const [editingAgent, setEditingAgent] = useState<AgentData | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editObjectives, setEditObjectives] = useState<string[]>([]);
  const [editLeadAction, setEditLeadAction] = useState("");
  const [savingAgent, setSavingAgent] = useState(false);
  const [reconnectTarget, setReconnectTarget] = useState<AgentData | null>(null);
  const [googleCalendarTarget, setGoogleCalendarTarget] = useState<AgentData | null>(null);

  // Detecta retorno do OAuth do Google
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get("google_auth");
    if (googleAuth === "success") {
      window.history.replaceState({}, "", "/agents");
      toast({ title: "Google Calendar conectado! Selecione o calendário." });
      // Abriremos o dialog após carregar os agentes
    } else if (googleAuth === "denied") {
      window.history.replaceState({}, "", "/agents");
      toast({ title: "Autorização negada pelo Google.", variant: "destructive" });
    } else if (googleAuth === "error") {
      window.history.replaceState({}, "", "/agents");
      toast({ title: "Erro ao conectar Google Calendar.", variant: "destructive" });
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const list = await getAgents();
        const agentList = list as AgentData[];
        setAgents(agentList);

        const entries = await Promise.allSettled(
          list.map(async (a) => {
            const m = await getAgentMetrics(a.id, 7);
            return { id: a.id, totals: m.totals };
          })
        );
        const map: Record<string, AgentMetricsTotals> = {};
        entries.forEach((r) => {
          if (r.status === "fulfilled") map[r.value.id] = r.value.totals;
        });
        setMetricsByAgent(map);

        // Abrir dialog de calendário se veio do OAuth
        const params = new URLSearchParams(window.location.search);
        if (params.get("google_auth") === "success" && agentList.length > 0) {
          const scheduleAgent = agentList.find((a) => (a.objectives ?? []).includes("schedule"));
          if (scheduleAgent) setGoogleCalendarTarget(scheduleAgent);
          else setGoogleCalendarTarget(agentList[0]);
        }
      } catch {
        toast({ title: "Erro ao carregar agentes", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEdit = (agent: AgentData) => {
    setEditingAgent(agent);
    setEditName(agent.name);
    setEditType(agent.type);
    setEditPrompt(agent.system_prompt ?? "");
    setEditObjectives(agent.objectives ?? []);
    setEditLeadAction(agent.lead_action ?? "");
  };

  const toggleObjective = (id: string) => {
    setEditObjectives((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        toast({ title: "Máximo 2 objetivos", variant: "destructive" });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleGoogleCalendarSaved = (agentId: string, data: { google_calendar_id: string; google_calendar_name: string }) => {
    setAgents((prev) => prev.map((a) => a.id === agentId ? { ...a, ...data } : a));
  };

  const handleGoogleCalendarDisconnect = async (agent: AgentData) => {
    try {
      await removeGoogleCalendar(agent.id);
      setAgents((prev) => prev.map((a) => a.id === agent.id
        ? { ...a, google_calendar_id: null, google_calendar_name: null }
        : a
      ));
      toast({ title: "Google Calendar desconectado" });
    } catch {
      toast({ title: "Erro ao desconectar", variant: "destructive" });
    }
  };

  const handleSaveAgent = async () => {
    if (!editingAgent || !editName.trim()) return;
    if (editObjectives.length === 0) {
      toast({ title: "Selecione pelo menos 1 objetivo", variant: "destructive" });
      return;
    }
    setSavingAgent(true);
    try {
      await updateAgent(editingAgent.id, {
        name: editName.trim(),
        type: editType,
        system_prompt: editPrompt,
        objectives: editObjectives,
        lead_action: editLeadAction || undefined,
      });
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? { ...a, name: editName.trim(), type: editType, system_prompt: editPrompt, objectives: editObjectives, lead_action: editLeadAction }
            : a
        )
      );
      toast({ title: "Agente atualizado!" });
      setEditingAgent(null);
    } catch {
      toast({ title: "Erro ao salvar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setSavingAgent(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Agentes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Carregando..." : `${agents.length} agente${agents.length !== 1 ? "s" : ""} configurado${agents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => navigate("/wizard/step-1")} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Agente
        </Button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-7 w-7 text-muted-foreground animate-spin" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && agents.length === 0 && (
        <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Bot className="h-7 w-7 text-primary" />
          </div>
          <p className="font-semibold text-foreground">Nenhum agente criado</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs mx-auto">
            Crie seu primeiro assistente de IA para começar a atender clientes via WhatsApp.
          </p>
          <Button onClick={() => navigate("/wizard/step-1")} className="gap-2">
            <Plus className="h-4 w-4" /> Criar Agente
          </Button>
        </div>
      )}

      {/* ── Agent cards ── */}
      {!loading && agents.length > 0 && (
        <div className="space-y-4">
          {agents.map((agent) => {
            const totals = metricsByAgent[agent.id];
            const isOnline = agent.whatsapp_connected && agent.status === "active";
            const isDisconnected = !agent.whatsapp_connected;
            const typeInfo = TYPE_LABELS[agent.type] ?? { label: agent.type, color: "bg-slate-100 text-slate-600" };

            const statusBorderColor = isOnline
              ? "border-l-emerald-400"
              : isDisconnected
              ? "border-l-amber-400"
              : "border-l-slate-300";

            return (
              <div
                key={agent.id}
                className={`bg-card rounded-2xl border border-border border-l-4 ${statusBorderColor} overflow-hidden`}
              >
                {/* ── Card header ── */}
                <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card">
                          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                        </span>
                      )}
                      {isDisconnected && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground leading-tight">{agent.name}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isOnline
                          ? "Agente ativo · atendendo via WhatsApp"
                          : isDisconnected
                          ? "WhatsApp desconectado"
                          : "Agente inativo"}
                      </p>
                    </div>
                  </div>

                  {isOnline ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                      <Wifi className="h-3 w-3" /> Online
                    </span>
                  ) : isDisconnected ? (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                      <WifiOff className="h-3 w-3" /> Desconectado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                      Inativo
                    </span>
                  )}
                </div>

                {/* ── Metrics strip ── */}
                <div className="mx-6 mb-4 bg-muted/40 rounded-xl grid grid-cols-3 divide-x divide-border/60">
                  {[
                    { icon: MessageSquare, value: totals ? totals.messages_sent + totals.messages_received : 0, label: "Mensagens", color: "text-primary" },
                    { icon: Users,         value: totals ? totals.leads_identified : 0, label: "Leads", color: "text-emerald-600" },
                    { icon: CalendarCheck, value: totals ? totals.appointments : 0,     label: "Agendamentos", color: "text-violet-600" },
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center py-3 gap-0.5">
                      <m.icon className={`h-3.5 w-3.5 ${m.color} mb-1`} />
                      <p className="text-lg font-bold text-foreground leading-none">{m.value}</p>
                      <p className="text-[11px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* ── Prompt preview ── */}
                {agent.system_prompt && (
                  <div className="mx-6 mb-4">
                    <div className="relative bg-slate-50 rounded-xl border border-border/50 px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Prompt do agente</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-mono">
                        {agent.system_prompt}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Google Calendar integration (só se objetivo "schedule" está ativo) ── */}
                {(agent.objectives ?? []).includes("schedule") && (
                  <div className="mx-6 mb-4">
                    {agent.google_calendar_id ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-700">Google Calendar conectado</p>
                            {agent.google_calendar_name && (
                              <p className="text-[11px] text-emerald-600">{agent.google_calendar_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-700 hover:bg-emerald-100"
                            onClick={() => setGoogleCalendarTarget(agent)}>
                            <Settings className="h-3 w-3" /> Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-red-500 hover:bg-red-50"
                            onClick={() => handleGoogleCalendarDisconnect(agent)}>
                            <Unlink className="h-3 w-3" /> Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setGoogleCalendarTarget(agent)}
                        className="w-full flex items-center gap-3 border border-dashed border-border rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <CalendarCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-foreground">Conectar Google Calendar</p>
                          <p className="text-xs text-muted-foreground">Agendar reuniões direto pelo WhatsApp</p>
                        </div>
                        <Link2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    )}
                  </div>
                )}

                {/* ── Actions footer ── */}
                <div className="px-6 pb-5 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8 text-xs"
                    onClick={() => openEdit(agent)}
                  >
                    <Settings className="h-3.5 w-3.5" /> Editar Prompt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-8 text-xs"
                    onClick={() => setReconnectTarget(agent)}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reconectar WhatsApp
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Agent Dialog ── */}
      <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">

            {/* Nome */}
            <div className="space-y-1.5">
              <Label>Nome do agente</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ex: Assistente Cognita"
                autoFocus
              />
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "attendant", label: "Atendente", desc: "Suporte e dúvidas" },
                  { value: "sdr",       label: "SDR",       desc: "Prospecção ativa" },
                  { value: "followup",  label: "Follow-up", desc: "Nutrição de leads" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setEditType(t.value)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      editType === t.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/50 hover:bg-accent/30"
                    }`}
                  >
                    <p className="text-xs font-semibold text-foreground">{t.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivos */}
            <div className="space-y-1.5">
              <Label>
                Objetivos
                <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">(até 2)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {OBJECTIVES.map((o) => {
                  const Icon = o.icon;
                  const active = editObjectives.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleObjective(o.id)}
                      className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/40 hover:bg-accent/30"
                      }`}
                    >
                      <div className={`absolute top-2.5 right-2.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-xs font-semibold text-foreground">{o.label}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{o.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ação para lead quente */}
            <div className="space-y-1.5">
              <Label>Quando identificar um lead quente</Label>
              <div className="space-y-1.5">
                {LEAD_ACTIONS.map((a) => {
                  const active = editLeadAction === a.label;
                  return (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => setEditLeadAction(a.label)}
                      className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/40 hover:bg-accent/30"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-primary" : "border-border"}`}>
                        {active && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm text-foreground">{a.emoji} {a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <Label>Prompt do agente</Label>
              <Textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={6}
                className="resize-none font-mono text-sm"
                placeholder="Descreva como seu agente deve se comportar..."
              />
            </div>

          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setEditingAgent(null)}>Cancelar</Button>
            <Button onClick={handleSaveAgent} disabled={savingAgent || !editName.trim()}>
              {savingAgent && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReconnectWhatsAppDialog
        open={!!reconnectTarget}
        onOpenChange={(open) => !open && setReconnectTarget(null)}
      />

      {googleCalendarTarget && (
        <GoogleCalendarDialog
          open={!!googleCalendarTarget}
          onOpenChange={(open) => !open && setGoogleCalendarTarget(null)}
          agentId={googleCalendarTarget.id}
          currentCalendarId={googleCalendarTarget.google_calendar_id}
          currentCalendarName={googleCalendarTarget.google_calendar_name}
          onSaved={(data) => handleGoogleCalendarSaved(googleCalendarTarget.id, data)}
          onDisconnected={() => handleGoogleCalendarDisconnect(googleCalendarTarget)}
        />
      )}
    </div>
  );
}
