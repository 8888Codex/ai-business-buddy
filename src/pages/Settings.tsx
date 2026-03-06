import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAgent } from "@/contexts/AgentContext";
import { useToast } from "@/hooks/use-toast";
import { updateEmail, updatePassword, updateAgent } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReconnectWhatsAppDialog } from "@/components/ReconnectWhatsAppDialog";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import {
  User,
  Bot,
  Wifi,
  WifiOff,
  LogOut,
  RefreshCw,
  CreditCard,
  ChevronRight,
  Lock,
  Zap,
  Loader2,
} from "lucide-react";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  trial:    { label: "Trial",    color: "bg-slate-100 text-slate-600" },
  starter:  { label: "Starter",  color: "bg-blue-100 text-blue-600" },
  pro:      { label: "Pro",      color: "bg-violet-100 text-violet-600" },
  business: { label: "Business", color: "bg-amber-100 text-amber-700" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  onClick,
  danger,
  iconColor = "text-muted-foreground",
}: {
  icon: any;
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  iconColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`flex items-center gap-3 w-full px-5 py-4 text-left transition-colors border-b last:border-0 border-border/50 ${
        onClick
          ? danger
            ? "hover:bg-red-50 text-red-600"
            : "hover:bg-accent/50"
          : "cursor-default"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${danger ? "text-red-500" : iconColor}`} />
      <span className={`flex-1 text-sm font-medium ${danger ? "text-red-600" : "text-foreground"}`}>
        {label}
      </span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      {onClick && !danger && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
    </button>
  );
}

export default function SettingsPage() {
  const { user, signIn, signOut } = useAuth();
  const { agent, reload: reloadAgent } = useAgent();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [reconnectOpen, setReconnectOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // ── Email dialog ──
  const [emailOpen, setEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const handleSaveEmail = async () => {
    if (!newEmail.trim()) return;
    setSavingEmail(true);
    try {
      const res = await updateEmail(newEmail.trim());
      signIn(res.user as any);
      toast({ title: "Email atualizado!" });
      setEmailOpen(false);
      setNewEmail("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message ?? "Tente novamente.", variant: "destructive" });
    } finally {
      setSavingEmail(false);
    }
  };

  // ── Senha dialog ──
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const handleSavePassword = async () => {
    if (newPw !== confirmPw) {
      toast({ title: "Senhas não coincidem", variant: "destructive" });
      return;
    }
    if (newPw.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setSavingPw(true);
    try {
      await updatePassword(currentPw, newPw);
      toast({ title: "Senha alterada com sucesso!" });
      setPwOpen(false);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message ?? "Verifique sua senha atual.", variant: "destructive" });
    } finally {
      setSavingPw(false);
    }
  };

  // ── Nome do agente dialog ──
  const [nameOpen, setNameOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim() || !agent?.id) return;
    setSavingName(true);
    try {
      await updateAgent(agent.id, { name: newName.trim() });
      await reloadAgent();
      toast({ title: "Nome do agente atualizado!" });
      setNameOpen(false);
      setNewName("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message ?? "Tente novamente.", variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const plan = user?.plan ?? "trial";
  const planInfo = PLAN_LABELS[plan] ?? { label: plan, color: "bg-slate-100 text-slate-600" };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie sua conta e agente</p>
      </div>

      {/* Conta */}
      <Section title="Conta">
        <Row
          icon={User}
          label="E-mail"
          value={user?.email}
          onClick={() => { setNewEmail(user?.email ?? ""); setEmailOpen(true); }}
          iconColor="text-primary"
        />
        <Row
          icon={CreditCard}
          label="Plano atual"
          value={
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${planInfo.color}`}>
              {planInfo.label}
            </span>
          }
          iconColor="text-violet-500"
        />
        <Row
          icon={Zap}
          label="Fazer Upgrade"
          onClick={() => setUpgradeOpen(true)}
          iconColor="text-amber-500"
        />
      </Section>

      {/* Agente de IA */}
      <Section title="Agente de IA">
        <Row
          icon={Bot}
          label="Nome do agente"
          value={agent?.name ?? "—"}
          onClick={() => { setNewName(agent?.name ?? ""); setNameOpen(true); }}
          iconColor="text-primary"
        />
        <Row
          icon={agent?.whatsapp_connected ? Wifi : WifiOff}
          label="WhatsApp"
          value={
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                agent?.whatsapp_connected
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {agent?.whatsapp_connected ? "Conectado" : "Desconectado"}
            </span>
          }
          iconColor={agent?.whatsapp_connected ? "text-emerald-500" : "text-amber-500"}
        />
        <Row
          icon={RefreshCw}
          label="Reconectar WhatsApp"
          onClick={() => setReconnectOpen(true)}
          iconColor="text-blue-500"
        />
        <Row
          icon={Bot}
          label="Gerenciar agentes"
          onClick={() => navigate("/agents")}
          iconColor="text-primary"
        />
      </Section>

      {/* Segurança */}
      <Section title="Segurança">
        <Row
          icon={Lock}
          label="Alterar senha"
          value="••••••••"
          onClick={() => setPwOpen(true)}
          iconColor="text-slate-400"
        />
      </Section>

      {/* Sessão */}
      <Section title="Sessão">
        <Row icon={LogOut} label="Sair da conta" onClick={handleLogout} danger />
      </Section>

      {/* ── Dialogs ── */}

      {/* Email */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Alterar e-mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Novo e-mail</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="novo@email.com"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSaveEmail()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEmail} disabled={savingEmail || !newEmail.trim()}>
              {savingEmail && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Senha */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Senha atual</Label>
              <Input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label>Nova senha</Label>
              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <Label>Confirmar nova senha</Label>
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSavePassword()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPwOpen(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}>
              Cancelar
            </Button>
            <Button onClick={handleSavePassword} disabled={savingPw || !currentPw || !newPw || !confirmPw}>
              {savingPw && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Alterar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nome do agente */}
      <Dialog open={nameOpen} onOpenChange={setNameOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nome do agente</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Assistente Cognita"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNameOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveName} disabled={savingName || !newName.trim()}>
              {savingName && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReconnectWhatsAppDialog open={reconnectOpen} onOpenChange={setReconnectOpen} />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
