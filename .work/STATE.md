# Checkpoint — 2026-09-21 — importação Marketplace disponível na edição

## Current checkpoint — editor reutiliza a importação oficial

- Corrigido `src/app/[locale]/upload/page.tsx`: o bloco “Importar do Minecraft
  Marketplace” não fica mais condicionado a `!isEditing`, então aparece ao
  editar texturas e qualquer item do catálogo.
- Ao abrir edição, `source_url` existente preenche o campo; buscar novamente
  atualiza título, descrição, trailer, imagens e metadados antes de salvar.
  Terabox continua manual e o servidor preserva o estado de sincronização
  quando a mesma origem é mantida.
- Teste de integração estrutural adicionado; build e suíte passaram **33/33**.
- Commit `657a5b5` publicado em `main`; o deploy da Vercel foi disparado.

**Próxima ação exata:** no painel autenticado, abrir um item existente, conferir
o bloco e buscar os dados do Marketplace antes de salvar; o fluxo público não
foi alterado.

# Checkpoint — 2026-09-21 — detecção de idioma ativada

## Current checkpoint — idioma do navegador aplicado ao primeiro acesso

- `src/i18n/routing.ts` agora usa `localeDetection: true`: `/` respeita a
  preferência salva pelo next-intl e o cabeçalho `Accept-Language` para `pt`,
  `es` ou `en`; URLs explícitas (`/en`, `/pt`, `/es`) continuam vencendo.
- Fallback para idioma não suportado continua em inglês. O idioma escolhido em
  Settings segue podendo ser persistido pela preferência do usuário.
- Teste de integração adicionado para `pt-BR`, `es-ES` e URL explícita; build e
  suíte passaram **32/32**.
- Commit `fb955af` publicado em `main`; produção confirmou `Accept-Language:
  pt-BR` redirecionando `/` para `/pt`.

**Próxima ação exata:** manter as URLs explícitas em links compartilhados e
acompanhar apenas se algum navegador enviar uma preferência inesperada.

# Checkpoint — 2026-09-21 — imagem responsiva e cache publicados

## Current checkpoint — PageSpeed mobile confirmou ganho potencial

- As abas abertas no Chrome foram conferidas: PageSpeed mobile atual **84**,
  LCP **4,4 s**, CLS **0,037**, com estimativa de **709 KiB** em entrega de
  imagens e **307 KiB** em cache. A documentação oficial do Chrome recomenda
  imagens responsivas e pelo menos 30 dias de cache para recursos estáticos.
- Causa confirmada: `OptimizedImage` envia uma única variante remota (hero até
  1280px e cards até 480px), mesmo quando o celular exibe aproximadamente
  158–386px. `/api/asset` usa `max-age=86400`; `/logo.jpg` é 49 KB e responde
  `must-revalidate, max-age=0`.
- `src/lib/media-image.ts` + `src/components/OptimizedImage.tsx` agora entregam
  `picture/srcSet` responsivo com alturas proporcionais; `/api/asset` tem cache
  de navegador de 30 dias e CDN de 1 ano; assets locais estáveis seguem o mesmo
  TTL. Nenhum anúncio, animação ou layout foi alterado.
- Commit `1324c2f` publicado em `main`; produção confirmou os novos cabeçalhos.
  `npm test` passou **31/31**.
- PageSpeed mobile novo (21/09 10:23): imagem entregue caiu de **797,5 KiB
  para 427,6 KiB** e a economia estimada caiu de **708,7 para 310 KiB**; o
  cache deixou de aparecer como auditoria pendente. O score variou para 74 e o
  LCP para 6,0 s nesta execução, portanto não atribuir essa oscilação à mudança;
  o teste confirma ganho de bytes, não uma garantia de LCP.
- Ainda há uma imagem remota específica que responde 413 por exceder o limite
  de 8 MB; o fallback preserva a página e isso é independente desta otimização.

**Próxima ação exata:** não alterar layout; se necessário, tratar em lote a
imagem remota acima de 8 MB e depois medir com mais de uma execução para reduzir
a variação do PageSpeed.

# Checkpoint — 2026-09-20 — importação Marketplace Minecraft publicada

## Current checkpoint — importação via API oficial e sincronização automática

- O formulário `/en/upload` aceita o link oficial de um item do Minecraft
  Marketplace, consulta a API pública oficial usada pelo próprio site,
  preenche título, descrição, até quatro imagens e trailer, e deixa o link
  Terabox para preenchimento manual antes da publicação.
- A origem fica privada em `mods.source_url`; o cron diário
  `/api/cron/sync-minecraft` atualiza os metadados de até 10 itens antigos.
- Migration Supabase Production aplicada e `CRON_SECRET` salvo somente na
  Vercel Production. Sem plano pago novo.
- Commits publicados: `7b5e59b` (feature), `8c20c73` (headers/JSON-LD) e
  `e927ee0` (API oficial do catálogo). `/api/health` responde `200`; sem
  credencial, admin responde `403` e cron responde `401`.
- Validação: Marketplace **4/4**, security matrix **2/2**, TypeScript e
  `git diff --check` passaram. A aba administrativa antiga perdeu a sessão,
  então o teste autenticado não foi repetido e nenhum item foi publicado.

**Próxima ação exata:** no painel autenticado, colar um link Marketplace,
confirmar o preenchimento, revisar o Terabox e publicar o primeiro item
importado; depois observar a primeira execução diária do cron.

# Checkpoint — 2026-09-20 — saúde procedural do Marketplace em preparação

- Implementado localmente: ao abrir qualquer detalhe, um POST público
  best-effort tenta atualizar a origem Marketplace com cooldown de 30 minutos;
  sucesso faz `router.refresh`, falha preserva o conteúdo atual e grava estado
  privado `error` para revisão.
- O cron diário agora registra tentativa/sucesso/falha. O painel Catálogo terá
  alerta global, botão “Ver atenção manual” e badge por item, sem expor URL de
  origem ou Terabox.
- Migration pendente de aplicação: `supabase/migrations/20260920_07_minecraft_source_health.sql`.
  Ela adiciona `source_last_checked_at`, `source_sync_status`,
  `source_sync_error` e `source_sync_failed_at`.
- `npm run test:security-matrix` **2/2**, `npm test` **30/30** e TypeScript
  passaram localmente. Código ainda não foi publicado nesta etapa para evitar
  que as novas consultas rodem antes da migration Production.

**Próxima ação exata:** aplicar a migration no SQL Editor autenticado, então
commitar/push, aguardar Vercel Ready e testar a fila de atenção em `/en/upload`.

# Checkpoint — 2026-09-20 — auditoria gratuita pós-lançamento encerrada

## Current checkpoint — continuidade documentada sem plano pago

- Reconciliados `.work/TASKS.md`, `docs/SECURITY_ROUTE_MATRIX.md`,
  `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md`, `docs/MAPA_MESTRE_LANCAMENTO.md`
  e `docs/RELEASE_READINESS.md` com o estado real: live ativo somente em
  Production, Sandbox isolado em Preview e primeiro PIX supervisionado já
  liquidado.
- Workflow gratuito de saúde, limites, RLS, índices, headers, logs sanitizados,
  testes de segurança e dependências foram conferidos. Não foi contratado plano
  novo nem criada cobrança adicional.
- Verificadores desta rodada: `npm run test:security-matrix` **2/2**,
  `npm run test:client-security` **1/1** e `npm audit --omit=optional` **0**.
  A primeira execução da matriz sem elevação falhou apenas por `spawn EPERM` do
  sandbox; a reexecução autorizada passou.
- Pendências não funcionais: fixture/evento assinado Sandbox se exigido,
  alertas de provedor, restore futuro, compressão/CDN e carga em Preview.
- Commit `620f89b` foi publicado em `main`; o deploy Production
  `site-mods-n46xu9ci3-guizz1.vercel.app` ficou **Ready**.
- Rechecagem PageSpeed `lrsncrbk1o` (20/09): mobile 73 / LCP 30,2 s / CLS
  0,045; desktop 75 / LCP 1,3 s / CLS 0,367. O CLS desktop veio do carrossel
  e do hero da home; não alterar layout sem repetir a captura.
- Search Console ainda mostra “Não foi possível buscar o sitemap”, mas a
  consulta pública respondeu `200 application/xml` com o caminho correto.
- `npx @claude-flow/cli security scan --depth full` foi tentado novamente e
  retornou `ENOTCACHED`; nenhum pacote foi instalado.

**Próxima ação exata:** manter o monitor gratuito e fazer apenas manutenção
orientada por evidência; não contratar plano, não alterar o pagamento liquidado
e não reabrir layout aprovado.

# Checkpoint — 2026-09-20 — Mercado Pago comercial encerrado

## Current checkpoint — checkout live validado e copy comercial alinhada

- A auditoria focada do Mercado Pago passou **30/30**: checkout PIX
  server-owned/idempotente, webhook HMAC anti-replay, valor liquidado,
  método PIX, reconciliação limitada, reembolso/disputa/cancelamento e
  proteção contra pedidos duplicados.
- `npm audit --omit=optional --audit-level=high` retornou **0 vulnerabilidades**;
  matriz de segurança **2/2** e varredura de segredos no cliente **aprovada**.
- `npm test` passou build, TypeScript e smoke **30/30** após o acabamento da
  página VIP. O modo live agora remove textos de pré-lançamento quando a flag
  comercial está ativa; fora de Production o copy de pré-lançamento permanece.
- O handoff comercial e o PIX semanal supervisionado já estão registrados;
  não criar nova cobrança real. Sandbox segue isolado em Preview e só falta,
  se exigido para homologação formal, um evento assinado/fixture controlada.
- O comando oficial de security scan não rodou porque o pacote não estava em
  cache npm offline; as verificações locais equivalentes passaram.
- Commit `c918c24` foi publicado e a Vercel marcou o deploy Production como
  **Ready**. A página pública `/en/vip` mostra “Available now” e checkout PIX
  seguro no modo live; não mudar preços, flags ou layout sem nova evidência.
- Próxima ação exata: manter observação de expiração/replay e reconciliação;
  não criar cobrança real adicional.

# Checkpoint — 2026-09-20 — ações Favorite/Share compactadas acima do Download

## Current checkpoint — espaçamento dos anúncios mobile corrigido

- Auditoria exclusiva do mobile confirmou que o `min-height:124px` inline dos
  shells de leaderboard vencia a regra mobile de 92px. Os quatro banners
  horizontais da página de detalhe agora usam `mobile-detail-ad` e forçam
  `min-height:92px` somente até 727px.
- Desktop, anúncios rectangle, modal de download e outras páginas não foram
  alterados. `npm test` passou build, TypeScript e smoke **30/30**.
- Commit `c70a225` foi publicado; em viewport 390px os quatro banners
  horizontais mediram 92px e a faixa Favorite/Share ficou separada do anúncio
  sem o vazio anterior. O viewport temporário foi restaurado ao padrão.
- Próxima ação exata: preservar a regra mobile escopada e não reduzir anúncios
  rectangle de 300×250.

## Current checkpoint — espaço do banner reduzido

- O banner `GuizzMods / Download` recebeu `lg:-mb-12` no `ModViewer`,
  reduzindo o vazio reservado pelo shell de leaderboard antes da faixa
  Favorite/Share. O recuo foi calibrado para `lg:-mb-6`, mantendo um respiro
  visual de aproximadamente 20–25px; o comportamento mobile permanece sem
  sobreposição.
- `npm test` passou build, TypeScript e smoke **30/30**.
- Commit `8ec85ef` foi publicado; produção recarregada e a faixa de ações
  ficou com respiro moderado acima do Download, sem colar os elementos.
- Próxima ação exata: preservar o espaçamento responsivo atual.

## Current checkpoint — barra de ações reposicionada

- Em `src/components/ModViewer.tsx`, Favorite e Share agora ficam logo acima
  de `DownloadFlow` na coluna direita, em uma faixa compacta com dois botões.
  Ícones e rótulos foram preservados para acessibilidade; apenas padding e
  espaçamento foram reduzidos.
- Build, TypeScript e smoke passaram **30/30**.
- Commit `f8cf34a` foi publicado no `main`; a produção foi recarregada e
  confirmou visualmente Favorite/Share acima do Download na coluna direita.
- Próxima ação exata: manter essa faixa compacta e a grade original da foto 2;
  só alterar novamente com nova evidência visual.

# Checkpoint — 2026-09-20 — layout da foto 2 restaurado

## Current checkpoint — grade original de 12 colunas restaurada

- A publicação anterior havia trocado a grade original de 12 colunas por uma
  grade fixa e forçado alinhamento à esquerda no desktop. `ModViewer.tsx`
  voltou à estrutura da foto 2: `max-w-[1280px]`, `lg:grid-cols-12`, mídia
  `lg:col-span-8`, ações `lg:col-span-4` e resumo centralizado.
- Vídeo e miniaturas ficam na coluna esquerda; título/autor, anúncio, Download
  e Favorite/Share ficam centralizados na coluna direita sem mudar conteúdo.
- `npm test` passou build, TypeScript e smoke **30/30**.
- Commit `316ee07` foi publicado no `main`; a página pública foi recarregada
  no desktop e confirmou a grade centralizada da foto 2. `/api/health`
  respondeu `200` com `ok:true`.
- Próxima ação exata: não alterar a grade original novamente sem nova
  evidência visual comparável.

# Checkpoint — 2026-09-20 — VIP comercial ativado em Production

## Current checkpoint — handoff Mercado Pago concluído com ressalva de liquidação

- A flag `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` foi salva como `true` no Vercel
  Production após confirmação do proprietário. O redeploy
  `BELHhJSNgp4TNHcbYcbK3YTMh8sA` ficou **Ready** e recebeu os domínios oficiais.
- `/api/health` e `/en/vip` responderam `200` após a publicação. O PIX live
  semanal de R$6,70 foi pago pelo proprietário e o entitlement VIP foi criado.
- O simulador de webhooks do Mercado Pago foi executado contra branch e produção;
  ambos retornaram `401` porque o simulador não enviou a assinatura HMAC exigida
  pelo endpoint fail-closed. Isso não substitui evento assinado de liquidação.
- A página VIP autenticada confirmou **VIP access active**, plano semanal e
  validade até 27/09/2026. Nenhum código, ID ou hash do ticket foi armazenado.
- Próxima ação exata: acompanhar expiração/replay e, se necessário, conferir
  a reconciliação administrativa; não criar outra cobrança para este ensaio.

# Checkpoint — 2026-09-20 — contratos públicos de produção verificados

## Current checkpoint — Mercado Pago Sandbox adapter published and production build verified

- Corrigida a validação TypeScript da resposta PIX do Mercado Pago: o adaptador
  agora estreita `payment_method` antes de validar o ticket, sem relaxar a
  checagem de referência externa, valores aceitos, método PIX, status e URL.
- O retry de uma ordem Sandbox antiga aceita somente o valor de teste atual ou
  o total comercial server-owned do mesmo plano; isso evita o `502` causado por
  uma ordem pré-existente sem permitir alteração de preço pelo cliente.
- Testes do checkout passaram **8/8** e `npm test` passou build/TypeScript e
  smoke **30/30**. O commit `2c840f2` está **Ready** na Vercel e foi publicado
  em produção; `/api/health` respondeu `200` e `/en/vip` respondeu `200`.
- O checkout live continua desligado. Nenhum pagamento real, webhook de
  liquidação ou entitlement VIP foi criado. Variáveis temporárias e callbacks
  de Preview foram removidos ao fim do ensaio.
- Próxima ação exata: fechar a homologação externa somente com evento Sandbox
  oficial ou fixture assinada controlada; depois, em etapa separada, fazer o
  handoff comercial do Mercado Pago antes de ligar cobrança real.

## Current checkpoint — atalho VIP do Download corrigido e validado

- O endpoint `/api/download/session` agora só reutiliza uma sessão anterior
  quando o estado VIP salvo coincide com o entitlement atual. Isso corrige o
  caso de cookie antigo sem VIP bloquear o atalho, e também impede manter o
  atalho após revogação.
- Foram adicionados testes para VIP ativo com sessão antiga, VIP revogado e
  reutilização de sessão VIP válida. O teste focado passou **7/7**; lint, build
  e smoke passaram **30/30**.
- O commit `c94342e` ficou **Ready** na Vercel em
  `site-mods-6751n62ii-guizz1.vercel.app`; produção recebeu a correção.

## Current checkpoint — deploy c84834e confirmado em produção

- O deploy de produção `site-mods-qwo8tzzl3-guizz1.vercel.app` ficou **Ready**
  para o commit `c84834e`; o domínio canônico continua `https://www.guizz.xyz`.
- Verificação somente leitura dos contratos públicos: `/api/health` retornou
  `200` com `ok:true`, `noindex` e JSON mínimo; `robots.txt` retornou texto
  com as áreas privadas bloqueadas; `sitemap.xml` retornou XML; `llms.txt`
  retornou texto puro; `/en/vip` retornou HTML.
- Nenhum segredo, pagamento, entitlement, domínio, anúncio ou configuração foi
  alterado. O próximo gate real continua sendo o evento oficial do Mercado
  Pago Sandbox, bloqueado pela autenticação adicional da conta.

## Security checkpoint — dependências e segredos versionados

- `npm audit --omit=optional --audit-level=high` retornou **0 vulnerabilidades**.
- A revisão dos padrões de segredos nos arquivos rastreados encontrou apenas
  nomes de roles/variáveis, migrations e fixtures intencionais; nenhum valor
  de token, chave privada ou segredo foi encontrado.
- O teste existente `npm run test:client-security` continua aprovado; nenhum
  arquivo de aplicação foi alterado nesta rodada.

## Release checkpoint — build completo concluído

- `npm test` passou: build Next.js 16.3.5, TypeScript e smoke **30/30**.
- O commit `b1630eb` ficou **Ready** na Vercel em
  `site-mods-q44eopz7c-guizz1.vercel.app`; o domínio canônico segue apontando
  para a produção.
- Com a matriz de segurança já cobrindo as 9 rotas, o item “validar toda
  entrada” foi marcado como concluído no mapa mestre.

# Checkpoint — 2026-09-20 — QA público de SEO/CTA concluído

## Current checkpoint — lote SEO e confiança validado sem mudanças cegas

- QA somente leitura confirmou home, busca, categoria Maps e VIP com títulos
  próprios, links/CTAs iniciais acessíveis, cards reais e imagens com alt
  descritivo. O detalhe continua com CTA de Download/guia de ação.
- `npm run test:smoke` passou **30/30** após repetir fora da restrição de spawn
  do ambiente. Não houve alteração de código, anúncios, pagamento ou tema.
- A linha de CTA na primeira dobra foi atualizada para concluída no mapa mestre;
  Search Console continua uma ação externa opcional após a decisão do domínio
  canônico.
- Próxima ação exata: manter o lote de performance/reliabilidade e o gate
  Mercado Pago Sandbox separado; não reabrir layout/SEO sem evidência.

## Security checkpoint — matriz de rotas revalidada

- `npm run test:security-matrix` passou **2/2** fora da restrição de spawn do
  ambiente: as 9 rotas `/api` continuam documentadas e com `no-store`.
- Nenhuma rota, cabeçalho, credencial ou configuração externa foi alterada.

# Checkpoint — 2026-09-20 — simulação oficial do Mercado Pago bloqueada por verificação de conta

## Current checkpoint — tentativa segura de fechar o evento oficial do Sandbox

- O painel do aplicativo Mercado Pago foi aberto somente para consulta. O
  acesso redirecionou para a verificação da conta por SMS/WhatsApp/ligação ou
  QR do app; a alternativa disponível exigiu um código temporário do Google
  Authenticator. Nenhum código, QR, segredo ou confirmação foi inserido.
- Não foi localizado nem acionado um controle oficial de “simular pagamento”
  ou “enviar webhook” sem autenticação. Portanto, não há evidência nova de
  liquidação/webhook; o ticket PIX Semanal continua apenas `checkout_created`.
- O checkout live permanece desligado. O próximo passo externo é o operador
  concluir essa validação no painel e usar um evento Sandbox oficial, ou
  fornecer uma fixture controlada de webhook para homologação local. Não
  usar transferência real nem marcar pedido como pago manualmente.
- Nenhuma variável, código do produto ou configuração de produção foi
  alterada nesta tentativa.

# Checkpoint — 2026-09-20 — checkout PIX Sandbox aberto com tester sem VIP

## Current checkpoint — MP Sandbox ponta a ponta parcial concluído

- A conta Google de suporte foi confirmada no Auth do Supabase e o UUID foi
  adicionado somente a `MERCADOPAGO_TEST_USER_IDS` do ambiente **Preview** da
  Vercel. Nenhum identificador ou segredo foi exposto no chat; Production não
  foi alterada.
- O Preview foi redeployado com as variáveis atualizadas e ficou **Ready** em
  `site-mods-926eus9eh-guizz1.vercel.app`; o alias de branch continua público
  apenas para homologação e o domínio oficial permanece protegido.
- O callback exato do novo Preview foi adicionado à allowlist do Supabase (sem
  wildcard amplo). O login Google retornou ao novo host e a sessão foi
  reconhecida pelo app.
- O fluxo VIP abriu um ticket **Mercado Pago PIX Sandbox** para o plano
  Semanal, R$6,70, exibindo QR/código de teste e vencimento no ambiente de
  homologação. Não houve transferência, cobrança real, webhook de pagamento ou
  ativação de VIP.
- Evidência concluída: pré-condições, allowlist, origem, catálogo server-owned
  e criação do checkout de teste (MP-09). Ainda pendentes: retorno controlado,
  webhook assinado/idempotente, reconciliação, expiração e testes para Diário e
  Mensal. Não ligar `MERCADOPAGO_LIVE_CHECKOUT_ENABLED`.
- A matriz automatizada de segurança passou (2/2) e os testes focados de
  checkout, webhook, reconciliação, validação PIX e duplicidade passaram **27/27**
  sem chamadas ao provedor; isso cobre as proteções locais, não substitui um
  evento oficial do Sandbox.
- O workflow gratuito `.github/workflows/health-check.yml` foi executado
  novamente no `main` (run `GuizzMods health check #2`) e terminou **Success**
  em 5 s, confirmando o contrato de `/api/health` em produção. Alertas por
  falha continuam dependentes das preferências de notificação do GitHub; não
  foi contratado Vercel Pro.
- Próxima ação exata: registrar este ticket como `checkout_created` sem pagar e
  fechar a matriz Sandbox com eventos oficiais/fixtures controlados; depois
  executar o próximo gate externo do mapa (monitor gratuito). O backup Free
  continua adiado pelo proprietário.

# Checkpoint — 2026-09-20 — webhook Mercado Pago Sandbox configurado

## Current checkpoint — Mercado Pago Preview pronto para homologação

- O painel Mercado Pago foi verificado e o modo de teste está configurado para
  `Order (Mercado Pago)` em
  `https://site-mods-git-main-guizz1.vercel.app/api/vip/webhook/mercadopago`.
- Uma nova assinatura secreta foi definida no modo de teste e armazenada apenas
  como `MERCADOPAGO_WEBHOOK_SECRET` no ambiente **Preview** da Vercel. Nenhum
  segredo foi exposto no chat; a variável de Production não foi alterada.
- O Preview foi redeployado e ficou Ready. O domínio de branch
  `site-mods-git-main-guizz1.vercel.app` recebeu uma exceção específica da
  proteção Vercel e fica público durante a homologação para permitir chamadas
  externas do Mercado Pago; o domínio oficial continua protegido.
- Verificação externa: `/api/health` respondeu `200` sem autenticação e um
  `POST` sem assinatura ao webhook respondeu `401`, confirmando alcance público
  com validação server-side.
- Próxima ação exata: entrar no Preview com a conta de teste autorizada e
  executar a matriz Sandbox (pedido PIX, retorno, webhook, duplicidade,
  reconciliação e expiração); não ativar checkout live.

# Checkpoint — 2026-09-19 — lote publicado e verificado

## Current checkpoint — monitor gratuito preparado

- Adicionado `.github/workflows/health-check.yml`: consulta
  `https://www.guizz.xyz/api/health` a cada 15 minutos e falha se o JSON não
  retornar `ok: true`; também pode ser disparado manualmente.
- O workflow não usa segredos nem altera o plano Vercel. Falta observar a
  primeira execução/notificação no GitHub depois da publicação.
- A execução manual `35479199762` no commit `e90afee` terminou **Success** em
  10 s; o endpoint respondeu com o contrato esperado.
- Próxima ação exata: publicar e observar o workflow; depois retomar o gate
  Mercado Pago Sandbox, avisando antes de tocar em credenciais externas.

## Current checkpoint — Mercado Pago Preview parcialmente configurado

- Após a verificação do painel Mercado Pago, o Access Token de teste foi
  armazenado apenas como segredo Vercel Preview; também foram adicionados
  `MERCADOPAGO_TEST_CHECKOUT_ENABLED=true` e
  `MERCADOPAGO_TEST_PAYER_EMAIL=testuser3696429992@testuser.com` somente no
  Preview. Nenhum valor foi exposto no chat e Production não foi alterada.
- O redeploy Preview `7Bjbc9gwqGo6uHnGZnAAbBa6ALYZ` terminou **Ready** em
  `https://site-mods-latyxq9wk-guizz1.vercel.app`.
- O UUID da conta GuizzMods `guilherme…@gmail.com` (Email + Google) foi
  identificado no Authentication do Supabase e salvo somente no Preview como
  `MERCADOPAGO_TEST_USER_IDS`; nenhum identificador foi exposto no chat.
- O novo redeploy Preview `9tipc7STG9rYqbNHdmEQaT7irNhH` terminou **Ready** em
  `https://site-mods-iav8p2uac-guizz1.vercel.app`.
- O checkout ponta a ponta agora aguarda apenas o segredo/URL do webhook de
  teste e o login da mesma conta no Preview. Não abrir allowlist ampla.
- Próxima ação exata: configurar webhook Sandbox assinado e executar a matriz
  Preview; manter live desligado.

## Current checkpoint — Mercado Pago local pronto para sandbox

- A suíte simulada de checkout/webhook/reconciliação passou **24/24** e a suíte
  VIP passou **10/10**; nenhum request foi enviado ao Mercado Pago.
- Os guardrails exigem `MERCADOPAGO_TEST_CHECKOUT_ENABLED`, usuário/payer de
  teste e token de Preview antes de qualquer ensaio ponta a ponta.
- A inspeção somente leitura da Vercel mostrou apenas variáveis Mercado Pago de
  Production; não há `MERCADOPAGO_TEST_*` nem token de Preview configurados.
- Próxima ação exata: criar/configurar credenciais de Preview e payer de teste
  no Vercel Preview; manter live desligado e não reutilizar token Production.

## Current checkpoint — alertas Vercel exigem plano Pro

- A página de alertas da Observability está acessível somente como upsell:
  mostra `Upgrade to Pro`; nenhuma mudança de plano ou cobrança foi feita.
- O endpoint `/api/health` continua pronto para um monitor externo gratuito,
  mas o provedor ainda precisa ser escolhido/configurado.
- Próxima ação exata: tratar a escolha do monitor e o Mercado Pago Sandbox como
  gates externos separados; não contratar Vercel Pro automaticamente.

## Current checkpoint — matriz de segurança automatizada

- Adicionado `tests/security-route-matrix.test.mjs` e o script
  `npm run test:security-matrix`; as 9 rotas `/api` atuais precisam aparecer
  na matriz e manter handler HTTP e `Cache-Control: no-store`.
- O guard passou junto com lint, teste de client security e smoke **30/30**.
- O commit `72213ee` está publicado na Vercel em
  `site-mods-3emnby9e0-guizz1.vercel.app` com status **Ready**.
- Próxima ação exata: entrar no próximo gate externo (monitor ou Mercado Pago
  Sandbox) somente após avisar; o backup Supabase permanece adiado.

## Current checkpoint — backup Supabase adiado pelo proprietário

- O proprietário decidiu pular o backup/restore por enquanto. Nenhum dump,
  vínculo ou restauração foi executado, e nenhum segredo foi armazenado.
- O runbook continua disponível para uma futura janela operacional; quando
  reaberto, a senha deverá ser digitada localmente e o restore ficará restrito
  a um projeto separado, nunca produção.
- Próxima ação exata: avançar para o próximo item não externo do mapa; não
  reabrir este gate sem nova decisão do proprietário.

## Current checkpoint — trava de segredos no client

- Criado `tests/client-secret-scan.mjs` e o script `npm run
  test:client-security`; ele percorre os arquivos `use client` e bloqueia
  referências a service role, tokens Mercado Pago, segredo de webhook/download
  e variáveis `NEXT_PUBLIC` indevidas.
- A trava passou, junto com lint; nenhum código de produto ou variável externa
  foi alterado. O commit `bc5303c` está publicado na Vercel em
  `site-mods-l2wa8bvsp-guizz1.vercel.app` com status **Ready**.
- Próxima ação exata: continuar nas tarefas que não dependem dos gates externos;
  avisar antes de iniciar Mercado Pago, monitoramento ou backup/restore do Supabase.

## Current checkpoint — APIs fora de indexação

- `next.config.ts` agora aplica `X-Robots-Tag: noindex, nofollow, noarchive`
  a toda a árvore `/api/*`; páginas públicas continuam com a política normal.
- A sonda `/api/health` foi alinhada ao mesmo cabeçalho depois de uma consulta
  pública em produção revelar a sobrescrita antiga; build, lint, TypeScript,
  teste de privacidade e smoke **30/30** passam.
- O commit `659b4f8` foi publicado e a implantação Vercel
  `site-mods-oobedfptm-guizz1.vercel.app` está **Ready**; a consulta pública
  confirmou `200`, `no-store` e `noindex, nofollow, noarchive`.
- Revisão somente leitura do Vercel confirmou `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`,
  `MERCADOPAGO_SITE_URL=https://www.guizz.xyz` e a presença dos segredos
  server-only de produção; nenhum valor secreto foi revelado ou alterado.
- Próxima ação exata: continuar pelos gates externos já documentados; não ligar
  checkout real nem adicionar rate limit distribuído sem provedor/telemetria
  aprovados.

## Current checkpoint — privacidade dos erros de favoritos

- Os componentes `FavoriteButton` e `ModViewer` não exibem mais a mensagem
  bruta retornada pelo Supabase; as mensagens EN/PT/ES são genéricas e pedem
  uma nova tentativa.
- O teste `tests/client-error-privacy.mjs`, lint, TypeScript, build e smoke
  **30/30** passaram. Nenhum schema, RLS, anúncio, pagamento ou credencial foi
  alterado. O commit `f7f93e5` foi publicado e a implantação Vercel
  `site-mods-7wn53yx9v-guizz1.vercel.app` está **Ready**.
- Smoke público da página `en/mod/c2aaf8bb-8de8-426b-ae34-db6f853c600d`
  confirmou título, vídeo, Download, Favorite, Share, especificações, blocos
  de recomendação e anúncios Adsterra horizontais/laterais visíveis.
- O checkpoint documental `06ce9a4` também foi publicado e a implantação
  `site-mods-dlve1fxz3-guizz1.vercel.app` concluiu em **Ready**.
- Próxima ação exata: retomar os gates externos já documentados (Mercado Pago
  Sandbox, monitor e backup Free); não ligar checkout real nem inventar rate
  limit distribuído.

## Current checkpoint — CLS confirmado após a reserva dos trilhos

- A medição mobile pós-deploy no mesmo perfil (19/09/2026, 19:55 BRT)
  retornou Performance 74, Accessibility 91, Best Practices 96 e SEO 100.
  FCP 0,9 s, LCP 31,1 s, TBT 60 ms, CLS **0,045**, Speed Index 3,0 s e
  payload 11.088 KiB.
- O diagnóstico de layout agora mostra apenas `Most downloaded` com 0,045;
  o deslocamento anterior do corpo/rodapé (0,312) e do shell móvel (0,175)
  desapareceu. A reserva dos trilhos foi confirmada como correção efetiva.
- O LCP continua volátil (1,7–31,1 s entre execuções) e a oportunidade de
  imagens/terceiros voltou a 10.325 KiB, com cache estimado de 5.880 KiB. O
  fallback de imagens diretas permanece estável; não reativar `/_next/image`
  nem contratar CDN sem decisão de custo e medição de origem.
- O commit `43ab8e6` está publicado; a implantação
  `site-mods-pt5udesnh-guizz1.vercel.app` está **Ready**. Lint, TypeScript,
  build e smoke **30/30** seguem verdes.
- Smoke público final em navegador limpo após o lote: `/en` mantém título,
  marketplace e rodapé, nenhum esqueleto fica preso após o carregamento, a
  parede não aparece e não houve `warn`/`error` próprio no console. Os slots
  `mobile` ficaram naturalmente ocultos no viewport desktop.
- Próxima ação exata: manter o layout congelado e avançar para os gates externos
  documentados (sandbox Mercado Pago, monitor e backup Free). Performance de
  mídia só volta à fila com uma estratégia de CDN/loader aprovada.

## Current checkpoint — PageSpeed pós-deploy e prioridade do hero

- Para atacar o CLS reproduzido, a home agora reserva a altura dos oito trilhos
  do catálogo durante as consultas iniciais e mostra placeholders discretos;
  quando os dados chegam, a troca preserva o fluxo do documento. O ajuste é
  local e não muda anúncios, gate, imagens ou conteúdo final.
- Lint, TypeScript, build e smoke **30/30** passaram. A alteração ainda não foi
  medida no PageSpeed porque a publicação ocorre neste lote.

- A medição mobile no mesmo perfil do PageSpeed (relatório de 19/09/2026,
  19:38 BRT) retornou Performance 76, Accessibility 96, Best Practices 96 e
  SEO 100. FCP 0,9 s, LCP 1,7 s, TBT 120 ms, CLS 0,487, Speed Index 4,1 s e
  payload total 11.079 KiB.
- A entrega de imagens remotas continua direta e estável; a oportunidade de
  imagem caiu para 48 KiB, mas o cache de terceiros ainda representa cerca de
  5.846 KiB. O diagnóstico de layout atribuiu 0,312 ao deslocamento do corpo/
  rodapé e 0,175 ao shell do anúncio móvel.
- A correção publicada em `9a00d2e` mantém `priority` somente na primeira
  imagem do hero. Lint, TypeScript, build e smoke **29/29** passaram, e a
  implantação Vercel `site-mods-k4mvxu3xh-guizz1.vercel.app` está **Ready**.
- Um navegador limpo em produção permaneceu sem erros próprios de console após
  o carregamento. A variação de CLS ainda não justifica mexer no gate
  Anti-Adblock, nos criativos ou na cadência de anúncios.
- O checkpoint documental `0ff71fd` também foi publicado; a implantação
  `site-mods-el03kr6ut-guizz1.vercel.app` está **Ready**.
- Próxima ação exata: publicar e repetir o mesmo perfil mobile para confirmar a
  queda do CLS; se permanecer alto, separar o shell de anúncio em uma captura
  própria antes de mexer no provider. Em paralelo, seguir para os
  gates externos já documentados (sandbox Mercado Pago, monitor e backup Free),
  sem ligar cobrança real.

## Current checkpoint — auditoria Free e matriz Mercado Pago

## Current checkpoint — continuidade Free documentada

- A documentação oficial da Supabase confirmou que backups automáticos
  baixáveis são dos planos pagos; no Free, a recomendação é exportar com
  `supabase db dump` e manter cópia externa. PITR é add-on pago.
- Criados `docs/SUPABASE_FREE_CONTINUITY_RUNBOOK.md` e
  `scripts/supabase-free-backup.ps1`. O script usa projeto vinculado (`--linked`),
  gera schema/dados/roles em `backups/` ignorado pelo Git e não imprime segredo.
- A CLI não está instalada nesta máquina e nenhum dump foi executado. O item de
  restore continua pendente até o proprietário instalar/vincular a CLI e
  autorizar um ensaio em projeto separado.
- Runbook publicado em `origin/main` no commit `87e4d70`; Vercel gerou a
  implantação `site-mods-pfajvahff-guizz1.vercel.app`, marcada como **Ready**.
- Próxima ação exata: o proprietário instala/vincula a CLI e autoriza o dump e
  ensaio em projeto separado; não tocar no projeto de produção nem comprar
  plano novo.

- Auditoria somente leitura do Supabase Free: projeto `SITE-MODS Free`, sem
  réplicas de leitura, primário único para leituras/escritas e 0,00 GB usados
  no painel (limite exibido: 2 GB). O painel consultado não exibiu evidência de
  PITR/restore; nenhum dado foi alterado e backup não foi marcado como concluído.
- Criada `docs/MERCADO_PAGO_SANDBOX_MATRIX.md` com 27 casos de homologação para
  Preview: bordas HTTP, allowlist, catálogo server-owned, idempotência,
  assinatura/duplicidade de webhook, divergências, timeout e reconciliação.
- Nenhuma credencial, flag live, pagamento, plano ou DNS foi alterado. O
  checkout de produção continua desligado.
- Documentação publicada em `origin/main` no commit `bc6db16`; Vercel gerou a
  implantação `site-mods-8iz6rt5hk-guizz1.vercel.app`, marcada como **Ready**.
- Próxima ação exata: executar a matriz no Preview apenas quando houver
  Access Token e payer de teste configurados diretamente pelo proprietário;
  enquanto isso, avançar com evidência de continuidade e monitor sem custo.

## Current checkpoint — limites de corpo nas rotas VIP

- Checkout Mercado Pago agora rejeita `content-length` acima de 1 KiB e mede o
  corpo em bytes UTF-8 antes do parse; o webhook rejeita declarações acima de
  256 KiB antes de qualquer consulta ao provedor ou banco.
- Testes focados de checkout/webhook passaram 8/8; lint, TypeScript, build de
  produção e smoke passaram 28/28. Nenhum limitador distribuído foi inventado:
  isso continua dependente de uma decisão/serviço externo e das proteções do
  provedor.
- Hotfix publicado em `origin/main` no commit `d180f40`; Vercel gerou a
  implantação `site-mods-kpozoyq30-guizz1.vercel.app`, marcada como **Ready**.
- Próxima ação exata: manter a matriz de sandbox pronta para execução em
  Preview com credenciais de teste; não ligar cobrança real.

## Current checkpoint — decisão sem novo plano e matriz de rotas

- Decisão registrada: não contratar Pro nem domínio customizado Supabase nesta fase; o host padrão HTTPS permanece em uso e nenhuma variável, DNS ou callback foi alterado.
- Criada `docs/SECURITY_ROUTE_MATRIX.md` com acesso, validações, limites, deadlines e efeitos protegidos das APIs públicas, VIP, download, webhook e admin.
- Próxima ação exata: executar o ensaio de backup/restore que o plano atual permitir, cadastrar monitor externo sem custo quando houver conta autorizada e homologar Mercado Pago sandbox; live continua desligado.

## Current checkpoint — Anti-Adblock lento/no-fill e gate externo Supabase

- O Anti-Adblock foi endurecido sem bloquear falso positivo: estados `loading` agora aguardam além do timeout de 10 s do host; somente `failed`/`timeout` em todos os slots sem criativo, ou a sonda cosmética, abrem a parede.
- Testes deste lote: teste dedicado do gate, lint, TypeScript, build de produção e smoke **28/28**.
- Publicado em `origin/main` no commit `86aa1e6`; a implantação Vercel `site-mods-qblb0v0bk-guizz1.vercel.app` ficou **Ready**.
- QA público pós-deploy do detalhe de mod confirmou mídia, Download/Favorite/Share, anúncios 160×600/468×60/728×90/300×250 e console sem avisos/erros próprios; o arquivo externo não foi aberto.
- Auditoria somente leitura do Supabase confirmou projeto **Free**; Custom Domains são add-on do Pro e custam US$10/mês por domínio. Nenhum upgrade, DNS, URL de produção ou callback foi alterado.
- Próxima ação exata: manter a URL Supabase atual até decisão de orçamento/hostname; em paralelo, fechar monitor externo, backup/restore não produtivo e homologação Mercado Pago sandbox. Checkout live continua desligado.

## Current checkpoint — VIP, anúncios, alinhamento e confiabilidade em produção

- A migration `supabase/migrations/20260919_04_vip_plan_catalog.sql` foi aplicada com sucesso no SQL Editor do projeto Supabase; ela mantém IDs trimestral/anual apenas para históricos e aceita os planos atuais Diário, Semanal e Mensal.
- O lote foi publicado em `origin/main` no commit `d56a572`; a implantação de produção da Vercel `site-mods-1dnaszmo7-guizz1.vercel.app` ficou **Ready**.
- Verificação pública: `/en/vip` exibe Diário R$1,99, Semanal R$6,70 e Mensal R$19,90; `/api/health` retorna 200 com `no-store`/`noindex`; `/llms.txt` retorna 200 como `text/plain` e lista as rotas canônicas.
- Gates locais verdes: lint, TypeScript, build de produção e smoke **28/28**; auditorias npm completa e production-only sem vulnerabilidades altas.
- O refresh de anúncios ocorre somente após o clique real em Skip, remonta os hosts com `guizz_mount` e pode receber a mesma campanha por decisão do Adsterra. O checkout Mercado Pago continua desligado e nenhum pagamento/VIP real foi processado.
- Limpeza externa anterior permanece válida: legado Preview do AbacatePay e variáveis de branch foram removidos; produção, Supabase, Auth, RLS, migrations e histórico de deployments foram preservados.
- Próxima ação exata: fazer QA público final de uma página de mod/download e fechar os gates externos P0 (domínio próprio Supabase, backup/restore, monitoramento e homologação Mercado Pago) antes de ligar cobrança real.

# Checkpoint — 2026-09-19 — external cleanup inventory

## Current checkpoint — Vercel/Supabase cleanup audit

- Read-only audit completed before deletion. Vercel has one project (`site-mods`), three valid domains (`guizz.xyz`, `www.guizz.xyz`, `site-mods-ecru.vercel.app`), no installed integrations and no Vercel Storage resources.
- The only clearly obsolete external item is the ready Preview deployment `DgBvJcAiWLgA6D9CHpPTwvGhkcPX` from branch `abacatepay-test`, commit `44dbf8a`; it exposes only preview domains and has no custom-domain assignment. The remote branch still exists, so deleting only the deployment would leave a confusing branch/preview source.
- Vercel environment variables scoped to `abacatepay-test` are legacy Preview entries: `MERCADOPAGO_TEST_SITE_URL`, `MERCADOPAGO_TEST_USER_IDS`, `MERCADOPAGO_TEST_PAYER_EMAIL`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_TEST_CHECKOUT_ENABLED`. Production Mercado Pago, Supabase, Turnstile and download variables remain needed and were not touched. Values were not revealed.
- Supabase has one production project (`vzvkwyzlyjlgcffupzhy`), no Edge Functions, no Storage buckets/usage, active Auth users, and migrations/RLS that must be retained. Advisor has no actionable issue beyond the known Free-plan leaked-password limitation. No Supabase deletion candidate was found.
- Cleanup completed after explicit confirmation: the obsolete Preview deployment `DgBvJcAiWLgA6D9CHpPTwvGhkcPX`, its five branch-scoped Preview variables, and the remote `abacatepay-test` branch were deleted. Production deployment/domains remain Ready, and the active production/env variable names were rechecked.
- Supabase verification after cleanup still shows the single `SITE-MODS` production project, no Edge Functions/storage resources, active Auth/database surfaces, and no Advisor issue. No Supabase resource was deleted because none was orphaned.
- The cleanup audit itself did not alter production code; the implementation batch was published separately in commit `d56a572` after the migration and release gates passed.
- Do not redeploy or delete the local `abacatepay-test` backup branch without a separate request; the remote legacy branch and Preview deployment are already removed.

# Checkpoint — 2026-09-19

## Historical checkpoint — VIP catalog, Skip ad refresh and desktop detail alignment

- The implementation was later published in `d56a572`: public/server plan catalog is now Daily R$1.99, Weekly R$6.70 (~R$0.96/day), and Monthly R$19.90 (~R$0.66/day). Quarterly and yearly are removed from new checkout/UI; the Supabase migration preserves legacy IDs for historical rows.
- Download stages now key the three active normal-stage ad placements by `step` (two leaderboards plus one rectangle), add a cache-busting `guizz_mount` query to each new provider script, and alternate between approved horizontal units where the container permits. A real user click on Skip therefore unmounts the previous hosts and requests a fresh visible stage; the provider may still return the same campaign. No timer, hidden refresh, or third normal-stage duplicate was added; the final modal remains separate.
- Desktop mod detail now uses a stable 400px sidebar and a wider 1440px content frame; the title, author card, ad and download controls align from the top of the media column while mobile centering is preserved.
- Added public `/api/health` liveness probe with no-store/noindex headers and standardized sanitized diagnostics for admin catalog and VIP checkout failures.
- Dependency gate rechecked: full `npm audit --audit-level=high` and production-only audit both return 0 vulnerabilities.
- Validation: lint, TypeScript, production build and public smoke **28/28** pass. Focused auth-return, Mercado Pago adapter, VIP-order and server-observability tests pass outside the sandbox; the Adsterra renderer harness remains unavailable because `react-test-renderer` is not installed.
- Important: the Mercado Pago live gate remains unchanged; provider approval for refresh behavior and the production payment handoff are still external gates.
- Historical next action completed: migration application, commit/push and post-deploy checks are recorded in the current checkpoint above.

## Current checkpoint — Supabase custom-domain plan correction

- Corrigido o entendimento do primeiro vídeo: o requisito principal é substituir o host padrão `PROJECT_REF.supabase.co` por um hostname próprio (recomendação inicial `api.guizz.xyz`), com CNAME/TXT, certificado e callbacks OAuth atualizados.
- `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md` agora separa a migração de domínio Supabase da revisão de segurança, do Mercado Pago e da checklist do segundo vídeo.
- Mercado Pago já possui Orders/PIX, webhook assinado, idempotência, reconciliação e entitlement server-side; o checkout real continua desligado.
- Próxima ação exata: confirmar qual hostname será usado e o plano Supabase; depois configurar DNS/verificação sem trocar a URL de produção antes do smoke.

## Current checkpoint — master launch map

- Criado `docs/MAPA_MESTRE_LANCAMENTO.md`, consolidando as duas checklists, PageSpeed, Supabase, Mercado Pago, anúncios, SEO e QA em uma ordem única.
- A nova lista revelou lacunas objetivas: metadata própria para categoria/busca, 404 dedicada, OG image completa e `mash-up` ausente do sitemap; elas estão registradas como tarefas, não como concluídas.
- Próxima ação exata: incorporar qualquer nova lista nesse mapa e executar o primeiro lote P0 completo, sem exigir comandos repetidos do usuário.

## Current checkpoint — security checklist added

- A terceira lista foi incorporada em `docs/MAPA_MESTRE_LANCAMENTO.md`, cobrindo segredos/Git, RLS, cookies, autenticação server-side, validação, headers, HTTPS e dependências.
- Status honesto: a maior parte da proteção de runtime está evidenciada; permanecem varredura formal do histórico Git, matriz completa de validação/rate limit e rechecagem do npm audit.
- O scanner Claude Flow continuou indisponível offline por pacote não presente no cache; as evidências manuais do código/migrations permanecem registradas.

## Current checkpoint — SEO/trust batch published locally

- Implementados metadata pública para categorias e busca, Open Graph/Twitter padrão e por mod, 404 útil e inclusão de `mash-up` no sitemap.
- Smoke atualizado passou **25/25**, além de lint e TypeScript; a build de produção já passou fora do sandbox.
- Próxima ação exata: concluir a varredura histórica de segredos; depois seguir para rate-limit/validação e os gates externos.

## Current checkpoint — alt text follow-up

- Substituídos alts genéricos `Media`, `Thumb` e `Video Thumb` por descrições baseadas no título do mod e no tipo de preview.
- Build, lint, TypeScript e smoke **25/25** passaram novamente; próximo deploy deve carregar este ajuste junto do lote SEO.

## Current checkpoint — SEO/trust published

- Commits `34cc82b` e `cf67174` foram enviados para `origin/main`: metadata pública, Open Graph/Twitter, 404, sitemap `mash-up` e alt text específico.
- A tentativa de smoke público foi bloqueada pelo proxy local, que recusou a conexão redirecionada a `127.0.0.1:9`; não há confirmação pública nova nesta rodada.
- Próxima ação: retomar os gates que exigem estado externo (domínio customizado Supabase, limites/monitoramento, backup/restore, sandbox Mercado Pago e auditorias npm/PageSpeed) ou continuar a matriz interna de rate-limit/validação.

## Paused checkpoint — 2026-09-19

- Projeto pausado a pedido do usuário para debate, sem novas alterações de código ou deploy após este ponto.
- Último estado publicado: `main` em `dd18000`; SEO/trust, 404, Open Graph, sitemap `mash-up` e alt text estão implementados; build, lint, TypeScript e smoke 25/25 passam.
- Verificação pública do último deploy continua sem evidência por bloqueio do proxy local (`127.0.0.1:9`); não tratar como confirmação até repetir em navegador/rede acessível.
- Retomada exata: revisar com o usuário os gates externos na ordem — domínio personalizado Supabase, homologação Mercado Pago, spending caps/monitoramento, backup/restore, rate-limit/validação e npm/PageSpeed — usando `docs/MAPA_MESTRE_LANCAMENTO.md` como fila única.

## Current checkpoint — monetização e preço VIP

- Correção após teste de reconciliação: os mesmos três hosts são preservados entre os três Skips; o fluxo atual gera 10 oportunidades por download concluído (12 em telas muito largas). O número 16/18 é apenas o teto hipotético com refresh em cada avanço.
- Conta Adsterra consultada em 19/09: 821 impressões, 6 cliques, CTR 0,731%, eCPM US$0,012 e receita US$0,01; com os 10 slots atuais isso equivale a cerca de R$0,02/mês por downloader a 1 arquivo/dia. Só há dados de dois dias, então não é base suficiente para uma redução definitiva.
- Criado/atualizado `docs/ANALISE_PRECOS_MONETIZACAO.md` com a distinção entre slots atuais e refresh, custos de Vercel/Supabase/Mercado Pago/domínio e variante de teste R$2,99/R$6,99/R$17,99/R$59,99. Nenhum preço ou refresh foi alterado/publicado nesta rodada.
- Próxima ação exata: confirmar tarifa líquida do Mercado Pago, custos reais de Vercel/Supabase/domínio e acumular 30 dias de Adsterra; só então aplicar um refresh aprovado pelo provedor ou um teste server-side de preço.

## Current checkpoint — Git secret history scan

- Foram verificados 205 commits e o working tree contra padrões de alta confiança (`sk_*`, `APP_USR-*`, chaves privadas, `AKIA*`, `sb_secret_*`); nenhum match foi encontrado.
- `.env.local` existe apenas localmente e não está rastreado; o repositório rastreia somente `.env.example`.
- O scanner especializado continua indisponível no cache; não há motivo atual para rotação emergencial, mas a rechecagem especializada permanece registrada.

## Current checkpoint — protected API edge probes

- Production anonymous probes passed: download session rejects `GET` with `405`, invalid content type with `400`, and explicit cross-site metadata with `403`.
- Direct cross-site download-open is `403`; admin mods is `403`.
- Unsigned Mercado Pago webhook is `401`; `GET` is `405`.
- VIP checkout returns `503 {"error":"disabled"}`, confirming the live checkout gate remains active rather than calling the provider.
- No data mutation, credential use or payment action occurred.
- Exact next action: commit the API QA checkpoint; remaining launch items are external audit/PageSpeed recovery and the separately authorized live-payment handoff.

## Historical checkpoint — dependency refresh deployed

- Public deployment from `fb961a0` is responding correctly: home and mod detail `200`, anonymous admin API `403`, and root `llms.txt` remains `text/plain`.
- Compatible dependency refresh is live with no observed route or security-contract regression.
- The later full npm audit recheck returned 0 vulnerabilities.
- Exact next action: wait for the audit service/PageSpeed quota or proceed with the authorized commercial Mercado Pago handoff; no blind dependency or UI changes remain.

## Historical checkpoint — compatible dependency maintenance

- `npm update` refreshed dependencies only within the existing semver ranges: Supabase, Tailwind, ESLint, next-intl, framer-motion, lucide and Zustand moved to their current allowed releases; Next remains pinned at secure `16.3.5`.
- Build, lint, TypeScript and smoke 24/24 pass after the refresh.
- No `audit fix --force` was used; a later full audit returned 0 vulnerabilities.
- Exact next action: commit/push the lockfile maintenance, then perform the public post-deploy smoke. Re-run audit when the registry recovers.

## Current checkpoint — protected download post-deploy QA

- Public mod detail loaded after the latest deployment with the expected Download, Technical Specifications and Adsterra 320×50/728×90/300×250 placements.
- Anonymous Download opened the three protected stages; Skip 1/3 and Skip 2/3 advanced to “Ready to download”, with no own console warnings/errors.
- The final external file action was intentionally not clicked.
- The explicit absolute URL navigation change is therefore compatible with the protected flow.
- No further product change was needed in this round.
- Exact next action: commit the QA checkpoint; wait for npm audit service recovery/PageSpeed quota or the authorized Mercado Pago handoff.

## Historical checkpoint — release batch after Next.js upgrade

- `next` and `eslint-config-next` are now `16.3.5`, removing the critical advisory reported against `next@16.2.10`.
- Build, TypeScript and smoke 24/24 pass after the upgrade; lint now passes with no warnings after making the protected download URL explicit while preserving full navigation.
- The initial npm audit endpoint returned `503`; a later full recheck returned 0 vulnerabilities.
- `npm audit fix --force` was intentionally not used.
- Consolidated status: `docs/RELEASE_READINESS.md`.
- Exact next action: commit/push the dependency and download-flow update; rerun the audit after npm maintenance ends.

## Current checkpoint — sitemap integrity

- Production `sitemap.xml` contains 33 canonical URLs; every published URL was crawled read-only and returned a `2xx` response after redirects.
- No broken catalog, localized, legal or discovery URL was found in the sitemap.
- No application code changed in this checkpoint.
- Exact next action: continue release QA with remaining launch evidence; keep sitemap generation unchanged.

## Current checkpoint — localized catalog route matrix

- Production matrix passed for home, search and all seven catalog categories in `en`, `pt` and `es`.
- All 27 requests returned `200` and stayed on their canonical locale paths; no unexpected fallback or redirect was observed.
- No application code changed in this checkpoint.
- Exact next action: continue the release checklist with remaining measurable checks; keep the localized route structure unchanged.

## Current checkpoint — production security-header audit

- Home, mod detail, admin API, download-open API and VIP-status API all return the expected security headers in production.
- Confirmed: CSP frame/object/base/form restrictions, one-year HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, Referrer Policy and Permissions Policy.
- `/api/admin/status` and `/api/download/open` remain `403` with no-store JSON; `/api/vip/status` remains no-store.
- `Cross-Origin-Opener-Policy` is not currently sent. It remains a deliberate follow-up rather than an automatic change because Google OAuth/popups must be regression-tested first.
- No application code changed in this checkpoint.
- Exact next action: continue release QA; if COOP is revisited, test OAuth popup and callback behavior before publishing.

## Current checkpoint — Anti-Adblock clean/blocked browser QA

- Clean in-app browser loaded both visible Adsterra 160×600 hosts with provider-created iframes; no gate and no own `warn`/`error` console entries.
- Edge profile with the installed blocker showed the premium “We detected an ad blocker” dialog and no ad slots, with no own console entries.
- Clicking the retry action while the blocker remained enabled caused the gate to persist; it did not become a bypass.
- The result supports the current detector separation: provider creative loaded in the clean profile, while cosmetic/provider blocking stopped the blocked profile.
- No application code changed in this checkpoint.
- Exact next action: keep the gate unchanged and continue remaining release QA; do not add stricter heuristics from this successful reproduction.

## Current checkpoint — auth/VIP public-surface verification

- Production route audit completed for `/en/login`, `/en/vip`, `/en/favorites` and `/en/settings`.
- `/en/login` and `/en/vip` return `200` with no-store/private caching; VIP is a public presentation surface and entitlement remains server-side.
- Anonymous `/en/favorites` renders the intended empty state with “SIGN IN TO VIEW YOUR FAVORITES.” rather than exposing data.
- Anonymous `/en/settings` redirects client-side to `/en/login`; no account form is exposed without a session.
- Clean in-app browser showed the expected dark UI and no own console error during the route checks.
- No application code changed in this checkpoint.
- Exact next action: continue the launch checklist with evidence-based QA; do not alter auth or VIP behavior unless a reproducible defect appears.

## Current checkpoint — image quota fallback published

- Public verification after `db5e62a` showed `/_next/image?...&w=384` returning `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`, so Vercel's transformation quota was a launch blocker even after the width was restored.
- Commit `b542e48` sets `images.unoptimized: true`; it is pushed to `origin/main` and the public browser now renders catalog images from their existing remote URLs with no `/_next/image` requests.
- Validation: lint, TypeScript, production build and smoke **24/24** pass. The initial sandbox build hit Windows `spawn EPERM`; the escalated rerun passed.
- Clean public-browser console remains empty for app warnings/errors. PageSpeed's repeat run was blocked by the API's daily quota (429); do not treat its missing result as a site regression. The earlier two Adsterra `invoke.js` 500s remain third-party/provider-side until a clean browser reproduces a user-visible failure.
- Follow-up clean-browser audit: `/en`, `/en/category/maps`, and `/en/mod/c2aaf8bb-8de8-426b-ae34-db6f853c600d` all render with no own `warn`/`error` logs; the category cards and detail Download/specification surfaces are present. Public `/llms.txt` returns `200`, `Content-Type: text/plain`, `X-Matched-Path: /llms.txt`, and the expected Markdown body.
- Protected download smoke: anonymous browser session advanced through “Securing your file” → “Almost there” → “Ready to download” with the three ad stages present and no own console warnings/errors. The final external file was not opened.
- Test harness maintenance: the full glob runner reported seven fixture-argument failures because isolated tests require an explicit temporary dependency path, plus two stale harness assumptions. Updated `tests/auth-focus-flow.mjs` to match the current ref-backed focus implementation and stubbed `FavoriteButton` in `tests/subcategories.test.mjs`; the focused checks now pass. Do not treat the missing cached `nanoid` version during temporary dependency installation as a product failure.
- Favicon production check: `/en` emits both shortcut and regular icon links to `/icon.jpg`; the public JPEG and `/icons/guizz-180.png` Apple icon return `200` with `image/jpeg` and `image/png` respectively.
- Public discovery check: `robots.txt` returns `200 text/plain` with catalog allowed, private/API routes disallowed, and a canonical sitemap link; `sitemap.xml` returns `200 application/xml` with 33 URLs and 99 locale alternates; `manifest.webmanifest` returns `200 application/manifest+json`, and its 192/512 PNG icons return `200`.
- Public API security check: anonymous `/api/admin/status` and direct `/api/download/open` return `403` with `no-store` JSON; `GET /api/download/session` returns `405`; `/api/vip/status` returns only `{\"vip\":false}` with `no-store`. Security headers remain present on every response.
- Legal/public trust check: all 12 About, Privacy, Terms and Contact routes across `en`, `pt` and `es` return `200` with localized titles; no `mercadopago_access_token`, `service_role`, `private_note` or `terabox_url` fields appear in their HTML.
- Exact next action: keep the direct-image fallback stable, re-run PageSpeed only after its quota resets, and evaluate a real CDN/loader later if bandwidth cost becomes measurable.

## Current checkpoint — production fix published

- The public verification after commit `768f9aa` found that Vercel still served `/llms.txt` as localized HTML (`X-Matched-Path: /[locale]`) even though the local smoke was correct.
- Added an explicit `/llms.txt` early pass-through in `src/proxy.ts` so next-intl cannot rewrite the machine-readable asset, plus a regression assertion in `tests/site-smoke.test.mjs`.
- Validation after the fix: lint, TypeScript, production build, `git diff --check`, and smoke **22/22** pass. The first sandbox smoke attempt hit Windows `spawn EPERM`; the escalated rerun passed.
- Commit `6a4cd20` is pushed to `origin/main`; the next action is to wait for/verify the Vercel deployment and confirm the public response is `text/plain` with `# GuizzMods`.
- PageSpeed quantitative remeasurement remains next after this deployment. Do not start another media/third-party optimization until the same mobile profile is measured.

## Latest public measurement — image batch

- Commit `79a36b7` publishes responsive Next/Image breakpoints (`400px` hero target and `160/220px` card targets) without changing image sources or layout.
- PageSpeed mobile run at 12:14 BRT: performance 62, FCP 0.9s, LCP 4.4s, TBT 160ms, CLS 0.487, Speed Index 2.8s; image-delivery opportunity was 47 KiB. Desktop in the same run: performance 79, FCP 0.3s, LCP 1.1s, TBT 90ms, CLS 0.339, Speed Index 1.4s; image opportunity 181 KiB.
- The run immediately after the first-paint reservation measured mobile CLS 0.312 and performance 46, while the previous run measured CLS 0.487/performance 62. Treat score and third-party timing as noisy; the stable evidence is the image-audit reduction and the split CLS attribution.
- The ad shell remains an isolated CLS source (`0.175`) in PageSpeed's attribution; the body/footer cluster remains `0.312`. Console errors and exact ad-gate behavior are still unclassified.
- Exact next action: capture a reproducible clean-browser console/layout trace before changing the Anti-Adblock gate or third-party loading. Do not remove the gate or defer above-the-fold ads based on PageSpeed variance alone.

## Lote 0 — diagnóstico somente leitura — completo

- Verificadas rotas públicas, APIs anônimas, cabeçalhos de segurança e assets de descoberta no domínio oficial.
- Confirmado: `/llms.txt` retorna o fallback HTML localizado (`Content-Type: text/html`) em vez de um recurso de texto da raiz.
- Confirmado: PageSpeed mantém o celular como foco (68; LCP 4,0 s; CLS 0,312; Speed Index 4,8 s); desktop 95.
- Provável causa de CLS: slots inline de `AdsterraInlineBanner` só recebem dimensões após `ResizeObserver`; ainda falta confirmar o elemento por medição de layout shift.
- PageSpeed confirmou erros de console, mas a captura não revelou as mensagens; não atribuir ao app sem DevTools reproduzível.
- Nenhum código de aplicação, segredo, configuração de provedor ou pagamento foi alterado.
- Documento: `docs/DIAGNOSTIC_LOTE0_2026-09-19.md`.
- Exato próximo passo: implementar o Lote 1 em uma única rodada — reserva segura de slots, teste de CLS, classificação de console, contraste e correção explícita de `/llms.txt` — depois validar antes de publicar.

## Lote 1 — estabilidade — subset implementado localmente

- `/llms.txt` agora é um arquivo estático Markdown servido na raiz; o smoke confirma `200`, `text/plain` e locale intacto.
- Slots inline agora mantêm reserva de altura antes de entitlement, Anti-Adblock, `ResizeObserver` e scripts Adsterra; os hosts continuam com dimensões exatas do provedor.
- Rótulos visíveis de publicidade trocaram `text-zinc-500` por `text-zinc-400`, uma correção direcionada ao contraste sem alterar os tokens gerais do site.
- Validação local: lint, TypeScript, build de produção e smoke **21/21** passaram; `git diff --check` passou.
- O teste React específico de Adsterra não executou porque este checkout não contém `react-test-renderer`; nenhuma dependência foi instalada.
- Ainda pendente antes de publicar: captura DevTools para classificar erros de console; o contraste recebeu apenas a correção direcionada dos rótulos de publicidade.
- Exato próximo passo: executar a verificação read-only final e, se não houver erro próprio no console, concluir o mesmo lote antes do commit/deploy.

## Lote 2 — performance mobile — primeiro subset implementado localmente

- A home usa uma seleção explícita de oito campos de card em vez de `select('*')`, reduzindo o payload das janelas latest/trending/categorias sem remover conteúdo renderizado.
- Latest, trending e as sete consultas de categoria são iniciadas em paralelo; o fallback de trending continua preservado quando há menos de três resultados recentes.
- Adicionado teste de regressão para manter os campos bounded e evitar retorno acidental a `select('*')` na home.
- Validação após a otimização: lint, TypeScript, build de produção e smoke **22/22** passam; `git diff --check` permanece verde.
- A nota PageSpeed ainda não foi recalculada: a confirmação quantitativa depende de um deploy público e de uma nova medição com o mesmo perfil mobile.
- Exato próximo passo: medir o bundle/requests no deploy ou em uma sessão de rede controlada antes de otimizar mídia, YouTube ou terceiros.

## Reference audit and launch map — complete

- Analyzed the five supplied TikTok references as concept signals (security checklist, legal readiness, component discovery and navigation clarity) without copying their UI or behavior.
- Read the supplied PageSpeed report: desktop 95/96/96/100 and mobile 68/96/96/100; mobile priorities are CLS 0.312, LCP 4.0 s, Speed Index 4.8 s, unused JavaScript, one long task and contrast/console findings.
- Created `docs/LAUNCH_MAP.md` with the preserved working features, risks, P0/P1/P2 order, grouped batches, acceptance criteria and file map. Updated `docs/CODEBASE_MAP.md` and `AGENTS.md`.
- No application code, provider settings, account data or payment configuration changed.
- Lote 0 foi concluído e está detalhado em `docs/DIAGNOSTIC_LOTE0_2026-09-19.md`.

## Public deployment verification — complete

- Read-only check on `https://www.guizz.xyz/en/mod/c2aaf8bb-8de8-426b-ae34-db6f853c600d` confirmed the current production deployment responds with the dark theme and the published responsive ad layout.
- The public DOM exposes four horizontal placements plus the 300×250 Technical Specifications companion; the GuizzMods/Download and Overview/Technical placements are present, and the lower discovery seams are also rendered.
- No external data, account, payment or provider settings were changed.
- Exact next action: continue with the remaining launch checklist or the next concrete UI request.

## Mod detail responsive ads — published

- Centered the mobile detail summary/author/download column while keeping the desktop right column aligned.
- Added responsive horizontal leaderboard slots between GuizzMods and Download, Overview and Technical Specifications, You may Also Like and Explore, and Explore and Popular Downloads.
- Removed the extra mobile-only in-feed slot that stacked directly below the 300×250 Technical Specifications ad; the square companion remains in its intended specs column.
- Validation: lint, TypeScript, production build, smoke **20/20**, and diff check pass. Local desktop visual QA confirms the requested seam placement.
- Commit `3dda5c1` is published to `origin/main`, triggering the Vercel deployment.
- Public deployment verification is recorded above.

## Desktop detail centering — published

- Applied the same centered alignment used on mobile to the desktop detail summary: title, GuizzMods metadata and the horizontal slot now share the center of the right column.
- The Download and Favorite/Share panels remain full-width within that column.
- Validation: lint, TypeScript, production build, smoke **20/20**, and diff check pass.
- Commit `54f8874` is published to `origin/main`, triggering the Vercel deployment.
- Public deployment verification is recorded above.

## Fixed dark theme — published

- Removed the `prefers-color-scheme: dark` dependency from `src/app/[locale]/globals.css`; the site now sets dark `:root` colors, `color-scheme: dark`, and a dark `html`/`body` background unconditionally.
- Local production Edge check with a light browser profile rendered the detail page and AdBlock wall in the dark palette, matching the intended single-theme UI.
- Validation: lint, TypeScript, focused gate test, production build and smoke **20/20** pass.
- Commit `b1bf493` is published to `origin/main`, which triggered the Vercel deploy.
- Exact next action: verify the public domain again after Vercel reports the deployment ready.

## Premium AdBlock wall — published

- Replaced the old warning panel in `src/components/AdblockAccessGate.tsx` with a compact premium modal: blurred page backdrop, blue security icon, VIP gradient CTA, reload action and localized copy in EN/PT/ES.
- The detector, VIP bypass and exempt routes are unchanged. The close icon only reruns detection, so it does not bypass the gate.
- Added responsive/reduced-motion-safe visual styles to `src/app/[locale]/site-motion.css` and kept all locale message keys aligned.
- Validation: focused gate test, lint, TypeScript, production build and smoke **20/20** pass. Commit `6778f83` is published to `origin/main`.
- Production check: `https://www.guizz.xyz/en` responds normally in a clean browser after the deploy trigger; the wall remains conditional on the detector.
- Exact next action: when a browser with an active blocker is available, perform a read-only visual check of the new wall; do not change detector or payment behavior.

## Site-wide adblock gate — published and production-verified

- `AdblockAccessGate` now covers public catalog/download surfaces while exempting login, VIP and legal routes; active VIP entitlements bypass the wall.
- Detection combines two cosmetic probes, complete failure of attempted Adsterra scripts, missing provider iframes when script load is unconfirmed, a retry action and a localized VIP/sign-in path. The Edge AdBlock extension triggered the wall on the local production build; the VIP route remained accessible.
- This is UX enforcement only. Signed download/API authorization and VIP entitlement remain server-side; disabling JavaScript can never grant a download.
- Validation: focused gate test, lint, TypeScript, production build and smoke **20/20** pass. Local Edge check confirmed the wall; local Chrome confirmed clean ads continue to render.
- Modified files: `src/components/AdblockAccessGate.tsx`, `src/components/AdsterraSidebar.tsx`, `src/app/[locale]/layout.tsx`, locale messages and `tests/adblock-access-gate.mjs`.
- The first gate commit is `55f11e6`; the silent-iframe fallback is the follow-up currently being amended and must be pushed before production verification.
- Exact next action: commit/push the fallback, then verify the Vercel deployment with AdBlock enabled/paused and a clean browser before the final launch batch.
- The silent-iframe fallback and conflict resolution are published in merge commit `1565ba7`, with the checkpoint in `7ed908e`.
- Production verification: Edge with AdBlock showed the full wall and retry/VIP actions; Chrome without a blocker rendered Adsterra iframes and no wall; the public VIP route remained accessible.
- Exact next action: keep this guard unchanged and proceed to the remaining launch checklist (payment production handoff and final mobile/desktop QA).

## Stable browser favicon — local complete

- Published Anti-Adblock script correction in `03b8f73` to `origin/main`.
- Production verification showed `/icon.jpg` is the intended cat logo, while the browser tab could fall back to a provider/deployment icon because only the Apple icon was explicit.
- `src/app/[locale]/layout.tsx` now explicitly declares `/icon.jpg` for regular and shortcut icons; the smoke test asserts the metadata. Lint, TypeScript, build and smoke **20/20** pass locally.
- Current work: commit and push the favicon metadata correction, then verify the new deployment once Ready.

## Adsterra Anti-Adblock script update — local complete

- Read-only dashboard check: `guizz.xyz` (website ID `6050144`) has five placements and all are **Active**: 300×250 (`31224064`), 160×600 (`31223855`), 320×50 (`31224000`), 728×90 (`31224126`) and 468×60 (`31224127`). No reactivation or new placement was needed.
- The warning is tied to the old Codes URL selection (`ad_units[]=28&ad_units[]=44`), not the current active placements.
- The regenerated snippets use `canvassanymorephotography.com`; `AdsterraSidebar` now uses that approved origin for every active format instead of the previous `highrevenueformat.com` origin.
- Focused Adsterra/download tests, lint, TypeScript, production build, smoke **20/20** and diff check pass locally.
- Current work: commit the local script update; pushing/deploying still requires explicit authorization.

## UI audit follow-up — local complete

- Subagent audit found the VIP promo's `translateX(-50%)` was only present during the animation; after it ended, `transform` reset and the fixed notice shifted right. It now has a permanent centered transform, `animation-fill-mode: both`, valid responsive `calc()` widths, and mobile overflow protection.
- Mod detail layout now uses a flexible zero-basis main column and explicitly centers the 300×250 Technical Specifications companion ad in its grid cell, improving the upper media/info row and square-ad use of space.
- Added a regression assertion for the centered VIP promo in `tests/download-flow-mobile.mjs`.
- Lint, TypeScript, production build, Adsterra/download tests, smoke **20/20**, and diff check pass. Published in commit `9fba271`; Vercel deployment is expected from `origin/main`.

## Favorites and ad surfaces batch — validated locally

- Restored the 300×250 square companion ad beside Technical Specifications; the horizontal unit remains only in category feed inserts.
- Kept the Download without the wait promo fixed above the download flow; it now hides only through its X action (or for VIP users).
- Added a reusable authenticated FavoriteButton to home/category/search/favorites/recommendation cards. The heart stops card navigation, persists to Supabase favorites, and uses one shared auth listener.
- Added one synchronized Guizz-palette animated frame around all Adsterra formats, rounded provider hosts, tightened inline spacing, and made the side-rail container responsive without stretching the provider's official 160×600 creative.
- Lint, TypeScript, production build, focused Adsterra/download tests and smoke **20/20** pass locally.
- Commits `23541c5` and `daab6a1` are now published to `origin/main`; Vercel should build the complete batch as one deployment. Do not split the visual changes into separate deployments.

## Ad layout and homepage discovery batch — local complete

- Removed the 300×250 creative from stacked side rails so only the sticky 160×600 rail remains on desktop; ModViewer rail wrappers now stretch with the full page row so the rail follows deep scrolling.
- Category inline placements now use the responsive horizontal leaderboard unit instead of the square unit. The ad beside Technical Specifications also uses the responsive horizontal unit.
- Home category rails now query their latest eight records independently from the global 50-item window, restoring full Latest skins discovery when other categories are newer.
- Download VIP notice now slides in from the side and keeps the reduced-motion fallback.
- Focused Adsterra and narrow-download tests pass, smoke is 20/20, lint/TypeScript/build pass. No provider settings or payment configuration changed.
- Published in commit `bd47e6c` to `origin/main`; Vercel deployment is now expected from the main branch.
- Next action: verify the generated deployment read-only when it is Ready; do not split these ad/layout changes into separate deployments.

## Ad layout cleanup — published (2026-09-18)

- Reworked `AdPlaceholder` to keep one neutral layout shell while the provider owns creative dimensions; removed page-level bordered/fixed-height placeholder styling from home, category, search, mod detail and download flow slots.
- Made both normal and stacked Adsterra side rails sticky with the same top offset; removed duplicate download labels and decorative boxes that made banners look embedded.
- Lint, TypeScript, production build, focused Adsterra lifecycle test and smoke 20/20 pass locally. Worktree changes are not published yet.
- Follow-up found and fixed the final sticky issue: side rails no longer sit inside an equal-height shell, so the rail itself can follow document scrolling. The stacked right rail is capped to the visible viewport and scrolls internally when both creatives exceed it.
- The layout batch is published through `af83e92`; production verification confirmed direct provider iframes, exact creative sizes, neutral inline/download shells and both 160×600 rails remaining at the same sticky top position after deep scrolling. The right column stretches with the main row while its 300×250 creative stays below the vertical rail. Build, smoke 20/20 and focused Adsterra tests pass.

## Adsterra direct DOM correction — 2026-09-18

- Replaced the nested `srcDoc`/sandbox integration in `src/components/AdsterraSidebar.tsx` with direct page-DOM hosts that append the official `atOptions` and `invoke.js` scripts. The provider can now create its own iframe from the top-level page context.
- VIP entitlement gating, ad-blocker messaging, responsive format selection, labels and all five existing units remain unchanged. No provider dashboard setting or secret was changed.
- Focused Adsterra lifecycle test, lint, TypeScript, production build and smoke **20/20** passed. Commit `07a156f` is published to `origin/main`.
- Clean in-app browser verification confirmed the production page now contains direct Adsterra hosts, provider-created child iframes and visible creatives in the 160×600 and 300×250 placements. Temporary test tabs were closed; no ad was clicked.

## Adsterra delivery diagnosis — 2026-09-18

- Read-only Adsterra check: `guizz.xyz` is visible, statistics are ON, and all five banner units show **Active** (300×250, 160×600, 320×50, 728×90, 468×60).
- Statistics filtered to **Last 7 Days (11–17 Sep, UTC)** still show **No data**. Adsterra documents that impressions require a fully loaded ad and can exclude proxy/VPN/Tor and AdBlock traffic; statistics may update within 10 minutes.
- Production DOM has the expected ad iframes and exact public keys, but each iframe contains only the original `atOptions` + `invoke.js` tags and no child creative iframe after waiting. The provider script's public code contains an early nested-window guard (`window/top/document`) that exits when run inside an iframe.
- Root cause identified: the integration placed Adsterra's official body snippet inside `srcDoc` iframe(s), so the vendor saw a nested window and aborted. Incognito did not change this code-path. The direct-DOM correction above addresses this; browser fill remains dependent on provider availability and traffic quality outside the verified clean session.

## VIP expiry and ad reactivation — complete

- O gate de anúncios agora lê também `expiresAt` e agenda nova consulta no momento do vencimento; se o VIP expirar enquanto a página estiver aberta, os anúncios voltam sem exigir reload.
- A autorização continua server-side: `/api/vip/status`, download e entitlement só reconhecem registros com `expires_at > now()`.
- Teste focado, lint, TypeScript, build e suíte completa **85/85** passaram; commit `e174427` foi publicado em `origin/main`.
- O preenchimento visual da Adsterra continua dependente do navegador, bloqueadores e disponibilidade de campanha; os slots estão presentes na produção.

## Release gate after roadmap sync — complete

- Após a atualização documental, `npm run lint`, `npx tsc --noEmit` e o smoke da aplicação foram verificados.
- O smoke precisou ser repetido fora do sandbox por uma restrição de criação de processo; o resultado final foi **20/20**.
- Nenhum arquivo de código, segredo, pagamento ou configuração externa foi alterado.
- Próxima ação: não abrir checkout real automaticamente; aguardar uma necessidade concreta ou decisão sobre o plano Supabase.

## Supabase leaked-password protection — externally unavailable

- O painel de produção foi conferido em **Attack Protection**: Turnstile continua ligado, mas “Prevent use of leaked passwords” aparece como **DISABLED** e só oferece configuração pelo provedor de e-mail.
- A documentação oficial do Supabase informa que essa proteção exige plano Pro ou superior; o projeto atual está no plano Free.
- Nenhuma configuração externa foi alterada. O app mantém mínimo de 8 caracteres, CAPTCHA Turnstile e os limites nativos do provedor.
- Próxima ação: não insistir em redeploy por causa desse item; só reavaliar após eventual upgrade do plano.

## Production protected-download smoke — complete

- O deployment de produção gerado pelo `main` abriu um mod público normalmente como visitante.
- O botão Download criou o fluxo protegido com aviso VIP e contador; o primeiro Skip ficou desabilitado até o tempo mínimo e depois habilitou.
- Nenhum anúncio foi clicado, nenhum destino externo foi aberto e nenhum pagamento foi iniciado.
- Próxima ação: manter este comportamento; a próxima mudança deve ser uma necessidade concreta do roadmap, não outro redeploy de verificação.

## Download session cross-site hardening — complete

- A sessão assinada agora rejeita sinais explícitos de requisição cross-site (`Sec-Fetch-Site` ou `Origin`) antes de analisar o corpo ou tocar no ledger privado.
- Navegadores que omitem esses cabeçalhos continuam compatíveis; a rota final já mantinha a mesma proteção antes do consumo do nonce.
- Adicionado teste de regressão para `cross-site` e origem externa. Foco, suíte completa (85/85), lint, TypeScript, build e smoke (20/20) passaram; o scanner Claude Flow permanece indisponível offline.
- Commit `2e18a69` (security: reject cross-site download sessions) foi publicado em `origin/main` após autorização explícita; o deploy automático pode iniciar sem alterar credenciais ou pagamentos.
- O Vercel gerou os deploys de produção dos commits `2e18a69`/`d8387b1` como **Ready**; a implantação mais recente foi aberta em modo somente leitura e exibiu página, navegação, catálogo e anúncios normalmente.
- `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` continua `false`; nenhuma credencial, pagamento ou configuração externa foi alterada.
- Próxima ação: seguir para a próxima pendência do roadmap somente após escolher uma mudança concreta; não repetir este deploy.

## Auth controlled E2E — complete

- O cadastro de teste recebeu a confirmação, o link retornou ao domínio oficial e a sessão autenticada foi reconhecida na página VIP.
- A área protegida de configurações abriu com o usuário autenticado e exibiu o cartão Guizz VIP sem entitlement ativo.
- O login por senha foi concluído no domínio oficial e redirecionou para a área VIP autenticada.
- O pedido de recuperação foi aceito e o e-mail chegou à caixa de teste com link de redefinição; o agente não abriu o link nem viu/manipulou a senha.
- Após confirmação explícita, o link abriu no mesmo navegador; o usuário digitou a nova senha diretamente e o formulário redirecionou para a página VIP autenticada.
- Não foi aberto checkout, não houve pagamento e nenhum segredo foi manipulado pelo agente.
- Próxima ação: manter a configuração atual e não repetir o teste de recuperação sem necessidade.

## Supabase auth settings read-only verification — complete

- O painel de produção confirma cadastro permitido, confirmação de e-mail ativa, Google habilitado e proteção CAPTCHA ligada com Turnstile.
- A URL oficial e os callbacks autorizados foram conferidos; a configuração não foi alterada.
- O teste ponta a ponta com uma caixa de e-mail controlada foi concluído; a proteção contra senhas vazadas permanece indisponível no plano Free.

## Release validation and lint cleanup — complete

- A suíte completa agora passa sem falhas: 84 testes; lint, TypeScript, build de produção e smoke (20/20) também passaram.
- Corrigidos dois pontos descobertos pela validação: o foco pós-troca de modo no login usa uma ref sincronizada com o modo, e a requisição compartilhada do bloqueio de anúncios usa declaração constante.
- QA somente leitura no domínio oficial confirmou o botão Google, o container Turnstile e o cadastro com foco no e-mail; nenhum login, CAPTCHA, e-mail ou pagamento foi enviado.
- Nenhuma credencial, configuração externa ou cobrança foi alterada; `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` continua desligado.
- Próxima ação: verificação externa controlada de login/cadastro-confirmação/recuperação com uma única caixa de teste; sem novos ajustes de código até surgir evidência.

## VIP active-state checkout guard — complete

- Quando o status server-side indica VIP ativo, o resumo do plano agora mostra o estado e a gestão da conta, sem oferecer um segundo checkout por engano.
- A proteção vale apenas para a interface: pedidos e entitlement continuam validados no servidor; o checkout real permanece desligado por configuração.
- Adicionado teste focado de estado ativo; validação passou: 5 testes VIP, lint, TypeScript, build e smoke (20/20).
- Próxima ação: manter checkout real desligado e seguir para a verificação controlada de autenticação.

## Ad entitlement single-flight batch — complete

- Vários espaços de anúncio montados juntos agora compartilham uma única consulta de entitlement para o mesmo token, evitando chamadas duplicadas ao status VIP sem persistir token no navegador.
- Cada instância ainda ignora respostas fora de ordem e mantém o comportamento fail-open para anúncios quando a consulta falha; usuários VIP continuam sem montar iframes de terceiros.
- Adicionado teste focado de single-flight; validação passou: teste focado, lint, TypeScript, build e smoke (20/20).
- Próxima ação: manter checkout real desligado e seguir para a verificação controlada de autenticação.

## Auth provider discovery cleanup — complete

- Removida a consulta pública de configurações do Supabase usada para decidir se o Google aparecia; o botão permanece visível em login/cadastro e a autorização do próprio provedor continua sendo a fonte de verdade.
- A remoção evita uma chamada desnecessária ao domínio do backend e alinha `docs/auth-rollout.md` ao comportamento publicado.
- Teste de foco e fixture do callback atualizados; 11 testes de autenticação, lint, TypeScript, build e smoke (20/20) passaram, além de `git diff --check`.
- Próxima ação: manter checkout real desligado e aguardar somente a verificação controlada de autenticação.

## Download access and repository privacy audit — complete

- As rotas de sessão e abertura continuam exigindo cookie HMAC válido, nonce server-side não consumido, prazo concluído, origem compatível e destino permitido; o consumo é atômico antes do redirecionamento.
- Nenhum atalho de cliente ou retorno VIP concede acesso. O host específico do Supabase foi removido da documentação pública do repositório, mantendo apenas um marcador genérico.
- Fixtures dos testes de acesso foram alinhados ao observability atual; testes de acesso/download e privacidade, lint, TypeScript, build e smoke (20/20) passaram.
- Próxima ação: manter checkout real desligado e aguardar somente a verificação controlada de autenticação.

## Contact privacy batch — complete

- A revisão dos canais públicos confirmou que o conteúdo não expõe e-mail pessoal, endereço `mailto:` nem URL do projeto Supabase; o contato usa apenas Discord e YouTube oficiais.
- Links externos da página de contato agora usam `referrerPolicy="no-referrer"`, evitando enviar a URL do GuizzMods como referência ao abrir esses serviços.
- Adicionado `tests/contact-privacy.mjs`. Validação passou: teste focado, smoke (20/20), lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: manter checkout real desligado e seguir para a próxima pendência priorizada, sem alterar credenciais ou configurações externas.

## Safe observability batch — complete

- Critical auth, VIP status and protected-download failures now emit only sanitized stage/code labels; user IDs, e-mails, tokens, destinations and provider payloads are never logged.
- Added focused regression coverage in `tests/server-observability.mjs`. Validation passed: focused test, lint, TypeScript, production build and `git diff --check`.
- External Claude Flow security scan remains unavailable offline (`ENOTCACHED`); no dependency or payment setting changed.
- Próxima ação: revisão mobile/UX restante; o teste de confirmação de e-mail continua aguardando uma caixa de teste controlada.

## Mobile navigation performance batch — complete

- A barra inferior agora mantém um único listener de rolagem e guarda a posição em `useRef`; isso evita recriar listeners a cada movimento e reduz renderizações redundantes.
- Adicionado teste focado em `tests/mobile-nav.mjs`. Validação passou: teste focado, lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: continuar a revisão mobile/UX somente onde houver ganho concreto; manter o checkout real desligado.

## Narrow download layout batch — complete

- O placeholder de anúncio retangular no fluxo de download agora se adapta a telas abaixo de 360 px, evitando overflow horizontal sem mudar a unidade real de anúncios.
- Adicionado teste focado em `tests/download-flow-mobile.mjs`. Validação passou: teste focado, lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: encerrar a revisão mobile/UX se não surgir outro problema concreto; manter o checkout real desligado.

## Error privacy and localized retry batch — complete

- Busca e catálogo não exibem mais exceções brutas no console; a busca agora mostra uma mensagem localizada e permite tentar novamente sem apagar resultados já carregados.
- Cancelamento do compartilhamento não registra detalhes do navegador, e falhas de comunicação com o Mercado Pago registram somente uma classe sanitizada.
- Validação passou: teste focado, smoke (20/20), lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: manter a verificação externa somente leitura e aguardar o teste controlado de confirmação de e-mail; checkout real permanece desligado.

## Auth password visibility batch — complete

- Login, cadastro e atualização de senha agora oferecem controles Mostrar/Ocultar localizados e acessíveis, sem alterar o valor enviado nem a política de senha.
- Adicionado teste focado em `tests/auth-password-visibility.mjs`. Validação passou: teste focado, lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: verificação externa controlada do fluxo de confirmação/recuperação, aguardando uma caixa de teste; checkout real permanece desligado.

## Auth focus and announcement batch — complete

- Trocas entre entrar, cadastrar e recuperar senha agora devolvem o foco ao campo de e-mail e anunciam o subtítulo do modo atual para leitores de tela.
- Adicionado teste focado em `tests/auth-focus-flow.mjs`. Validação passou: teste focado, lint, TypeScript, build de produção e `git diff --check`.
- Próxima ação: verificação externa controlada do fluxo de confirmação/recuperação, aguardando uma caixa de teste; checkout real permanece desligado.

## VIP checkout copy alignment — complete

- A página VIP agora adapta o texto do topo e da seção de planos ao modo efetivo: pré-lançamento, teste PIX ou pagamento PIX.
- Isso elimina a contradição entre mostrar um botão de checkout e informar que nada está disponível. Teste focado, smoke (20/20), lint, TypeScript, build e `git diff --check` passaram.
- Próxima ação: manter o checkout real desligado até nova autorização explícita; a etapa externa pendente é o teste controlado de autenticação.

## VIP return notice batch — complete

- Retornos com `checkout` agora exibem um aviso seguro mesmo depois que o modo de checkout é desligado; o texto nunca afirma que o VIP foi ativado sem confirmação server-side.
- Avisos localizados foram adicionados aos três idiomas. Teste focado, smoke (20/20), lint, TypeScript, build e `git diff --check` passaram.
- Próxima ação: manter o checkout real desligado e aguardar apenas a verificação controlada de autenticação.

## Legal disclosure update — complete

- Política de Privacidade atualizada em inglês, espanhol e português para refletir Google OAuth, confirmação de e-mail, Mercado Pago PIX e a ausência de armazenamento de credenciais de pagamento.
- Termos de Uso agora explicam que o VIP é opcional, a cobrança é PIX via Mercado Pago e benefícios só são liberados após verificação server-side e dentro do período comprado.
- Lint, TypeScript e `git diff --check` passaram; nenhuma credencial, limite, pagamento ou regra de entitlement foi alterada.
- Verificação somente leitura no domínio oficial confirmou a nova data e os textos de privacidade e Termos publicados após o deploy automático.
- Próxima ação: seguir para observabilidade e polimento mobile restantes, mantendo o checkout real desligado.

## Email confirmation policy — complete

- Supabase Auth agora exige confirmação para novos cadastros por e-mail; a configuração foi salva e verificada no painel.
- O callback publicado aceita `signup`, o template usa `{{ .ConfirmationURL }}` e as URLs permitidas incluem o domínio oficial e o alias estável de teste.
- Google continua independente (não depende de confirmação por e-mail). CAPTCHA/limites do provedor continuam ativos; nenhum limite ou pagamento foi alterado.
- Próxima ação: seguir para a próxima pendência do mapa consolidado, sem reabrir checkout real.

## Auth input hardening batch — complete

- Centralized e-mail normalization and username validation before signup, reset, sign-in and confirmation-resend calls; oversized, malformed or control-character inputs stop locally with generic localized messages.
- Validation is green: 84/84 tests, ESLint, TypeScript, production build and `git diff --check` pass. CAPTCHA and Supabase provider limits remain the actual abuse boundary; no payment setting changed.
- Published in commit `0f6b9af`; Vercel reports Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## VIP desktop discovery batch — complete

- Added a prominent localized VIP CTA to the desktop header while preserving the existing mobile VIP navigation.
- `TopHeader`, shared motion styles, locale messages, smoke coverage and map navigation notes are complete.
- Validation is green: 83/83 tests, ESLint, TypeScript, production build and `git diff --check` pass. Commit `527109e` is pushed and Vercel reports the production deployment Ready.
- Next action: continue with the next prioritized item in `docs/CODEBASE_MAP.md`; keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## Consolidated release-hardening batch — complete

- User requested a codebase map and grouped implementation to replace one-fix-at-a-time updates.
- Created `docs/CODEBASE_MAP.md` and linked it from `AGENTS.md` with architecture, flows, navigation, risks and the prioritized roadmap.
- Hardened signed download-token shape validation, reject present cross-site signals before a one-time download nonce can be consumed, and made DownloadFlow cancellation/expiry cleanup consistent.
- Validation is complete: 82/82 tests, ESLint, TypeScript, production build and `git diff --check` pass. The external cartographer scanner could not run because its token package was unavailable offline; the map records the bounded 128-file inventory and estimate.
- Published in commit `8b4af8e`; Vercel reports the production deployment Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## VIP reconciliation lookup cooldown — complete

- Authenticated VIP status recovery now permits at most one live Mercado Pago lookup per user every 30 seconds in a bounded process-local map, with stale-entry cleanup. It remains fail-closed and does not change checkout or entitlement rules.
- Full suite is green at 80/80; lint, TypeScript, production build and `git diff --check` pass. The external Claude Flow scanner was unavailable offline (`ENOTCACHED`). Commit `f3a4fd2` is pushed and Vercel Production deployment `site-mods-iojegpc46-guizz1.vercel.app` is Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## Download timer return-sync — complete

- Protected-download stages now track client deadlines and reconcile `stepTimer`/`finalTimer` on `pageshow` and `visibilitychange`, so a background-tab pause cannot leave the visual countdown stale.
- Returning after expiry resets the local flow; the signed session, preflight and atomic `/api/download/open` checks remain authoritative. Full suite is green at 79/79; lint, TypeScript, production build and `git diff --check` pass.
- Commit `407b53a` is pushed to `origin/main`; Vercel Production deployment `site-mods-7h8yj7dav-guizz1.vercel.app` is Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## One-time download consumption — complete

- Closed the replay gap in the protected download flow. Each issued signed cookie now has a server-owned nonce row in `download_access_sessions`; `/api/download/open` preflights without consuming and atomically consumes the nonce for the final redirect.
- Anonymous visitors still wait through the existing stages; VIP visitors still open without the wait. A copied cookie cannot be reused for another redirect after consumption.
- Supabase rollout was executed and verified: table exists, RLS is enabled, `anon`/`authenticated` have no SELECT privilege, and `service_role` has the required access. Security advisors remain at the existing optional leaked-password warning only.
- Validation: focused download tests 5/5, full suite 73/73, ESLint PASS, TypeScript PASS, production build PASS, `git diff --check` PASS.
- Commits `90e5297` and `b510a89` were pushed to `origin/main` after the user authorized publication. Vercel deployment `GfaNNRWzjypCXZPeduvTKAtBgrK4` is Ready on Production. Official mod-page verification reached the external download destination directly for the active VIP account; no ad was clicked and no payment was opened.
- Supabase migration history now also records `one_time_download_sessions` (`20260917190808`); the security advisor still reports only the pre-existing optional leaked-password warning.
- The session endpoint now reuses an active browser session instead of issuing duplicate wait tokens for the same mod. Full suite is green at 73/73 after this follow-up; the live payment gate remains off.
- Follow-up commit `12fb8f9` is pushed to `origin/main`; Vercel deployment from that commit is Ready on Production.
- Download session/open responses now send `Referrer-Policy: no-referrer`, including the final external redirect, so the provider does not receive the originating path. Commit `9f0baf2` is pushed and its Vercel Production deployment is Ready; full suite remains 73/73.
- Admin catalog database failures now return generic 503 messages while logging only a safe stage/code pair server-side; full suite is green at 74/74. The live payment gate remains off.
- Commit `15cab5b` is pushed to `origin/main`; the next Vercel Production build is triggered from this commit. No payment setting changed.
- Admin mutation requests now require JSON and are capped at 64 KiB before parsing; full suite is green at 75/75. This is ready to publish with the live payment gate still off.
- Auth settings hardening is published in commits `591438f` and `9d2ac65`: settings blocks duplicate logout clicks, handles sign-out errors generically, clears local VIP/account state, uses `router.replace` for logout and expired-session redirects, and no longer displays raw Supabase errors for profile/password changes. Final lint/build and full 76/76 validation pass.
- VIP motion polish is published in `f050cec`: plan cards, the member card and button press feedback have opt-in, pointer-only motion with reduced-motion support. Lint, production build and full 76/76 tests pass; Vercel reports the deployment Ready.
- VIP ad entitlement refresh is published in `e55fa2b`: `VipAdGate` rechecks status on Supabase auth changes, hides third-party ad frames while the new entitlement is resolved, and uses request ordering to ignore stale responses. Lint, production build and full 77/77 tests pass; Vercel reports the deployment Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.
- VIP status return refresh is published in `9df5374`: `VipExperience` revalidates the current session on `pageshow` and visible-tab changes, so a confirmed entitlement or logout is reflected without a manual reload. Lint, production build and full 78/78 tests pass; Vercel reports the deployment Ready. Keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.

## Live PIX opening test completed

- The user authorized enabling a real Mercado Pago PIX checkout for a supervised test. `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` is active in Production and must be treated as capable of creating real charges.
- The first Production redeploy still had a masked bullet placeholder in `MERCADOPAGO_ACCESS_TOKEN`, proven by the runtime `ByteString` error. That value was replaced with the real Production token copied internally from the official Mercado Pago credentials page; the token was not recorded in project files or chat.
- Vercel redeploy `B6UBP1b5Ph7fQm5eSCSkQ4RdkQ7F` (`site-mods-k18pj88qw-guizz1.vercel.app`) is **Ready** on Production and includes the official domain.
- Final opening test succeeded: Mercado Pago opened a PIX ticket for the monthly plan. No QR was scanned, no PIX was confirmed, and no VIP entitlement was activated by this agent. The checkout tab is handed off for the user to decide manually.
- Exact next action: user may complete or abandon the PIX manually. After the manual test, disable `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` to prevent additional live orders unless the user explicitly requests ongoing live checkout.

## Live PIX payment confirmed — webhook pending

- The Mercado Pago ticket now visibly says the payment was completed. The corresponding `vip_orders` row exists for the live monthly plan with status `checkout_created`.
- Supabase `vip_webhook_events` still has zero rows after repeated refreshes, and `/en/settings` still shows the regular “Explore VIP” card. No VIP entitlement was created yet.
- This is a webhook-delivery/configuration or provider retry issue, not a second-charge situation. Do not open another checkout. Next action is to use the existing server reconciliation path or resend the official Order webhook, then verify the entitlement and turn the live gate off.
- After confirming the payment, the live gate was set back to `false` and Vercel redeploy `CgfrMAd6RtNJPAbdvj27bBBem5cE` was created. This blocks new real orders while the already-paid order is recovered.

## Automatic paid-order recovery added

- `src/lib/vip-entitlement.ts` now performs a bounded, server-side recovery on an authenticated Production status request when no active entitlement exists: it checks the user's open live order directly with Mercado Pago, verifies the provider ID, external reference, exact amount, PAID state and PIX method, then calls the existing checked idempotent RPC.
- The recovery is fail-closed, never runs in Preview/Sandbox, never trusts browser values, and does not expose provider data. Commit `434ed44` is pushed to `origin/main` and the official site now shows the user's VIP as active through 2026-10-17; the live order is `paid` in Supabase. Keep the live checkout gate off.

## Mercado Pago Production Access Token transferred

- The Production Access Token was copied directly from the validated Mercado Pago credentials page into Vercel as the Production Secret `MERCADOPAGO_ACCESS_TOKEN`; the value was never displayed, read from clipboard, or recorded in chat/files.
- Vercel deployment `F6ZqBPEWrj31qJBtKvDFB6gB979s` from `main` commit `64bede2` is visibly **Ready** on Production and includes `www.guizz.xyz`.
- The follow-up automatic Production deployment `Bm7BFyk5wRQVZLAE4NjTVj1RHgLv` from checkpoint commit `28e8c52` is also visibly **Ready** and marked Current, with `www.guizz.xyz` assigned.
- Production now has the live credential, signed webhook secret, official site URL, and the explicit safety gate `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`. No live checkout, charge, or VIP activation was performed.
- Exact next action: do not enable live checkout automatically. Review and authorize a supervised real PIX test only if the user accepts that it can create a real charge; keep the gate off until then.

## Production validation after credential rollout

- `npm run lint`, `npx tsc --noEmit`, the escalated production build, and the 14 smoke tests all pass. The first sandboxed build/test attempts were blocked only by Windows subprocess policy (`spawn EPERM`) and passed when rerun with the required execution permission.
- Read-only review of `https://www.guizz.xyz/en/vip` confirms the public VIP page is healthy and intentionally still says subscriptions are unavailable while `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`.
- No checkout request, charge, webhook event, or VIP entitlement was created. Exact blocker remains the user-authorized human-supervised Production PIX test.

## Mercado Pago signing secret transferred to Vercel

- The generated Mercado Pago webhook signing secret was copied directly from the masked dashboard field into Vercel as the Production Secret `MERCADOPAGO_WEBHOOK_SECRET`; it was never displayed or recorded in chat/files.
- Vercel redeploy `CKFx7TRqM6TCdQefk66X2oLogjcS` was created from `main` commit `00a8af7` and is Ready on Production, including `www.guizz.xyz`.
- Live checkout remains disabled (`MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`). The Production Access Token has not been transferred; no live order or VIP activation has been performed. Exact next action: separately authorize transfer of the Production Access Token, then run a human-reviewed PIX payment test before enabling live checkout.

## Mercado Pago webhook saved — signing secret transfer pending

- Mercado Pago Webhooks configuration was saved successfully for `https://www.guizz.xyz/api/vip/webhook/mercadopago` in both test and production modes, with only the `Order (Mercado Pago)` event selected.
- Mercado Pago generated the webhook signing secret; it remains masked in the dashboard and has not been revealed, copied, or entered into Vercel.
- Exact next action: obtain explicit authorization to transfer this generated secret directly into Vercel as `MERCADOPAGO_WEBHOOK_SECRET`; keep `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false` until the Live Access Token, secret, and human-reviewed payment test are complete.

## Mercado Pago webhook form prepared — save pending confirmation

- Mercado Pago Webhooks configuration is open. Test and production URLs are filled with `https://www.guizz.xyz/api/vip/webhook/mercadopago` and the `Order (Mercado Pago)` event is selected.
- The configuration has not been saved. Saving will change the Mercado Pago app and generate a signing secret; no secret has been copied or transferred to Vercel.
- Live checkout remains disabled (`MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`). Exact next action: obtain explicit user authorization to save the webhook, then copy the generated signing secret directly into Vercel as `MERCADOPAGO_WEBHOOK_SECRET` only after a separate action-time confirmation.

## Search race-condition fix

- Search result requests now carry a monotonically increasing query version; stale responses cannot replace newer query/filter results or reset their loading state (`src/app/[locale]/search/page.tsx`).
- Validation: lint, TypeScript, production build, and full 71-test suite pass. Exact next action: keep Live payments disabled pending the manual Mercado Pago Production handoff.

## Category pagination resilience

- Public category pages still load bounded 20-row pages, now preserving the last successful cursor when a request fails. Duplicate IntersectionObserver requests are blocked with an in-flight ref, and a localized retry action is shown for initial and subsequent-page failures.
- Validation: lint, TypeScript, production build, `git diff --check`, and the official full 71-test suite pass. No catalog visibility, payment, entitlement, or permission behavior changed.
- Commit `b945c72` is pushed to `origin/main`; Vercel Production deployment `site-mods-7r697tyqe-guizz1.vercel.app` is Ready. Official `https://www.guizz.xyz/en/category/maps` renders paginated cards and inline ads. Exact next action: keep Live payments disabled until the manual Mercado Pago Production handoff.

## Homepage catalog discovery

- The home page intentionally loads only the latest 50 summaries for lightweight highlights. Each category highlight now has a localized “View all” link to its complete, retry-safe paginated route, with localized screen-reader labels for the horizontal controls.
- Commit `c359f24` is pushed to `origin/main`; Vercel Production deployment `site-mods-pxzc1m2b4-guizz1.vercel.app` is Ready. Official `https://www.guizz.xyz/en` shows the localized `View all` links on populated category rails. Exact next action: keep Live payments disabled until the manual Mercado Pago Production handoff.

## Homepage category coverage

- The home now has bounded latest-item rails for all supported categories (Add-ons, Maps, Textures, Skins, Shaders, Holoprint, and Mash-up), with each populated rail linking to its complete category route. Locale keys and screen-reader labels are available in en/pt/es.
- Validation: lint, TypeScript, production build, and the official full 71-test suite pass. Commit `c065af6` is pushed to `origin/main`; Vercel Production deployment `site-mods-huqc773hp-guizz1.vercel.app` is Ready.
- Exact next action: keep Mercado Pago Live disabled pending the manual production handoff (Live credential, production products, signed webhook, and human-reviewed payment test).

## Mercado Pago Production handoff — owner action required

- Phone validation is complete. The Production credentials form is open with `Serviços de TI` selected and `https://www.guizz.xyz` filled as the business site.
- Production credentials are now activated. Vercel Production has `MERCADOPAGO_SITE_URL=https://www.guizz.xyz` and an explicit `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=false`; redeploy `BhinMeZ2QdaXKAifcZm3piVdZ6g4` is Ready on `www.guizz.xyz`.
- The Live Access Token has not been transferred, and no production webhook has been saved. Exact next action: explicitly authorize the secret transfer, then configure the signed Order webhook and perform a human-reviewed payment test before enabling live checkout.

## VIP Mercado Pago reconciliation — local implementation

- Added admin-only `POST /api/admin/vip/reconcile`; it authenticates with `requireAdmin`, processes only live `checkout_created` rows, rejects limits above 20, enforces a 45-second deadline, and returns aggregate counts/reasons without IDs or provider tokens.
- Shared Mercado Pago validation now proves provider ID, external reference, exact total, PAID settled amount, and exactly one PIX bank-transfer payment. The webhook and reconciliation call `apply_vip_payment_checked`, whose remote wrapper rejects a provider checkout mismatch before the existing entitlement RPC; Sandbox rows are skipped by reconciliation.
- Migration `bind_provider_checkout` was applied remotely and verified: service_role can execute the checked wrapper; anon/authenticated cannot. Focused tests pass 17/17, full suite passes 71/71 with the production build present, lint/TypeScript/git diff checks pass.
- Commit `deeab76` is pushed to `origin/main`; Vercel Production deployment `site-mods-jd7bg95vy-guizz1.vercel.app` is Ready and the official `https://www.guizz.xyz/en/vip` renders the completed page. Full suite/build/lint/TypeScript checks pass. No live credential, payment, or VIP activation was configured.
- Exact next action: keep Mercado Pago Live disabled until a separately authorized production credential, product IDs, signed webhook, and human-reviewed payment test are available; use the admin reconciliation endpoint only for real live orders after that handoff.

## Duplicate checkout guard — implementation and database rollout

- Added migration `supabase/migrations/20260917_01_prevent_duplicate_vip_orders.sql` with a partial unique index allowing only one `pending`/`checkout_created` order per user, plan, and environment (`dev_mode`). A read-only query confirmed no duplicate open orders before rollout.
- Supabase migration `prevent_duplicate_vip_orders` was applied successfully; the index is present remotely and duplicate scan remains empty.
- `createVipOrder` now identifies the expected `23505` conflict and carries the existing `externalId`; checkout retries reuse that Mercado Pago idempotency key instead of opening a second provider order. Other database failures remain `503 order_unavailable`.
- Added isolated conflict and Sandbox/Live separation coverage in `tests/vip-orders.test.mjs`. Focused tests pass 4/4, related payment tests pass, lint/TypeScript/build pass. No Live payment change, credentials, or entitlement activation.
- Commit `e90525e` is pushed to `origin/main`; Vercel production deployment `site-mods-onm3n0wdb-guizz1.vercel.app` is Ready and serves the change.
- Remaining follow-up: surface a dedicated operator recovery/reconciliation path for provider timeouts; persistence-update failures now fail closed with `503 order_unavailable`.

## Latest checkpoint — production readiness review

- Vercel Production deployment `F5qjCGgwnDWTLLSZrSgkxiGtUTud` (commit `823eeed`) is Ready.
- Read-only verification on `https://www.guizz.xyz/en/login` passed: Google login is rendered, Turnstile is enabled for the official hostname, and the login action remains unavailable until a Turnstile token is present. No credentials were entered and no CAPTCHA was solved during QA.
- Mercado Pago Live remains disabled. No Live credential, production product, production webhook, payment activation, or VIP entitlement change was made.
- Current blocker/next action: manual Mercado Pago Production handoff—configure and verify the Live credential, production products, and signed webhook before any live checkout or VIP activation.

## Previous checkpoint — total paid amount

- The `total_paid_amount` phase is complete in commit `d73444b`.
- Verification: focused tests 7/7, lint PASS, TypeScript PASS, and `git diff --check` PASS.
- Mercado Pago Live remains disabled; no live credentials, payment activation, or entitlement change was made.
- Superseded by the production readiness review recorded above.

## Release hardening checkpoint (historical)

- Release hardening is complete: commit `5dc34f8` was created and pushed to `origin/main`; subsequent production readiness verification is recorded above. Mercado Pago Live remains disabled.

- Audited the Mercado Pago Orders webhook against the official Orders documentation. The signed `data.id` value is now lowercased for the HMAC manifest while the original provider ID remains unchanged for the server-side Order lookup (`src/lib/mercadopago-webhook.ts`). Regression coverage includes uppercase and lowercase IDs (`tests/mercadopago-webhook.test.mjs`).
- Hardened `POST /api/download/session`: requires JSON, rejects bodies over 2 KiB before JSON parsing when declared or measured, and returns a safe 400 for malformed JSON. This limits public input/body abuse without changing valid download behavior (`src/app/api/download/session/route.ts`, `tests/download-session-input.test.mjs`).
- Verification: focused webhook/download tests 3/3 (rerun with Windows subprocess isolation disabled after sandbox EPERM), lint PASS, TypeScript PASS, and `git diff --check` PASS. No Vercel/Supabase changes, credentials, or production payment activation.
- The deployment/read-only review follow-up is superseded by the production readiness checkpoint above.

## Active phase 1 — authentication

- User authorized Chrome access to SITE GUIZZ services; use existing connections, do not request secrets in chat.
- Local implementation: safe en/pt/es email auth, Google PKCE action shown on login/register and validated by Supabase at authorization time, confirmation/resend, link recovery, locale/VIP returns, callback getAll/setAll cookies/no-store, password form disabled before validation + confirmation, optional one-use Turnstile. Docs: docs/auth-rollout.md.
- Tests: auth return/actions/callback + PIX checkout16 PASS, lint PASS, production build PASS (process-spawn escalation), smoke14 PASS. Isolated UI lifecycle PASS (initial session guard, matching passwords, revalidation, VIP recovery, CAPTCHA expiry/retry/cleanup, duplicate submit, same-email cooldown across modes). Chrome login/register/reset transitions + invalid callback localized VIP return verified. No live emails sent.
- Remote changes: Supabase Site URL corrected from localhost:3000 to https://www.guizz.xyz; recovery template updated/saved with blue ConfirmationURL link and OTP retained for old clients (docs/auth-recovery-email.html). Confirm email OFF, Google enabled, SMTP Resend ON, guizz.xyz sender verified; email30/hour + per-user60s; sign-in/signup5/5min/IP. Do not enable Confirm email/CAPTCHA before compatible rollout.
- Google project guizz-mods-login CREATED (Guizz Mods Login), number460882853776. OAuth branding configuration CREATED as External with support/developer contact `suporte@guizz.xyz`; the non-Gmail support address is registered as a Google Account and has project-level Editor access. OAuth Web client `Guizz Mods Web` CREATED with Supabase callback `https://vzvkwyzlyjlgcffupzhy.supabase.co/auth/v1/callback`; credentials were transferred directly into Supabase without recording the secret. Supabase Auth Providers now shows Google Enabled; nonce checks remain enforced and users without email remain disallowed. OAuth audience remains in Testing with `suporte@guizz.xyz` added as the sole test user (1/100). Turnstile widget Guizz Mods Login CREATED in Cloudflare, managed mode, guizz.xyz only, pre-clearance OFF. Public site key added to .env.example and Vercel all environments; secret transferred directly into the Supabase CAPTCHA form without being recorded in code/chat/Vercel. CAPTCHA toggle is currently staged ON in the unsaved Supabase form; do not click Save until compatible auth code is deployed, because saving would enforce CAPTCHA against the old deployment.
- CLI input-validation scanner unavailable in sandbox (npm ENOTCACHED); targeted security tests pass, broader dependency review remains phase2.
- Files: login pages, auth/callback, auth-actions.ts, auth-return.ts, AuthCaptcha.tsx, messages/*.json, .env.example, tests/auth-actions.test.mjs, docs/auth-rollout.md.
- Exact next action: stable branch-alias callback is now allowlisted in Supabase; deploy this login adjustment to the test branch and retest Google return there. Production still serves the old auth client, so deploy/rollout remains explicitly gated. Return to Supabase Attack Protection and save the staged Turnstile secret/toggle only after a coordinated production deployment is explicitly authorized. Until then CAPTCHA abuse protection is NOT live.
- Payment foundation implemented 2026-09-16: local migration `supabase/migrations/20260916_04_vip_payments.sql` and server-only `vip_orders`, `vip_webhook_events`, `vip_entitlements` tables/RPC were applied to Supabase with explicit deny policies for browser roles. Checkout records a pending test order before provider creation; `/api/vip/webhook` validates the AbacatePay URL secret + HMAC and claims event IDs; Sandbox events never grant VIP. Rollback SQL verified atomic entitlement creation, duplicate no-op, refund revocation, and no late reactivation; Supabase advisors no longer report the new tables. `npm run lint`, `npx tsc --noEmit`, production build, checkout tests (6), webhook tests (2), full smoke (14), and VIP status tests pass. Corrected Sandbox webhook `Guizz VIP Preview Stable` (v2, checkout.completed/refunded/disputed/lost) targets `https://site-mods-git-abacatepay-test-guizz1.vercel.app/api/vip/webhook`; the earlier malformed `Guizz VIP Preview` is preserved for manual cleanup later. Its new URL secret and public HMAC key are stored only in AbacatePay and Vercel Secret variables. `ABACATEPAY_WEBHOOK_SECRET` and `ABACATEPAY_WEBHOOK_PUBLIC_KEY` are configured for Preview and Development; Production remains untouched. Commit `64e2af5` deployed the webhook and commit `7e806d7` deployed the entitlement gate to a Ready Preview on 2026-09-16. Active entitlements now gate production ad iframe mounting and signed download wait; Sandbox events still cannot grant VIP. Exact next action: validate duplicate/retry/refund events where possible, then continue Supabase/auth hardening. Do not save Turnstile yet.
- Supabase function hardening applied remotely on 2026-09-16 and captured in `supabase/migrations/20260916_05_harden_public_functions.sql`: legacy `increment_download`/`update_mod_rating` now pin `search_path`; public/anon/authenticated EXECUTE was revoked from all three SECURITY DEFINER functions, with `increment_download` retained for `service_role`. Security advisors are clear for these findings; the only remaining warning is leaked-password protection, which Supabase documents as Pro-plan-only and is unavailable on the current Free project. CAPTCHA/Turnstile remains intentionally unsaved until a coordinated production auth rollout.
- Desktop discoverability polish added: the compact rail now gives the VIP entry a clearly labeled blue treatment with a restrained halo animation that automatically stops under reduced-motion preferences. Lint and TypeScript validation pass; the isolated motion test requires its optional `react-test-renderer` fixture and was not rerun because that fixture is not installed.
- Dependency review rerun on 2026-09-16: `npm audit --audit-level=high` and the production-only audit both report zero vulnerabilities for the current lockfile.
- Cloudflare Turnstile widget `Guizz Mods Login` now allows both `guizz.xyz` and `www.guizz.xyz` (saved 2026-09-16); Managed mode and pre-clearance OFF remain unchanged. Supabase CAPTCHA is still unsaved until the compatible auth build is promoted deliberately.
- Latest Preview commit `70efb8a` is Ready; the complete 14-test smoke suite passes when run with the approved process-spawn environment. The login action now exposes Google without relying on the public settings probe, and Supabase remains the authorization source of truth. Turnstile remains unavailable on random Preview hostnames by design. Production was inspected and still serves the older login client without Google/Turnstile, so no production promotion or CAPTCHA enforcement was performed in this unattended pass.
- Supabase Email provider policy saved 2026-09-16: `PASSWORD_MIN_LENGTH` is now 8 (matching the site form). Secure password-change and current-password requirements remain off so recovery links keep working; leaked-password protection is unavailable on Free.
- Auth UX resilience added 2026-09-16: Google remains visible when the public provider-settings probe is temporarily unavailable on a Preview origin; the OAuth request still passes through Supabase and reports a safe generic error if the provider is actually disabled.
- Supabase redirect allowlist updated 2026-09-16: added the stable test alias callback `https://site-mods-git-abacatepay-test-guizz1.vercel.app/auth/callback`; production Site URL and existing production callbacks remain unchanged. This enables direct Google-return testing on the branch alias without allowing arbitrary Preview hosts.
- Current checkpoint correction: commit `9747e91` is the latest Ready Preview. Login/register render Google without the public settings probe, and `AdblockGuard` is a best-effort non-VIP notice only. Lint, TypeScript, production build and smoke14 pass; production and Turnstile enforcement remain intentionally untouched.
- Latest implementation checkpoint: download flow now shows a localized, dismissible VIP promo at the top of the protected flow for non-VIP visitors; it hides after the overlay scrolls and never renders for VIP sessions. The VIP page now calls `/api/vip/status` with the authenticated bearer token and shows a localized active-access card with plan/expiry instead of a generic activation label. Lint, TypeScript, production build and smoke14 pass. No production promotion performed.
- 2026-09-17 provider cleanup: removed AbacatePay checkout/webhook code, route, tests, docs and fallback selection. Mercado Pago Orders/PIX is now the sole provider; generic VIP order/webhook/entitlement tables remain because they are provider-neutral. `.env.example` now documents only `MERCADOPAGO_*`; Preview test variables remain scoped to `abacatepay-test`, live checkout remains disabled. Focused MP/webhook/status tests 8/8, lint, TypeScript, production build and `npm audit --audit-level=high` pass. The prescribed Claude Flow scan is unavailable offline (npm ENOTCACHED). Exact next action: push cleanup only to the test branch, wait for a Ready Preview, then delete stale Preview deployments and obsolete `ABACATEPAY_*`/`PAYMENT_PROVIDER` Vercel variables without touching Production.
- 2026-09-17 cleanup progress: commit `44dbf8a` is pushed to `origin/abacatepay-test` and Preview `DgBvJcAiWLgA6D9CHpPTwvGhkcPX` is the only remaining deployment on that test branch. All other stale Preview deployments were deleted through Vercel; Production was not touched. The obsolete variable rows are identified in Vercel and ready for removal, but cloud-variable deletion requires an action-time confirmation before proceeding. Next exact action after confirmation: delete only `ABACATEPAY_*` and `PAYMENT_PROVIDER` rows, verify all `MERCADOPAGO_*`/Supabase/Turnstile/download secrets remain, then decide whether to push `44dbf8a` to `main` (Production currently still points to `3ae7751`).
- 2026-09-17 cleanup progress update: `44dbf8a` was pushed to `main`; Vercel Production deployment `G6AAPbobUh51R7skKU8JGUvkQ5Cp` is Ready on that commit. The live checkout remains gated/disabled. Test-branch pruning still leaves only Preview `DgBvJcAiWLgA6D9CHpPTwvGhkcPX`. The only outstanding cloud mutation is deletion of 15 obsolete Vercel variable rows (`ABACATEPAY_WEBHOOK_SECRET`, `ABACATEPAY_WEBHOOK_PUBLIC_KEY`, `ABACATEPAY_PRODUCT_QUARTERLY`, `ABACATEPAY_TEST_USER_IDS`, `ABACATEPAY_TEST_CHECKOUT_ENABLED`, `ABACATEPAY_PRODUCT_MONTHLY`, `ABACATEPAY_API_KEY` in Preview/Development, plus `PAYMENT_PROVIDER` in Preview); confirmation was requested immediately before that destructive action and no variable has been deleted yet.
- 2026-09-17 cleanup complete: after user confirmation, all 15 obsolete Vercel rows listed above were deleted. Verification shows the five Preview-scoped `MERCADOPAGO_*` test variables, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, Supabase secrets, and all download secrets remain. Vercel warns that a new deployment is needed for env deletions to affect builds; the current code no longer reads any removed variable, and the Ready Production/Preview deployments remain safe. No AbacatePay or `PAYMENT_PROVIDER` variable remains in the project list.
- Cloudflare Email Routing: domain `guizz.xyz` is onboarded; required root MX/DKIM/SPF records are added. A private destination is verified and the active rule `suporte@guizz.xyz` forwards to that mailbox. Routing status may remain `Syncing` briefly while Cloudflare propagates the configuration.
- Latest account UX checkpoint: authenticated settings now calls `/api/vip/status` with the Supabase bearer token and shows a localized Guizz VIP card with active expiry/management or a clear upgrade CTA. Settings password validation and copy now use the Supabase 8-character baseline in en/pt/es. `npm run lint`, `npx tsc --noEmit`, production build, and smoke14 pass. Commit `5a6de2e` is pushed to `abacatepay-test`; Ready Preview: `https://site-mods-62yesdjsz-guizz1.vercel.app`. Public Preview confirms the new build and Google action; random Preview hostnames intentionally show the Turnstile-unavailable state, so authenticated settings still needs a session-based check on the stable alias. Production remains untouched.
- Auth/payment verification follow-up: the stable alias reaches Google's official account chooser through the configured Supabase OAuth callback; no account was selected or session created during QA. The Supabase project host shown there is the callback/audience identifier, not a password or database credential. Focused checkout/webhook/status tests pass 10/10. CAPTCHA is now saved in Supabase Attack Protection with Turnstile enabled; the Cloudflare widget allows only `guizz.xyz` and `www.guizz.xyz`. Release gates on the branch pass lint, TypeScript, production build, and smoke14. User explicitly authorized the production rollout; promote the compatible branch to `main`, then verify the official domain login and keep the PIX checkout guard unchanged.
- Production rollout complete: `main` is at commit `9e99af6` and the guarded live-checkout preparation is published. `https://www.guizz.xyz/en/login` renders the Google action and loads the Turnstile script without an unavailable/error notice on the allowed hostname; no credentials were submitted during QA. Production `/en/vip` remains honest pre-launch and the PIX checkout stays disabled until the explicit live flag, Production key/products, and webhook are configured. Next action: user review of the live login/VIP/download surfaces, then a separately authorized Production configuration; do not enable real payment or grant VIP from a Sandbox event.
- Post-rollout read-only review: official `/en/login`, `/en/vip`, and a public mod page render correctly. The focused guard suite passes 11/11 (`--test-isolation=none`): production checkout is disabled before provider contact, anonymous VIP status fails closed, and forged/early/expired download sessions are rejected.
- Responsive follow-up: production mod page was reviewed at 390×844; mobile header, media, title, Download action, utility buttons, and bottom navigation all render without visible clipping. Temporary viewport override was reset afterward.
- Protected-download follow-up: on the official domain, an anonymous session created the three-step flow, the VIP prompt was visible, each `Skip` became enabled after its timer, and the final action reached the same-tab Terabox destination. No ad was clicked and the external tab was closed immediately after verification.
- Security follow-up: `npm audit --audit-level=high` and the production-only audit both report zero vulnerabilities. The prescribed `@claude-flow/cli` scan could not run because the package is not cached and network access is unavailable; no dependency or production setting was changed.
- Regression gate closed: `npm run lint`, `npx tsc --noEmit`, and the full 14-test smoke suite pass. Smoke required the approved process-spawn environment; the earlier sandbox-only attempt failed solely with Windows `spawn EPERM`.
- Live checkout preparation: added a separate Production-only PIX path behind `ABACATEPAY_LIVE_CHECKOUT_ENABLED=true`, an exact `https://guizz.xyz`/`https://www.guizz.xyz` origin allowlist, `guizz-live-*` IDs, `devMode=false` response validation, and localized live-payment copy. Commit `9e99af6` is published to `main`; the flag remains unset/false and no live key, product, webhook, or payment was configured. Checkout tests 7/7, build, lint, TypeScript, and smoke14 pass.
- AbacatePay Production activation: user authorized and the account moved from Sandbox to the KYC submission page. No personal/KYC data was entered by the agent. User must complete phone verification and the five-step business review before live keys/products can be created; live checkout remains disabled.
- Mercado Pago migration started 2026-09-17: user created the GuizzMods application (Checkout Transparente via Orders) and activated test credentials in the browser. No Access Token was exposed in chat or copied yet. Next code step is an explicit Mercado Pago PIX Orders adapter with signed Order webhook, keeping AbacatePay selectable and all production gates off.
- Mercado Pago test rollout complete 2026-09-17: `PAYMENT_PROVIDER=mercadopago`, PIX-only Orders adapter, signed webhook path, test payer, Access Token, and tester allowlist are configured only for Vercel Preview branch `abacatepay-test`; Production remains untouched. Google OAuth stable branch alias is allowlisted in Supabase and returns authenticated to Preview. The first checkout 403 was traced to origin validation because the stable alias differed from `VERCEL_URL`; `MERCADOPAGO_TEST_SITE_URL` was added for that alias (branch-only), a Preview redeploy completed (`6nFB6UAez5bkemQm2VXD4bX9pfFZ`), and the monthly checkout now opens a Mercado Pago Sandbox PIX ticket successfully. No payment was made and Sandbox cannot grant VIP. Exact next action: stop using the Sandbox ticket and continue with the next authorized production-readiness task (webhook reconciliation/UX review); do not promote or enable live checkout without explicit authorization.

## Previous checkpoints

- Current round COMPLETE: card checkout was abandoned after the final Sandbox attempt still rejected the quarterly product. All plans now send explicit `methods: ['PIX']`; the VIP summary says PIX-only in en/pt/es. Dialog actions have16px gap; signed-in account link uses dark secondary background while checkout/login remains blue. Responsive shared CSS, six isolated checkout tests, 14 smoke tests, lint and production build PASS. User confirmed the quarterly Sandbox checkout now opens successfully with the `Teste2` product at R$20.00. PIX-only fallback is pushed to `origin/abacatepay-test` as commit `76f6790`.
- Supabase connector verified 2026-09-16: connected to `SITE-MODS Project` (`vzvkwyzlyjlgcffupzhy`), status ACTIVE_HEALTHY, PostgreSQL 17.6.1.155. Read-only table inventory and security advisors completed; no remote changes made. Advisors report mutable search paths on `update_mod_rating`/`increment_download`, publicly executable SECURITY DEFINER functions (`rls_auto_enable`, `update_mod_rating`), and leaked-password protection disabled. Treat these as auth/database hardening items before production.
- Card fallback 2026-09-16: removed `vipPlanSupportsCard`/card minimum gating and all `CARD` methods from the test flow. The provider, product ID, price, Dev key, and payload had been checked repeatedly; keeping PIX-only avoids another rejected checkout and matches the launch decision.
- Diagnostic fix 2026-09-16: provider HTTP 401/403/400/422 responses now map to safe localized auth/permission/product messages instead of one generic error. The provider response body and secrets remain hidden. Logs from user showed Supabase GET + Abacate POST and 502; next Preview test identifies rejection class.
- Product confirmation 2026-09-16: AbacatePay Sandbox has two quarterly products at R$20.00: old `prod_qX5cbwKLPEtzdrBcdEEZFTzd` and newly created “Teste2” `prod_1BgSfKNZ465NtSat6j6rgumu`. Vercel Preview `site-mods-1fzzvsoz8-guizz1.vercel.app` was on commit `70366e1`; the final quarterly test still returned `provider_request`.
- Card request experiment 2026-09-16: optional `card.maxInstallments` was first removed while retaining `methods: ['PIX', 'CARD']`; the final fallback now removes CARD entirely. Tests (6), lint and escalated production build PASS. Security scan found dependency advisories including a critical Next.js issue; no dependency upgrade was performed.

- Current objective: AbacatePay API v2 TEST checkout only, authorized by user “iiniciar”, step-by-step. Part 1 local implementation COMPLETE: server-only key, verified Supabase user + tester allowlist, server-owned plan/product mapping, fixed origin, devMode/amount/item/externalId/checkout URL validation, localized responsive VIP button with duplicate-click guard/timeouts and honest return notice.
- Active objective 2026-09-16: user authorized prioritized step-by-step site fixes, starting with auth and email abuse. Also queued finish VIP page, desktop VIP visibility and remaining animation polish. Actual Chrome config: guizz.xyz production (www.guizz.xyz/en open), Resend SMTP enabled, guizz.xyz sender domain verified, email 30/h/per-user 60s, sign-in/signup 5/5min/IP. Confirm Email OFF, Google unconfigured/disabled, Turnstile not created. Work on local login/recovery/callback before enabling provider protection that would lock out old clients. Credential creation/secret transfer not performed.
- Fix 2026-09-16: Preview failures were caused by validating a stale hash URL after Vercel redeploys. `checkoutSiteOrigin` now accepts the current validated `VERCEL_URL` Preview deployment (or an explicit fixed origin), and checkout return URLs use the current request origin. Production remains blocked. Six isolated checkout tests PASS after this fix.
- Manual Preview verification 2026-09-16: user reached AbacatePay hosted checkout in Sandbox Mode for Guizz VIP Mensal, R$6.70, after the origin fix. This proves Dev key/product/allowlist/route creation in the real Preview. No real payment was made and no VIP entitlement is active; webhook/order persistence remains next part.
- Verification: 5 isolated mocked-provider tests PASS, lint PASS, production build PASS (escalated after sandbox spawn EPERM), all14 page smoke PASS. No real API call, checkout, payment, DB write, VIP grant or deployment. No secret inspected/disclosed. Configuration defaults disabled; Vercel Production always blocked.
- Next exact action: keep the working PIX Sandbox configuration. The next authorized payment task is persistent orders + authenticated/idempotent webhook before granting VIP. Keep the old AbacatePay product and all API secrets unchanged. `ABACATEPAY_TEST_SITE_URL` is optional because the route accepts the current Vercel Preview origin. Do not ask for key in chat.
- Limits: real checkout/mobile browser behavior not verified; key selects provider environment and devMode response guard runs AFTER creation. Require actual Dev key before enabling. No persistent orders/deduplication/distributed rate limit; test-only allowlist. No automatic retry after ambiguous POST. Metadata binds account/plan at provider; next separately authorized part needs persistent orders + authenticated/idempotent webhook before granting VIP.

- Motion browser QA complete (Chrome local production): home23 motion cards with240ms transitions; navigation home→search succeeds, final main opacity1/transform none, input transition150ms. Local server stopped and test tab closed. No production deploy. Reduced-motion behavior covered by isolated lifecycle tests, not device setting change. Existing local admin-status configuration error remains unrelated (private secrets absent).

- Previous round: site-wide subtle fluid motion completed; preserve download/VIP and all existing dirty work.
- Motion implementation: SiteMotion route opacity-only 220ms on navigation (not hydration), no key/remount or transformed fixed-dialog ancestor. Shared card/image/panel CSS; microinteractions in base layer; reduced-motion runtime cancellation. tests/site-motion.mjs PASS lifecycle/cleanup/preference/no-WAAPI; lint/build and14 smoke PASS; Chrome QA complete above. No commit/deploy.
- Implemented: DownloadFlow controller + DownloadFlowView.tsx/module.css; 3×8s Skip stages, ready glow, stage leaderboard ads, final landscape cover/title/countdown/progress/cancel and468/320 banners. No sound invented; original audio not assessed.
- Robustness:15s request timeout, local expiry guard, signed per-mod cookies(10min), server minimum20s unchanged, non-consuming preflight validates cookie/backend/allowed URL, same-tab redirect. Cancel aborts pending preflight; cleanup restores scroll/focus. Same-mod parallel tabs still share authorization; preflight handles consumed-cookie retry.
- Independent tests passed: controller expiry/timeout/cancel/retry/timers; Adsterra widths/lifecycle; signed cookies; new download-open route tests for absent/forged/early/expired token, preflight without count/consume/URL disclosure,302/cookie clearing. Also15 auth/catalog/export/URL and4 subcategory tests.
- Final verification PASS: lint, production build (preview absent), all14 smoke tests. Removed only obsolete generated .next/dev/types/validator.ts which still referenced deleted preview; build then passed. Sandbox subprocess restriction requires approved build; isolated unit tests support --test-isolation=none.
- Visual QA: parent Chrome320 wait PASS screenshot+DOM (overlay/banner320,rectangle300 x10); final desktop visual PASS. Final mobile screenshot capture unreliable, not claimed approved. Temporary download-preview route DELETED after QA.
- Implementation/review complete for this round. Next: user review; verify production ad fill and real signed download in an authorized deployment, plus final mobile visual on a real viewport. No commit/push/deploy performed.
- Limits: no real signed delivery or production Adsterra fill verified; local private Supabase/download secrets absent. Do not disclose/request secrets in chat. Live reference ad overlays opened external tabs and looped; no claim exact/full parity. Development placeholders do not prove vendor fill/sandbox compatibility.
- Residual: preflight-to-navigation race can reach API error if backend/session changes between requests. No protection against sharing known Terabox links. Trailer remount resets playback.
# Checkpoint — 2026-09-20 — Search Console e host canônico alinhados

## Current checkpoint — propriedade final verificada e sitemap enviado

- A propriedade URL-prefix final `https://www.guizz.xyz/` foi verificada no
  Google Search Console pelo método de metatag já publicado no layout global.
- O Vercel redireciona o apex para `www.guizz.xyz`; sitemap, robots/host e
  `metadataBase` agora usam o host final. O teste de smoke foi atualizado para
  impedir regressão de host.
- O sitemap `/sitemap.xml` foi enviado na propriedade `www`; a interface aceitou
  o envio, mas ainda mostra “Não foi possível buscar o sitemap”, apesar do
  endpoint público responder 200 com XML válido. Isso fica como pendência
  opcional de rechecagem, não como alteração cega adicional.
- A publicação `4886f07` está Ready na Vercel e `npm test` passou 30/30.
- Próxima ação exata: avançar para homologação Sandbox do Mercado Pago; não
  alterar anúncios, layout, Supabase, planos ou cobrança live nesta etapa.

# Checkpoint — 2026-09-20 — Mercado Pago Sandbox aguardando validação da conta

## Current checkpoint — painel oficial abriu, mas exige ação do operador

- O painel do aplicativo Mercado Pago foi aberto para a homologação oficial e
  redirecionou para “Valide que esta é a sua conta”. As opções exibidas são
  SMS, WhatsApp, ligação para o número cadastrado ou outra forma de validação.
- Nenhum código temporário foi solicitado/enviado pelo agente, nenhum segredo
  foi inserido e nenhum pagamento real foi feito. A aba ficou preservada para o
  operador concluir a validação com segurança.
- Depois da validação, executar somente os testes Sandbox da matriz
  `docs/MERCADO_PAGO_SANDBOX_MATRIX.md`; live permanece desligado e VIP não é
  concedido pelo retorno do navegador.
- Próxima ação exata: o operador concluir a verificação no painel Mercado Pago
  e avisar; então retomar o ensaio oficial de pedido, webhook e reconciliação.

# Checkpoint — 2026-09-20 — branding Google OAuth atualizado

## Current checkpoint — nome público do app corrigido

- No Google Auth Platform, o branding do cliente `Guizz Mods Web` foi salvo com
  o nome público **GuizzMods**; a confirmação “As mudanças de marca foram
  salvas” foi exibida.
- O callback do Supabase e o domínio técnico autorizado não foram alterados.
  Trocar esse callback por `api.guizz.xyz` continua dependendo de domínio
  personalizado/proxy do Auth e não faz parte do plano Free atual.
- O nome pode levar algum tempo para aparecer em sessões OAuth já cacheadas;
  isso não exige mudança de código nem novo deploy.
- Não alterar anúncios, layout, Supabase, planos ou cobrança live nesta etapa.
# Checkpoint — 2026-09-20 — validação da conta MP concluída; Sandbox parcial

## Current checkpoint — conta verificada e cobertura de planos iniciada

- A validação adicional da conta no Mercado Pago foi concluída pelo operador;
  o painel voltou para a aplicação **GuizzMods** e as credenciais de teste
  estão acessíveis. Nenhum segredo foi copiado para o chat ou para o Git.
- No Preview `site-mods-926eus9eh-guizz1.vercel.app`, o plano Semanal
  (R$6,70) gerou um ticket PIX Sandbox válido. Não houve pagamento, webhook de
  liquidação ou ativação VIP.
- As tentativas dos planos Diário (R$1,99) e Mensal (R$19,90) retornaram
  `502 provider_invalid` em `/api/vip/checkout`; o log sanitizado confirma que
  a resposta do provedor não passou no formato esperado. A causa externa ainda
  precisa ser confirmada; não fazer correção cega nem ligar o checkout live.
- Próxima ação exata: investigar o retorno do Orders API para Diário/Mensal
  (sem expor token/payer), repetir somente após confirmar a causa e então fechar
  webhook assinado, idempotência, reconciliação e expiração da matriz Sandbox.

# Checkpoint — 2026-09-20 — formato de teste MP corrigido localmente

- A documentação oficial do Mercado Pago confirmou que o PIX Sandbox por
  Orders usa valor pré-definido e `payer.first_name=APRO`; isso explica os
  `provider_invalid` de Diário/Mensal com os preços comerciais.
- `src/lib/mercadopago-checkout.ts` agora aceita `MERCADOPAGO_TEST_ORDER_AMOUNT`
  somente no modo `test` e envia `APRO`; live continua usando o catálogo real.
- A variável Config `MERCADOPAGO_TEST_ORDER_AMOUNT=50.00` foi criada apenas no
  Vercel Preview e aguarda um novo deploy. Suíte focada do adaptador passou
  **9/9**.
- Próxima ação exata: publicar este commit, repetir Diário/Semanal/Mensal no
  Preview e verificar que os tickets retornam; depois seguir para webhook e
  reconciliação. Não pagar tickets e manter live desligado.
# Checkpoint — 2026-09-20 — CLS da home estabilizado

## Estado atual

- A causa reproduzida do salto da home era o carregamento de oito rails de
  skeleton, seguido da remoção das categorias vazias. A primeira rail agora é a
  única reservada durante o carregamento e tem a mesma geometria dos cards reais;
  as demais entram somente quando existem dados.
- Geometria verificada na produção `www.guizz.xyz/en`: em 390px a primeira rail
  manteve `y` e `height` idênticos antes/depois (204px de seção; 159,75px de
  faixa), e em 1920px manteve 254px/210px. O layout do detalhe e os anúncios não
  foram alterados.
- `npm test` passou **30/30**; commit `fb005e6` publicado e deploy Vercel
  `site-mods-4tvuo7g9e-guizz1.vercel.app` marcado **Ready**.
- PageSpeed final `g95wipoe2l` (20/09 15:54): mobile Performance 74, FCP 0,9s,
  LCP 24,8s, TBT 30ms, CLS **0,037**, payload 11.160 KiB; desktop Performance
  62, FCP 0,3s, LCP 7,0s, TBT 50ms, CLS **0,261**, payload 11.165 KiB.
  O restante do CLS desktop foi atribuído ao bloco de instalação abaixo das
  rails (0,136 + 0,124), não à primeira rail; LCP e anúncios de terceiros são
  variáveis do provedor.

**Próxima ação exata:** manter este lote sem novas mudanças visuais. Só retomar
otimização de performance se houver uma meta definida; nesse caso, investigar a
reserva/lazy-load das rails abaixo da dobra, sem mexer no layout de anúncios ou
no checkout.
# Checkpoint — 2026-09-20 — importação do Minecraft Marketplace

## Current checkpoint — fluxo de publicação reduzido, sincronização preparada

- Criados `src/lib/minecraft-marketplace.ts` e a rota autenticada
  `/api/admin/minecraft`: valida somente URL HTTPS oficial de item, limita
  corpo/HTML/tempo, extrai JSON-LD/HTML, quatro imagens oficiais e vídeo
  YouTube sem fazer fetch no navegador.
- A aba Publicar de `src/app/[locale]/upload/page.tsx` ganhou campo “Importar
  do Minecraft Marketplace”. O preenchimento automático preserva o Terabox
  manual e sugere categoria; a origem privada acompanha o item.
- `supabase/migrations/20260920_06_minecraft_marketplace_sources.sql` foi
  aplicada no projeto Production pelo SQL Editor (Success, 0 rows). A view
  pública não recebe os campos privados.
- Criado `/api/cron/sync-minecraft` + `vercel.json` com execução diária,
  até 10 itens antigos por lote e autenticação `CRON_SECRET`; a Secret foi
  salva em Vercel Production sem registrar o valor em arquivo/chat. Vercel
  Hobby suporta cron diário sem upgrade.
- Testes: `npm test` 30/30 antes da última alteração de parser; teste isolado
  `tests/minecraft-marketplace.test.mjs` 3/3; TypeScript sem erros; matriz de
  segurança 2/2 após documentar 11 rotas. O scanner Ruflo não rodou por
  `ENOTCACHED` (pacote ausente).
- Código/documentação ainda não foram commitados/publicados nesta rodada.

**Próxima ação exata:** revisar o diff, repetir `npm test` completo, commit/push
e verificar deploy Production; depois abrir `/en/upload` para confirmar a nova
aba, sem publicar um item real sem o Terabox escolhido pelo operador.
# Checkpoint — 2026-09-20 — migration aplicada no Supabase

- A migration `20260920_07_minecraft_source_health.sql` foi executada no SQL Editor do projeto Production e retornou “Success. No rows returned”.
- O Chrome foi reiniciado e a aba autenticada foi reaberta sem inserir senha ou OTP.
- O código procedural está publicado em `origin/main` (`0125e93` + `93c34a8`); o diretório `.claude-flow/` permanece não rastreado e não faz parte do lote.
- Suíte de segurança 2/2 e smoke/build 30/30 passaram. Produção respondeu `200` em `/api/health` e `/en`; a rota de refresh respondeu `400` para ID inválido e `200 {"ok":true,"refreshed":false}` para UUID inexistente.

**Próxima ação exata:** manter o lote em observação; testar a importação/alerta de um item real somente quando o operador escolher um Terabox válido.

# Checkpoint — 2026-09-20 — auditoria independente do Marketplace

- Três revisores read-only concluíram: produção básica **PASS** (`/api/health`, `/en`, refresh, cron protegido); build/smoke **30/30**, segurança **2/2**, parser **4/4**, lint, TypeScript e scanner de segredos passaram.
- Dois achados P1 impedem considerar o fluxo procedural totalmente robusto: o claim do refresh não é atômico e o cron também pode duplicar fetches; gravações finais por ID permitem resposta antiga sobrescrever atualização nova.
- Achados P2: estado `checking` pode ficar sem alerta, não há retry administrativo direto, edição não troca facilmente a origem Marketplace, faltam testes específicos de refresh/cron/attentionCount e o contador de atenção pode mascarar erro como zero.
- Nenhum código foi alterado pelos revisores. O próximo lote deve corrigir primeiro as corridas P1, depois cobrir os testes e ajustar os alertas/estado órfão.

**Próxima ação exata:** implementar claims atômicos/compare-and-set para refresh e cron, adicionar testes de concorrência e só então publicar nova revisão.

# Checkpoint — 2026-09-20 — importação corrigida para slugs canônicos

- Reproduzido o erro com `Actions & Stuff: Flat Textures`: a API oficial respondia 200, mas o validador rejeitava o slug canônico por conter `&`/`:` (inclusive percent-encoded).
- `parseMinecraftMarketplaceUrl` agora mantém host, locale, rota e identificador restritos, mas aceita pontuação válida nos dois segmentos de slug. Foram adicionados testes para URL canônica e codificada.
- Importação real verificada contra a API oficial: título correto, categoria `textures`, quatro imagens e trailer do YouTube.
- Testes: importador 4/4, matriz de segurança 2/2, smoke/build 30/30, lint e `git diff --check` passaram.

**Próxima ação exata:** publicar esta correção e repetir o botão “Buscar dados” no painel com a URL completa da textura.

# Checkpoint — 2026-09-20 — metadata do Marketplace integrada

- Implementada a próxima melhoria: o importador agora normaliza criador, tags, data de publicação e tipo oficial do pacote; `ResourcePack`, `WorldTemplate`, `SkinPack`, `ShaderPack`, `Mashup` e `AddonPack` sugerem as subcategorias existentes sem substituir uma escolha manual.
- A nova migration `20260920_08_minecraft_marketplace_metadata.sql` foi executada no SQL Editor Production com sucesso. `source_creator`, `source_tags` e `source_published_at` permanecem privados e a view pública não mudou.
- API administrativa, publicação, cron diário e refresh on-demand persistem os metadados. A tela mostra criador, tipo, tags e data para conferência; preço em Minecoins, tamanho, versão e Terabox continuam manuais.
- Validação: parser **5/5**, TypeScript, lint, segurança **2/2**, smoke/build **30/30** e `git diff --check` passaram.

**Próxima ação exata:** publicar o lote, verificar o deploy e testar `Buscar dados` com um item ResourcePack e um WorldTemplate no painel autenticado.

# Checkpoint — 2026-09-21 — auditoria de performance mobile sem alterações

- Chrome/PageSpeed mobile atual: Performance **53**, FCP 0,9s, LCP **30,7s**, TBT 240ms, CLS **0,312**, payload **10.933 KiB**. O audit aponta ~9.399 KiB de economia em imagens, ~5.390 KiB em cache, 180ms de render-blocking e 2,6s de trabalho de main thread.
- A imagem LCP é o hero do catálogo; o relatório diz que ela não é descoberta no HTML inicial porque a home busca os dados no cliente. O atraso do LCP medido inclui 1.690ms de descoberta, 680ms de download e 320ms de renderização.
- Vercel Speed Insights mobile: Real Experience Score **66 (Needs Improvement)** em 664 eventos nas últimas 24h; `/[locale]` é a rota com mais eventos (344). Métricas detalhadas estão indisponíveis na visão Hobby, então PageSpeed é a fonte detalhada.
- Em viewport 390px na produção, a home montou **51 links de mods** (3 hero + 6 rails x 8) e **57 imagens**; 41 imagens já estavam completas após 2,5s. Cada card mobile renderiza ~158x89, mas as fontes são imagens externas 800x450; `next.config.ts` mantém `images.unoptimized: true`.
- Observação visual: o primeiro `AdPlaceholder` mobile reservou 92px vazios antes do hero nesta sessão; os hosts Adsterra ainda não haviam montado após mais de 11s. Isso cria sensação de travamento/espaço morto mesmo quando o conteúdo já existe.
- Próxima decisão do operador: escolher entre (A) cap mobile de 4 cards por rail + renderização tardia das rails, (B) pipeline de thumbnails/responsive images e (C) pré-render do hero; anúncios devem ser tratados separadamente para não quebrar receita.

# Checkpoint — 2026-09-21 — cap mobile aprovado pelos revisores

- A home agora mede `matchMedia('(max-width: 767px)')` após hidratação; cada rail usa 4 itens no mobile e 8 no desktop/tablet. O listener acompanha rotação/redimensionamento e cancela respostas antigas para evitar sobrescrita/duplicação.
- `Most downloaded` ganhou `Ver todos` para `/${locale}/search`; categorias continuam com seus links completos.
- Nenhum `AdPlaceholder`, formato, dimensão, gate VIP ou código Adsterra foi alterado, ocultado ou colocado em lazy-load. Os dois anúncios mobile continuam montando normalmente.
- Teste novo protege limite mobile e superfície de anúncios. `npm test`: **31/31**; lint, TypeScript, build e `git diff --check` passaram. O teste isolado `tests/adsterra-sidebar.mjs` não roda neste checkout por falta de `react-test-renderer`, sem alteração nos arquivos de anúncios.
- Próxima ação exata: revisar diff final, criar commit separado no `main`, publicar e revalidar home em 390/430/768px e desktop. Não misturar otimização de thumbnails/hero neste lote.

# Checkpoint — 2026-09-21 — rollout mobile publicado

- Commit `aa10215` foi publicado em `origin/main`; o Vercel criou o deploy `Ap96dZHhWonxSup9TYSYbX1bTSyP` e marcou Production **Ready** em `www.guizz.xyz`.
- Verificação live em 390px: **27** links de mods (3 hero + 6 rails x 4), rails com altura preservada e **2** slots mobile de anúncio presentes, cada um com reserva de 92px. Em 1920px: **51** links (3 hero + 6 rails x 8), comportamento anterior preservado.
- O Chrome de auditoria não recebeu os creatives Adsterra nesta sessão (`data-adsterra-key` ausente), provavelmente por bloqueador/ambiente; os shells e montagens de anúncios não foram removidos ou alterados pelo lote.
- `npm test` passou **31/31** após o rollout. Não iniciar thumbnail/hero neste mesmo lote; medir primeiro o comportamento real no celular do operador.
- Próxima ação exata: o operador deve abrir a home no celular e confirmar scroll, “Ver todos” e anúncios; se estiver aprovado, o próximo lote separado será otimização de imagens/hero.

# Checkpoint — 2026-09-21 — limite mobile ajustado para 6

- A pedido do operador, o limite das rails mobile foi alterado de 4 para **6**; desktop permanece em 8 e anúncios continuam intocados.
- O próximo lote deve atacar o peso real (imagens externas 800x450, hero descoberto tarde e shell de anúncio vazio), pois aumentar cards tende a piorar bytes mesmo que a sensação visual melhore.
- Commit `66fd05d` publicado em `origin/main`; build, lint, TypeScript e `npm test` (31/31) passaram antes do push.

# Checkpoint — 2026-09-21 — otimização de mídia em andamento

- Objetivo atual: reduzir bytes das thumbnails e do primeiro hero sem remover cards ou anúncios.
- Restrição confirmada: `/_next/image` da Vercel já respondeu `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`; não reativar esse caminho.
- Estratégia: rota própria Node com `sharp`, cache de saída WebP, tamanhos limitados por uso e fallback direto para a URL original se a origem falhar.
- Arquivos previstos: `src/app/api/media/route.ts`, helper de URL de mídia, home/cards e testes de contrato.
- Implementado: `sharp` direto, `/api/media`, `OptimizedImage` com fallback, cards da home/categorias/busca/favoritos/detalhe e capa do fluxo de download usando WebP dimensionado; anúncios não foram tocados.
- Segurança verificada localmente: host privado retorna 400, HTML remoto retorna 415; `sharp` gerou WebP; cache de sucesso usa `s-maxage=31536000`.
- Build, TypeScript, lint, `git diff --check` e `npm test` **31/31** passaram após a alteração.
- Próxima ação exata: revisar diff e publicar o lote; depois medir PageSpeed/Speed Insights comparando bytes e LCP, sem reativar `/_next/image`.

# Checkpoint — 2026-09-21 — rota pública de mídia ajustada após reinício

- O deploy do lote principal (`fdc9e84`) já estava **Ready** na Vercel após o computador desligar.
- A verificação no Chrome mostrou que uma extensão bloqueava o caminho literal `/api/media`; por isso o helper público passou a usar `/api/asset`, que apenas encaminha para a mesma implementação protegida de `sharp`. A rota `/api/media` foi preservada para compatibilidade.
- `npm test` passou **31/31**, incluindo build/TypeScript; lint e `git diff --check` também passaram.
- Nenhum card, anúncio, formato Adsterra ou limite mobile foi removido/alterado neste ajuste; a otimização continua servindo WebP dimensionado com fallback para a origem.
- Próxima ação exata: commit/push deste alias e repetir PageSpeed no mesmo perfil para comparar payload e LCP, sem reativar `/_next/image`.

# Checkpoint — 2026-09-21 — mídia otimizada verificada em produção

- Commit `07fc5d3` foi publicado em `origin/main` e o deploy `site-mods-69gr6troj-guizz1.vercel.app` ficou **Ready** na Vercel.
- O endpoint público `/api/asset` respondeu `200 image/webp` com cache configurado; a rota continua usando a validação/limites do `/api/media`.
- Próxima ação exata: repetir o PageSpeed no mesmo perfil mobile e comparar payload, LCP e CLS; não alterar anúncios nem reativar o otimizador pago da Vercel.

# Checkpoint — 2026-09-21 — PageSpeed pós-otimização

- PageSpeed mobile em `https://www.guizz.xyz/en`: Performance **59**, FCP **0,9 s**, LCP **4,7 s**, TBT **220 ms**, CLS **0,349**, Speed Index **4,7 s**.
- Comparação com o baseline: Performance **53 → 59** e LCP **30,7 s → 4,7 s**; a entrega de imagens deixou de ser o gargalo principal.
- O audit ainda estima 184 KiB de economia em imagens e 307 KiB em cache; CLS permanece o próximo gargalo e deve ser tratado preservando todos os anúncios e seus espaços reservados.
- Próxima ação exata: analisar a origem do CLS em uma rodada separada, sem mexer no endpoint WebP já publicado.

# Checkpoint — 2026-09-21 — rolagem mobile suavizada sem esconder anúncios

- O travamento percebido tinha dois candidatos de pintura contínua: a borda conic-gradient dos anúncios girava a cada 4s e a navegação inferior usava blur 2XL durante a rolagem.
- No mobile, a borda dos anúncios agora permanece estática com `contain: paint`; a navegação usa blur menor, camada própria (`will-change: transform`) e mantém a transição de entrada/saída.
- Desktop, dimensões, carregamento e quantidade de anúncios não foram alterados. A rolagem vertical nativa foi preservada; não foi adicionado `scroll-behavior: smooth`, que costuma introduzir atraso no gesto.
- Build, TypeScript, lint, `git diff --check` e smoke passaram **32/32**.
- Próxima ação exata: publicar e conferir a sensação de rolagem no aparelho real; se ainda houver engasgo, perfilar especificamente CLS/listeners, sem reverter a otimização WebP.

# Checkpoint — 2026-09-21 — rolagem publicada

- Commit `3779d77` foi publicado em `origin/main`; o deploy `site-mods-i3n9j65e9-guizz1.vercel.app` ficou **Ready** na Vercel.
- O lote reduz a pintura durante o gesto no mobile sem remover anúncios, alterar dimensões ou adicionar rolagem artificial.
- Próxima ação exata: confirmar no aparelho físico; caso o travamento continue, medir listeners/CLS de forma específica antes de qualquer nova alteração visual.

# Checkpoint — 2026-09-21 — visual original restaurado

- O operador não autorizou a alteração visual da rolagem; o lote `3779d77` foi revertido no código.
- A borda animada dos anúncios e o `backdrop-blur-2xl` da navegação mobile voltaram exatamente ao comportamento anterior.
- A otimização aprovada de imagens/WebP permanece intacta. Build, TypeScript, lint, `git diff --check` e smoke passaram **31/31**.
- Próxima ação exata: publicar o revert e só investigar o travamento com medição/diagnóstico, sem alterar animações ou aparência sem autorização explícita.
# Checkpoint — 2026-09-21 — quinta imagem da galeria em publicação, edição e página pública

## Current checkpoint — implementação e testes em andamento

- Adicionado o slot opcional `image_url_5` no formulário de publicar/editar,
  payload/API admin, importação Marketplace e visualizador público; imagens
  ausentes continuam filtradas e não geram miniatura vazia.
- Atualizados parser Marketplace, refresh individual e cron diário para até
  cinco imagens. Criada migration `20260921_09_catalog_gallery_image_5.sql`
  com coluna, view pública explícita e permissões sem expor Terabox.
- Migration ajustada para adicionar a nova coluna no fim da view, requisito do
  `CREATE OR REPLACE VIEW`; testes estruturais e fixtures estão sendo fechados.

**Concluído nesta rodada:** Marketplace **5/5**, build/TypeScript e smoke
**34/34**, lint, migration aplicada/verificada no Supabase Production,
commit `fa27d98` publicado e Vercel Production `site-mods-fai23aksi-guizz1`
marcado **Ready**. `/api/health` e home pública responderam **200**; a home
não expõe `terabox_url`.

**Próxima ação exata:** validar manualmente no painel autenticado um publicar
e editar com a quinta URL quando o operador tiver um item de teste; manter o
slot vazio sem miniatura/thumbnail e não alterar os quatro slots existentes.
