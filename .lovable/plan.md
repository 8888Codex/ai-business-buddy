

## Funcionário de IA — Estrutura Inicial

### Design System
- Atualizar as variáveis CSS para usar as cores especificadas (indigo-500 como primária, slate-50 como background, etc.)
- Adicionar fonte Inter via Google Fonts

### Rotas e Páginas (placeholders)
Criar todas as páginas como placeholders com título e descrição:
- `/` — Landing Page (pública)
- `/auth` — Login/Registro (pública)
- `/wizard/step-1` a `/wizard/step-6` — Wizard steps (autenticadas)
- `/connect` — Conectar WhatsApp (autenticada)
- `/dashboard` — Dashboard (autenticada)
- `/conversations` — Histórico (autenticada, v1.1)
- `/settings` — Configurações (autenticada, v1.1)

### Layouts
1. **PublicLayout** — Layout limpo, centralizado, sem sidebar (para `/` e `/auth`)
2. **AuthenticatedLayout** — Sidebar à esquerda + área de conteúdo principal
   - Sidebar colapsável com: logo "Funcionário de IA", links (Dashboard, Conversas, Configurações), badge do plano, botão "Criar Novo Agente"
   - No mobile: bottom navigation com ícones
   - Header com trigger para abrir/fechar sidebar

### Navegação
- React Router com rotas aninhadas nos layouts
- NavLink com destaque da rota ativa na sidebar
- Bottom nav no mobile com ícones para Dashboard, Conversas e Configurações

> Nota: Autenticação com Supabase será adicionada depois. Por agora, todas as rotas "autenticadas" serão acessíveis sem login.

