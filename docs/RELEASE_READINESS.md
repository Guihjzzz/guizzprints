# Prontidão para lançamento — GuizzMods

Atualizado em 20/09/2026.

## Importação automática do Minecraft Marketplace — 20/09/2026

- O formulário administrativo agora aceita uma URL oficial de item do
  Marketplace e busca no servidor o título, descrição, thumbnail, screenshots
  e trailer do YouTube; o operador só precisa revisar e informar o Terabox.
- A origem fica privada em `mods.source_url`/`source_provider` e não entra na
  view pública. A migration `20260920_06_minecraft_marketplace_sources.sql`
  foi aplicada no projeto Supabase Production (resultado: Success, 0 rows).
- A rota autenticada `/api/admin/minecraft` aceita somente HTTPS de
  `minecraft.net` e consulta a API pública oficial do catálogo (o parser HTML
  bounded permanece coberto para fixtures). O cron `/api/cron/sync-minecraft` atualiza até 10 itens
  antigos por dia; `CRON_SECRET` foi salvo como Secret em Vercel Production.
- Vercel Hobby inclui cron diário sem plano pago; `vercel.json` e o código estão
  publicados em Production. A origem continua privada e o Terabox manual.

## Última validação de publicação — 20/09/2026

- A correção do adaptador Mercado Pago Sandbox foi publicada no commit
  `2c840f2` após resolver um erro de estreitamento TypeScript no primeiro
  deploy. A Vercel está **Ready**; o domínio oficial respondeu `/api/health`
  `200` e `/en/vip` `200`.
- O checkout Sandbox passou **8/8** e a suíte completa passou **30/30**.
  Retries aceitam somente o valor Sandbox configurado ou o total comercial
  server-owned da mesma ordem/plano; referência, método PIX, status e URL
  continuam obrigatórios.
- A validação inicial não pagou tickets; depois do handoff comercial, o
  proprietário liquidou o PIX live semanal de R$6,70. A página VIP autenticada
  confirmou o entitlement semanal ativo até 27/09/2026.

## Handoff comercial — 20/09/2026

- O Mercado Pago exibiu credenciais de produção e a URL oficial do webhook;
  valores sensíveis não foram copiados nem expostos.
- `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` foi salvo em Production. O
  redeploy `BELHhJSNgp4TNHcbYcbK3YTMh8sA` ficou **Ready** e os probes públicos
  `/api/health` e `/en/vip` responderam `200`.
- O simulador de notificações foi executado contra a URL de branch e a URL
  oficial e retornou `401` em ambos os casos. A resposta é esperada para esse
  simulador porque ele não envia a assinatura HMAC necessária ao endpoint
  fail-closed; não representa pagamento, webhook assinado ou entitlement.
- Uma ordem PIX live semanal de R$6,70 foi criada com autorização explícita e
  paga pelo proprietário. A página VIP autenticada confirmou o entitlement
  ativo até 27/09/2026; nenhum código/ID/hash do ticket foi registrado.
- O caminho de liquidação/webhook e concessão server-side foi observado uma vez.
  Replay, expiração, reembolso e reconciliação administrativa permanecem como
  casos de manutenção; não criar outra cobrança real para validá-los.

## Pronto e verificado

- Catálogo, busca, categorias, detalhe, favoritos e navegação responsiva.
- Tema escuro único em navegadores claros e escuros.
- Anti-Adblock reproduzido: navegador limpo carrega Adsterra; bloqueador ativo recebe a parede premium; retry não contorna o bloqueio.
- Download protegido por sessão/nonce; fluxo anônimo percorre as três etapas sem abrir o arquivo externo.
- Login Google/email, confirmação, recuperação, Turnstile e configurações protegidas.
- VIP público para descoberta, com entitlement server-side; checkout Mercado Pago
  live está habilitado em Production e o primeiro PIX supervisionado já foi
  liquidado pelo proprietário.
- Páginas legais, robots, sitemap, manifest, ícones e `llms.txt` verificados em produção.
- Cabeçalhos de segurança presentes em páginas e APIs sensíveis.
- Todas as 33 URLs do sitemap e as 27 combinações de catálogo/locales retornaram `2xx`.
- QA público de SEO/CTA confirmou home, busca, Maps e VIP com títulos próprios,
  ações iniciais acessíveis, cards reais e alts descritivos; o smoke local
  repetido passou **30/30**.
- A matriz automatizada de segurança passou **2/2**: as 9 rotas `/api` têm
  cobertura documental e `Cache-Control: no-store`; não há mudança de código
  pendente nesse gate.
- O deploy de ativação `BELHhJSNgp4TNHcbYcbK3YTMh8sA` foi confirmado como
  **Ready** em `site-mods-lwex096a5-guizz1.vercel.app`. Em produção, `/api/health`
  respondeu `200` com JSON mínimo e `X-Robots-Tag: noindex, nofollow,
  noarchive`; `robots.txt`, `sitemap.xml`, `llms.txt` e `/en/vip` responderam
  com os tipos públicos esperados.
- A auditoria de dependências desta rodada retornou **0 vulnerabilidades** em
  `npm audit --omit=optional --audit-level=high`; a revisão dos arquivos
  rastreados não encontrou valores de tokens, chaves privadas ou segredos.
- A validação completa desta rodada passou no build Next.js/TypeScript e no
  smoke **30/30**; a matriz formal cobre todas as 9 rotas e fecha o gate de
  validação de entradas sem mudança de código.
- Search Console: a propriedade final `https://www.guizz.xyz/` foi verificada
  por metatag e o sitemap foi enviado nela. Na rechecagem de 20/09, o painel
  ainda exibe “Não foi possível buscar o sitemap” (0 páginas), embora o endpoint
  público responda `200 application/xml` com `X-Matched-Path: /sitemap.xml`.
  Isso permanece uma pendência de coleta do Google, não uma falha reproduzida
  no site; não reenviar nem alterar o sitemap sem evidência nova.
- O fluxo protegido de Download foi endurecido contra cookies de estado antigo:
  a sessão só é reutilizada quando o estado VIP coincide com o entitlement
  atual. VIP ativo pula a espera e revogação volta a exigir espera; teste
  focado **7/7**, lint, build e smoke **30/30**.
- Build, lint sem avisos, TypeScript e smoke oficial 28/28 passam após o upgrade de segurança do Next.js para 16.3.5.
- QA pós-deploy confirmou o detalhe e as três etapas do download protegido, com anúncios presentes e sem erros próprios no console; o arquivo externo não foi aberto.
- Manutenção de dependências dentro das faixas existentes passou em build, lint, TypeScript e smoke; Next.js continua na versão segura 16.3.5 e o `npm audit` completo retornou 0 vulnerabilidades.
- O deploy dessa manutenção foi verificado publicamente: home/detalhe `200`, API administrativa anônima `403` e `llms.txt` em texto puro.
- Probes de borda confirmaram rejeição de métodos, tipos, requests cross-site,
  admin anônimo e webhook sem assinatura; o checkout live só é oferecido após
  sessão autenticada e o webhook permanece fail-closed (`401` sem HMAC).
- `/api/health` está disponível como sonda pública mínima, sem cache, sem indexação e sem consultar dependências externas.
- Falhas de catálogo administrativo e checkout agora passam pelo logger sanitizado compartilhado, sem dados de usuário/provedor nos logs.
- Erros de favoritos também usam copy localizada genérica; a mensagem bruta do
  Supabase não chega ao navegador e o teste dedicado de privacidade passa.
- O smoke público pós-deploy de detalhe após `f7f93e5` confirmou as ações
  principais, especificações, recomendações e os placements Adsterra configurados.
- As rotas `/api/*` enviam `X-Robots-Tag: noindex, nofollow, noarchive`,
  confirmado pelo smoke e pela consulta pública de `/api/health`; páginas
  públicas não recebem essa restrição.
- O Vercel Production mantém `MERCADOPAGO_SITE_URL` apontando para o domínio
  canônico e `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true`; tokens e segredo do
  webhook permanecem server-only.
- A trava `npm run test:client-security` verifica automaticamente que arquivos
  `use client` não referenciam tokens Mercado Pago, service role ou segredos de
  webhook/download.
- A suíte local simulada do Mercado Pago passou checkout/webhook/reconciliação
  **24/24** e a suíte VIP **10/10**; isso não substitui o ensaio ponta a ponta
  em Preview com payer de teste.
- O Preview da Vercel recebeu o token de teste server-only, a flag
  `MERCADOPAGO_TEST_CHECKOUT_ENABLED=true`, um payer `@testuser.com`, o UUID
  da conta GuizzMods de teste e `MERCADOPAGO_WEBHOOK_SECRET`; o deploy ficou
  Ready. O modo de teste do Mercado Pago está com o evento Order apontando para
  `https://site-mods-git-main-guizz1.vercel.app/api/vip/webhook/mercadopago`.
  Production usa somente credenciais live e a flag comercial ligada; nenhum
  valor de Sandbox é lido pelo checkout live.
- Como o Mercado Pago não autentica em uma implantação Vercel protegida, o
  domínio de branch de Preview recebeu uma exceção pública específica e fica
  acessível durante a homologação. O domínio oficial não foi alterado.
  `/api/health` respondeu 200 e o webhook sem assinatura respondeu 401
  externamente.
- A homologação Sandbox já abriu, no Preview `site-mods-926eus9eh-guizz1.vercel.app`,
  um ticket PIX do plano Semanal (R$6,70) com QR/código de teste usando uma
  conta sem entitlement. Isso comprova o caminho autenticado e a criação do
  checkout (MP-09); não houve pagamento, webhook de liquidação ou ativação de
  VIP. O callback adicionado ao Supabase é específico desse hostname.
- A validação adicional da conta no painel do Mercado Pago foi concluída pelo
  operador. O painel e as credenciais de teste voltaram a ficar acessíveis.
- Após a validação, o Preview gerou um ticket PIX Sandbox válido para Semanal
  (R$6,70), sem pagamento, webhook de liquidação ou ativação VIP.
- Registro histórico: Diário (R$1,99) e Mensal (R$19,90) chegaram a retornar
  `502 provider_invalid` quando uma ordem Sandbox pré-existente tinha total
  diferente do valor configurado. A causa foi confirmada na documentação
  oficial: o Sandbox PIX por Orders usa uma order pré-definida, com valor de
  teste e `payer.first_name=APRO`.
- O adaptador publicado em `2c840f2` aceita a quantia Sandbox configurada ou o
  total comercial server-owned da mesma ordem/plano no retry, sem relaxar a
  referência, método, status ou URL. A lacuna que continua é o evento oficial
  assinado de liquidação e a reconciliação; não pagar tickets de Sandbox. O
  primeiro PIX live já foi executado de forma supervisionada e concedeu o VIP.

## Pendências externas, sem correção cega

1. Repetir `npm audit` em cada release; a verificação atual completa (produção e desenvolvimento) retornou 0 vulnerabilidades.
2. PageSpeed foi reexecutado após o ajuste de CLS no relatório `g95wipoe2l`
   (20/09/2026): mobile marcou Performance 74, FCP 0,9 s, LCP 24,8 s,
   TBT 30 ms, CLS **0,037** e payload 11.160 KiB; desktop marcou Performance
   62, FCP 0,3 s, LCP 7,0 s, TBT 50 ms, CLS **0,261** e payload 11.165 KiB.
   A medição própria confirmou que a primeira rail mantém a posição e a altura
   em 390px e 1920px antes/depois dos dados. O CLS desktop restante aponta para
   o bloco de instalação abaixo das rails (0,136 + 0,124), com LCP/anúncios de
   terceiros voláteis; não há falha visual reproduzida e não se deve alterar os
   anúncios ou o layout aprovado sem nova meta.
3. Se for desejado adicionar `Cross-Origin-Opener-Policy`, testar antes o popup e callback do Google OAuth.
4. O handoff comercial já ligou `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` em
   Production e o primeiro PIX live supervisionado foi concluído. Manter a
   reconciliação e os ensaios de replay/expiração sem gerar novas cobranças.
5. Manter `docs/MAPA_MESTRE_LANCAMENTO.md`, `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md`, `docs/MERCADO_PAGO_SANDBOX_MATRIX.md`, `docs/SUPABASE_FREE_CONTINUITY_RUNBOOK.md` e `docs/SECURITY_ROUTE_MATRIX.md` coerentes: host padrão do Supabase sem novo plano, workflow gratuito `.github/workflows/health-check.yml`, preferências de notificação opcionais e backup/restore adiado pelo proprietário. Search Console já está verificado no host final; rechecagem do fetch do sitemap é opcional. As execuções manuais `35479199762` e `GuizzMods health check #2` passaram; alertas nativos da Vercel exigem Pro e não serão contratados.
6. A auditoria de segurança local está fechada: matriz por rota, varredura de
   cliente e `npm audit` passaram. O scanner especializado foi reexecutado, mas
   continua indisponível porque o pacote não está no cache npm offline; não foi
   instalado um pacote novo nem há pendência funcional.

## Critério de lançamento

O site está tecnicamente pronto para lançamento público sem contratar plano
novo. Os itens restantes são melhorias/rotinas externas — rechecagem do CLS e
Search Console, preferências de alerta, restore futuro, carga em Preview e uma
eventual fixture assinada do Sandbox — e não falhas funcionais reproduzidas.
