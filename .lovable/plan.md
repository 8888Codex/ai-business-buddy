Crie um web app SaaS premium chamado "Funcionário de IA" — uma plataforma que permite pequenos empresários criarem agentes de IA para WhatsApp em 15 minutos, sem programar.

O design deve transmitir: CONFIANÇA, SIMPLICIDADE e TECNOLOGIA ACESSÍVEL. Não deve parecer um template. Deve parecer um produto de uma empresa de tecnologia séria que cobra R$ 30-75 mil por implementações customizadas — e agora oferece uma versão self-service.

REFERÊNCIAS DE DESIGN (inspiração, não cópia):

- [Linear.app](http://Linear.app) (clean, sofisticado, espaçamento generoso)

- [Vercel.com](http://Vercel.com) (minimalismo tech com personalidade)

- [Notion.so](http://Notion.so) (acessível sem ser infantil)

- [Cal.com](http://Cal.com) (SaaS moderno, dashboard limpo)

STACK: React + TypeScript + Tailwind CSS + React Router + Supabase + Recharts

DESIGN SYSTEM PREMIUM:

Cores:

- Primária: #6366F1 (indigo-500) — confiança, tecnologia

- Primária hover: #4F46E5 (indigo-600)

- Primária light: #EEF2FF (indigo-50) — backgrounds sutis

- Sucesso: #10B981 (emerald-500)

- Erro: #EF4444 (red-500)

- Alerta: #F59E0B (amber-500)

- Background: #FFFFFF (white) para conteúdo principal

- Background secundário: #F8FAFC (slate-50) para áreas neutras

- Background sutil: #F1F5F9 (slate-100) para cards hover

- Texto primário: #0F172A (slate-900) — forte, legível

- Texto secundário: #475569 (slate-600)

- Texto terciário: #94A3B8 (slate-400) — labels, placeholders

- Borda: #E2E8F0 (slate-200)

- Borda hover: #CBD5E1 (slate-300)

- Gradiente hero: de indigo-600 via indigo-500 para violet-500

Tipografia:

- Font family: "Inter" do Google Fonts

- Heading 1 (h1): 48px/56px, font-weight 700, tracking-tight (-0.02em)

- Heading 2 (h2): 32px/40px, font-weight 700, tracking-tight

- Heading 3 (h3): 24px/32px, font-weight 600

- Body: 16px/24px, font-weight 400

- Body small: 14px/20px, font-weight 400

- Caption: 12px/16px, font-weight 500, uppercase, letter-spacing 0.05em — para labels

Espaçamento (ritmo vertical):

- Seções: 96px (py-24) entre seções na landing page

- Cards: 24px padding interno (p-6)

- Entre elementos: 16px (gap-4) como padrão

- Entre seções de form: 32px (gap-8)

- Margem do conteúdo: max-w-6xl mx-auto px-6

Componentes:

- Cards: bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200

- Cards destaque: bg-white border-2 border-indigo-500 rounded-2xl shadow-lg

- Botões primários: bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200

- Botões secundários: bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium px-6 py-3 rounded-xl transition-all duration-200

- Botões ghost: text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg

- Inputs: bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200

- Selects/Dropdowns: mesmo estilo dos inputs, com chevron-down customizado

- Badges: inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium

- Tooltips: bg-slate-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg

- Dividers: border-t border-slate-100 (sutis, quase invisíveis)

Microinterações:

- Hover em cards: translate-y por -2px + shadow-md (sutil elevação)

- Click em botões: scale(0.98) por 100ms

- Transição entre páginas: fade + slide (200ms ease-out)

- Loading states: skeleton com shimmer animation (não spinners genéricos)

- Toasts: slide-in da direita com auto-dismiss em 4s

Ícones:

- Lucide React (consistente, clean, peso visual correto)

- Tamanho padrão: 20px (w-5 h-5) para inline, 24px (w-6 h-6) para standalone

- Cor: currentColor (herda do texto pai)

Mobile:

- Mobile-first obrigatório

- Touch targets mínimo 44px

- Sidebar vira bottom navigation no mobile com 4 ícones: Dashboard, Conversas, Agente, Config

- Cards empilham verticalmente

- Fontes de heading reduzem 20% no mobile

ROTAS:

/ → Landing Page (pública)

/auth → Login e Registro (pública)

/wizard/step-1 até /wizard/step-6 → Wizard de criação (autenticado)

/connect → Conectar WhatsApp (autenticado)

/dashboard → Dashboard Principal (autenticado)

/conversations → Histórico de Conversas (autenticado)

/settings → Configurações (autenticado)

LAYOUT:

- Páginas públicas: sem sidebar, layout full-width com max-w-6xl

- Páginas autenticadas: sidebar fixa à esquerda (240px wide, bg-white, border-r border-slate-200) + área de conteúdo com bg-slate-50

- Sidebar items: ícone + label, active state com bg-indigo-50 text-indigo-700, hover com bg-slate-50

- Logo no topo da sidebar: "✦ Funcionário de IA" (usar caractere ✦ como ícone-logo ou um ícone de bot/zap de Lucide)

Comece criando a estrutura do projeto com todas as rotas, o layout global com sidebar premium, e páginas placeholder. Foque na qualidade visual do layout — ele define a percepção do produto inteiro.