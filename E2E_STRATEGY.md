# 🚀 Estratégia E2E Completa — Funcionario IA

## 📊 Status Atual (06/03/2026)

### Problemas Identificados
1. **🔴 CRÍTICO:** Rate limiting (429) bloqueia testes de autenticação
   - Limite: 100 requisições / 15 minutos
   - Solução: Aumentar limite ou usar mock
   
2. **🟡 IMPORTANTE:** Seletor strict mode no wizard
   - Status: ✅ Corrigido
   - Arquivo: `e2e/pages/wizard-page.ts`

3. **🟢 ÓTIMO:** Cobertura atual é boa (23/25 passando)

---

## 🎯 Plano de Ação — 4 Fases

### ✅ Fase 1: Diagnóstico (CONCLUÍDO)
- [x] Identificar problemas
- [x] Rate limiting encontrado
- [x] Criar testes isolados

### 🔧 Fase 2: Corrigir Rate Limiting (PRÓXIMO)

#### Opção A: Aumentar limite no backend
```javascript
// backend/src/middleware/rateLimit.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // Aumentar de 100 para 1000
  skip: (req) => {
    // Skip para IPs internos/localhost
    return req.ip === '127.0.0.1' || req.ip === '::1';
  }
});
```

#### Opção B: Mock da autenticação para testes
```typescript
// e2e/fixtures.ts
export const authenticatedContext = async ({ browser }) => {
  const context = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [{
        origin: "https://funcionario.cognitaai.com.br",
        localStorage: [{
          name: "access_token",
          value: "mock-token-for-tests"
        }]
      }]
    }
  });
  return context;
};
```

#### Opção C: Usar endpoint diferente para testes
```typescript
// Criar endpoint /api/auth/signin-test que não tem rate limit
app.post('/api/auth/signin-test', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    // Retorna token fixo
    res.json({ token: 'test-token', user: { ... } });
  }
});
```

### 📝 Fase 3: Adicionar Cobertura (EM PROGRESSO)

#### Testes já criados:
- ✅ `auth-isolated.spec.ts` — 6 cenários de autenticação
- ✅ `coverage-extended.spec.ts` — 11 cenários adicionais

#### Testes a adicionar:
- [ ] Testes de erro (credenciais inválidas, usuário não existe)
- [ ] Testes de WhatsApp integration
- [ ] Testes de performance
- [ ] Testes de segurança (XSS, CSRF)
- [ ] Testes de rate limit behavior

### 🔄 Fase 4: Validação Final (PRÓXIMO)
- [ ] Rodar suite completa
- [ ] Validar 100% de sucesso
- [ ] Gerar relatório final
- [ ] Integrar em CI/CD

---

## 📋 Checklist de Testes

### Autenticação
- [ ] Login com email válido
- [ ] Login com email inválido
- [ ] Login com senha errada
- [ ] Usuário não existe
- [ ] Rate limit é respeitado
- [ ] Token é salvo em localStorage
- [ ] Token expirado faz logout

### Wizard
- [x] Step 1: Dados da empresa
- [x] Step 2: Produtos e preço
- [x] Step 3: Personalidade
- [x] Step 4: Missão
- [x] Step 5: Regras (skip)
- [x] Step 6: Conectar WhatsApp
- [x] Voltar entre steps (funciona)
- [ ] Editar prompt em Step 6
- [ ] Validação em tempo real
- [ ] Persistência de dados

### Dashboard
- [ ] Carrega dados do usuário
- [ ] Lista agents criados
- [ ] Permite criar novo agent
- [ ] Permite editar agent
- [ ] Permite deletar agent
- [ ] Estatísticas são exibidas

### WhatsApp
- [ ] QR code é gerado
- [ ] Scaneamento funciona
- [ ] Mensagens são recebidas
- [ ] Respostas são enviadas
- [ ] Desconectar funciona

### Geral
- [ ] Responsividade mobile
- [ ] Responsividade tablet
- [ ] Performance (< 3s load time)
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] Links funcionam
- [ ] Formulários validam

---

## 🛠️ Como Rodar os Testes

### Testes Isolados (sem rate limit)
```bash
cd ~/Downloads/Projetos/ai-business-buddy
npx playwright test e2e/auth-isolated.spec.ts --reporter=list
```

### Testes de Cobertura
```bash
npx playwright test e2e/coverage-extended.spec.ts --reporter=list
```

### Todos os testes (quando rate limit normalizou)
```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Com debug
```bash
npx playwright test --debug
```

---

## 📈 Métricas de Sucesso

| Métrica | Target | Status |
|---------|--------|--------|
| Taxa de sucesso | 100% | 92% ❌ |
| Cobertura | >80% | ~70% |
| Tempo médio | <3s | ✅ |
| Acessibilidade | WCAG 2.1 AA | ⏳ |
| Performance | Lighthouse 90+ | ⏳ |

---

## 📞 Próximos Passos

1. **Imediato (hoje):**
   - Aguardar 15 min para rate limit normalizar
   - Implementar Opção B (mock authentication)
   - Rodar testes isolados

2. **Curto prazo (hoje/amanhã):**
   - Aumentar rate limit no backend (Opção A)
   - Adicionar testes de erro
   - Validar 100% de testes passando

3. **Médio prazo (semana):**
   - Adicionar testes de WhatsApp
   - Integrar em CI/CD (GitHub Actions)
   - Gerar relatório de cobertura

4. **Longo prazo (mês):**
   - Validar WCAG 2.1 AA
   - Performance testing
   - Load testing

---

## 📁 Arquivos Gerados

```
e2e/
├── auth-isolated.spec.ts      ✨ NOVO — 6 testes
├── coverage-extended.spec.ts  ✨ NOVO — 11 testes
├── auth.setup.ts              ⚠️ Rate limited
├── auth.spec.ts               ✅ 3 testes passando
├── wizard.spec.ts             🔴 1 falho (seletor — CORRIGIDO)
├── dashboard.spec.ts          ✅ 1 teste passando
├── landing.spec.ts            ✅ 3 testes passando
├── conversations.spec.ts      ✅ 1 teste passando
├── agents.spec.ts             ✅ 1 teste passando
└── pages/
    ├── wizard-page.ts         🔧 CORRIGIDO — seletor específico
    ├── landing-page.ts
    ├── connect-page.ts
    └── dashboard-page.ts

test-results/
├── auth.setup.ts-*            📸 Screenshots/Traces
└── playwright-report/         📊 Relatório HTML
```

---

## 🔑 Comandos Rápidos

```bash
# Rodar apenas auth isolado
npm run test:auth-isolated

# Ver relatório HTML
npx playwright show-report

# Ver trace de falha
npx playwright show-trace test-results/[trace-name]/trace.zip

# Rodar teste específico
npx playwright test auth-isolated.spec.ts -g "Página de login"

# Rodar com browser visível
npx playwright test --headed

# Debug mode
npx playwright test --debug
```

---

**Última atualização:** 06/03/2026 15:40 UTC
**Próxima revisão:** Após normalização de rate limit (~15:55)
