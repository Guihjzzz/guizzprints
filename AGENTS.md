<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Codebase Overview

GuizzMods é um site Next.js 16 localizado (en/pt/es) com catálogo público no Supabase, autenticação Google/email com Turnstile, downloads protegidos por sessão HMAC/nonce e VIP PIX via Mercado Pago. O layout por domínio fica em `src/app`, componentes compartilhados em `src/components`, regras server-side em `src/lib` e migrations em `supabase/migrations`.

Para a arquitetura completa, fluxos e guia de navegação, consulte [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md). Para a ordem de implementação e critérios de lançamento, consulte [docs/LAUNCH_MAP.md](docs/LAUNCH_MAP.md).
