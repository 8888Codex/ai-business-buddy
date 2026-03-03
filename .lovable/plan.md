

## A página /auth já está implementada

A página de autenticação em `src/pages/Auth.tsx` já contém **tudo** que você descreveu:

- **Layout dividido**: painel esquerdo indigo-600 com pattern, logo, headline e 3 benefits (desktop only); formulário no lado direito; mobile mostra só o formulário com logo
- **Tabs**: "Criar Conta" (default) e "Entrar"
- **Tab Criar Conta**: nome, e-mail, senha com toggle, botão "Criar Conta Grátis →", separador "ou", Google OAuth, texto de termos
- **Tab Entrar**: e-mail, senha, "Esqueci minha senha", botão "Entrar →", separador "ou", Google OAuth
- **Validação**: zod + react-hook-form com feedback em tempo real
- **Loading states**: spinners nos botões durante submit
- **Toasts de erro**: via sonner
- **Redirects**: registro → `/wizard/step-1`, login → `/dashboard`
- **Google OAuth**: via `lovable.auth.signInWithOAuth("google")`
- **Reset de senha**: rota `/reset-password` com `ResetPassword.tsx`
- **Auth guard**: `AuthenticatedLayout` redireciona para `/auth` se não autenticado
- **AuthContext**: gerencia sessão global com `onAuthStateChange`

A infraestrutura (AuthProvider, rotas, guards) já está configurada no `App.tsx`.

**Nenhuma alteração é necessária.** Navegue até `/auth` no preview para verificar.

