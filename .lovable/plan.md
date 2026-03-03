

## Dashboard Principal (/dashboard)

### Arquivo a editar

**`src/pages/Dashboard.tsx`** — Reescrever completamente

### Estrutura

**Header:**
- Saudação dinâmica ("Bom dia/Boa tarde/Boa noite, [nome]!") usando `useAuth()` para obter `user.user_metadata.name` e `new Date().getHours()` para a saudação
- Badge status agente (estado local, toggle)
- Botão "Editar Prompt" → abre Dialog com textarea

**4 Cards de Métrica** (grid `grid-cols-2 lg:grid-cols-4`):
- Mensagens Hoje (47, +12%), Leads (8), Agendamentos (3), Status do Agente (toggle on/off)
- Cada card: ícone colorido, número grande, label, badge/indicador
- Dados mockados

**Gráfico "Mensagens por Dia":**
- Recharts `AreaChart` com `ResponsiveContainer`
- 7 dias mockados [12,19,15,25,32,28,47], eixo X dias da semana
- Gradiente indigo fill, tooltip

**Últimas Conversas:**
- Card com lista de 5 conversas mockadas
- Avatar com iniciais, nome, preview truncada, timestamp relativo, badge "🔥 Lead"
- Link "Ver todas →" e click → toast "Em breve"

**Ações Rápidas:**
- 4 botões: Reconectar WhatsApp (→ /connect), Editar Prompt (→ modal), Compartilhar Link (→ clipboard copy + toast), Fazer Upgrade (→ modal placeholder)

### Componentes usados
- `Card`, `CardHeader`, `CardTitle`, `CardContent` (existentes)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` (existente)
- `Button`, `Switch`, `Badge`, `Textarea` (existentes)
- `AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer` de recharts
- Ícones lucide: `MessageSquare`, `Users`, `Calendar`, `Zap`, `Pencil`, `Link`, `ArrowUpRight`, `Flame`

### Tudo em um único arquivo
O Dashboard inteiro será implementado em `src/pages/Dashboard.tsx` para simplicidade, com dados mockados inline.

