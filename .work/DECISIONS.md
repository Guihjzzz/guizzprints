# Durable decisions
- 2026-09-21 Gallery: expand the external image gallery to five optional
  URLs across publishing, editing, Marketplace import/sync and the public
  viewer. Keep empty values nullable and filter them before rendering so an
  item with fewer images has no blank tile. Append `image_url_5` at the end of
  `public_mods` because PostgreSQL `CREATE OR REPLACE VIEW` cannot insert a
  column before existing view columns; grant only that public column and keep
  Terabox/source fields private.
- 2026-09-20 Minecraft Marketplace import: use only official HTTPS item URLs,
  parse metadata server-side with bounded timeout/HTML size and allowlisted
  asset hosts, then persist the source privately. Keep Terabox operator-owned;
  never scrape from the browser or expose source fields in `public_mods`.
  Refresh at most 10 stale imported rows once per day through a Vercel Hobby
  cron protected by `CRON_SECRET`; do not overwrite manually published items
  that have no saved Marketplace source.
- 2026-09-20 Mercado Pago commercial handoff: after confirming production
  credentials and the official webhook URL, enable
  `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` only in Vercel Production. Do not
  create an automatic live test charge; the first PIX must be supervised by the
  owner. A dashboard notification simulator without HMAC is not settlement
  evidence and the webhook remains fail-closed.
- 2026-09-20 Mercado Pago Sandbox Orders: manter o preço comercial server-owned
  no `vip_orders`, mas permitir `MERCADOPAGO_TEST_ORDER_AMOUNT` somente no modo
  de teste, porque a documentação oficial exige uma order PIX pré-definida com
  `payer.first_name=APRO`. O valor é configurado apenas no Vercel Preview;
  produção usa sempre R$1,99/R$6,70/R$19,90 e o Sandbox nunca concede VIP.
- 2026-09-19 No-plan decision: keep the Supabase project on Free and its default HTTPS host; do not buy Pro, create a custom domain, change DNS, rotate `NEXT_PUBLIC_SUPABASE_URL` or update OAuth callbacks. Treat the custom-domain video as an optional future migration, not a current launch blocker.
- 2026-09-19 Route security matrix: document existing server-side auth, body/page bounds, origin checks, timeouts, idempotency and nonce controls in one route matrix. Do not add a distributed limiter or paid monitoring blindly; revisit with real traffic or an authorized free monitor.
- 2026-09-19 Anti-Adblock stability: do not classify a still-loading Adsterra slot as blocked. Wait beyond the provider's 10-second timeout, accept a loaded no-fill response, and keep the fast all-script-error path. This prevents slow mobile networks from hiding the site while preserving the existing blocker wall.
- 2026-09-19 Supabase custom-domain cost gate: the production project is on Free and Custom Domains require Pro plus US$10/month per domain. Do not upgrade, spend money, change DNS, rotate `NEXT_PUBLIC_SUPABASE_URL`, or alter OAuth callbacks without an explicit budget/hostname decision.
- 2026-09-19 Published cohesive VIP/reliability batch: apply the Supabase plan-compatibility migration before shipping code, then publish pricing, user-driven Skip remounts, desktop detail alignment and `/api/health` together. This keeps the database and UI contracts synchronized and avoids repeated micro-deploys. Production verification covered VIP pricing, health headers and `llms.txt`; Mercado Pago live checkout remains disabled until external homologation and a supervised payment handoff.
- 2026-09-19 Launch planning: preserve the current dark/responsive/ads/download flows and group future work into diagnostics, stability/accessibility, mobile performance, targeted UX polish and supervised payment launch. Do not copy TikTok references wholesale or mix redesign with performance fixes.
- 2026-09-18 Detail alignment: center the title, author metadata and inline leaderboard in the detail right column at every breakpoint; keep actionable Download/Favorite/Share panels full-width for stable desktop and mobile sizing.
- 2026-09-18 Mod detail ads: keep the Technical Specifications companion as the only 300×250 detail ad, remove the duplicate mobile in-feed slot, and use responsive leaderboard placements at the GuizzMods/Download, Overview/Technical Specifications, You may also like/Explore, and Explore/Popular seams. Center the mobile summary column without changing the desktop alignment.
- 2026-09-18 Theme: GuizzMods is single-theme dark. Set the global CSS variables and `color-scheme` to dark unconditionally; do not use the browser's light/dark preference to change the site palette.
- 2026-09-18 AdBlock wall presentation: keep the hard detector/VIP/server boundaries unchanged and use a compact blurred premium modal for the visitor-facing explanation. The close icon is a recheck action, not a bypass; copy and labels stay localized in EN/PT/ES.
- 2026-09-18 Browser identity: explicitly declare `/icon.jpg` for regular and shortcut icons, while retaining the 180px Apple icon. This keeps the tab/logo stable across browsers and deployments instead of relying on provider or deployment fallbacks.
- 2026-09-18 Adsterra Anti-Adblock: use the exact regenerated script origin `canvassanymorephotography.com` for every current Active format. Do not reactivate or create placements when the Websites page already shows all five Active; treat the Codes URL selecting IDs 28/44 as stale dashboard state.
- 2026-09-18 UI audit: fixed overlays must keep their final centering transform outside the entrance animation; use valid `calc()` width math and explicit `box-sizing` for narrow screens. The Technical Specifications companion ad remains 300×250 and is centered inside a flexible detail grid cell.
- 2026-09-18 Favorites/ad surfaces: keep the Technical Specifications companion unit square (300×250), while category inserts stay leaderboard; the download VIP notice is fixed until explicit dismissal; use one shared auth listener for card favorites; wrap all Adsterra formats with one reduced-motion-safe palette frame; keep the official side creative at 160×600 and adapt only its responsive rail container to avoid distorting provider markup.
- 2026-09-18 Ad layout: page call sites provide only placement/margin classes; `AdsterraInlineBanner` and `AdsterraSidebar` own creative dimensions, labels and sticky behavior. Avoid bordered/fixed-height placeholder shells because they clip or visually nest provider creatives and break the stacked right rail while scrolling.
- 2026-09-18 Adsterra integration: do not run the official snippet inside `srcDoc`/sandbox iframes because the public vendor script rejects nested-window execution. Mount each existing Active unit's `atOptions` and `invoke.js` directly in a page-DOM host; let Adsterra create its own child iframe. Preserve VIP gating, ad labels, responsive dimensions and no provider-setting changes.
- 2026-09-17 VIP expiry UX: use the server-returned `expiresAt` to schedule a bounded client refresh in `VipAdGate`; this only restores ad rendering after expiry and never grants or revokes entitlement client-side.
- 2026-09-17 Supabase leaked-password protection: keep the current Free plan configuration unchanged because the dashboard marks this optional control as disabled and official Supabase documentation requires Pro or above. Retain the 8-character minimum, Turnstile and provider rate limits; revisit only after a deliberate plan upgrade.
- 2026-09-17 Auth focus state: use a ref as a one-shot focus request keyed by the auth mode instead of synchronously resetting state inside an effect. This keeps the login mode transition accessible while satisfying React's effect rules without an extra render.
- 2026-09-17 Active VIP UX: when `/api/vip/status` confirms an active entitlement, do not present another purchase action in the plan dialog. Show active status and account management instead; the server remains authoritative for any order or entitlement.
- 2026-09-17 Ad entitlement lookups: deduplicate concurrent `/api/vip/status` requests in memory per access token while keeping each gate's cancellation/order checks. Never persist tokens or treat this optimization as authorization; the server download and entitlement checks remain authoritative.
- 2026-09-17 Auth provider discovery: do not call Supabase's public settings endpoint from the browser to decide whether Google is shown. Keep the button visible on login/register and let `signInWithOAuth` validate availability, preserving a generic failure message and reducing backend-domain exposure.
- 2026-09-17 Repository privacy: do not publish the concrete Supabase project host in rollout documentation. Keep a placeholder for operator setup; the browser still receives the required public project URL through the runtime configuration.
- 2026-09-17 Error privacy: client surfaces must not log raw exceptions; show localized retry feedback when useful. Provider diagnostics use only sanitized error classes, never messages, payloads or user data.
- 2026-09-17 Safe observability: log only sanitized fixed-label scope/stage/code values on unexpected server failures. Never log identifiers, e-mails, tokens, private destinations, provider payloads or credentials; generic client responses remain unchanged.
- 2026-09-17 Legal copy: disclose the actual Google OAuth data scope and Mercado Pago PIX handoff in all supported locales, state that payment credentials and Google refresh tokens are not stored, and document server-verified time-limited VIP access. Keep provider names factual and avoid exposing internal identifiers.
- 2026-09-17 Auth confirmation: require mailbox confirmation for new password signups after verifying the published callback, confirmation template and redirect allowlist. Google OAuth remains independent; existing auto-confirmed accounts are not retroactively changed. Keep provider CAPTCHA/rate limits and generic resend UX as the abuse boundary.
- 2026-09-17 Auth input normalization: normalize e-mail and username values before any Supabase Auth call, rejecting oversized, malformed or control-character inputs with localized generic responses. This is a client-path guard and does not replace provider CAPTCHA, rate limits or dashboard confirmation policy.
- 2026-09-17 Consolidated updates: group related security and UX corrections behind one map, one validation pass and one deploy where possible; keep each batch small enough to review and preserve the payment safety gate.
- 2026-09-17 Download CSRF/token shape: reject a present cross-site fetch signal before DB access, and reject signed payloads with unsafe identifiers, timestamps or nonce shape. Direct navigations without these optional headers remain compatible; server nonce/expiry checks remain authoritative.
- 2026-09-17 VIP status recovery cooldown: a process-local 30-second per-user cooldown limits repeated live provider lookups after a missing webhook. The map is bounded and failures remain fail-closed; this is an abuse-control optimization, not an authorization decision.
- 2026-09-17 Download timer return-sync: stage and final countdowns are derived from client-side deadlines and reconciled when the tab becomes visible again. Expired sessions reset the UI, while final authorization still requires the signed server session and atomic `/api/download/open` checks.
- 2026-09-17 Download replay protection: signed browser access is paired with a private server nonce ledger. Preflight reads without consuming; only the final redirect performs an atomic one-time update. Keep the ledger service_role-only with RLS and preserve the existing VIP/no-wait behavior.
- 2026-09-17 Download privacy: protected download APIs and the final external redirect explicitly set `Referrer-Policy: no-referrer`, preventing the originating path from being sent to the hosting provider.
- 2026-09-17 Admin API errors: database/provider failures are logged only as a safe stage and code on the server; browser responses use generic 503 messages so schema, connection, and provider details cannot leak.
- 2026-09-17 Admin API input: mutation bodies must be JSON and stay under 64 KiB before parsing, limiting memory/abuse exposure even if an administrator token is compromised.
- 2026-09-17 Settings logout: ignore duplicate clicks, show a localized generic failure, clear account/VIP state after a successful Supabase sign-out, and use `router.replace` for logout and expired-session redirects so protected settings cannot be revisited through the previous history entry.
- 2026-09-17 Settings error privacy: profile/password update failures use localized generic copy instead of exposing raw Supabase error messages; upstream details remain server-side only.
- 2026-09-17 VIP motion: use only hover/press transitions on visible cards and controls, gated by fine-pointer and `prefers-reduced-motion` media queries; do not introduce hidden initial states or perpetual motion.
- 2026-09-17 VIP ad gate: subscribe to Supabase auth changes, hide ad iframes while a new entitlement check is pending, and ignore out-of-order status responses; on errors or signed-out sessions, fail open to ads while server-side download authorization remains authoritative.
- 2026-09-17 VIP status freshness: refresh the authenticated session and server entitlement when the VIP page returns via `pageshow` or becomes visible again; request ordering and cleanup prevent stale responses or listeners after unmount.
- 2026-09-17 Mercado Pago live test: a real Production PIX ticket may be opened
  only under explicit user authorization; the agent must never confirm the PIX
  or claim VIP on the user’s behalf. The later 2026-09-20 handoff explicitly
  enabled ongoing commercial billing, but the first live PIX remains supervised.
- 2026-09-16 Auth rollout: preserve current locale and allowlisted VIP plan throughout login/confirmation/recovery/Google PKCE. Password forms require server validation before enabling and again on submit. Never expose upstream auth messages or account-existence details.
- Auth email abuse: project quota is shared across unverified confirmation and verified-account mail, so increasing quota cannot selectively protect verified users. Keep provider5/5min/IP +60s per-user limits and add server-validated Turnstile; client cooldown is UX only. Google avoids confirmation-email consumption. Do not enable CAPTCHA before compatible UI deployment; keep OTP during recovery-template rollout. Existing auto-confirmed users are not retroactively mailbox-verified.

- VIP payments: user chose AbacatePay, explicitly step-by-step. First step is Dev mode credential setup only; no real charge, production activation or VIP entitlement until subsequent authorization/verification. Never request secrets in chat or expose them in NEXT_PUBLIC variables.

- 2026-09-15: user explicitly rejects reference's free 24-hour ad-unlock pass; future ad-free benefit belongs to VIP. User can provide additional Adsterra snippets if needed; do not substitute reference publisher keys.

- Keep the catalog light: list requests return 10/20/50 summaries; filtering is server-side. Avoid loading everything merely to browse or search.
- Admin CRUD uses server authorization and privileged Supabase client. Never put privileged keys in public bundles or project memory.
- Public browsing uses public_mods; Terabox destinations stay private and are exposed only by protected waiting/download flow.
- Invoker migration grants only public columns with RLS; historical SQL application must be verified separately from local files.
- User prefers external images; do not migrate image hosting or remove intentionally unfinished app links without a new request.
- Version is stored without the fixed display prefix '# v'; normalize legacy values.
- Categories: holoprint, addons, textures, shaders, maps, skins, mash-up. Preserve en/pt/es and mobile/desktop usability.
- User normally publishes using git commit/push to trigger Vercel; do not assume local changes are live.
- Export must include all categories and pages, not just current search results. CSV is the chosen requested format.
- A mod belongs to both its main category and its single stored optional subcategory. Public/admin category filters use OR without duplicating rows. Display both labels; omit empty secondary badges. No multi-subcategory schema change requested.
- 2026-09-13 monetization: user rules out AdSense and chose to start Adsterra setup. Begin with display banners in existing spaces, not popunders. Await actual publisher snippets before implementation.
- 2026-09-15: VIP preview imported on explicit request from Login and Payment copy, with installation/navigation/auth-return. Preserve source prices: 15d R$3.35, 30d R$6.70, 90d R$20, 365d R$80. No provider, actual billing, entitlement, ad removal or wait bypass. Future benefits require server-validated time-limited entitlement; preview/login cannot grant VIP.
- AbacatePay part 1 authorized2026-09-16: hosted APIv2 PIX TEST checkout only, not subscriptions. Default-off feature and Vercel Production block; verified Supabase bearer user must be in server tester allowlist. Dev dashboard products mapped to four server plans; exact configured Preview/local origin; response devMode/price/item/externalId/URL checked. Key determines provider environment: response guard cannot prevent creation with a mistakenly configured production key. No DB writes/VIP grants; provider metadata records user/plan/order UUID. Persistent orders/idempotency/webhook/rate limiting are required before public launch. No auto-retry on ambiguous checkout POST. Never ask for API key in chat.
- AbacatePay webhook rollout 2026-09-16: created Sandbox v2 webhook `Guizz VIP Preview` for checkout.completed/refunded/disputed/lost. Generated URL secret and documented public HMAC key are stored as Vercel Secret variables in Preview/Development only; Production remains untouched until a separately authorized production rollout. Do not grant VIP from Sandbox events.
- AbacatePay webhook correction 2026-09-16: created `Guizz VIP Preview Stable` with the base stable-Preview endpoint (secret passed by provider, not embedded in the URL), rotated the Vercel Preview/Development secret, and redeployed Preview from `64e2af5`. The original malformed webhook remains undeleted so it can be removed deliberately later; Production is untouched.
- 2026-09-16 Supabase hardening: pin legacy SECURITY DEFINER function search paths and revoke browser-role EXECUTE; keep `increment_download` callable only by `service_role`. This removes the advisor findings without changing application behavior. Leaked-password checks remain unavailable on the current Free plan.
- 2026-09-16 VIP discoverability: keep the desktop rail compact, but give the VIP link an explicit text label and restrained blue halo; respect `prefers-reduced-motion` and avoid adding a persistent promotional overlay.
- 2026-09-16 Turnstile hostname scope: allow only `guizz.xyz` and `www.guizz.xyz` for the login widget; keep Managed mode and pre-clearance disabled to avoid broadening the challenge surface.
- 2026-09-16 Password baseline: set Supabase minimum password length to 8 to match client validation. Do not require current password or recent reauthentication until recovery UX is explicitly tested; leaked-password protection requires Pro.
- 2026-09-16 Google discovery fallback: show the Google action when the read-only settings probe fails transiently; never bypass Supabase's provider validation, and keep the user-facing error generic.
- 2026-09-16 Auth UI: render Google sign-in on every non-reset screen instead of trusting the public settings discovery endpoint, because Preview/CORS false negatives hid an enabled provider. Supabase `signInWithOAuth` and destination validation remain authoritative.
- 2026-09-16 Ads: use a best-effort CSS-bait detector to explain blocked advertising to non-VIP visitors, but never treat it as authorization. VIPAdGate and signed server download sessions remain the only entitlement controls.
- 2026-09-16 Account/VIP discoverability: show VIP status from `/api/vip/status` inside authenticated settings, with expiry and a manage link for active users or an upgrade CTA otherwise. Keep the server response authoritative and fail closed if unavailable; do not expose entitlement state from client-only metadata.
- 2026-09-17 Payment provider consolidation: remove AbacatePay code, routes, docs, tests and environment variables at the user's request. Mercado Pago Orders/PIX is the sole provider; keep the generic `vip_orders`, `vip_webhook_events` and `vip_entitlements` tables because they are provider-neutral and required for Mercado Pago. Production was later enabled by the explicit 2026-09-20 handoff.
- 2026-09-17 Mercado Pago reconciliation hardening: only live `checkout_created` rows are operator-reconciled; the provider checkout ID must match the saved order, the fetched Order must prove a single PIX bank transfer with matching amount, and `apply_vip_payment_checked` (service_role-only) must report `applied=true`. A 45-second route deadline bounds sequential provider lookups; Sandbox rows remain diagnostic-only.
- 2026-09-17 Category pagination resilience: public category pages keep 20-row bounded requests, advance the cursor only after a successful page, and pause the observer after errors until the visitor explicitly retries. This avoids skipped results and request loops while preserving the lightweight catalog policy.
- 2026-09-17 Homepage discovery: keep the home query bounded to the latest 50 summaries, but link every populated category rail to its full paginated category route so older items remain discoverable without loading the entire catalog on the home page.
- 2026-09-17 Homepage category coverage: render latest rails for all six supported categories from the same bounded 50-row home result. Keep empty rails hidden and direct visitors to the dedicated paginated route through the existing localized “View all” link.
# Privacidade de contato (2026-09-17)

- Decisão: manter o contato público somente nos canais oficiais já publicados (Discord e YouTube), sem e-mail pessoal ou URL do backend.
- Motivo: reduz exposição de identidade e de infraestrutura; solicitações de conta continuam orientadas a informar o e-mail apenas em conversa privada.
- Implementação: links externos em `SiteInfoPage` usam `noopener`, `noreferrer` e `referrerPolicy="no-referrer"`; teste dedicado impede regressões.
# 2026-09-18 — ad visual cleanup batch

- Keep only the 160×600 sticky creative in desktop side rails. The square unit is removed from sidebars because it overlapped the rail during scrolling and made the catalog look boxed-in.
- Use the responsive leaderboard placement for category inserts and the Technical Specifications companion slot. Keep the deliberate 300×250 unit only in the protected download interstitial, where it is a standalone step rather than a page rail.
- Query each home category independently (latest eight) instead of deriving every rail from the global latest-50 window; this preserves discovery for categories such as skins without increasing the number of catalog cards shown.

# 2026-09-19 — Lote 0 diagnostic findings

# 2026-09-19 — plano integrado dos vídeos

- Correção: o primeiro vídeo trata principalmente da troca do host aleatório `PROJECT_REF.supabase.co` por um domínio/hostname personalizado do projeto, não apenas de uma revisão genérica de segurança.
- Decisão: usar um subdomínio próprio (recomendação inicial `api.guizz.xyz`) com CNAME/TXT e certificado Supabase; confirmar Custom Domain pago versus Vanity Subdomain experimental antes de qualquer alteração.
- Motivo: a mudança afeta `NEXT_PUBLIC_SUPABASE_URL`, OAuth/callbacks, Storage, Functions e sessões. Deve ser verificada em DNS e smoke antes da publicação.
- Decisão: manter a revisão de segurança Supabase, a checklist de 20 itens e backup/restore como gates separados; o produto já tem autenticação, RLS/functions hardening, download protegido e pagamentos server-side, mas algumas evidências ainda faltam.
- Decisão: tratar Mercado Pago como homologação primeiro e manter `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false` até credenciais/produtos/webhook e teste PIX supervisionado. Nunca conceder VIP pelo retorno do navegador.
- Afetados: `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md`, `.work/TASKS.md`, `.work/STATE.md`, `docs/mercadopago-payments.md` e os endpoints `src/app/api/vip/*`.

# 2026-09-19 — mapa mestre de lançamento

- Decisão: usar `docs/MAPA_MESTRE_LANCAMENTO.md` como fila única para as checklists, PageSpeed, Supabase, Mercado Pago, SEO e QA; novas listas serão incorporadas antes de executar outra rodada.
- Motivo: evita repetir alterações ou exigir comandos “próximo” para cada microtarefa, preservando lotes coesos e os comportamentos já aprovados.
- Lacunas registradas: metadata própria de categoria/busca, 404 localizada, OG image completa e `mash-up` ausente do sitemap; não classificar a existência de um arquivo como conclusão sem evidência.

# 2026-09-19 — catálogo VIP e refresh por Skip

- Decisão: vender somente Diário (R$1,99), Semanal (R$6,70; aproximadamente R$0,96/dia) e Mensal (R$19,90; aproximadamente R$0,66/dia). Trimestral e anual saem da oferta pública e do checkout.
- Motivo: manter o diário como entrada de maior custo unitário e tornar o semanal/mensal progressivamente mais atrativos, conforme solicitado.
- Compatibilidade: a migration mantém os IDs antigos aceitos no banco exclusivamente para históricos já pagos; novos pedidos só podem usar os três IDs de `src/lib/vip-plans.ts`.
- Anúncios: cada mudança de etapa causada pelo clique real em Skip remonta apenas os três slots ativos da etapa (dois `leaderboard`, superior/inferior, e um `rectangle`), sem timer ou refresh oculto. A etapa final mantém seus próprios banners e não recebe chamadas extras.
- A montagem de cada slot recebe um query string `guizz_mount` monotonicamente crescente para evitar cache do `invoke.js`; os formatos horizontais alternam entre unidades aprovadas quando cabem no container. Isso garante uma nova solicitação após Skip, mas não promete uma campanha diferente, pois a seleção final é da Adsterra.
- Segurança comercial: esse refresh é uma nova oportunidade somente após ação explícita do usuário e segue sujeito às regras de refresh da Adsterra; não usar chamadas ocultas, duplicadas ou automáticas para inflar impressões.

# 2026-09-19 — alinhamento do detalhe no desktop

- Decisão: usar uma grade desktop de duas colunas com a mídia ocupando o espaço flexível e a lateral fixada em `400px`, ampliando o frame principal para `1440px`; alinhar a lateral à esquerda/no topo apenas em telas grandes e manter o centro no celular.
- Motivo: a divisão anterior em 8/4 e a centralização da lateral deixavam título, autor, anúncio e download visualmente deslocados em telas largas, enquanto o comportamento mobile já estava aprovado.

# 2026-09-19 — prioridade do hero e leitura do PageSpeed

- Decisão: somente a primeira imagem do carrossel recebe `priority`; os slides
  seguintes usam carregamento padrão/lazy.
- Motivo: o mesmo perfil mobile mostrou payload de 11.079 KiB e LCP muito
  elevado antes da correção; preservar a primeira pintura sem baixar três
  imagens de destaque em paralelo reduz a concorrência sem alterar o carrossel.
- Validação: `9a00d2e` está publicado e Ready; lint, TypeScript, build e smoke
  29/29 passam. A medição posterior marcou LCP 1,7 s, mas CLS 0,487, então
  não atribuir toda a melhora ou piora a uma única execução do PageSpeed.
- Limite: não mudar Anti-Adblock, origem dos anúncios ou remover criativos por
  causa de falhas sintéticas/terceiras; primeiro obter uma captura mobile
  reproduzível de layout e console.

# 2026-09-19 — reserva de trilhos na home

- Decisão: durante o carregamento inicial, os oito trilhos de catálogo exibem
  placeholders com altura reservada; depois da consulta, os cards reais ocupam
  o mesmo fluxo.
- Motivo: duas execuções do mesmo perfil mobile mantiveram CLS 0,487 e
  atribuíram 0,312 ao deslocamento do corpo/rodapé. A mudança reduz o salto de
  conteúdo sem remover itens, atrasar anúncios ou alterar a hierarquia visual.
- Validação: lint, TypeScript, build e smoke 30/30; a confirmação PageSpeed
  pós-deploy é obrigatória antes de outra intervenção.

# 2026-09-19 — CLS fechado sem alterar anúncios

- Decisão: manter a reserva dos trilhos e congelar o layout; não mexer em
  Anti-Adblock, criativos ou cadência.
- Evidência: a mesma medição mobile pós-deploy caiu de CLS `0,487` para
  `0,045`; o relatório restante atribuiu todo o salto a `Most downloaded` e
  não apontou o shell de anúncio.
- Limite: o LCP oscilou até 31,1 s e o relatório estimou 10.325 KiB de imagens;
  isso é uma decisão de origem/CDN e custo, não motivo para reativar o
  otimizador Vercel ou contratar plano novo automaticamente.

# 2026-09-19 — erros de favoritos sem detalhes do provedor

- Decisão: as falhas de adicionar/remover favoritos mostram apenas uma
  mensagem localizada genérica; detalhes de `result.error` ficam fora da UI.
- Motivo: mensagens Supabase podem conter nomes de constraint, schema ou
  diagnóstico operacional; o usuário só precisa de uma ação segura (tentar
  novamente), enquanto a investigação permanece nos logs sanitizados.
- Afetados: `src/components/FavoriteButton.tsx`, `src/components/ModViewer.tsx`
  e `src/messages/{en,pt,es}.json`.

# 2026-09-19 — limpeza externa controlada

- Decisão: preservar produção e remover somente legado comprovado. O candidato é a Preview `abacatepay-test` (deployment `DgBvJcAiWLgA6D9CHpPTwvGhkcPX`) e suas cinco variáveis Preview específicas; domínios, deployments históricos, chaves de produção, Supabase Auth/RLS/migrations e projeto permanecem.
- Motivo: o branch diverge amplamente do `main` e contém o histórico do provedor substituído, enquanto a aplicação atual usa apenas Mercado Pago. Nenhum recurso Supabase órfão ou integração/storage Vercel foi encontrado.
- Regra: exclusões cloud exigem confirmação imediata dos alvos exatos; não fazer limpeza ampla nem apagar histórico de rollback.
- Resultado: após confirmação, os alvos foram excluídos e a verificação mostrou `main`/produção Ready, domínios oficiais preservados, somente variáveis atuais restantes e nenhum recurso Supabase removível. O branch local legado foi preservado por enquanto como cópia de segurança local.

# 2026-09-19 — checklist de segurança adicional

- Decisão: tratar a terceira lista como auditoria de segurança de runtime e de cadeia de código, separando controles comprovados de verificações externas ainda pendentes.
- Motivo: RLS, service-role boundaries, cookies, headers, HTTPS e validação já existem, mas histórico Git, rate limiting distribuído, matriz de entrada e rechecagem de dependências precisam de evidência específica.
- Regra: não criptografar campos ou adicionar bloqueios genéricos apenas por checklist; primeiro confirmar se o dado é realmente sensível e se o controle atual já cobre o risco.
- Evidência: varredura local de 205 commits + working tree contra padrões de alta confiança não encontrou matches; manter rechecagem especializada quando o scanner puder ser instalado.

# 2026-09-19 — SEO/trust batch

- Decisão: usar layouts de rota server-side para metadata de categorias/busca e uma 404 global, sem converter páginas client-side inteiras nem alterar o layout visual aprovado.
- Resultado: Open Graph/Twitter default e por mod, `mash-up` no sitemap e smoke 25/25. A imagem padrão reutiliza o logo existente; não foi criado um asset publicitário novo nesta rodada.

- 2026-09-19 Next/Image width allowlist: keep `384px` in both `deviceSizes` and `imageSizes`. Removing it to reduce candidate sizes caused PageSpeed's high-density mobile card requests (`w=384`) to return HTTP 400. Preserve the narrower 400px hero/card targets, but never remove a width requested by the browser.
- 2026-09-19 Image reliability: enable `images.unoptimized` while remote catalog media has no owned CDN and Vercel returns `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` from `/_next/image`. Direct source delivery is preferable to broken cards at launch; retain the breakpoint lists so a future CDN/loader can restore resizing without changing components.

- Keep the current security headers unchanged until compatibility is tested; do not broaden CSP/HSTS or remove restrictions based only on PageSpeed manual checks.
- Treat `/llms.txt` as a confirmed root-route bug: it currently falls through to localized HTML. Correct it explicitly with a text resource and route/content-type regression, without changing locale routing.
- Treat inline Adsterra dimensions as a likely CLS source, not a proven root cause. Measure layout shifts first, then reserve dimensions with a provider-safe fallback.
- Do not harden Anti-Adblock based on PageSpeed alone; console errors and provider slow/no-fill behavior must be classified so legitimate visitors are not falsely blocked.
- Keep contrast changes targeted: ad labels now use `text-zinc-400`, but do not replace every `text-zinc-500` token globally until the exact PageSpeed node is captured. Console classification remains evidence-driven.
- 2026-09-19 Performance: optimize the homepage first by selecting only rendered card fields and parallelizing independent Supabase reads. Do not lazy-load hero/YouTube or defer third parties until the same PageSpeed profile is remeasured; preserving ad detection and above-the-fold content is more important than an unverified score change.
- 2026-09-19 Root text asset routing: explicitly bypass next-intl for `/llms.txt` in `src/proxy.ts`. The public deployment proved that a static file alone was insufficient because the locale fallback could still return HTML; preserve the regression check for status, content type, and non-HTML body.
- 2026-09-19 Responsive images: configure Next/Image `deviceSizes`/`imageSizes` around the actual 400px hero and 160/220px card breakpoints. Keep source URLs, quality and layout unchanged; PageSpeed's image-delivery opportunity is the measurable target, while volatile headline scores are not a reason to defer ads or hero content.

# 2026-09-19 — auditoria Free e homologação Mercado Pago

- Decisão: não comprar plano Supabase nem tentar trocar o host padrão nesta
  rodada. A leitura do painel Free mostrou primário único, sem réplicas e 0,00
  GB usados; como PITR/restore não apareceu na tela consultada, esse controle
  fica pendente até existir evidência não destrutiva.
- Decisão: manter a homologação Mercado Pago separada da cobrança comercial e
  documentar os casos em `docs/MERCADO_PAGO_SANDBOX_MATRIX.md`. O documento é
  um roteiro MP-01–MP-27, não uma afirmação de que o sandbox foi executado.
- Regra: nunca pedir ou registrar credenciais no chat; executar testes somente
  em Preview com Access Token/payer de teste configurados diretamente e manter
  `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

# 2026-09-19 — limites de corpo nas rotas de pagamento

- Decisão: rejeitar o `content-length` declarado antes de ler o corpo do
  checkout/webhook e medir também bytes UTF-8 após a leitura.
- Motivo: reduz o custo de payloads grandes e mantém a proteção mesmo quando o
  cabeçalho é omitido; não cria um falso rate limiter distribuído em Vercel.
- Evidência: testes focados 8/8, lint, TypeScript, build e smoke 28/28.

# 2026-09-19 — continuidade no Supabase Free

- Decisão: não contratar Pro/PITR. Usar exportação lógica operada pelo
  proprietário com `supabase db dump --linked` e cópia externa privada.
- Motivo: a documentação oficial recomenda esse caminho para Free e informa
  que backups automáticos não ficam disponíveis para download nesse plano.
- Regra: o dump nunca entra no Git, bundle ou Storage público; restauração só
  em projeto separado e após confirmação do alvo. Sem CLI/ensaio, o gate segue
  pendente.
# 2026-09-19 — APIs não indexáveis por cabeçalho

- Decisão: aplicar `X-Robots-Tag: noindex, nofollow, noarchive` em `/api/*`
  no `next.config.ts`.
- Motivo: reforçar a exclusão de respostas operacionais, auth e erro dos
  rastreadores mesmo se uma rota for vinculada acidentalmente; não afeta páginas
  públicas, sitemap ou o host padrão do Supabase.
# 2026-09-20 — nome público do Google OAuth

- Decisão: usar `GuizzMods` como nome público no Google Auth Platform.
- Razão: é a marca voltada ao usuário; `api.guizz.xyz` seria um identificador
  técnico e não substitui o callback `*.supabase.co` sem domínio personalizado
  do Auth/proxy.
- Escopo: somente branding da tela de consentimento; manter cliente `Guizz
  Mods Web`, callback Supabase e credenciais sem alteração.
# 2026-09-20 — encerramento do handoff comercial Mercado Pago

- **Decisão:** manter o checkout live ligado somente em Production e exibir
  copy comercial apenas quando essa flag está ativa; Preview permanece Sandbox.
- **Motivo:** o PIX semanal supervisionado já confirmou liquidação e
  entitlement server-side, enquanto o ticket/retorno Sandbox não prova
  pagamento. Evita nova cobrança e evita que visitantes vejam “pré-lançamento”
  no checkout comercial.
- **Afetados:** `src/lib/vip-copy.ts`, página/componente VIP e documentação de
  Mercado Pago/lançamento.
