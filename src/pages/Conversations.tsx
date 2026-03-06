import { useState, useEffect } from "react";
import { getConversations, getConversationMessages, updateConversationStatus } from "@/services/api";
import type { Conversation, Message } from "@/services/api";
import { useAgent } from "@/contexts/AgentContext";
import { Loader2, MessageSquare, Phone, ChevronLeft, Flame, Check, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "closed" | "handoff";

const STATUS_LABEL: Record<string, string> = {
  all: "Todas",
  active: "Ativas",
  closed: "Encerradas",
  handoff: "Humano",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-500",
  handoff: "bg-amber-100 text-amber-700",
};

function leadBadge(score: number) {
  if (score >= 70) return { cls: "bg-red-100 text-red-600", label: `🔥 ${score}` };
  if (score >= 40) return { cls: "bg-amber-100 text-amber-600", label: `🌡 ${score}` };
  return { cls: "bg-slate-100 text-slate-500", label: `${score}` };
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
  if (d.length === 12) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
  return `+${d}`;
}

function initials(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d.slice(-2);
}

export default function Conversations() {
  const { agent } = useAgent();
  const { toast } = useToast();

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingList, setLoadingList] = useState(true);

  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showMessages, setShowMessages] = useState(false); // mobile: toggle view
  const [actionLoading, setActionLoading] = useState<string | null>(null); // loading para botões de ação

  // Carrega lista quando muda filtro ou página
  useEffect(() => {
    if (!agent?.id) return;
    setLoadingList(true);
    const params: any = { agent_id: agent.id, page, limit: 20 };
    if (filter !== "all") params.status = filter;

    getConversations(params)
      .then((r) => {
        setConversations(page === 1 ? r.conversations : (prev) => [...prev, ...r.conversations]);
        setTotal(r.total);
        setHasMore(r.has_more);
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [agent?.id, filter, page]);

  // Reset ao mudar filtro
  useEffect(() => {
    setPage(1);
    setSelected(null);
  }, [filter]);

  // Carrega mensagens ao selecionar conversa
  useEffect(() => {
    if (!selected) return;
    setLoadingMsgs(true);
    getConversationMessages(selected.id)
      .then((r) => setMessages(r.messages))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [selected?.id]);

  const handleSelect = (conv: Conversation) => {
    setSelected(conv);
    setShowMessages(true);
  };

  const handleMarkClosed = async () => {
    if (!selected) return;
    setActionLoading('close');
    try {
      await updateConversationStatus(selected.id, 'closed');
      toast({ title: "✅ Conversa encerrada", description: "A conversa foi marcada como finalizada." });

      // Atualizar conversa selecionada
      setSelected({ ...selected, status: 'closed' });

      // Recarregar lista
      setPage(1);
      setFilter("all"); // Reset para "Todas" para ver a mudança
    } catch (err: any) {
      toast({
        title: "❌ Erro ao encerrar",
        description: err.message || "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async () => {
    if (!selected) return;
    toast({
      title: "⏳ Em breve",
      description: "Função de arquivar será implementada na próxima versão.",
    });
  };

  if (!agent?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="font-medium text-foreground">Nenhum agente configurado</p>
        <p className="text-sm text-muted-foreground mt-1">Crie um agente para ver as conversas.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Conversas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {total} conversa{total !== 1 ? "s" : ""} no total
        </p>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* ── Lista de conversas ── */}
        <div
          className={cn(
            "flex flex-col w-full md:w-80 lg:w-96 shrink-0 bg-card border border-border rounded-2xl overflow-hidden",
            showMessages && "hidden md:flex"
          )}
        >
          {/* Filtros */}
          <div className="flex gap-1 p-3 border-b border-border">
            {(["all", "active", "closed", "handoff"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-md transition-colors",
                  filter === s
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {loadingList && page === 1 ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada</p>
              </div>
            ) : (
              <>
                {conversations.map((conv, i) => {
                  const badge = leadBadge(conv.lead_score ?? 0);
                  const isActive = selected?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelect(conv)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 text-left transition-colors",
                        i < conversations.length - 1 && "border-b border-border/50",
                        isActive ? "bg-primary/5" : "hover:bg-accent/50"
                      )}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
                        {initials(conv.contact_phone)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-medium text-foreground truncate">
                            {conv.contact_name || formatPhone(conv.contact_phone)}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                            {timeAgo(conv.last_message_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", STATUS_BADGE[conv.status])}>
                            {STATUS_LABEL[conv.status]}
                          </span>
                          {(conv.lead_score ?? 0) > 0 && (
                            <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", badge.cls)}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {hasMore && (
                  <div className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loadingList}
                    >
                      {loadingList ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Carregar mais
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Painel de mensagens ── */}
        <div
          className={cn(
            "flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden min-w-0",
            !showMessages && "hidden md:flex"
          )}
        >
          {!selected ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Selecione uma conversa</p>
              <p className="text-sm text-muted-foreground mt-1">
                Escolha uma conversa da lista para ver as mensagens.
              </p>
            </div>
          ) : (
            <>
              {/* Header da conversa */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <button
                  className="md:hidden p-1 rounded-lg hover:bg-accent"
                  onClick={() => setShowMessages(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                  {initials(selected.contact_phone)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {selected.contact_name || formatPhone(selected.contact_phone)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{selected.contact_phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded font-medium", STATUS_BADGE[selected.status])}>
                    {STATUS_LABEL[selected.status]}
                  </span>
                  {(selected.lead_score ?? 0) >= 70 && (
                    <Flame className="h-4 w-4 text-red-500" />
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex items-center gap-1.5">
                  {selected.status === 'active' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleMarkClosed}
                        disabled={actionLoading !== null}
                        className="text-xs gap-1"
                        title="Marcar conversa como finalizada"
                      >
                        {actionLoading === 'close' ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span className="hidden sm:inline">Encerrar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleArchive}
                        disabled={actionLoading !== null}
                        className="text-xs gap-1"
                        title="Arquivar conversa"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Arquivar</span>
                      </Button>
                    </>
                  )}
                  {selected.status === 'closed' && (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-slate-100">
                      ✓ Encerrada
                    </span>
                  )}
                  {selected.status === 'handoff' && (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-amber-100">
                      👤 Aguardando humano
                    </span>
                  )}
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                    Nenhuma mensagem nesta conversa.
                  </div>
                ) : (
                  messages.map((msg) => {
                    if (msg.role === "system") {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }
                    const isAgent = msg.role === "agent";
                    return (
                      <div
                        key={msg.id}
                        className={cn("flex gap-2", isAgent ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                            isAgent
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-slate-100 text-foreground rounded-bl-sm"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={cn("text-xs mt-1", isAgent ? "text-white/60" : "text-muted-foreground")}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
