import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Calendar,
  Zap,
  Pencil,
  Link as LinkIcon,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { day: "Seg", msgs: 12 },
  { day: "Ter", msgs: 19 },
  { day: "Qua", msgs: 15 },
  { day: "Qui", msgs: 25 },
  { day: "Sex", msgs: 32 },
  { day: "Sáb", msgs: 28 },
  { day: "Dom", msgs: 47 },
];

const mockConversations = [
  { id: 1, name: "Maria Silva", initials: "MS", preview: "Olá, gostaria de saber mais sobre o serviço de vocês...", time: "há 5 min", isLead: true },
  { id: 2, name: "João Santos", initials: "JS", preview: "Qual o horário de funcionamento?", time: "há 15 min", isLead: false },
  { id: 3, name: "+55 11 98765-4321", initials: "?", preview: "Boa tarde! Vocês fazem entrega?", time: "há 1h", isLead: true },
  { id: 4, name: "Ana Oliveira", initials: "AO", preview: "Obrigada pelo atendimento, vou pensar e retorno!", time: "há 2h", isLead: false },
  { id: 5, name: "Carlos Mendes", initials: "CM", preview: "Preciso agendar para quinta-feira, é possível?", time: "há 3h", isLead: true },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [agentOnline, setAgentOnline] = useState(true);
  const [promptOpen, setPromptOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    "Você é um assistente virtual de atendimento ao cliente. Seja educado, objetivo e tente identificar oportunidades de venda."
  );

  const firstName =
    user?.user_metadata?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText("https://wa.me/5511999999999");
    toast({ title: "Link copiado!", description: "Link do WhatsApp copiado para a área de transferência." });
  };

  const handleConversationClick = () => {
    toast({ title: "Em breve", description: "Detalhes da conversa em breve." });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName}!
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${agentOnline ? "bg-[hsl(var(--success))]" : "bg-destructive"}`}
            />
            <span className="text-sm text-muted-foreground">
              Agente {agentOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setPromptOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar Prompt
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Messages */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-0 text-xs">
                +12%
              </Badge>
            </div>
            <p className="text-3xl font-bold text-foreground">47</p>
            <p className="text-sm text-muted-foreground">Mensagens Hoje</p>
          </CardContent>
        </Card>

        {/* Leads */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-lg bg-[hsl(160,84%,39%)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[hsl(var(--success))]" />
            </div>
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">Leads Identificados</p>
            <span className="text-xs text-muted-foreground">últimos 7 dias</span>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="h-10 w-10 rounded-lg bg-[hsl(var(--warning))]/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[hsl(var(--warning))]" />
            </div>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Agendamentos</p>
            <span className="text-xs text-muted-foreground">últimos 7 dias</span>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <Switch checked={agentOnline} onCheckedChange={setAgentOnline} />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {agentOnline ? "Online" : "Offline"}
            </p>
            <p className="text-sm text-muted-foreground">Status do Agente</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Quick Actions row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Mensagens por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillMsgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(239,84%,67%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(239,84%,67%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,16%,47%)" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0,0%,100%)",
                    border: "1px solid hsl(214,32%,91%)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="msgs"
                  stroke="hsl(239,84%,67%)"
                  strokeWidth={2}
                  fill="url(#fillMsgs)"
                  name="Mensagens"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate("/connect")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Reconectar WhatsApp
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setPromptOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Prompt do Agente
            </Button>
            <Button variant="outline" className="justify-start" onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Compartilhar Link
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setUpgradeOpen(true)}>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Fazer Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">Últimas Conversas</CardTitle>
          <Button variant="link" size="sm" onClick={() => navigate("/conversations")}>
            Ver todas →
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {mockConversations.map((c) => (
            <button
              key={c.id}
              onClick={handleConversationClick}
              className="flex items-center gap-3 py-3 w-full text-left hover:bg-accent/50 rounded-md px-2 -mx-2 transition-colors"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {c.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{c.name}</span>
                  {c.isLead && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                      <Flame className="h-3 w-3 mr-0.5" /> Lead
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                {c.time}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Edit Prompt Dialog */}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Prompt do Agente</DialogTitle>
          </DialogHeader>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setPromptOpen(false);
                toast({ title: "Prompt salvo!", description: "O prompt do agente foi atualizado." });
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fazer Upgrade</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Planos de upgrade estarão disponíveis em breve. Fique ligado!
          </p>
          <DialogFooter>
            <Button onClick={() => setUpgradeOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
