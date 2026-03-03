Preciso melhorar significativamente o hero da landing page. Ele está genérico demais. Quero um resultado premium, com mais impacto visual e personalidade. Faça as seguintes mudanças:

1. BACKGROUND DO HERO:

- Remova o fundo slate-50 flat. Substitua por um gradiente suave e sofisticado: de white (canto inferior esquerdo) para indigo-50 (centro) para violet-50 (canto superior direito). Adicione um pattern sutil de grid dots em opacity-[0.03] por cima do gradiente para dar textura (use CSS background-image com radial-gradient para criar dots de 1px a cada 24px).

- Adicione um glow circular grande e difuso de indigo-400 com opacity-[0.08] e blur-[120px] posicionado atrás do mockup do WhatsApp (como um "halo" de luz). Use um div absoluto com w-[500px] h-[500px] rounded-full.

2. BADGE DE SOCIAL PROOF:

- Aumente o badge "✨ +500 empresários já usam". Ele precisa ser a primeira coisa que o olho pega.

- Mude para: bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-medium px-5 py-2 rounded-full text-sm

- Adicione um ícone de "users" (Lucide Users) antes do texto em vez do emoji ✨

- Adicione uma animação sutil de pulse no badge (animate-pulse com opacity, não escala)

3. HEADLINE:

- Aumente para text-6xl no desktop (de text-5xl). Mantenha font-bold tracking-tight.

- "Seu Funcionário" na linha 1, "de IA no WhatsApp" na linha 2, "em 15 Minutos" na linha 3 com text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 (gradiente no texto, não cor sólida).

- Adicione margin-bottom maior entre a headline e o subtítulo (mb-6 em vez de mb-4).

4. SUBTÍTULO:

- Mude de text-slate-600 para text-slate-500 com text-lg (em vez de text-xl, que compete com a headline).

- Reduza o max-width para max-w-lg para que quebre em 2 linhas equilibradas.

- Adicione font-normal (não deve ter nenhum peso extra).

5. BOTÕES:

- Aumente os botões. O CTA principal precisa de mais presença: px-8 py-4 text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200.

- Adicione um ícone ArrowRight animado no botão primário que se move 4px para a direita no hover (group hover:translate-x-1 transition-transform).

- O botão "Ver em Ação" deve ter borda mais visível: border-2 border-slate-200 em vez de border-slate-200.

- Aumente o gap entre os dois botões para gap-4.

6. MOCKUP DO WHATSAPP:

- O mockup precisa de mais "presença". Adicione shadow-2xl e uma rotação suave: rotate-2 hover:rotate-0 transition-transform duration-500.

- Adicione um brilho sutil atrás: um div com bg-gradient-to-br from-emerald-400/20 to-indigo-400/20 blur-3xl com -z-10 posicionado atrás do card.

- Arredonde mais o card do mockup: rounded-3xl.

- A barra verde do header do WhatsApp deve ser bg-gradient-to-r from-emerald-500 to-emerald-600 (gradiente suave, não cor flat).

- Adicione um sutil efeito de "flutuação": animation com translate-y alternando entre 0 e -8px a cada 3s (CSS keyframes, ease-in-out). Isso dá vida ao componente.

7. ESPAÇAMENTO GERAL:

- O hero deve ter min-h-[90vh] com items-center (centralização vertical real).

- Aumente o gap entre o lado esquerdo (texto) e o lado direito (mockup) para gap-16 ou gap-20.

- O texto "Grátis por 7 dias · Sem cartão de crédito" deve estar mais próximo dos botões (mt-4, não mt-6) e com text-sm text-slate-400.

8. NAVBAR:

- Adicione bg-white/70 backdrop-blur-xl border-b border-slate-100/50 (mais transparência, mais blur, borda mais sutil).

- O botão "Começar Grátis →" na navbar deve ter shadow-sm e ser ligeiramente menor que o CTA do hero.

- Adicione sticky top-0 z-50 se ainda não tiver.

Não mude o conteúdo do texto — apenas o visual, espaçamento, efeitos e acabamento. O objetivo é que o hero pareça de uma empresa de tecnologia premium, não um template.