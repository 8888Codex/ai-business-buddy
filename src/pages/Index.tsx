import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  Bot, MessageSquare, QrCode, Clock, Shield, CheckCircle, Users, Calendar,
  TrendingDown, Zap, Play, Building2, Heart, Car, ShoppingBag, Briefcase, Sun,
  ShieldCheck, ArrowRight
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/* ── Animated wrapper ── */
function A({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── WhatsApp Mockup ── */
function WhatsAppMockup() {
  const msgs = [
    { from: "client", text: "Olá, vi o anúncio do apartamento de 3 quartos" },
    { from: "ai", text: "Olá! 😊 Que bom que se interessou! O apartamento tem 95m², 3 quartos com suíte, 2 vagas. Gostaria de agendar uma visita?" },
    { from: "client", text: "Sim, pode ser sábado?" },
    { from: "ai", text: "Perfeito! Agendei sua visita para sábado às 10h. Vou enviar a localização. Posso ajudar com mais alguma dúvida? ✅" },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto animate-float hover:[animation-play-state:paused]">
      {/* Glow behind mockup */}
      <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 blur-3xl rounded-full -z-10" />
      <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-success-foreground" />
          </div>
          <div>
            <p className="text-success-foreground font-semibold text-sm">Funcionário de IA ✦</p>
            <p className="text-success-foreground/70 text-xs">online</p>
          </div>
        </div>
        <div className="p-4 space-y-3 bg-secondary" style={{ minHeight: 260 }}>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-2xl px-3 py-2 max-w-[78%] text-sm ${
                m.from === "client"
                  ? "bg-success/20 text-foreground rounded-tr-sm"
                  : "bg-card text-foreground rounded-tl-sm shadow-sm border border-border"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Wizard Demo Mockup ── */
function WizardDemoMockup() {
  const tones = [
    { label: "Profissional", desc: "Formal e objetivo", active: false },
    { label: "Amigável", desc: "Próximo e acolhedor", active: true },
    { label: "Técnico", desc: "Preciso e detalhado", active: false },
    { label: "Vendedor", desc: "Persuasivo e dinâmico", active: false },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm">Criar Agente</span>
          </div>
          <span className="text-xs text-muted-foreground">Passo 3 de 6</span>
        </div>
        {/* Progress */}
        <div className="h-1 bg-secondary">
          <div className="h-full bg-primary rounded-r-full" style={{ width: "50%" }} />
        </div>
        {/* Content */}
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Personalidade do Agente</h3>
            <p className="text-sm text-muted-foreground mt-1">Escolha o tom de voz que mais combina com seu negócio.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {tones.map((t, i) => (
              <div
                key={i}
                className={`rounded-xl border-2 p-4 cursor-default transition-all ${
                  t.active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <p className="font-medium text-foreground text-sm">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-8 py-4 border-t border-border flex justify-between">
          <Button variant="outline" size="sm" className="rounded-xl">Voltar</Button>
          <Button size="sm" className="rounded-xl">Continuar →</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Data ── */
const steps = [
  { num: "01", icon: MessageSquare, title: "Conte sobre seu negócio", desc: "Responda 5 perguntas simples sobre seus serviços, público e forma de atendimento." },
  { num: "02", icon: Bot, title: "O sistema cria seu agente", desc: "A IA gera um agente personalizado com a cara e o tom do seu negócio." },
  { num: "03", icon: QrCode, title: "Conecte seu WhatsApp", desc: "Escaneie o QR code e seu agente começa a atender na hora." },
];

const sectors = [
  { icon: Building2, label: "Imobiliário" },
  { icon: Sun, label: "Solar" },
  { icon: Car, label: "Automotivo" },
  { icon: Heart, label: "Saúde" },
  { icon: ShoppingBag, label: "Varejo" },
  { icon: Briefcase, label: "Serviços" },
];

const benefits = [
  { icon: Zap, title: "Resposta em 3 Segundos", desc: "Seus clientes nunca ficam esperando. A IA responde instantaneamente." },
  { icon: Clock, title: "24 Horas por Dia", desc: "Feriado, madrugada, final de semana. Sempre disponível." },
  { icon: Shield, title: "Nunca Falta", desc: "Sem atestado, sem férias, sem atraso. Atendimento consistente." },
  { icon: Users, title: "Qualifica Leads", desc: "Filtra curiosos e foca nos clientes que realmente querem comprar." },
  { icon: Calendar, title: "Agenda Reuniões", desc: "Marca horários automaticamente conforme sua disponibilidade." },
  { icon: TrendingDown, title: "Custo 50x Menor que CLT", desc: "Economia real desde o primeiro dia de uso." },
];

const plans = [
  {
    name: "Starter", price: "97", badge: "7 dias grátis", badgeClass: "bg-success/10 text-success border-0",
    highlighted: false, btnVariant: "outline" as const, btnText: "Começar Grátis",
    features: ["1 agente de IA", "500 mensagens/mês", "Dashboard básico", "Suporte por e-mail"],
  },
  {
    name: "PRO", price: "197", badge: "Mais Popular", badgeClass: "bg-primary text-primary-foreground border-0",
    highlighted: true, btnVariant: "default" as const, btnText: "Começar Agora →",
    features: ["Tudo do Starter +", "3 agentes de IA", "2.000 mensagens/mês", "Métricas avançadas", "Suporte prioritário"],
  },
  {
    name: "Business", price: "497", badge: null, badgeClass: "",
    highlighted: false, btnVariant: "outline" as const, btnText: "Falar com Consultor",
    features: ["Tudo do PRO +", "10 agentes de IA", "Mensagens ilimitadas", "API access", "Relatórios avançados", "Gerente dedicado"],
  },
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. Você só responde perguntas simples sobre seu negócio. A IA faz todo o resto." },
  { q: "Funciona para qual tipo de negócio?", a: "Qualquer negócio que atende clientes pelo WhatsApp: imobiliárias, clínicas, lojas, prestadores de serviço e mais." },
  { q: "E se eu não gostar?", a: "Garantia de 7 dias. Devolvemos 100% do valor sem perguntas." },
  { q: "Quantas mensagens posso enviar?", a: "Depende do plano: 500, 2.000 ou ilimitadas. Você pode fazer upgrade a qualquer momento." },
  { q: "Posso ter mais de um agente?", a: "Sim! Nos planos PRO (até 3) e Business (até 10) você pode criar múltiplos agentes." },
  { q: "Como funciona o suporte?", a: "Oferecemos suporte por e-mail para o plano Starter e suporte prioritário para PRO e Business." },
];

/* ── Page ── */
export default function Index() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">

      {/* ═══ HERO ═══ */}
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-indigo-50/60 to-violet-50/60" />
        {/* Grid dots pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        {/* Indigo glow behind mockup */}
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-400/[0.08] blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-medium px-5 py-2 rounded-full text-sm animate-pulse">
                <Users className="h-4 w-4" />
                +500 empresários já usam
              </div>

              <h1 className="text-4xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Seu Funcionário de IA
                <br className="hidden lg:block" />
                {" "}no WhatsApp{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">em 15 Minutos</span>
              </h1>

              <p className="text-lg text-muted-foreground font-normal max-w-lg mx-auto lg:mx-0">
                Crie um agente que vende, atende e agenda pelo seu negócio. 24 horas por dia. Sem programar, sem complicação.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="group rounded-xl px-8 py-4 text-base font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  <Link to="/auth">
                    Criar Meu Agente
                    <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="rounded-xl px-8 py-4 text-base border-2 border-border">
                      <Play className="mr-2 h-4 w-4" /> Ver em Ação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Demo — Funcionário de IA</DialogTitle>
                      <DialogDescription>Veja como funciona em menos de 2 minutos.</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Play className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-muted-foreground/50 mt-4">Grátis por 7 dias · Sem cartão de crédito</p>
            </div>
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOGOS DE CONFIANÇA ═══ */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-[0.15em] text-muted-foreground/60 mb-10 font-medium">
            Tecnologia usada por empresas de todos os segmentos
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {sectors.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
                <s.icon className="h-7 w-7 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMO FUNCIONA ═══ */}
      <section id="como-funciona" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <A className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Três Passos. Quinze Minutos.</h2>
            <p className="text-lg text-muted-foreground">Sem código. Sem técnico. Sem complicação.</p>
          </A>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <A key={i}>
                <Card className="h-full border-border hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <CardContent className="p-8 space-y-4 relative">
                    <span className="text-6xl font-bold text-primary/10 absolute top-4 right-6 select-none">{s.num}</span>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEMONSTRAÇÃO VISUAL ═══ */}
      <section className="py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <A className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Veja Como Funciona</h2>
          </A>
          <A>
            <WizardDemoMockup />
          </A>
          <A className="text-center mt-8">
            <p className="text-muted-foreground">Simples assim. Responda as perguntas, nós fazemos o resto.</p>
          </A>
        </div>
      </section>

      {/* ═══ BENEFÍCIOS ═══ */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <A className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Tudo Que Seu Negócio Precisa</h2>
          </A>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <A key={i} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </A>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <A className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Planos Simples, Sem Surpresa</h2>
            <p className="text-lg text-muted-foreground">Comece grátis. Escale quando precisar.</p>
          </A>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <A key={i}>
                <Card className={`h-full flex flex-col relative ${p.highlighted ? "border-2 border-primary shadow-lg" : "border-border"}`}>
                  {p.badge && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${p.badgeClass} px-4 py-1 text-sm`}>
                      {p.badge}
                    </Badge>
                  )}
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <p className={`text-lg font-semibold ${p.highlighted ? "text-primary" : "text-foreground"}`}>{p.name}</p>
                    <p className="text-4xl font-bold text-foreground mt-2">
                      R$ {p.price}<span className="text-base font-normal text-muted-foreground">/mês</span>
                    </p>
                    <ul className="space-y-3 mt-6 flex-1">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-8 rounded-xl" variant={p.btnVariant} asChild>
                      <Link to="/auth">{p.btnText}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </A>
            ))}
          </div>
          <p className="text-center text-muted-foreground/60 mt-10 text-sm">
            Todos os planos incluem 7 dias grátis. Sem cartão de crédito.
          </p>
        </div>
      </section>

      {/* ═══ GARANTIA ═══ */}
      <section className="py-24 bg-background">
        <div className="max-w-2xl mx-auto px-6">
          <A>
            <div className="bg-success/5 border border-success/20 rounded-2xl p-10 text-center space-y-5">
              <ShieldCheck className="h-12 w-12 text-success mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Garantia Tripla</h2>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                {[
                  "7 dias para testar sem compromisso",
                  "Agente funcionando em 15 min ou devolvemos",
                  "Primeiro mês sem risco — ou não paga"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">Sem burocracia. Um e-mail e pronto.</p>
            </div>
          </A>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-24 bg-secondary">
        <div className="max-w-2xl mx-auto px-6">
          <A className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Perguntas Frequentes</h2>
          </A>
          <A>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-foreground font-medium py-5 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </A>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-24 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary-foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Seu Próximo Cliente Pode Estar Mandando Mensagem Agora.
          </h2>
          <p className="text-xl text-primary-foreground/70">
            Quem vai responder — você ou seu Funcionário de IA?
          </p>
          <Button
            size="lg"
            asChild
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
          >
            <Link to="/auth">Criar Meu Funcionário de IA <ArrowRight className="ml-1 h-5 w-5" /></Link>
          </Button>
          <p className="text-sm text-primary-foreground/50">
            Grátis por 7 dias · Sem cartão · Setup em 15 minutos
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 bg-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-background">Funcionário de IA</span>
              </div>
              <p className="text-sm text-background/40">by Cognita Soluções em IA</p>
            </div>
            {/* Produto */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-background/40 font-medium">Produto</p>
              <nav className="flex flex-col gap-2">
                <a href="#como-funciona" className="text-sm text-background/60 hover:text-background transition-colors">Como Funciona</a>
                <a href="#pricing" className="text-sm text-background/60 hover:text-background transition-colors">Preços</a>
                <a href="#faq" className="text-sm text-background/60 hover:text-background transition-colors">FAQ</a>
              </nav>
            </div>
            {/* Legal */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-background/40 font-medium">Legal</p>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Termos de Uso</a>
                <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">Privacidade</a>
              </nav>
            </div>
            {/* Contato */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-background/40 font-medium">Contato</p>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">E-mail</a>
                <a href="#" className="text-sm text-background/60 hover:text-background transition-colors">WhatsApp</a>
              </nav>
            </div>
          </div>
          <div className="border-t border-background/10 mt-10 pt-6">
            <p className="text-center text-background/30 text-sm">© 2026 Cognita Soluções em IA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
