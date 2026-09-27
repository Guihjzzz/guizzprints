# Work queue

## Current batch — quinta imagem da galeria (publicada)
- [x] Adicionar o slot opcional `image_url_5` em publicar e editar, enviando
  vazio como `null`.
- [x] Propagar a quinta imagem pelo importador Marketplace, refresh individual,
  cron diário, API admin e visualizador sem renderizar slot ausente.
- [x] Aplicar/verificar migration e permissões públicas sem expor Terabox.
- [x] Marketplace **5/5**, build/smoke **34/34**, lint e deploy Production
  **Ready** no commit `fa27d98`.
- [ ] Repetir uma publicação/edição autenticada com uma URL de imagem 5 no
  painel quando houver item de teste; não é bloqueio para o código publicado.

## Current batch — saúde procedural do Marketplace (aguardando migration)
- [x] Adicionar refresh best-effort ao abrir detalhe com cooldown de 30 minutos.
- [x] Registrar sucesso/falha no cron e preservar o conteúdo anterior quando a
  origem estiver indisponível.
- [x] Adicionar alerta global, filtro e badge de atenção manual ao Catálogo.
- [x] Passar build, `npm test` **30/30** e security matrix **2/2**.
- [ ] Aplicar `20260920_07_minecraft_source_health.sql` no Supabase Production.
- [ ] Publicar e validar o fluxo live; só então observar o primeiro cron.

## Current batch — importação Marketplace Minecraft (publicada; teste autenticado pendente)
- [x] Adicionar parser server-side bounded para páginas oficiais e extrair
  título, descrição, quatro imagens e trailer YouTube.
- [x] Adicionar botão/campo na aba Publicar; manter Terabox manual e sugerir
  categoria sem publicar automaticamente.
- [x] Criar migration privada de origem/sincronização e aplicar em Production.
- [x] Criar cron diário protegido por `CRON_SECRET`, configurar `vercel.json`
  e salvar a Secret somente na Vercel Production.
- [x] Adicionar teste isolado 4/4, documentar as 11 rotas na matriz e passar
  security matrix 2/2.
- [x] Repetir TypeScript, testes focados e matriz, commitar/push e validar
  `/api/health` e as respostas 403/401 das rotas novas.
- [ ] Confirmar manualmente o import em `/en/upload` com o link Senna World;
  não concluir/publicar sem um destino Terabox escolhido.

## Current launch audit — concluído sem plano pago
- Documentação e mapa mestre reconciliados com o checkout comercial real:
  Production usa live; Preview continua Sandbox; nenhuma cobrança adicional
  foi criada.
- Workflow gratuito de saúde permanece ativo a cada 15 minutos. Testes desta
  rodada: security matrix **2/2**, client-secret scan **1/1** e `npm audit`
  **0 vulnerabilidades**.
- Commit `620f89b` foi publicado em `main` e o deploy Production ficou Ready.
- Rechecagens opcionais concluídas: PageSpeed `lrsncrbk1o` (mobile CLS 0,045,
  desktop CLS 0,367/LCP 1,3 s), Search Console ainda sem leitura do sitemap
  apesar do endpoint público 200 XML, e scanner especializado tentado sem
  pacote disponível (`ENOTCACHED`).
- Melhorias que dependem de conta/infraestrutura externa (fixture Sandbox,
  alertas de provedor, restore, CDN/compressão e carga em Preview) continuam
  separadas e não bloqueiam a operação atual.

## Current payment batch — concluído
- Auditoria focada Mercado Pago **30/30**, `npm audit` limpo, matriz de
  segurança **2/2**, client-secret scan aprovado e `npm test` **30/30**.
- Copy da página VIP agora diferencia corretamente o modo comercial live do
  pré-lançamento; documentação de produção deixou de instruir o live gate
  desligado. Sandbox continua como pendência externa opcional de evento
  assinado/fixture, sem nova cobrança real.
- Commit `c918c24` foi publicado; deploy Production ficou **Ready** e `/en/vip`
  mostrou “Available now”/PIX seguro no modo live. Manter observação de
  expiração/replay e reconciliação sem tocar no pagamento já liquidado.

## Current external gate — Mercado Pago live
- **Concluído:** credenciais de produção e webhook oficial conferidos no painel;
  `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` salvo no Vercel Production.
- **Concluído:** redeploy `BELHhJSNgp4TNHcbYcbK3YTMh8sA` ficou **Ready**; probes
  `/api/health` e `/en/vip` responderam `200`.
- **Concluído:** ordem PIX live semanal de R$6,70 foi paga pelo proprietário;
  a página VIP autenticada confirmou o entitlement ativo até 27/09/2026.
- **Pendente:** observar replay/expiração e manter a reconciliação administrativa
  disponível; não criar uma segunda cobrança para o ensaio.
- **Nota:** o simulador de notificações do Mercado Pago retornou `401` na URL
  de branch e na oficial por não fornecer a assinatura HMAC; isso é esperado
  para o endpoint fail-closed e não representa falha de produção.

## Current external gate — Mercado Pago Sandbox
- **Concluído:** validação adicional da conta Mercado Pago; painel e credenciais
  de teste acessíveis.
- **Concluído parcialmente:** tickets PIX Sandbox de Diário (R$1,99) e Mensal
  (R$19,90) foram devolvidos pelo provedor; Semanal (R$6,70) também foi
  exercitado. Nenhum deles representa pagamento, webhook de liquidação ou
  entitlement VIP.
- **Concluído no código:** o adaptador aceita a quantia Sandbox configurada ou
  o total comercial server-owned ao reutilizar uma ordem antiga do mesmo plano,
  com referência, método, status e URL ainda obrigatórios. Teste focado **8/8**,
  `npm test` **30/30**, commit `2c840f2` e deploy Production **Ready**.
- **Pendente opcional:** evento oficial Sandbox/fixture assinada para registrar
  retorno, webhook idempotente, reconciliação e expiração. A cobrança comercial
  já está ativa somente em Production e foi validada com um PIX supervisionado;
  não criar uma segunda cobrança real.
- **Regra:** manter Sandbox isolado em Preview, sem misturar credenciais ou
  entitlements; a flag live só deve permanecer `true` no ambiente Production.

## Current implementation batch
- **Concluído nesta rodada:** auditoria do subagente corrigiu o excesso de
  espaço dos quatro banners horizontais no mobile da página de detalhe,
  vencendo o `min-height` inline com uma classe escopada. Desktop e rectangle
  permanecem intactos; `npm test` passou **30/30**. Commit `c70a225` publicado
  e viewport 390px conferido.
- **Concluído nesta rodada:** recalibrado o espaço reservado entre o banner
  superior e Favorite/Share somente no desktop, de `lg:-mb-12` para `lg:-mb-6`.
  `npm test` passou **30/30**; commit `8ec85ef` publicado e produção conferida.
- **Concluído nesta rodada:** Favorite/Share foram movidos para uma faixa
  compacta acima do Download, preservando rótulos e acessibilidade. `npm test`
  passou **30/30**; commit `f8cf34a` publicado e produção conferida.
- **Concluído nesta rodada:** restauração fiel do grid da foto 2 após a
  regressão da grade fixa. Voltados `max-w-[1280px]`, `lg:grid-cols-12`,
  spans 8/4 e centralização desktop. `npm test` passou **30/30**; commit
  `316ee07` está publicado, visual conferido e `/api/health` retornou `200`.
- Mercado Pago Sandbox: a correção `2c840f2` foi publicada após o primeiro
  deploy falhar apenas no estreitamento TypeScript de `payment_method`. A
  produção está Ready; `/api/health` e `/en/vip` responderam `200`. Não houve
  alteração de preço, segredo, entitlement ou flag live.
- OAuth branding: no Google Auth Platform, o app `Guizz Mods Web` agora exibe
  **GuizzMods**. Callback Supabase, credenciais e domínio técnico permanecem
  intactos; nenhuma alteração de código/deploy é necessária.
- Search Console/canonical: publicação `4886f07` alinhou `metadataBase`,
  `robots.txt` e `sitemap.xml` ao host final `https://www.guizz.xyz`; build e
  smoke passaram **30/30** e a Vercel está Ready. A propriedade `www` foi
  verificada e o sitemap foi enviado; o painel ainda mostra falha de busca
  transitória embora o endpoint público responda 200/XML válido. Rechecagem é
  opcional; próximo gate é Mercado Pago Sandbox.
- Mercado Pago Sandbox: a validação da conta foi concluída pelo operador. O
  painel está acessível; manter o registro detalhado no gate acima e não
  reabrir a etapa de identidade.
- Download/VIP: corrigida a reutilização de cookie para comparar o estado VIP
  atual com a sessão salva; VIP ativo pula a espera mesmo após cookie antigo e
  revogação não preserva o atalho. Teste focado 7/7, lint, build e smoke 30/30.
  Publicado em `c94342e`; deploy Vercel Ready.
- Produção: o deploy `c84834e` ficou Ready e os contratos públicos foram
  conferidos somente leitura: health `200`/`ok:true`/`noindex`, robots texto,
  sitemap XML, llms texto puro e VIP HTML. Nenhuma configuração externa foi
  alterada.
- Segurança de release: `npm audit --omit=optional --audit-level=high` retornou
  0 vulnerabilidades; a revisão dos padrões versionados só encontrou nomes e
  fixtures intencionais, sem valores de segredo.
- Release: `npm test` passou com build Next.js/TypeScript e smoke **30/30**;
  a matriz formal de validação cobre todas as 9 rotas e fecha o item de
  validação de entradas do mapa mestre. O deploy `b1630eb` ficou Ready.
- SEO/confiança: QA público somente leitura confirmou títulos e CTAs iniciais
  na home, busca, Maps e VIP, cards reais e alts descritivos; `npm run
  test:smoke` passou 30/30. A primeira dobra foi marcada concluída no mapa,
  sem mudança de código ou configuração externa.
- Segurança: `npm run test:security-matrix` passou 2/2; as 9 rotas `/api`
  seguem cobertas e sem cache. A lacuna restante é apenas rate limit
  distribuído dependente de provedor/tráfego real, não um bloqueio atual.
- Mercado Pago Sandbox: tentativa segura de localizar uma simulação oficial
  no painel foi bloqueada pela verificação adicional da conta (SMS/WhatsApp,
  QR do app ou Google Authenticator). Nenhum código/segredo foi inserido e
  nenhum pagamento/webhook foi inventado. O ticket Semanal continua somente
  `checkout_created`; o próximo passo externo é concluir a validação do
  operador ou executar fixture controlada.
- Monitor gratuito verificado novamente: `GuizzMods health check #2` terminou
  **Success** em 5 s no `main` contra `https://www.guizz.xyz/api/health`.
  O agendamento de 15 minutos está publicado; somente preferências de alerta
  do GitHub permanecem opcionais.
- Mercado Pago Sandbox: conta de suporte foi adicionada à allowlist **Preview**
  e o deploy `site-mods-926eus9eh-guizz1.vercel.app` ficou Ready. O checkout
  PIX Semanal (R$6,70) abriu um ticket de teste com QR/código; não houve
  pagamento nem ativação. MP-09 está evidenciado para o Semanal; retorno,
  webhook assinado/idempotente, reconciliação, expiração e Diário/Mensal ainda
  aguardam ensaio controlado. Live permanece desligado.
- Monitor gratuito preparado em `.github/workflows/health-check.yml`: ping
  sem segredo a cada 15 minutos, com execução manual e timeout curto. Falta
  somente configurar preferências de notificação do GitHub, se desejado;
  execução manual `35479199762` passou em 10 s. Vercel Pro não será usado.
- Monitoramento: Vercel Observability confirmou que alertas exigem upgrade
  para Pro; nenhum plano foi alterado. `/api/health` segue pronto para um
  monitor externo gratuito, ainda pendente de escolha/configuração.
- Mercado Pago: testes locais simulados de checkout/webhook/reconciliação
  passaram 24/24 e testes VIP 10/10. O Preview agora tem token de teste,
  flag de sandbox, payer `@testuser.com`, UUID da conta GuizzMods e
  `MERCADOPAGO_WEBHOOK_SECRET`, com deploy Ready e o domínio de branch de
  Preview público para permitir chamadas externas durante o teste. O painel
  Mercado Pago está configurado com Order apontando para esse domínio; falta
  executar a matriz ponta a ponta.
- Matriz de segurança automatizada adicionada: `npm run test:security-matrix`
  cobre as 9 rotas `/api`, seus handlers e o cabeçalho `no-store`; lint,
  client-security e smoke **30/30** passam. Publicada em `72213ee`; Vercel
  Ready em `site-mods-3emnby9e0-guizz1.vercel.app`.
- Backup/restore do Supabase Free **adiado pelo proprietário**; nenhum segredo,
  dump ou restauração foi executado. Não reabrir sem nova decisão.
- Trava de segredos no client publicada em `bc5303c`; Vercel Ready em
  `site-mods-l2wa8bvsp-guizz1.vercel.app`. `npm run test:client-security` e
  lint passam; nenhum gate externo foi iniciado.
- Trava de segredos no client adicionada: `npm run test:client-security` passa e
  lint permanece sem avisos; bloqueia tokens/segredos server-only em arquivos
  `use client`.
- APIs fora de indexação: `X-Robots-Tag` aplicado por configuração a `/api/*`
  e smoke atualizado; build, lint, TypeScript, privacidade e smoke **30/30**.
  Publicado em `854f52e`; Vercel Ready em `site-mods-nyv4hdszg-guizz1.vercel.app`.
- A sonda health foi alinhada ao mesmo valor após a verificação pública; o
  deploy `659b4f8` confirmou `noarchive` também no domínio canônico.
- Privacidade de erros fechada nos favoritos: `FavoriteButton`/`ModViewer` usam
  copy localizada genérica e o teste dedicado não permite `{message}` ou
  `error.message` na superfície. Lint, TypeScript, build e smoke **30/30**.
  Publicado em `f7f93e5`; Vercel Ready em `site-mods-7wn53yx9v-guizz1.vercel.app`.
- Smoke público pós-deploy do detalhe confirmou Download, Favorite, Share,
  especificações, recomendações e anúncios Adsterra presentes.
- O checkpoint documental `06ce9a4` está publicado; Vercel concluiu a
  implantação `site-mods-dlve1fxz3-guizz1.vercel.app` como Ready.
- Mercado Pago Production auditado somente por nomes/flags: live permanece
  `false`, `SITE_URL` aponta para `https://www.guizz.xyz` e os segredos estão
  server-only; não houve revelação nem mutação.
- CLS mobile fechado: após `43ab8e6`, a mesma medição passou de 0,487 para
  0,045; só `Most downloaded` ainda apareceu como deslocamento (0,045).
  Performance 74, FCP 0,9 s, LCP 31,1 s, TBT 60 ms, Speed Index 3,0 s e
  payload 11.088 KiB. Não reabrir layout/ads por essa execução.
- Smoke público final após a publicação confirmou home/marketplace/rodapé,
  sem skeleton preso, parede Anti-Adblock ou erros próprios no console.
- CLS mobile reproduzido em duas execuções (0,487) e corrigido localmente com
  placeholders/altura reservada para os oito trilhos da home. O ajuste não muda
  criativos ou Anti-Adblock; lint, TypeScript, build e smoke **30/30** passam.
  Publicar e medir novamente antes de avançar para outra otimização.
- Performance pós-deploy medida no mesmo perfil mobile: Performance 76, FCP 0,9 s,
  LCP 1,7 s, TBT 120 ms, CLS 0,487, Speed Index 4,1 s e payload 11.079 KiB.
  O commit `9a00d2e` prioriza apenas a primeira imagem do hero; lint,
  TypeScript, build e smoke **29/29** passaram e a implantação está Ready.
- A captura limpa não mostrou erro próprio; o CLS segue atribuído ao corpo/rodapé
  (0,312) e ao shell móvel (0,175), portanto não mudar Anti-Adblock ou anúncios
  sem uma medição mobile reproduzível.
- Decision batch complete: no Supabase Pro/custom-domain purchase; default HTTPS host remains source of truth. Added `docs/SECURITY_ROUTE_MATRIX.md` covering all API access, validation, body/page limits, timeouts, idempotency and remaining rate-limit/continuity gaps.
- Anti-Adblock stability batch complete: slow provider responses remain accessible until the 10-second slot timeout settles; no-fill `onload` is not treated as a blocker, while all-failed/all-timeout slots still trigger the existing wall. Dedicated gate test, lint, TypeScript, build and smoke 28/28 pass.
- Local batch complete: VIP offers now use 1/7/30-day plans (R$1,99/R$6,70/R$19,90); weekly is the requested R$6,70 anchor and monthly remains cheaper per day; legacy quarterly/yearly IDs remain database-compatible only for history.
- Local batch complete: protected-download ad hosts remount on user-driven Skip stage transitions, append a per-mount cache buster, and alternate approved horizontal units where available; the provider can still choose the same creative. Desktop mod detail now has a stable 400px, top-aligned sidebar and a wider content frame. Lint, TypeScript, build and smoke 28/28 pass.
- Local reliability batch complete: public `/api/health` liveness probe added, admin/catalog and VIP checkout failures now use the sanitized observability helper, and smoke coverage is 28/28. External monitor registration is still pending.
- Security gate complete: full and production-only `npm audit` both returned 0 vulnerabilities; keep the check in every release.
- Published in `d56a572` after applying `20260919_04_vip_plan_catalog.sql` in Supabase; Vercel production is Ready, public VIP/health/llms checks passed, and smoke is 28/28. Keep Mercado Pago live disabled and confirm Adsterra refresh policy before production billing.

## Latest checkpoint
- Supabase continuity: official docs confirm Free projects should use operator-run `supabase db dump` off-site; added `docs/SUPABASE_FREE_CONTINUITY_RUNBOOK.md` and `scripts/supabase-free-backup.ps1` (Git-ignored `backups/`). CLI is not installed here, so no dump/restore was claimed.
- Runbook commit `87e4d70` is published; Vercel deployment `site-mods-pfajvahff-guizz1.vercel.app` is Ready.
- Payment input hardening complete: checkout rejects declared/UTF-8 bodies over 1 KiB; Mercado Pago webhook rejects declared payloads over 256 KiB before external/database work. Focused payment tests 8/8, lint, TypeScript, build and smoke 28/28 pass. Distributed rate limiting remains intentionally unimplemented pending a real provider-backed requirement.
- Hotfix `d180f40` is published and Vercel deployment `site-mods-kpozoyq30-guizz1.vercel.app` is Ready.
- Supabase Free audit recorded: primary-only project, no read replicas, 0.00 GB displayed usage (2 GB panel limit), and no PITR/restore control/evidence visible in the read-only infrastructure view. No data was changed.
- Added `docs/MERCADO_PAGO_SANDBOX_MATRIX.md` with MP-01–MP-27 cases. It is a test plan, not completed sandbox evidence; execution requires Preview test credentials/payer configured outside chat. Live remains off.
- Documentation batch `bc6db16` is published; Vercel production deployment `site-mods-8iz6rt5hk-guizz1.vercel.app` is Ready.
- Latest deployment: `86aa1e6` is Ready at `site-mods-qblb0v0bk-guizz1.vercel.app`; public mod/detail QA passed with provider creatives visible and no own console warnings/errors.
- External gate audit: Supabase project is Free; Custom Domains require Pro plus US$10/month per domain. No paid upgrade, DNS change or production URL rotation was attempted.
- Supabase custom domain is now explicitly deferred by owner decision; do not treat it as a launch blocker unless the budget changes.
- Latest deployment: `d56a572` is live on `main`; public `/en/vip`, `/api/health` and `/llms.txt` were verified read-only after deployment. No real payment or entitlement was created.
- Public auth/VIP surface QA completed: Login and VIP are reachable, anonymous Favorites shows a safe empty/login-required state, and Settings redirects to Login. No product change was justified.
- Anti-Adblock QA completed in clean and blocked browsers: clean Adsterra iframes load without the wall; Edge with the blocker shows the premium wall, and retry does not bypass it. No product change was justified.
- Production security headers rechecked on pages and sensitive APIs. Required protections are present; COOP is recorded as a follow-up requiring OAuth popup testing, not a blind header change.
- Localized route matrix completed: home, search and all seven categories returned `200` in `en`, `pt` and `es`, with canonical paths preserved.
- Sitemap integrity completed: all 33 published canonical URLs returned `2xx` in a read-only production crawl.
- Historical release batch: the Next.js advisory was fixed by upgrading to `16.3.5`; the later full audit recheck is now clean.
- Consolidated launch status is recorded in `docs/RELEASE_READINESS.md`.
- Download navigation lint warning removed without changing signed-session authorization or external redirect behavior; final lint is clean and smoke remains 24/24.
- Post-deploy protected-download QA completed: detail ads rendered, all three stages appeared, skips reached “Ready to download”, and the external file was not opened.
- Compatible dependency maintenance completed: `npm update` stayed within existing ranges; the current build/lint/TypeScript/smoke and full npm audit are green.
- Public post-deploy smoke after the dependency refresh passed: home/detail `200`, admin anonymous `403`, and `llms.txt` remained plain text.
- Protected API edge probes passed: download/session `405/400/403`, download/open `403`, admin mods `403`, unsigned webhook `401/405`, and checkout intentionally `503 disabled`.

## In progress
- SEO/trust: metadata de categorias/busca, Open Graph, 404, `mash-up` no sitemap e alts específicos implementados e testados no smoke 25/25; manter regressões nas próximas rotas.
- Checklist de segurança: terceira lista incorporada ao mapa mestre; 205 commits e o working tree passaram por varredura de padrões de alta confiança sem matches. Próximo: completar matriz de validação/rate limit por rota; o npm audit atual está limpo.
- Mapa mestre de lançamento: `docs/MAPA_MESTRE_LANCAMENTO.md` consolida as duas checklists e as pendências históricas. Nova lista deve ser incorporada nele; a execução seguirá lotes completos, sem depender de vários comandos “próximo”.
- Plano integrado dos vídeos: `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md` agora registra corretamente a migração do host padrão do Supabase para um hostname próprio, além da homologação Mercado Pago e da checklist de 20 proteções. Próximo: escolher hostname/plano e configurar DNS, sem ligar checkout real.
- Performance/reliability hotfix: bypass Vercel Image Optimization for remote catalog media after the public endpoint returned `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`. Published in `b542e48`; public browser confirms direct remote image URLs and no own console errors. PageSpeed recheck is deferred until its API quota resets (current attempt returned 429).
- PageSpeed pós-deploy confirmou CLS 0,045; LCP segue volátil (1,7–31,1 s) por imagens/cache de terceiros. Manter o fallback direto e não iniciar CDN/loader sem decisão de custo.
- Public QA: clean-browser checks of home, Maps category, mod detail and `/llms.txt` passed after `b542e48`; no own console warnings/errors, cards/detail surfaces present, and root Markdown is served as `text/plain`.
- Download QA: anonymous protected flow reached the final “Ready to download” stage through all three countdowns without own console errors; external file navigation was intentionally not triggered.
- Verification: repaired two stale/under-isolated test assumptions; `auth-focus-flow` and `subcategories` now pass. The optional full fixture run remains unavailable until a temporary dependency tree with `react-test-renderer`, PGlite and the matching transitive versions is available.
- Release QA: public HTML and icon assets confirm the stable `/icon.jpg` favicon plus the PNG Apple touch icon; the earlier changing-tab-icon issue is closed.
- Release QA: public robots, sitemap and manifest are valid and reachable; private/API routes remain excluded from crawlers while all supported locale alternates are present.
- Security QA: production anonymous API probes match the intended contracts (`403` admin/open, `405` wrong session method, minimal `vip:false`), with `no-store`, `nosniff` and frame-deny headers.
- Legal QA: the 12 localized About/Privacy/Terms/Contact routes are public, titled correctly and contain no private credential/download fields.
- Planning: `docs/LAUNCH_MAP.md` and `docs/DIAGNOSTIC_LOTE0_2026-09-19.md` are complete. Lote 1 stability subset and the first Lote 2 homepage payload/query optimization are published; public PageSpeed remeasurement remains before further media/third-party work.
- Release: commit `6a4cd20` explicitly bypasses locale proxy rewriting for `/llms.txt`; local smoke is 22/22. Verify the Vercel deployment returns root Markdown as `text/plain` before the next performance batch.
- Performance: commit `79a36b7` publishes responsive Next/Image breakpoints. PageSpeed image-delivery opportunities measured 47 KiB mobile and 181 KiB desktop in the latest run; overall scores remain noisy, so the next work is reproducible CLS/console capture rather than another blind optimization.
- Ads/layout: desktop detail summary and responsive horizontal placements are published in `54f8874`/`3dda5c1`; public deployment verified.
- Theme: force the single dark palette regardless of browser preference. Published in `b1bf493`; local Edge light-profile check is dark and all validation passes.
- Ads/UX: premium AdBlock wall is published in `6778f83` with localized EN/PT/ES copy, strong backdrop blur and responsive actions. Focused gate test, lint, TypeScript, production build and smoke 20/20 pass; production domain responds normally in a clean browser.
- Launch gate: site-wide AdBlock wall plus silent-iframe fallback are published in `1565ba7`/`7ed908e`; production Edge, clean Chrome and public VIP-route checks pass. Keep unchanged for launch.
- Release: favicon metadata correction is validated locally; regular and shortcut browser icons now explicitly use `/icon.jpg` so the tab cannot fall back to a changing provider/deployment icon. Verify the already-published deployment when convenient.
- Ads: Anti-Adblock domain is approved and all five current Adsterra placements are already Active. The stale Codes warning references old unit IDs; local code now uses the regenerated `canvassanymorephotography.com` scripts. Commit is ready; await explicit push/deploy authorization.
- Release: UI audit follow-up is published in `9fba271`; monitor the Vercel deployment. Keep the VIP promo centered/fixed and the Technical Specifications companion ad square.
- Release: favorites/ad-surfaces batch is published in `23541c5`/`daab6a1`; monitor the resulting Vercel deployment. Keep the Technical Specifications ad square and the Mercado Pago live gate unchanged.
- Ads: visual cleanup batch is published in `bd47e6c`: stacked side rails no longer mount the 300×250 unit, category and Technical Specifications placements use horizontal responsive units, and ModViewer rails stretch with the page.
- Release: Vercel deployment generated from `2e18a69` is Ready; public mod/download smoke confirmed the protected countdown and VIP prompt; no external payment or credential changes.
- Release safety: keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`; Sandbox events cannot activate VIP.
- Documentation: keep `.work/` and `docs/auth-rollout.md` aligned with dashboard state after each external configuration change.
- Release: direct-DOM Adsterra mount is published in `07a156f`; clean-browser verification shows provider-created child iframes and visible creatives. Keep the existing VIP gate and cadence.

## Prioritized phases
1. P0 — Auth: Google, confirmation, Turnstile, generic errors, input/rate guards and controlled end-to-end verification are complete.
2. P0 — Supabase obrigatório: configurar/verificar hostname próprio (CNAME/TXT/certificado/callbacks) e depois executar RLS/functions, backup/restore e observabilidade conforme `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md`.
3. P0 — VIP: Mercado Pago PIX orders, signed/idempotent webhook, reconciliation and server-owned entitlement are complete; homologar todos os casos e keep live checkout gated.
4. P1 — VIP/discovery: VIP page, account status, download CTA and desktop navigation are complete.
5. P1 — Downloads: signed sessions, one-time nonce consumption, cross-site checks and mobile verification are complete.
6. P2 — Motion: existing fluid motion is complete and reduced-motion safe; extend only when a concrete surface needs it.
7. P2 — Next batch: preserve the existing ad cadence (10 items in categories, 8 mobile search), then review privacy/terms, observability and remaining mobile polish.

## Next batch — Lote 1 stability
- Capture/classify own versus third-party console errors and add a regression for slow/no-fill ads.
- Confirm the remaining PageSpeed contrast element after the targeted ad-label token correction; do not replace muted tokens globally.
- Re-run lint, TypeScript, production build, smoke, mobile/desktop visual checks and PageSpeed before publishing.

## Next batch — domínio Supabase + Mercado Pago
- Confirmar o hostname desejado e o plano Supabase Custom Domains versus Vanity Subdomain.
- Registrar o hostname, criar CNAME/TXT e aguardar certificado antes de alterar `NEXT_PUBLIC_SUPABASE_URL`.
- Executar a Fase 0.1: settings, RLS/functions, service-role boundaries, backup/PITR e ensaio de restore não produtivo.
- Executar a Fase 1 em sandbox: pedido PIX, webhook duplicado/ inválido/atrasado, timeout, reconciliação, expiração e reembolso.
- Não alterar `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` nem solicitar segredo no chat.

## Next batch — SEO e confiança
- Revisar alt text genérico e validar metadata após alterações de rota.
- Validar CTA na primeira dobra por rota e confirmar Search Console.

## Next batch — segurança de lançamento
- Repetir scanner especializado de segredos quando o pacote estiver disponível.
- Mapear validação/rate limit por rota, sem adicionar bloqueio distribuído sem necessidade demonstrada.
- Repetir a auditoria de dependências após o endpoint npm sair da manutenção.

## Next batch — Lote 2 performance
- When the PageSpeed quota resets, verify the direct-image fallback's transfer cost and repeat the error-audit detail. Do not re-enable Vercel transformations without a quota plan or owned image CDN.
- Capture a reproducible clean-browser console and layout-shift trace, separating app, Adsterra, YouTube and browser-extension messages.
- Re-run PageSpeed with the same profile after that trace; use the image-audit reduction as the current confirmed win, not the volatile headline score.
- Only then consider lazy-loading below-fold media/YouTube or deferring non-critical third-party work.
- Preserve above-the-fold hero, Adsterra detection, protected download and all current card counts.

## Completed recently
- Theme: removed the white default and media-query-only dark fallback from global CSS; `color-scheme: dark` now keeps the site dark in light browsers. Local production browser check and full validation pass.
- Ads/UX: redesigned the site-wide AdBlock wall as a compact premium security modal with a blue-to-gold VIP CTA, reload action, responsive mobile layout and localized copy. Detector behavior remains unchanged; build and smoke 20/20 pass.
- Stability: added a root `public/llms.txt` resource with a smoke regression, reserved stable inline ad-slot heights, and added a proxy pass-through so late locale routing cannot turn the root asset into HTML. Lint, TypeScript, production build and smoke 22/22 pass; published in `6a4cd20`.
- Performance: bounded all homepage catalog selections to card fields and started latest/trending/category queries in parallel; added a regression test. PageSpeed remeasurement awaits the public deployment.
- Performance: matched Next/Image device and image sizes to the rendered mobile breakpoints; lint, TypeScript, production build and smoke **24/24** pass. Latest PageSpeed image audit reports 47 KiB mobile and 181 KiB desktop opportunity, with headline scores varying across runs.
- Release: published Anti-Adblock scripts in `03b8f73`; pinned the regular/shortcut favicon to the stable GuizzMods logo and added a smoke regression assertion. Lint, TypeScript, build and smoke 20/20 pass locally; favicon follow-up is not published yet.
- Ads: verified the Adsterra Websites page read-only, found all five `guizz.xyz` placements Active, replaced the pre-approval script origin in `AdsterraSidebar`, and added a regression test. Focused tests, lint, TypeScript, production build and smoke 20/20 pass locally.
- UI audit: fixed the post-animation VIP notice offset on desktop/mobile, centered the detail-page square ad, improved the main media/info grid sizing, and added a regression assertion. Build, focused tests and smoke 20/20 pass; published in `9fba271`.
- Ads/favorites: restored the Technical Specifications 300×250 placement, made the download VIP notice fixed-until-dismissed, added persistent favorite hearts across catalog cards, and synchronized rounded palette frames for Adsterra units. Lint, TypeScript, production build and smoke 20/20 pass locally; publish is the next action.
- Ads/home: removed the square side creative, converted category and Technical Specifications placements to horizontal units, added side-rail page-height containment, restored independent latest-category queries (including skins), and changed the download VIP notice to a slide-in animation. Focused ad/download tests and smoke 20/20 pass locally.
- Ads: centralized placement shells across home, category, search, mod detail and download flow; removed duplicate labels/box framing and the equal-height sidebar shell that prevented sticky behavior. The stacked right column now keeps only the 160×600 rail sticky and leaves the 300×250 creative below it; production deep-scroll verification passes.
- Ads: direct-DOM Adsterra correction published in `07a156f`; clean in-app browser verification showed visible 160×600 and 300×250 creatives without nested `srcDoc` frames.
- Ads: replaced the nested `srcDoc`/sandbox snippets with direct page-DOM hosts so `invoke.js` runs in the top-level context; focused test, lint, TypeScript, production build and smoke 20/20 passed. No provider setting or payment configuration changed.
- VIP/ads: o gate agora agenda nova consulta ao vencer `expiresAt`, fazendo anúncios reaparecerem em páginas abertas sem recarga; validação completa 85/85, lint, TypeScript e build passaram. Publicado em `e174427`.
- Release: pós-sincronização do mapa, lint, TypeScript e smoke da aplicação foram confirmados; smoke final 20/20 após repetir fora do sandbox por restrição de processo. Nenhuma configuração externa ou pagamento foi alterado.
- Supabase: Attack Protection was rechecked in production; Turnstile is enabled, while leaked-password protection is explicitly disabled on the current Free plan. No external setting was changed; upgrade is the only path if this optional control becomes mandatory.
- Download security: session creation now rejects explicit cross-site Fetch Metadata/origin signals before any database access; compatibility for missing headers is preserved. Full suite 85/85, lint, TypeScript, build and smoke 20/20 pass; commit `2e18a69` is published to `origin/main`.
- Release: production deploy from the security batch is Ready and the latest deployment page renders normally in a read-only smoke check.
- Release: anonymous production mod smoke reached the protected download flow; timer gating and VIP prompt behaved as designed without ad clicks or external handoff.
- Auth: cadastro, confirmação de e-mail, retorno oficial, sessão autenticada, página VIP, configurações protegidas, login por senha, entrega do e-mail de recuperação e redefinição final com senha digitada pelo usuário verificados com uma conta de teste. Nenhum segredo foi capturado pelo agente.
- Auth: verificação somente leitura no painel de produção confirmou Google, confirmação de e-mail, Turnstile e allowlist de callbacks; o teste ponta a ponta com caixa controlada também foi concluído, sem alteração externa.
- Release: suíte completa corrigida e validada após dois achados de lint; 84/84 testes, lint, TypeScript, build de produção e smoke 20/20 passaram. QA somente leitura confirmou Google/Turnstile/cadastro no domínio oficial. Nenhuma configuração de pagamento foi alterada.
- VIP: plano ativo agora prioriza status/gestão da conta e oculta checkout duplicado no resumo; teste focado adicionado sem alterar entitlement server-side.
- Ads/VIP: slots simultâneos compartilham a consulta de entitlement para o mesmo token, reduzindo chamadas repetidas sem mudar a autorização server-side; teste focado adicionado.
- Auth: removida consulta pública de configurações do Supabase para descoberta do Google; autorização real permanece no provedor, documentação alinhada e teste de regressão adicionado. 11 testes de autenticação, smoke 20/20, lint, TypeScript e build passaram.
- Downloads/privacidade: auditoria confirmou nonce único, assinatura, prazo, origem e destino permitido; host específico do Supabase removido da documentação pública; fixtures de acesso alinhados ao observability. Testes de acesso/privacidade, smoke 20/20, lint, TypeScript e build passaram.
- Privacidade de contato: canais públicos revisados sem e-mail pessoal, `mailto:` ou URL do Supabase; links externos agora omitem o referenciador. Teste focado, smoke 20/20, lint, TypeScript, build e diff check passaram.
- VIP: retorno do checkout mostra aviso seguro mesmo sem modo ativo, sem insinuar ativação de benefício; textos nos três idiomas, teste focado, smoke 20/20, lint, TypeScript, build e diff check passaram.
- VIP: textos de disponibilidade no topo e nos planos agora refletem corretamente pré-lançamento, teste PIX ou pagamento PIX; teste focado, smoke 20/20, lint, TypeScript, production build e diff check passaram.
- Acessibilidade de autenticação: troca de modo restaura o foco no e-mail e anuncia a tela atual; teste focado, lint, TypeScript, production build e diff check passaram.
- Autenticação: campos de senha no login, cadastro e recuperação agora têm Mostrar/Ocultar localizado e acessível; teste focado, lint, TypeScript, production build e diff check passaram.
- Privacidade de erros: busca/catálogo e compartilhamento deixaram de registrar exceções brutas; busca ganhou retry localizado e Mercado Pago registra apenas classe sanitizada. Foco, smoke 20/20, lint, TypeScript, build e diff check passaram.
- Download mobile: placeholder retangular responsivo abaixo de 360 px evita rolagem horizontal; teste focado, lint, TypeScript, production build e diff check passaram.
- Mobile navigation: scroll listener is mounted once with a ref-backed position and redundant visibility updates are skipped; focused test, lint, TypeScript, production build and diff check passed.
- Observabilidade: falhas inesperadas em auth, VIP e downloads agora registram apenas rótulos sanitizados; teste dedicado, lint, TypeScript, build e diff check passaram. Scanner Claude Flow indisponível offline.
- Privacidade/termos: textos en/es/pt agora descrevem Google OAuth, confirmação de e-mail, Mercado Pago PIX, ausência de armazenamento de credenciais e ativação server-side do VIP; lint, TypeScript e diff check passaram.
- E-mail confirmation: Supabase now requires confirmation for new password signups; callback/template/allowlist were checked first. Google remains independent, CAPTCHA and provider limits unchanged.
- Auth input hardening: centralized e-mail normalization and username validation before signup, reset, sign-in and confirmation resend. Full suite 84/84, lint, TypeScript, production build and diff checks pass; provider CAPTCHA and rate limits remain the server boundary.
- VIP desktop discovery: added a localized, accessible header CTA with reduced-motion-safe styling while retaining the mobile navigation entry. Full suite 83/83, lint, TypeScript, production build and diff checks pass. Commit `527109e` is pushed and Vercel is Ready.
- Consolidated release hardening: created `docs/CODEBASE_MAP.md`, linked the architecture overview from `AGENTS.md`, validated signed download-token shapes, rejected present cross-site download opens before nonce consumption, and unified DownloadFlow cleanup. Full suite 82/82, lint, TypeScript, production build and diff checks pass. The external cartographer scanner was unavailable offline.
- VIP status recovery cooldown: repeated live provider lookups are bounded to one per user per 30 seconds with bounded cleanup; entitlement remains fail-closed. Full suite 80/80, lint, TypeScript, production build and diff checks pass. External Claude Flow scan was unavailable offline. Commit `f3a4fd2` is pushed and Vercel Production is Ready.
- Download UX return-sync: stage/final deadlines now reconcile after `pageshow` or visible-tab changes, with expired sessions cleared locally while server authorization remains unchanged. Full suite 79/79, lint, TypeScript, production build and diff checks pass. Commit `407b53a` is pushed and Vercel Production is Ready.
- `total_paid_amount` phase: commit `d73444b` completed the phase; focused tests 7/7, lint, TypeScript, and `git diff --check` pass. Mercado Pago Live remains disabled; deployment/readiness follow-up is complete.
- Mercado Pago reconciliation hardening: commit `deeab76` adds the admin-only timeout recovery endpoint, PIX/provider-binding proofs, a checked service-role-only RPC wrapper, and a bounded deadline. Supabase migration applied and verified; focused 17/17 and full 71/71 tests pass; Production deployment is Ready.
- Search stale-response hardening: query/filter versions now prevent an older Supabase response from overwriting the latest search; lint, TypeScript, build, and full 71/71 suite pass.
- Category pagination resilience: public category pages now recover from transient page errors without skipping the cursor or hammering Supabase; localized retry feedback is available for initial and incremental loads. Lint, TypeScript, build, diff checks, and full 71/71 suite pass.
- Homepage catalog discovery: recent category rails now expose localized “View all” links to the complete catalog; horizontal controls have localized accessible labels.
- Homepage category coverage: all six category shortcuts now have matching latest-item sections when data is available, using the existing latest-50 bounded home query.
- Release hardening: Mercado Pago webhook manifest normalization and download-session input limits were committed as `5dc34f8` and pushed to `origin/main`. Focused tests 3/3, lint, TypeScript and diff checks pass; subsequent production readiness verification is complete and Mercado Pago Live stays disabled.
- Release hardening: normalized Mercado Pago Order `data.id` for documented HMAC verification; bounded and validated public download-session request bodies. Focused tests 3/3, lint, TypeScript and diff checks pass; no external settings or production payment state changed.
- Mercado Pago authenticated/allowlisted TEST PIX checkout + localized VIP button/return notice. Server plan/amount/origin and response testMode/price/externalId/URL guards. Orders and signed webhook remain server-owned; Sandbox events never grant VIP. Focused tests, lint/build and smoke PASS. Setup: docs/mercadopago-payments.md.
- Site motion: route opacity220ms, opt-in actual card/image/panel effects, fine-pointer hover, reduced-motion support. Independent lifecycle test,lint,production build and14 smoke tests passed2026-09-16. No remount/key, no invisible SSR state, no added network or ad logic.
- Download video refinement and robustness: three8s Skip stages, blue/green-ready glow, final cover/countdown, expiry/15s timeout/per-mod cookie/preflight. Independent review, final lint/build and14 smoke tests pass2026-09-16; isolated controller/ad/cookie/open-route tests pass. Preview removed from build.
- VIP preview merged with install manifest/icons/buttons, desktop/mobile navigation and allowlisted login/signup return. Build, lint, 14 smoke and 7 auth/category tests pass.
- Blue download experience and five Adsterra units integrated; isolated timing/cancel/redirect/ad width tests pass.
- Temporary download-preview route removed.

## Current cleanup gate

- [x] Delete preview deployment `DgBvJcAiWLgA6D9CHpPTwvGhkcPX`, the five `abacatepay-test` Preview variables (`MERCADOPAGO_TEST_SITE_URL`, `MERCADOPAGO_TEST_USER_IDS`, `MERCADOPAGO_TEST_PAYER_EMAIL`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_TEST_CHECKOUT_ENABLED`), and remote branch `abacatepay-test` after confirmation.
- [x] Keep production Vercel domains, production deployments/retention, Mercado Pago Production variables, Supabase project/migrations/Auth users, and all active application keys.
- [x] Verify no Supabase Edge Functions, Storage buckets, Vercel integrations or Vercel Storage resources exist to discard.

## Next / external verification
- Current Production deployment `B6UBP1b5Ph7fQm5eSCSkQ4RdkQ7F` is Ready with the corrected Production Mercado Pago token and signing secret. A live monthly PIX ticket is open for manual user action; no payment has been confirmed.
- After the user’s decision on that ticket, disable `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` unless ongoing live checkout is explicitly requested; then verify webhook/order reconciliation and VIP activation only after a confirmed payment.
- Configure Mercado Pago Production manually when the Live credential, production products, and signed webhook are available; verify the full flow before enabling live checkout or VIP activation.
- Google OAuth smoke passed on the latest Preview with the support alias; session returned to the official domain. The stable branch-alias callback is now allowlisted for direct return testing; still verify sign-out, expired callback and locale/VIP return before rollout.
- If billing is resumed later, perform a separately authorized production Mercado Pago setup and webhook verification; do not reuse Sandbox events or secrets for benefits.
  - Historical note superseded: the Next.js advisory was fixed at 16.3.5 and the later npm audit recheck returned 0 vulnerabilities.
- Supabase function/search-path and SECURITY DEFINER hardening is complete; only the optional Free-plan leaked-password warning remains.
- Supabase function hardening complete: search paths pinned and SECURITY DEFINER execution restricted by `20260916_05_harden_public_functions.sql`; advisors now show only the Free-plan leaked-password warning. Upgrade to Pro if leaked-password checks are required.
- VIP desktop visibility polish complete: compact sidebar VIP entry now has a blue label/halo with reduced-motion fallback.
  - The older zero-advisory note is superseded by the 2026-09-19 recheck; use `docs/RELEASE_READINESS.md` as the current source of truth.
- Turnstile hostname coverage and Supabase CAPTCHA enforcement are complete for the production auth rollout; random Preview hostnames remain intentionally unsupported.
- Production rollout complete: `main` at `9e99af6`, official-domain login verified read-only, PIX checkout guard unchanged.
  - Security review: application/API probes are green and dependency audit is clean. The optional offline Claude Flow scanner remains unavailable.
- Regression gate refreshed: lint, TypeScript, and all 14 smoke tests pass with the approved local process-spawn environment.
- Production checkout preparation published: explicit live gate, official-origin allowlist, PIX-only payload, non-test metadata, and localized payment copy are on `main`. No live secrets, products, webhook, or payment were configured; keep the live flag disabled until the human Production handoff.
- AbacatePay integration removed from the application. Commit `44dbf8a` is on `abacatepay-test` and `main`; Production deployment `G6AAPbobUh51R7skKU8JGUvkQ5Cp` is Ready with live checkout still disabled. Stale Preview deployments were pruned, leaving only `DgBvJcAiWLgA6D9CHpPTwvGhkcPX`. All 15 obsolete Vercel variable rows were deleted after confirmation; Mercado Pago, Supabase, Turnstile, and download variables remain.
- Mercado Pago is now the sole provider: Checkout Transparente Orders PIX adapter, sandbox payer validation, server-side order verification, signed Order webhook and focused tests. Preview test credentials remain scoped to the test branch; no live payment is enabled.
- Password baseline complete: Supabase now rejects passwords shorter than 8 characters; recovery compatibility preserved.
- Google button resilience complete: transient settings/CORS failures no longer hide the provider on Preview; Supabase remains the source of truth at authorization time.
- Stable Preview OAuth callback allowlisted in Supabase (`site-mods-git-abacatepay-test-guizz1.vercel.app/auth/callback`) for direct branch-alias validation; production URLs unchanged.
- Best-effort anti-adblock notice added for non-VIP ad surfaces; detection is client UX only and never replaces server-side download/entitlement checks. Build/lint/smoke pass on `9747e91`.
- User review merged VIP. No payments or actual benefits active.
- Protected download verified on the official domain: anonymous three-step flow, VIP prompt, timed skips, and same-tab Terabox handoff all worked without clicking ads. Real ad fill quality remains vendor-dependent and was not interacted with.
- Responsive production QA passed at 390×844: mod media, title, Download action, utility controls, and bottom navigation fit without visible clipping. No real download/ad fill was triggered during unattended QA.
- Real email auth return and physical app installation not tested.
- Google AdSense legacy metadata/component removed; active advertising is Adsterra-only.
- Anti-adblock guard implemented as best-effort messaging with retry and VIP exemption in `AdPlaceholder`/`VipAdGate`; it does not replace server-side download authorization.
- Download VIP prompt and active entitlement UI completed: `DownloadFlowView` hides the promo for VIP and after scroll/dismissal; `VipExperience` reads `/api/vip/status` and displays active plan/expiry. `npm run lint`, `npx tsc --noEmit`, production build and smoke14 pass.
- Account settings VIP card completed locally: `src/app/[locale]/settings/page.tsx` reads `/api/vip/status` with the user bearer token and exposes active expiry or a localized upgrade CTA; Settings password strings now state 8 characters in every locale. Lint, TypeScript, production build, and smoke14 pass; commit/push and Preview validation remain next.
- Provider selected: Mercado Pago Orders API with PIX only. Preview test checkout is authorized; production remains disabled until a separate live credential/webhook handoff. Never grant VIP from client state or a return URL.
- Confirm database invoker migration only when relevant; no production verification yet.

## Backlog
- Home category sections derive from latest 50 records; dedicated category pages paginate full catalog.
# Lote atual — CLS da home (concluído)
- **Concluído:** removidos os skeletons instáveis das categorias vazias; a home
  mantém somente a primeira rail com dimensões idênticas aos cards reais.
- `npm test` **30/30**; commit `fb005e6` publicado e Vercel Production **Ready**.
- Produção medida em 390px e 1920px: primeira rail não muda de posição/altura na
  transição loading→dados. Detalhe e anúncios não sofreram alteração.
- PageSpeed `g95wipoe2l`: mobile Performance 74 / CLS 0,037; desktop
  Performance 62 / CLS 0,261. O desktop restante é atribuído ao bloco de
  instalação abaixo das rails e ao tempo variável de terceiros; não há falha
  funcional reproduzida.
