

## Página de Conexão WhatsApp (/connect)

### Arquivo a editar

**`src/pages/Connect.tsx`** — Reescrever completamente

### Implementação

**3 estados gerenciados via `useState`**: `"waiting"` | `"connected"` | `"error"`

**Estado 1 — Aguardando:**
- Card centralizado (`max-w-lg mx-auto`) com título, subtítulo
- Placeholder QR Code 256x256 com borda pontilhada e ícone `QrCode` do lucide
- 3 instruções numeradas
- Status pulsante: dot amarelo animado + "Aguardando conexão..."
- Countdown de 60s com `useEffect`/`setInterval`; ao chegar a 0, mostra botão "Gerar Novo QR Code" que reseta o timer

**Estado 2 — Conectado:**
- Checkmark verde com animação pulse
- Título "WhatsApp Conectado!", número placeholder
- Progress bar de 3s + redirect automático para `/dashboard` via `useEffect`

**Estado 3 — Erro:**
- Ícone X vermelho, mensagem de erro, botão "Tentar Novamente" que volta para `"waiting"`

**Debug:** Botões no rodapé (visíveis só em dev `import.meta.env.DEV`) para alternar entre os 3 estados.

### Ícones lucide usados
`QrCode`, `CheckCircle2`, `XCircle`, `Smartphone`, `ArrowRight`

