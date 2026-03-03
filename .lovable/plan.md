

## Wizard de Criação de Agente — 6 Steps

### Arquivos a criar/editar

**1. `src/contexts/WizardContext.tsx`** — Context para estado do wizard
- State com dados de todos os 6 steps (empresa, segmento, horário, produtos, preço, diferencial, tom, nome do agente, objetivos, ação lead quente, FAQs, restrições, extras, prompt editado)
- Funções `updateStep(stepNumber, data)` e `getStepData(stepNumber)`
- Dados persistem enquanto o context está montado (navegação entre steps)

**2. `src/components/wizard/WizardLayout.tsx`** — Layout compartilhado
- Progress bar (barra horizontal colorida, step/6)
- Label "Passo X de 6 — Título"
- Container `max-w-2xl mx-auto`
- Footer com botões Voltar/Continuar (+ Pular no step 5)
- Animação fade entre steps
- Validação antes de avançar

**3. `src/pages/wizard/WizardStep1.tsx`** — Sobre Seu Negócio
- Input nome empresa, Select segmento (8 opções), 2 Selects horário (06-23h)
- Ícone decorativo Building

**4. `src/pages/wizard/WizardStep2.tsx`** — O Que Você Vende
- Textarea produtos (min 20 chars, character counter), Select faixa preço, Textarea diferencial

**5. `src/pages/wizard/WizardStep3.tsx`** — Personalidade do Agente
- Grid 2x2 de cards clicáveis (Formal/Amigável/Técnico/Persuasivo) com ícone, título, descrição, exemplo
- Card selecionado: `border-indigo-500 bg-indigo-50`
- Input nome agente pré-preenchido (derivado do nome empresa step 1)

**6. `src/pages/wizard/WizardStep4.tsx`** — Missão do Agente
- 4 cards clicáveis (multi-select até 2): Vender/Atender/Agendar/Qualificar
- Select ação lead quente (3 opções)

**7. `src/pages/wizard/WizardStep5.tsx`** — Regras Especiais
- Badge "Opcional" no topo
- 3 textareas opcionais (FAQs, restrições, extras)
- Botão "Pular →" ao lado de "Continuar →"

**8. `src/pages/wizard/WizardStep6.tsx`** — Agente Pronto
- Ícone confetti, título celebração
- Card com prompt gerado (template combinando dados de todos steps)
- Botão Editar → transforma em textarea, mostra badge "Prompt personalizado"
- Botão principal "Conectar WhatsApp →" → navega para `/connect`
- Botão secundário "Salvar e conectar depois" → navega para `/dashboard`

**9. `src/App.tsx`** — Wrap wizard routes com `WizardProvider`

### Detalhes técnicos
- Estado gerenciado via React Context (sem persistência em DB por enquanto)
- Navegação com `useNavigate` entre `/wizard/step-{1-6}`
- Validação com estado local (required fields checked antes de avançar)
- Geração do prompt no step 6: template string concatenando dados dos steps
- Transições com `animate-fade-in` (já existe no tailwind config)

