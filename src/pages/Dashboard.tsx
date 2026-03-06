import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAgents, getAgentMetrics } from "@/services/api";
import type { AgentMetrics } from "@/services/api";
import {
  MessageSquare,
  Users,
  CalendarCheck,
  Zap,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function dateToDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return DAYS_PT[d.getDay()];
}

type ChartTab = "mensagens" | "leads" | "agendamentos";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground text-primary-foreground rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium">{label}</p>
      <p>{payload[0].value} {payload[0].dataKey}</p>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [chartTab, setChartTab] = useState<ChartTab>("mensagens");

  const [agentConnected, setAgentConnected] = useState(false);
  const [metricsData, setMetricsData] = useState<AgentMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgent() {
      try {
        const agents = await getAgents();
        if (agents.length === 0) {
          setLoading(false);
          return;
        }
        const agent = agents[0];
        setAgentConnected(agent.whatsapp_connected ?? false);

        const metrics = await getAgentMetrics(agent.id, 7);
        setMetricsData(metrics);
      } catch {
        // falha silenciosa — exibe zeros
      } finally {
        setLoading(false);
      }
    }
    loadAgent();
  }, []);

  const firstName = user?.email?.split("@")[0] ?? "Usuário";

  const totals = metricsData?.totals ?? {
    messages_sent: 0,
    messages_received: 0,
    leads_identified: 0,
    appointments: 0,
  };

  const chartData = (metricsData?.metrics ?? []).map((m) => ({
    day: dateToDay(m.date),
    mensagens: m.messages_sent + m.messages_received,
    leads: m.leads_identified,
    agendamentos: m.appointments,
  }));

  const metrics = [
    {
      icon: MessageSquare,
      value: String(totals.messages_sent + totals.messages_received),
      label: "Mensagens (7 dias)",
      badge: "últimos 7 dias",
      iconBg: "bg-primary/10", iconColor: "text-primary",
      badgeBg: "bg-[hsl(160,84%,39%)]/10", badgeColor: "text-[hsl(160,84%,39%)]",
    },
    {
      icon: Users,
      value: String(totals.leads_identified),
      label: "Leads Identificados",
      badge: "últimos 7 dias",
      iconBg: "bg-[hsl(160,84%,39%)]/10", iconColor: "text-[hsl(var(--success))]",
      badgeBg: "bg-[hsl(160,84%,39%)]/10", badgeColor: "text-[hsl(160,84%,39%)]",
    },
    {
      icon: CalendarCheck,
      value: String(totals.appointments),
      label: "Agendamentos",
      badge: "últimos 7 dias",
      iconBg: "bg-[hsl(var(--warning))]/10", iconColor: "text-[hsl(var(--warning))]",
      badgeBg: "bg-[hsl(var(--warning))]/10", badgeColor: "text-[hsl(var(--warning))]",
    },
    {
      icon: Zap,
      value: "—",
      label: "Taxa de Resposta",
      badge: "em breve",
      iconBg: "bg-[hsl(263,70%,58%)]/10", iconColor: "text-[hsl(263,70%,58%)]",
      badgeBg: "bg-[hsl(263,70%,58%)]/10", badgeColor: "text-[hsl(263,70%,58%)]",
    },
  ];

  const tabs: { key: ChartTab; label: string }[] = [
    { key: "mensagens", label: "Mensagens" },
    { key: "leads", label: "Leads" },
    { key: "agendamentos", label: "Agendamentos" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* ── TOPBAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {firstName} 👋
        </h1>
        <div className="flex items-center gap-3">
          {loading ? (
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-sm font-medium">
              <Loader2 className="h-3 w-3 animate-spin" /> Carregando...
            </span>
          ) : agentConnected ? (
            <span className="inline-flex items-center gap-1.5 bg-[hsl(160,84%,39%)]/10 text-[hsl(var(--success))] px-3 py-1 rounded-full text-sm font-medium">
              🟢 Agente Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
              🟡 WhatsApp Desconectado
            </span>
          )}
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-sm transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                <m.icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
              <span className={`text-xs ${m.badgeColor} ${m.badgeBg} rounded-full px-2 py-0.5 font-medium`}>
                {m.badge}
              </span>
            </div>
            {loading ? (
              <div className="h-9 w-12 bg-slate-100 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{m.value}</p>
            )}
            <p className="text-sm text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      {/* ── CHART ── */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="font-semibold text-foreground">Atividade dos Últimos 7 Dias</h2>
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setChartTab(t.key)}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  chartTab === t.key
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Sem dados ainda. O gráfico aparecerá quando o agente começar a interagir.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(239,84%,67%)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="hsl(239,84%,67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal vertical={false} stroke="hsl(214,32%,91%)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(215,16%,47%)" }}
              />
              <ReTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={chartTab}
                stroke="hsl(239,84%,67%)"
                strokeWidth={2}
                fill="url(#chartFill)"
                dot={{ fill: "white", stroke: "hsl(239,84%,67%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── CONVERSATIONS PLACEHOLDER ── */}
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Histórico de Conversas</p>
        <p className="text-xs text-muted-foreground mt-1">Disponível em breve (v1.1)</p>
      </div>

    </div>
  );
}
