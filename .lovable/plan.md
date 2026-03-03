

## Página de Autenticação (/auth) — Plano

### Pré-requisito: Conectar Supabase

O projeto ainda não tem Supabase conectado. Antes de implementar, precisamos:
1. Conectar Supabase ao projeto (via conector Lovable)
2. Isso criará o client em `src/integrations/supabase/client.ts`

### Arquivos a criar/editar

**1. `src/integrations/supabase/client.ts`** — Client Supabase (gerado pela conexão)

**2. `src/contexts/AuthContext.tsx`** — Context de autenticação
- `AuthProvider` com `onAuthStateChange` listener (antes de `getSession`)
- Expõe `user`, `session`, `loading`, `signOut`
- Wrap no App.tsx

**3. `src/pages/Auth.tsx`** — Reescrever completamente
- Layout dividido: esquerda (desktop only) com bg-indigo-600, pattern CSS sutil, logo branca, headline, 3 mini-benefits com ícones (Code, Zap, Shield)
- Direita: formulário com Tabs "Criar Conta" / "Entrar"
- Tab Criar Conta: nome, email, senha (com toggle show/hide), botão "Criar Conta Grátis →", separador "ou", botão Google OAuth, texto termos
- Tab Entrar: email, senha, link "Esqueci minha senha", botão "Entrar →", separador "ou", botão Google
- Validação com zod + react-hook-form
- Loading state nos botões
- Toast de erro via sonner
- Redirect: registro → `/wizard/step-1`, login → `/dashboard` (simplificado, sem check de agente por agora)

**4. `src/pages/ResetPassword.tsx`** — Página de reset de senha
- Formulário para nova senha
- Checa `type=recovery` no URL hash
- Chama `supabase.auth.updateUser({ password })`

**5. `src/App.tsx`** — Adicionar AuthProvider, rota `/reset-password`, proteger rotas autenticadas

**6. `src/components/layouts/AuthenticatedLayout.tsx`** — Adicionar guard: se não autenticado, redirect para `/auth`

### Comportamento
- Google OAuth via `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Sign up com `emailRedirectTo: window.location.origin`
- Senha com toggle visibility (Eye/EyeOff icons)
- Validação em tempo real (zod: email válido, senha min 6 chars, nome obrigatório)
- Mobile: só formulário com logo no topo, sem painel esquerdo

