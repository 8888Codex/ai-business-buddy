import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  MessageSquare,
  Users,
  CalendarCheck,
  Zap,
  Settings,
  RefreshCw,
  Share2,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

/* ── Mock Data ── */
const chartData = [
  { day: "Seg", mensagens: 12, leads: 2, agendamentos: 1 },
  { day: "Ter", mensagens: 19, leads: 3, agendamentos: 0 },
  { day: "Qua", mensagens: 15, leads: 1, agendamentos: 1 },
  { day: "Qui", mensagens: 25, leads: 4, agendamentos: 0 },
  { day: "Sex", mensagens: 32, leads: 2, agendamentos: 1 },
  { day: "Sáb", mensagens: 28, leads: 1, agendamentos: 0 },
  { day: "Dom", mensagens: 47, leads: 3, agendamentos: 0 },
];

const conversations = [
  { id: 1, name: "Maria Silva", initials: "MS", preview: "Olá, gostaria de saber mais sobre o serviço de vocês...", time: "há 5 min", hot: true },
  { id: 2, name: "João Santos", initials: "JS", preview: "Qual o horário de funcionamento?", time: "há 15 min", hot: false },
  { id: 3, name: "+55 11 98765-4321", initials: "?", preview: "Boa tarde! Vocês fazem entrega?", time: "há 1h", hot: true },
  { id: 4, name: "Ana Oliveira", initials: "AO", preview: "Obrigada pelo atendimento, vou pensar e retorno!", time: "há 2h", hot: false },
  { id: 5, name: "Carlos Mendes", initials: "CM", preview: "Preciso agendar para quinta-feira, é possível?", time: "há 3h", hot: true },
];

const metrics = [
  { icon: MessageSquare, value: "47", label: "Mensagens Hoje", badge: "+12% ↑", iconBg: "bg-primary/10", iconColor: "text-primary", badgeBg: "bg-[hsl(160,84%,39%)]/10", badgeColor: "text-[hsl(160,84%,39%)]" },
  { icon: Users, value: "8", label: "Leads Esta Semana", badge: "+3 novos", iconBg: "bg-[hsl(160,84%,39%)]/10", iconColor: "text-[hsl(var(--success))]", badgeBg: "bg-[hsl(160,84%,39%)]/10", badgeColor: "text-[hsl(160,84%,39%)]" },
  { icon: CalendarCheck, value: "3", label: "Agendamentos", badge: "últimos 7 dias", iconBg: "bg-[hsl(var(--warning))]/10", iconColor: "text-[hsl(var(--warning))]", badgeBg: "bg-[hsl(var(--warning))]/10", badgeColor: "text-[hsl(var(--warning))]" },
  { icon: Zap, value: "98%", label: "Taxa de Resposta", badge: "< 3s média", iconBg: "bg-[hsl(263,70%,58%)]/10", iconColor: "text-[hsl(263,70%,58%)]", badgeBg: "bg-[hsl(263,70%,58%)]/10", badgeColor: "text-[hsl(263,70%,58%)]" },
];

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const [promptOpen, setPromptOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    "Você é um assistente virtual de atendimento ao cliente. Seja educado, objetivo e tente identificar oportunidades de venda."
  );
  const [chartTab, setChartTab] = useState<ChartTab>("mensagens");

  const firstName =
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText("https://wa.me/5511999999999");
    toast({ title: "Link copiado!", description: "Link do WhatsApp copiado." });
  };

  const quickActions = [
    { icon: Settings, label: "Editar Prompt", onClick: () => setPromptOpen(true), highlight: false },
    { icon: RefreshCw, label: "Reconectar WhatsApp", onClick: () => navigate("/connect"), highlight: false },
    { icon: Share2, label: "Compartilhar Link", onClick: handleCopyLink, highlight: false },
    { icon: Zap, label: "Fazer Upgrade", onClick: () => setUpgradeOpen(true), highlight: true },
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
          <span className="inline-flex items-center gap-1.5 bg-[hsl(160,84%,39%)]/10 text-[hsl(var(--success))] px-3 py-1 rounded-full text-sm font-medium">
            🟢 Agente Online
          </span>
          <Button variant="ghost" size="sm" onClick={() => setPromptOpen(true)} className="gap-1.5">
            <Settings className="h-4 w-4" /> Editar Prompt
          </Button>
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
            <p className="text-3xl font-bold text-foreground">{m.value}</p>
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
      </div>

      {/* ── RECENT CONVERSATIONS ── */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-semibold text-foreground">Últimas Conversas</h2>
          <button
            onClick={() => navigate("/conversations")}
            className="text-primary text-sm font-medium hover:underline"
          >
            Ver todas →
          </button>
        </div>
        <div>
          {conversations.map((c, i) => (
            <button
              key={c.id}
              onClick={() => toast({ title: "Em breve", description: "Detalhes da conversa em breve." })}
              className={`flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-accent/50 transition-colors ${
                i < conversations.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{c.name}</span>
                  {c.hot && <span className="text-xs">🔥</span>}
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{c.preview}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">{c.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className={`rounded-xl border p-4 text-center transition-colors ${
              a.highlight
                ? "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                : "bg-card border-border text-foreground hover:bg-accent/50"
            }`}
          >
            <a.icon className="h-5 w-5 mx-auto mb-2" />
            <span className="text-sm font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── DIALOGS ── */}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Prompt do Agente</DialogTitle>
          </DialogHeader>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} className="resize-none" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptOpen(false)}>Cancelar</Button>
            <Button onClick={() => { setPromptOpen(false); toast({ title: "Prompt salvo!" }); }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fazer Upgrade</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Planos de upgrade estarão disponíveis em breve.</p>
          <DialogFooter>
            <Button onClick={() => setUpgradeOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
