

## Redesign Premium da Página /connect

### Arquivo: `src/pages/Connect.tsx` — Reescrita completa

Manter toda a lógica existente (3 estados, countdown, auto-redirect) e aplicar o design premium:

**Estado "Aguardando":**
- Card: `bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md mx-auto`
- Smartphone icon `text-indigo-500 w-10 h-10` no topo
- QR area: 250x250px `border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50` com QrCode placeholder `text-slate-300`
- Timer circular SVG: circle stroke-dasharray animado em 60s, cor indigo-500, texto "Expira em 0:XX"
- Quando timer=0: QR desaparece, botão "Gerar Novo Código" primário
- 3 instruções verticais com number circles `bg-slate-100 w-6 h-6 text-slate-500`
- Status: dot `w-2 h-2 bg-amber-400 animate-pulse` + "Aguardando conexão..."

**Estado "Conectado":**
- Card transition: `border-emerald-500 bg-emerald-50`
- CheckCircle2 `text-emerald-500 w-16 h-16` com `animate-scale-in`
- Título `text-emerald-700`, subtítulo `text-emerald-600`
- Número: `font-mono bg-slate-100 px-4 py-2 rounded-lg`
- Progress bar `h-1 bg-emerald-500` preenchendo em 3s
- Botão "Ir para o Dashboard →"

**Estado "Erro":**
- Card: `border-red-200 bg-red-50`
- XCircle `text-red-500 w-12 h-12`
- Título `text-red-700`, subtítulo `text-red-500`
- Botão `bg-red-500 text-white` "Tentar Novamente"

**Debug:** Botão discreto `text-xs text-slate-300 hover:text-slate-500` para alternar estados

**Timer circular:** SVG com `<circle>` usando `stroke-dasharray` e `stroke-dashoffset` animado via state. Raio ~40px, stroke-width 3, cor indigo-500. Texto centralizado dentro do SVG.

