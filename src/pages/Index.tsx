import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  Bot, ClipboardList, QrCode, Clock, Sun, CheckCircle, Filter, Calendar,
  Coins, Shield, ArrowRight, Play, Building2, Heart, Car, ShoppingBag, Wrench, Zap
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

function WhatsAppMockup() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-success px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-success-foreground" />
          </div>
          <div>
            <p className="text-success-foreground font-semibold text-sm">Assistente IA</p>
            <p className="text-success-foreground/70 text-xs">online</p>
          </div>
        </div>
        {/* Chat */}
        <div className="p-4 space-y-3 bg-[hsl(var(--secondary))]" style={{ minHeight: 220 }}>
          {/* Client */}
          <div className="flex justify-end">
            <div className="bg-success/20 text-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[75%] text-sm">
              Olá, vocês têm horário disponível amanhã?
            </div>
          </div>
          {/* Agent */}
          <div className="flex justify-start">
            <div className="bg-card text-foreground rounded-2xl rounded-tl-sm px-3 py-2 max-w-[75%] text-sm shadow-sm border border-border">
              Olá! 😊 Sim, temos horários às 9h, 14h e 16h. Qual prefere?
            </div>
          </div>
          {/* Client */}
          <div className="flex justify-end">
            <div className="bg-success/20 text-foreground rounded-2xl rounded-tr-sm px-3 py-2 max-w-[75%] text-sm">
              14h, por favor!
            </div>
          </div>
          {/* Agent */}
          <div className="flex justify-start">
            <div className="bg-card text-foreground rounded-2xl rounded-tl-sm px-3 py-2 max-w-[75%] text-sm shadow-sm border border-border">
              Perfeito! Agendado para amanhã às 14h. Enviarei um lembrete. ✅
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const steps = [
  { icon: ClipboardList, title: "Responda 5 perguntas", desc: "Conte sobre seu negócio, serviços e como você atende clientes." },
  { icon: Bot, title: "IA cria seu agente", desc: "O sistema gera um agente personalizado com a cara do seu negócio." },
  { icon: QrCode, title: "Conecte o WhatsApp", desc: "Escaneie o QR code e seu agente começa a atender na hora." },
];

const benefits = [
  { icon: Clock, title: "Responde em 3 segundos", desc: "Seus clientes nunca esperam." },
  { icon: Sun, title: "Trabalha 24h por dia", desc: "Feriado, madrugada, final de semana." },
  { icon: CheckCircle, title: "Nunca falta", desc: "Sem atestado, sem férias, sem atraso." },
  { icon: Filter, title: "Qualifica leads sozinho", desc: "Filtra curiosos e foca nos compradores." },
  { icon: Calendar, title: "Agenda reuniões", desc: "Marca horários automaticamente." },
  { icon: Coins, title: "Custa menos que 1h de CLT", desc: "Economia real desde o primeiro dia." },
];

const sectors = [
  { icon: Building2, label: "Imobiliário" },
  { icon: Zap, label: "Solar" },
  { icon: Heart, label: "Saúde" },
  { icon: Car, label: "Automotivo" },
  { icon: ShoppingBag, label: "Varejo" },
  { icon: Wrench, label: "Serviços" },
];

const plans = [
  {
    name: "Starter", price: "97", badge: "7 dias grátis", highlighted: false,
    features: ["1 agente de IA", "500 mensagens/mês", "Dashboard básico", "Suporte por e-mail"],
  },
  {
    name: "PRO", price: "197", badge: "Mais popular", highlighted: true,
    features: ["3 agentes de IA", "2.000 mensagens/mês", "Métricas avançadas", "Suporte prioritário"],
  },
  {
    name: "Business", price: "497", badge: null, highlighted: false,
    features: ["10 agentes de IA", "Mensagens ilimitadas", "API access", "Suporte dedicado"],
  },
];

const faqs = [
  { q: "Preciso saber programar?", a: "Não. Você só responde perguntas sobre seu negócio." },
  { q: "Funciona para qual tipo de negócio?", a: "Qualquer negócio que atende clientes pelo WhatsApp." },
  { q: "E se eu não gostar?", a: "Garantia de 7 dias. Devolvemos 100% sem perguntas." },
  { q: "Quantas mensagens o agente pode enviar?", a: "Depende do plano: 500, 2.000 ou ilimitadas." },
  { q: "Posso ter mais de um agente?", a: "Sim, nos planos PRO e Business." },
  { q: "Como funciona o suporte?", a: "Grupo exclusivo no Telegram + e-mail prioritário." },
];

export default function Index() {
  const counterSection = useScrollAnimation(0.3);
  const c1 = useCountUp(45, 2000, counterSection.isVisible);
  const c2 = useCountUp(10000, 2000, counterSection.isVisible);
  const c3 = useCountUp(2, 2000, counterSection.isVisible);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--background)) 100%)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                Crie Seu Funcionário de IA no WhatsApp em 15 Minutos
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                O mesmo sistema que empresas pagam R$ 30-75 mil. Agora em versão self-service. Sem programar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-base px-8 py-6">
                  <Link to="/auth">
                    Criar Meu Funcionário de IA <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="text-base px-8 py-6">
                      <Play className="mr-2 h-4 w-4" /> Ver Demo
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
            </div>
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Seu Agente de IA em 3 Passos</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <AnimatedSection key={i}>
                <Card className="text-center h-full border-border">
                  <CardContent className="pt-8 pb-6 px-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                      {i + 1}
                    </div>
                    <s.icon className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-foreground text-lg">{s.title}</h3>
                    <p className="text-muted-foreground text-sm">{s.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Por Que 500+ Empresários Já Usam</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <AnimatedSection key={i}>
                <Card className="h-full border-border">
                  <CardContent className="pt-6 pb-6 px-6 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{b.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{b.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Criado por Quem Faz de Verdade</h2>
            <p className="text-muted-foreground text-lg">
              A Cognita implementa IA em 45+ empresas com projetos de R$ 30-75 mil. A tecnologia por trás do Funcionário de IA é a mesma. A diferença é que agora você opera sozinho.
            </p>
          </AnimatedSection>
          <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-12">
            {sectors.map((s, i) => (
              <Badge key={i} variant="secondary" className="px-4 py-2 text-sm gap-2">
                <s.icon className="h-4 w-4" /> {s.label}
              </Badge>
            ))}
          </AnimatedSection>
          <div ref={counterSection.ref} className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            {[
              { value: c1, suffix: "+", label: "empresas atendidas" },
              { value: c2, suffix: "+", label: "mensagens processadas", prefix: "" },
              { value: c3, suffix: "M+", label: "em projetos", prefix: "R$ " },
            ].map((c, i) => (
              <div key={i} className="space-y-1">
                <p className="text-4xl md:text-5xl font-extrabold text-primary">
                  {c.prefix}{c.value.toLocaleString("pt-BR")}{c.suffix}
                </p>
                <p className="text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planos</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <AnimatedSection key={i}>
                <Card className={`h-full flex flex-col relative ${p.highlighted ? "border-primary border-2 shadow-lg scale-[1.03]" : "border-border"}`}>
                  {p.badge && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${p.highlighted ? "" : "bg-success text-success-foreground"}`}>
                      {p.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{p.name}</CardTitle>
                    <p className="text-4xl font-extrabold text-foreground mt-2">
                      R$ {p.price}<span className="text-base font-normal text-muted-foreground">/mês</span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pt-4">
                    <ul className="space-y-3 flex-1 mb-6">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={p.highlighted ? "default" : "outline"} asChild>
                      <Link to="/auth">Começar Agora</Link>
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Ou teste grátis por 7 dias — sem cartão de crédito
          </p>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatedSection>
            <Card className="border-success border-2">
              <CardContent className="p-8 text-center space-y-4">
                <Shield className="h-12 w-12 text-success mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">Garantia Tripla</h2>
                <ul className="space-y-2 text-muted-foreground text-left max-w-md mx-auto">
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" /> 7 dias de teste gratuito</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" /> Agente funcionando em 15 minutos ou devolvemos</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" /> Primeiro mês sem risco — cancele quando quiser</li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: "hsl(var(--secondary))" }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Perguntas Frequentes</h2>
          </AnimatedSection>
          <AnimatedSection>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Seu próximo cliente pode estar mandando mensagem agora. Quem vai responder?
          </h2>
          <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 py-6" asChild>
            <Link to="/auth">
              Criar Meu Funcionário de IA <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-semibold text-background">Funcionário de IA <span className="font-normal text-background/60">by Cognita</span></span>
            </div>
            <div className="flex gap-6 text-background/60 text-sm">
              <a href="#" className="hover:text-background transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-background transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-background transition-colors">Contato</a>
            </div>
          </div>
          <p className="text-center text-background/40 text-sm mt-6">© 2026 Cognita Soluções em IA</p>
        </div>
      </footer>
    </div>
  );
}
