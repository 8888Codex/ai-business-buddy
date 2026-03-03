

## Correções Urgentes

### 1. Navbar Duplicada
O `PublicLayout.tsx` renderiza uma navbar fixa (linha 30-90) e o `Index.tsx` renderiza outra `<Navbar />` (linha 207). A navbar do `PublicLayout` é a correta (tem mobile hamburger, smooth scroll, etc).

**Fix:** Remover o componente `Navbar` e sua invocação `<Navbar />` do `src/pages/Index.tsx` (linhas 72-92 e linha 207).

### 2. Headline em 2 Linhas
Atualmente a headline quebra em 3 linhas com `<br>` forçados. Ajustar para 2 linhas no desktop:
- Linha 1: "Seu Funcionário de IA"
- Linha 2: "no WhatsApp em 15 Minutos" (com "em 15 Minutos" em gradiente)
- Reduzir para `lg:text-5xl` para caber em 2 linhas
- Usar um único `<br>` visível apenas em `lg:`

**Arquivo:** `src/pages/Index.tsx` — remover componente Navbar, remover `<Navbar />`, ajustar headline.

