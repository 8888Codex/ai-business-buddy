

## Landing Page Premium — Reescrita Completa

### Arquivos a editar

**1. `src/pages/Index.tsx`** — Reescrever completamente (~600 linhas)

**2. `src/components/layouts/PublicLayout.tsx`** — Adicionar navbar fixa

### Estrutura da Página

**Navbar (em PublicLayout.tsx):**
- Fixo no topo: `fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100`
- Logo "✦ Funcionário de IA", links centrais com scroll suave (`#como-funciona`, `#pricing`, `#faq`), botão CTA
- Mobile: menu hambúrguer com Sheet (componente existente)
- Lógica: detectar rota `/` para mostrar links de seção; outras rotas públicas mostram apenas logo + CTA

**Seção 1 — Hero** (`min-h-[85vh]`, pt extra para compensar navbar fixa):
- Badge "✨ +500 empresários já usam"
- Título em 2 linhas, "15 Minutos" em `text-primary`
- Subtítulo, 2 botões (Criar Meu Agente + Ver em Ação com dialog)
- Texto "Grátis por 7 dias · Sem cartão"
- WhatsApp mockup à direita com mensagens do segmento imobiliário, rotação `rotate-2`, sombra `shadow-2xl`

**Seção 2 — Logos de Confiança** (`py-16 bg-secondary`):
- Caption uppercase tracking-widest
- 6 ícones Lucide (Building2, Sun, Car, Heart, ShoppingBag, Briefcase) em grayscale com labels

**Seção 3 — Como Funciona** (`py-24`, id="como-funciona"):
- Título + subtítulo
- 3 cards com número watermark ("01"/"02"/"03" em text-6xl text-primary/10), ícone em rounded-2xl bg-primary/10, título, descrição
- Hover: shadow-md + -translate-y-1

**Seção 4 — Demonstração Visual** (`py-24 bg-secondary`):
- Card max-w-4xl simulando wizard step 3 (personalidade do agente) com progress bar, 4 cards de tom de voz, botões Voltar/Continuar — tudo estático/visual

**Seção 5 — Benefícios** (`py-24`):
- Título centralizado
- Grid 3x2, layout limpo sem cards: ícone em circle + título bold + descrição
- Ícones: Zap, Clock, Shield, Users, Calendar, TrendingDown

**Seção 6 — Pricing** (`py-24 bg-secondary`, id="pricing"):
- Título + subtítulo
- 3 cards: Starter (badge emerald "7 dias grátis"), PRO (destaque border-2 border-primary, badge absolute "Mais Popular"), Business
- Features com checks verdes, botões adequados
- Texto rodapé

**Seção 7 — Garantia** (`py-24`):
- Card centralizado bg-emerald-50 border-emerald-200 com ShieldCheck, 3 items, texto rodapé

**Seção 8 — FAQ** (`py-24 bg-secondary`, id="faq"):
- Accordion com 6 perguntas, max-w-2xl

**Seção 9 — CTA Final** (`py-24`, gradiente indigo→violet com pattern dots):
- Título branco, subtítulo indigo-100, botão branco, texto indigo-200

**Footer** (`py-12 bg-slate-900`):
- Logo, links em 3 colunas (Produto, Legal, Contato), copyright

### Detalhes técnicos
- Scroll suave via `scroll-behavior: smooth` no CSS + anchor links `#id`
- AnimatedSection reutilizado para fade-in com IntersectionObserver
- Todas as seções com `py-24` e `max-w-6xl mx-auto px-6`
- Navbar com `useLocation` para condicionar links de seção
- Mobile hambúrguer usa Sheet existente

