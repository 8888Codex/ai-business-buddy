# 💰 Inconsistências de Preço — Documentação

**Data:** 06/03/2026
**Status:** ❌ **3 Inconsistências Identificadas**

---

## Resumo Executivo

| Inconsistência | Landing Page | Upgrade Dialog | Impacto |
|---|---|---|---|
| **Business Price** | R$ 497 | R$ 397 | 🔴 CRÍTICO - R$ 100 de diferença |
| **Message Limits** | Especificadas (500/2k/ilimitado) | Não especificadas | 🟡 MÉDIO - Falta clareza |
| **Feature Descriptions** | Detalhadas | Genéricas | 🟡 MÉDIO - Falta consistência |

---

## 1. PREÇO DO PLANO BUSINESS — DISCREPÂNCIA DE R$ 100

### Landing Page (`src/pages/Index.tsx`, linhas 153-169)
```typescript
{
  name: "Business",
  price: "497",          // ← R$ 497
  badge: null,
  features: [
    "Tudo do PRO +",
    "10 agentes de IA",
    "Mensagens ilimitadas",
    "API access",
    "Relatórios avançados",
    "Gerente dedicado"
  ]
}
```

### Upgrade Dialog (`src/components/UpgradeDialog.tsx`, linhas 48-61)
```typescript
{
  key: "business",
  name: "Business",
  price: "R$ 397",       // ← R$ 397 (DIFERENTE!)
  period: "/mês",
  features: [
    "10 agentes de IA",
    "Múltiplos WhatsApps",
    "Tudo do Pro",
    "Suporte prioritário",
    "Integração personalizada"
  ]
}
```

### Análise
- **Landing Page:** R$ 497 (495 centavos)
- **Upgrade Dialog:** R$ 397
- **Diferença:** R$ 100 (25% de variação!)
- **Que é correto?** Precisamos verificar com o time de produto/pricing

### Impacto
- ✗ Usuário pode começar a checkout vendo R$ 397, depois surpresa com R$ 497
- ✗ Reduz confiabilidade da marca
- ✗ Possível perda de conversão

---

## 2. LIMITES DE MENSAGENS — FALTA DE CLAREZA

### Landing Page
Especifica limites claros:
- **Starter:** 500 mensagens/mês
- **Pro:** 2.000 mensagens/mês
- **Business:** Ilimitadas

### Upgrade Dialog
**NÃO menciona** limites de mensagens. Deixa genérico:
- Starter: "1 agente de IA" + 3 features genéricas
- Pro: "3 agentes de IA" + features (sem mencionar 2k mensagens)
- Business: "10 agentes de IA" + features (sem mencionar ilimitadas)

### Impacto
- Usuário na upgrade dialog não vê o diferencial de mensagens
- Pro com 2.000 vs Business ilimitadas não fica claro
- Oportunidade de upsell perdida

---

## 3. DESCRIÇÕES DE FEATURES — INCONSISTÊNCIA

### Landing Page (mais detalhado)
```
Starter:
  - 1 agente de IA
  - 500 mensagens/mês
  - Dashboard básico
  - Suporte por e-mail

Pro:
  - Tudo do Starter +
  - 3 agentes de IA
  - 2.000 mensagens/mês
  - Métricas avançadas
  - Suporte prioritário

Business:
  - Tudo do PRO +
  - 10 agentes de IA
  - Mensagens ilimitadas
  - API access
  - Relatórios avançados
  - Gerente dedicado
```

### Upgrade Dialog (mais genérico)
```
Starter:
  - 1 agente de IA
  - Atendimento via WhatsApp
  - Histórico de conversas
  - Métricas básicas

Pro:
  - 3 agentes de IA
  - Atendimento via WhatsApp
  - Histórico completo
  - Métricas avançadas
  - Identificação de leads
  - Agendamentos automáticos

Business:
  - 10 agentes de IA
  - Múltiplos WhatsApps
  - Tudo do Pro
  - Suporte prioritário
  - Integração personalizada
```

### Diferenças Observadas
1. **Dashboard básico** aparece só na landing page
2. **Identificação de leads + Agendamentos automáticos** aparecem só na upgrade dialog (Pro)
3. **Histórico de conversas** chamado diferente nas duas
4. "Tudo do Pro" vs "Tudo do PRO +" — Inconsistência de capitalização e escrita

---

## Plano de Correção

### Priority 1: Sincronizar Preço Business (CRÍTICO)

**Decisão necessária:** Qual é o preço correto?
- [ ] R$ 397 (Upgrade Dialog está certo, landing page está errada)
- [ ] R$ 497 (Landing Page está certa, upgrade dialog está errado)

**Ação:**
1. Confirmar com time de pricing/produto
2. Atualizar ambas as fontes para o mesmo preço
3. Testar a mudança no Stripe

**Arquivo(s) a alterar:**
- `src/pages/Index.tsx` linha 165: `price: "497"` → `price: "XXX"`
- `src/components/UpgradeDialog.tsx` linha 51: `price: "R$ 397"` → `price: "R$ XXX"`

---

### Priority 2: Adicionar Limites de Mensagens na Upgrade Dialog (MÉDIO)

**Ação:**
1. Adicionar descrição de message limits no UpgradeDialog
2. Deixar consistente com Landing Page

**Arquivo a alterar:**
- `src/components/UpgradeDialog.tsx` linhas 26-61

**Exemplo de correção:**
```typescript
const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    highlight: false,
    features: [
      "1 agente de IA",
      "500 mensagens/mês",        // ← ADICIONAR
      "Atendimento via WhatsApp",
      "Histórico de conversas",
      "Métricas básicas",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "R$ 197",
    period: "/mês",
    highlight: true,
    features: [
      "3 agentes de IA",
      "2.000 mensagens/mês",      // ← ADICIONAR
      "Atendimento via WhatsApp",
      "Histórico completo",
      "Métricas avançadas",
      "Identificação de leads",
      "Agendamentos automáticos",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: "R$ [CONFIRM]",        // ← DECIDIR PREÇO
    period: "/mês",
    highlight: false,
    features: [
      "10 agentes de IA",
      "Mensagens ilimitadas",     // ← ADICIONAR
      "Múltiplos WhatsApps",
      "Tudo do Pro",
      "Suporte prioritário",
      "Integração personalizada",
    ],
  },
];
```

---

### Priority 3: Consolidar Features em Uma Só Fonte (MÉDIO)

**Opção A:** Landing Page é source of truth
- Atualizar Upgrade Dialog para sempre refletir Index.tsx
- Menos código duplicado

**Opção B:** Backend é source of truth
- Criar um endpoint `/api/pricing` que retorna dados
- Landing Page + Upgrade Dialog ambos consomem de lá
- Mais escalável e DRY

**Recomendação:** Opção A por agora (rápida), depois migrar para Opção B

---

## Checklist de Teste Após Correção

- [ ] Landing Page mostra Business R$ [PREÇO CORRETO]
- [ ] Upgrade Dialog mostra Business R$ [PREÇO CORRETO] — **sem discrepância**
- [ ] Stripe checkout recebe preço correto
- [ ] Message limits são exibidos em ambas as páginas
- [ ] Features estão sincronizadas (sem diferenças)
- [ ] E2E test `conversations-filters.spec.ts` passa
- [ ] Responsividade em mobile (375px) mantém preços legíveis

---

## Próximos Passos

1. **Reunião com Product Manager:**
   - [ ] Confirmar preço correto (R$ 397 ou R$ 497?)
   - [ ] Validar feature lists
   - [ ] Decidir se quer message limits visíveis

2. **Implementação:**
   - [ ] Corrigir discrepância de preço
   - [ ] Adicionar message limits no Upgrade Dialog
   - [ ] Sincronizar descriptions

3. **Testes:**
   - [ ] Rodar E2E completa
   - [ ] Testar checkout com preço correto
   - [ ] Validar em Stripe dashboard

4. **Deploy:**
   - [ ] Criar PR com as correções
   - [ ] Code review
   - [ ] Deploy em staging
   - [ ] Validar em produção

---

**Última atualização:** 2026-03-06 19:30 UTC
**Autor:** Claude Code AI
**Status:** Aguardando confirmação de preço e features
