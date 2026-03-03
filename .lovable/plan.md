

## Wizard Premium — Redesign Completo (7 Arquivos)

### Arquivos a reescrever

1. **`src/components/wizard/WizardLayout.tsx`**
2. **`src/pages/wizard/WizardStep1.tsx`**
3. **`src/pages/wizard/WizardStep2.tsx`**
4. **`src/pages/wizard/WizardStep3.tsx`**
5. **`src/pages/wizard/WizardStep4.tsx`**
6. **`src/pages/wizard/WizardStep5.tsx`**
7. **`src/pages/wizard/WizardStep6.tsx`**

All existing logic (WizardContext, validation, navigation, prompt generation) is preserved. Only visual and UX changes.

---

### WizardLayout.tsx — Complete rewrite

**Progress indicator** replaces the generic `<Progress>` bar:
- 6 circles connected by horizontal lines using flex layout
- Completed step: `w-8 h-8 bg-indigo-500 rounded-full` with white `Check` icon, connecting line `bg-indigo-500`
- Current step: same circle + `ring-4 ring-indigo-100` glow effect, white number
- Upcoming: `bg-slate-200` circle with `text-slate-400` number, line `bg-slate-200`
- Below circles: "Passo X de 6 — Label" centered

**Card wrapper**: `bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10` on `bg-slate-50` background

**Inside card**: title (`text-xl font-semibold text-slate-900`) + subtitle (`text-slate-500 text-sm`) + children + footer

**Footer**: "← Voltar" ghost left, "Continuar →" primary right (with optional "Pular →" ghost). Hidden on step 6.

New props: `subtitle?: string`, `optionalBadge?: boolean`

---

### Step 1 — "Sobre Seu Negócio"

- Subtitle: "Vamos conhecer sua empresa em 30 segundos"
- All labels: caption style `text-xs uppercase tracking-wider text-slate-500 font-medium`
- Company name input: `Building2` icon inside (absolute positioned left, input with `pl-10`)
- Segment: emoji prefix in each `SelectItem`: 🏠 Imobiliário, ☀️ Energia Solar, 🚗 Automotivo, 🏥 Saúde/Clínicas, 🛍️ Varejo, 💼 Serviços, 💻 Tecnologia, ✏️ Outro
- Hours: compact layout with "Das" and "às" text between two smaller selects
- All inputs: `rounded-xl` styling

---

### Step 2 — "O Que Você Oferece"

- Subtitle: "Isso ajuda seu agente a falar com propriedade sobre seu negócio"
- Products textarea: `min-h-[120px]`, character counter `{length}/500` bottom-right in `text-xs text-slate-400`
- Price range dropdown with updated labels
- Differentiator: inline "Opcional" badge next to label, `min-h-[60px]`
- Caption labels throughout

---

### Step 3 — "Personalidade do Agente"

- Subtitle: "Escolha como seu agente se comunica"
- 2x2 card grid: `p-5 rounded-xl border-2 cursor-pointer transition-all`
  - Normal: `border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50`
  - Selected: `border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20`
  - Icon color changes to `text-indigo-600` when selected
- Each card: icon + title (font-semibold), italic example quote, description in `text-xs text-slate-400`
- Agent name: caption label "COMO SEU AGENTE SE CHAMA?", helper text below in `text-xs text-slate-400`

---

### Step 4 — "Missão do Agente"

- Subtitle: "O que seu agente deve fazer quando um cliente manda mensagem?"
- 2x2 objective cards with visual checkbox (circle top-right: empty → indigo check when selected)
- Icons: ShoppingCart, Headphones, CalendarCheck, Filter (from lucide-react)
- Hot lead action: 3 styled radio buttons (not dropdown) with emoji prefixes (📱📧📊)
  - Each radio: horizontal card style with dot indicator left, text right
  - Selected: `border-indigo-500 bg-indigo-50`
- Caption label: "QUANDO IDENTIFICAR UM LEAD QUENTE:"

---

### Step 5 — "Regras Especiais"

- `optionalBadge={true}` on WizardLayout
- Subtitle: "Personalize ainda mais. Ou pule e adicione depois."
- 3 collapsible sections using Radix `Collapsible` (already available):
  - 📋 Perguntas Frequentes → textarea
  - 🚫 Restrições → textarea
  - ℹ️ Informações Extras → textarea
- Each section: `border-b border-slate-100`, click header to expand with `CollapsibleContent`
- Chevron rotates on expand
- `showSkip={true}` in layout

---

### Step 6 — "Seu Agente Está Pronto!"

- Does NOT use WizardLayout (has its own layout with same bg-slate-50 + progress indicator)
- Celebration: `Sparkles` icon `w-16 h-16 text-indigo-500 animate-pulse` centered
- Title: "Seu Funcionário de IA está pronto!" `text-2xl font-bold text-center`
- Subtitle: "Revise o prompt e conecte seu WhatsApp" `text-slate-500 text-center`
- Prompt preview card: `bg-slate-50 rounded-xl p-6 border border-slate-200`
  - Edit button (Pencil icon) top-right → transforms to editable textarea with indigo border + Save button
  - "✏️ Personalizado" badge when edited
- Primary CTA: `bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl shadow-md` with MessageCircle icon → navigates to /connect
- Secondary: "Salvar e conectar depois" ghost → navigates to /dashboard
- Back button at bottom

---

### No changes needed
- `WizardContext.tsx` — unchanged
- `App.tsx` routing — unchanged
- All existing validation logic preserved in each step

