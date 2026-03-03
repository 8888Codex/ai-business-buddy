

## Redesign da Página de Autenticação (/auth)

### Arquivo: `src/pages/Auth.tsx` — Reescrever completamente

A lógica de autenticação (signUp, signIn, Google OAuth, forgotPassword, validação com zod + react-hook-form) já está implementada e será preservada. O foco é no upgrade visual.

### Mudanças visuais

**Painel esquerdo (desktop only, `hidden lg:flex lg:w-1/2`):**
- Gradiente: `bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600`
- Pattern dots sutil em `opacity-10`
- Logo "✦ Funcionário de IA" (texto, sem ícone Bot)
- Título: "Crie seu agente de IA em 15 minutos"
- 3 features com `CheckCircle2` em `text-indigo-200`: "Sem programação necessária", "Resultado imediato no WhatsApp", "7 dias grátis, sem cartão"
- Na parte inferior: mockup WhatsApp decorativo em `opacity-20` (2-3 mensagens estáticas, versão compacta)

**Painel direito (formulário, `max-w-sm`):**
- Tabs customizadas sem usar o componente TabsList padrão: botões com `border-b-2` ativo em indigo, inativo em slate-400
- Continuar usando `Tabs`/`TabsContent` do Radix para lógica, mas override visual no trigger

**Tab Criar Conta:**
- Título "Comece grátis" (text-2xl font-bold) + subtítulo "Crie sua conta em 30 segundos" (text-slate-500)
- Campos com `space-y-5` (20px), labels em caption style (`text-xs uppercase tracking-wider text-slate-500`)
- Placeholders atualizados: "Como podemos te chamar?", "seu@email.com", "Mínimo 6 caracteres"
- Input styling: `rounded-xl px-4 py-3.5 border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`
- Botão primário: `py-3.5 rounded-xl`
- Validação visual: bordas `border-emerald-500` quando campo válido (dirty + no error), `border-red-500` quando erro

**Tab Entrar:**
- Título "Bem-vindo de volta" + subtítulo "Entre na sua conta"
- Mesmo estilo de inputs
- "Esqueci minha senha" alinhado à direita, `text-indigo-500`

**Mobile:**
- Apenas formulário full-screen, logo "✦ Funcionário de IA" pequeno no topo

### Preservado sem alteração
- Toda a lógica de auth (handleSignUp, handleSignIn, handleGoogle, handleForgotPassword)
- Schemas zod, react-hook-form
- Redirects (signup → /wizard/step-1, signin → /dashboard)

