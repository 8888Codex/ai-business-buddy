

## Landing Page Completa — Plano de Implementação

### Estrutura de Arquivos

Reescrever `src/pages/Index.tsx` com todas as 8 seções + footer. Criar um hook `useScrollAnimation` para fade-in ao scroll via Intersection Observer. Criar um componente `WhatsAppMockup` para o mockup de chat no hero.

### Seções

1. **Hero** — Gradiente indigo-50→white, headline + sub-headline, 2 botões (CTA → /auth, "Ver Demo" → Dialog com placeholder de vídeo), componente WhatsAppMockup ao lado direito (desktop) / abaixo (mobile)

2. **Como Funciona** — 3 cards com numeração circular indigo, ícones (ClipboardList, Bot, QrCode), títulos e descrições

3. **Benefícios** — Grid 2x3 (1 col mobile) com ícones (Clock, Sun, CheckCircle, Filter, Calendar, Coins) + título + descrição

4. **Prova Social** — Texto sobre Cognita, badges de setores, counters animados (useEffect com incremento) para 45+, 10.000+, R$ 2M+

5. **Pricing** — 3 cards (Starter R$97, PRO R$197 destacado, Business R$497), badges "7 dias grátis" e "Mais popular", botões CTA

6. **Garantia** — Card com borda verde (border-success), ícone Shield, 3 itens da garantia tripla

7. **FAQ** — Accordion com 6 perguntas/respostas usando componente Accordion existente

8. **CTA Final** — Background bg-primary, texto branco, botão branco → /auth

9. **Footer** — Logo, links placeholder (Termos, Privacidade, Contato), copyright Cognita 2026

### Animações

- Hook `useScrollAnimation`: usa IntersectionObserver para adicionar classe de fade-in quando elemento entra no viewport
- Adicionar keyframes `fade-in` e `count-up` no tailwind.config.ts
- Counters animados com useEffect + requestAnimationFrame

### Componentes Auxiliares

- `WhatsAppMockup` — inline no Index.tsx, simula tela de chat com bolhas de mensagem estilizadas (verde para agente, branco para cliente)
- Dialog do shadcn para modal de vídeo demo

### Responsividade

- Hero: flex-col mobile, flex-row desktop
- Cards: grid 1 col → 3 cols
- Benefícios: grid 1 col → 2 cols → 3 cols
- Pricing: grid 1 col → 3 cols

