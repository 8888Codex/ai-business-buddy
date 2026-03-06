# ✅ Fase 1 — Validação do Backend

**Data:** 06/03/2026
**Status:** 🟢 Validação Completa

---

## Achados do Backend

### 1. Schema do Banco de Dados ✅
**Arquivo:** `/opt/funcionario-backend/sql/schema.sql`

Tabela `conversations`:
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  agent_id UUID NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active'
    CHECK (status IN ('active','closed','handoff')),
  lead_score INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ
);
```

**Status válidos:** `'active'`, `'closed'`, `'handoff'`

---

### 2. Lógica de Status Atual 📊

#### **Status: HANDOFF** — ✅ Implementado e Automático
**Arquivo:** `/opt/funcionario-backend/src/routes/webhooks.js` (linhas 230-241)

```javascript
// Detecta lead quente por palavras-chave
const isHotLead = hotWords.some(word =>
  aiMessage.toLowerCase().includes(word) ||
  body.toLowerCase().includes(word)
);

// hot words: 'agendamento', 'agendar', 'reunião', 'proposta',
//            'orçamento', 'contratar', 'comprar', etc.

if (isHotLead) {
  lead_score += 10;

  // Quando score >= 50 → automático HANDOFF
  if (lead_score >= 50) {
    UPDATE conversations SET status = 'handoff' WHERE id = ?
  }
}
```

**Como funciona:**
- ✅ Cada resposta da IA com palavras-chave → +10 points
- ✅ Lead score >= 50 → status = 'handoff'
- ✅ Conversa aparece em "Humano" (passada para atendimento humano)

---

#### **Status: CLOSED** — ❌ NÃO Implementado
**Problema:** Não existe lógica para marcar conversa como `closed`

O status existe no banco de dados, mas:
- Nenhum webhook atualiza para `closed`
- Nenhum evento automático marca como `closed`
- Nenhum endpoint manual permite marcar como `closed`

---

### 3. Fluxo Esperado vs Atual

| Cenário | Status Esperado | Status Atual | Gap |
|---------|---|---|---|
| Conversa normal iniciada | `active` ✅ | `active` ✅ | Nenhum |
| Lead quente detectado | `handoff` ✅ | `handoff` ✅ | Nenhum |
| Agendamento feito | `closed` ❌ | `active` ❌ | **Falta implementar** |
| User quer arquivar | `archived` ❌ | `active` ❌ | **Falta implementar** |

---

## Conclusões

✅ **O que está certo:**
- Schema permite 3 status (active, closed, handoff)
- Handoff automático funciona (lead_score >= 50)
- Filtro por status no GET /conversations está implementado

❌ **O que falta:**
1. Lógica para marcar como `closed` quando há agendamento
2. Endpoint para marcar conversa como `closed` manualmente
3. Webhook ou integration com sistema de agendamentos
4. Status `archived` para limpeza de lista (opcional)

---

## Próximas Ações

### Para Fase 2 (Frontend):
- Exibir abas de filtro (já existem no código)
- Botão "Marcar como Encerrada" (vai chamar novo endpoint)
- Botão "Arquivar" (bônus, se houver tempo)

### Para Fase 2 (Backend):
- [ ] Criar endpoint `PATCH /conversations/:id` para atualizar status
- [ ] Adicionar validação de status (active → closed, handoff)
- [ ] Considerar webhook de agendamentos (quando integrar com calendário)

---

**Recomendação:** Implementar endpoint simples de UPDATE primeiro (manual), depois adicionar automação quando houver integração de agendamentos.
