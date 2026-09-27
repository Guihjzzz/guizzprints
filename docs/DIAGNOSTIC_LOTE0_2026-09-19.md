# Diagnóstico Lote 0 — 2026-09-19

Este diagnóstico é somente leitura. Nenhum arquivo de aplicação, segredo, configuração de provedor, conta ou pagamento foi alterado durante a coleta.

## Resumo executivo

- As rotas públicas verificadas respondem normalmente (`200`) e o download protegido rejeita chamadas anônimas (`403`); a rota de sessão rejeita método incorreto (`405`).
- O desktop está saudável no PageSpeed (95), mas o celular é o principal risco de lançamento (68), com CLS `0,312`, LCP `4,0 s` e Speed Index `4,8 s`.
- `/llms.txt` é um problema confirmado: responde HTML da página localizada, com `Content-Type: text/html`, em vez de um recurso de texto na raiz.
- A causa provável de parte do CLS é a montagem tardia de `AdsterraInlineBanner`: o formato só é escolhido depois do `ResizeObserver`, deixando o slot sem dimensão inicial em algumas posições.
- O PageSpeed confirmou que houve erros no console do navegador, mas a captura disponível não revelou as mensagens. Não é seguro atribuí-las ao app sem uma sessão DevTools reproduzível.

## Evidências HTTP públicas

Rotas navegadas com sucesso (`200`):

- `/en`
- `/en/category/maps`
- `/en/search`
- `/en/favorites`
- `/en/login`
- `/en/vip`
- `/en/privacy`
- `/en/terms`
- `/en/contact`
- `/en/mod/c2aaf8bb-8de8-426b-ae34-db6f853c600d`

Proteções observadas sem mutação:

- `/api/admin/status` → `403` JSON para visitante anônimo.
- `/api/download/open` → `403` JSON para visitante anônimo.
- `/api/download/session` via `GET` → `405` (método incorreto).
- `/api/vip/status` → `200` JSON mínimo e `no-store`.

Cabeçalhos presentes nas rotas públicas/dinâmicas:

- `Content-Security-Policy` com `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` e `form-action 'self'`.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` restritiva para câmera, microfone, geolocalização, pagamento, USB e tópicos de navegação.
- HSTS presente com `max-age=31536000`; a ausência de `includeSubDomains`/`preload` deve ser avaliada junto da configuração de domínio, não alterada às cegas.

## Achados confirmados

### P1 — `/llms.txt` cai no fallback localizado

`https://www.guizz.xyz/llms.txt` retornou `200`, mas com `Content-Type: text/html`, `X-Matched-Path: /[locale]` e corpo começando por `<!DOCTYPE html>`. O documento contém a página localizada com links reescritos sob `/llms.txt/...`.

Isso confirma o alerta do PageSpeed sobre `llms.txt`: o caminho raiz está sendo tratado como rota de locale. A correção deve ser planejada como recurso/rota de texto explícita, com teste de `Content-Type` e sem interferir nas rotas localizadas.

### P1 — CLS móvel acima do aceitável

Linha de base PageSpeed:

| Métrica | Desktop | Celular |
|---|---:|---:|
| Performance | 95 | 68 |
| FCP | 0,3 s | 1,7 s |
| LCP | 0,6 s | 4,0 s |
| TBT | 40 ms | 80 ms |
| CLS | 0,125 | 0,312 |
| Speed Index | 1,2 s | 4,8 s |

O arquivo `src/components/AdsterraSidebar.tsx` confirma que `AdsterraInlineBanner` só define o formato depois do `ResizeObserver`. Antes disso, o host não possui a dimensão final do criativo. Essa é uma causa provável e deve ser confirmada com uma medição de layout-shift antes de escolher a reserva de espaço.

`src/components/DownloadFlowView.module.css` já reserva altura para alguns banners do fluxo de download; as posições inline do detalhe/catálogo não têm a mesma garantia inicial.

### P1 — erros de console existem, origem ainda não classificada

O PageSpeed marcou que foram registrados erros no console do navegador. A captura disponível não expôs as linhas/URLs das mensagens. Podem ser do próprio app ou de YouTube/Adsterra; a próxima coleta deve separar `app`, `terceiro`, `intermitente` e `falso positivo` antes de corrigir qualquer coisa.

### P2 — custo de JavaScript e terceiros no celular

O relatório repetiu aproximadamente `77–78 KiB` de JavaScript não usado, cerca de `14 KiB` de JavaScript legado, uma tarefa longa, solicitações que bloqueiam renderização e custo de terceiros. Esses números orientam o Lote 2; não justificam remover anúncios ou mídia no Lote 1 sem medir receita e CLS.

## Itens verificados e preservados

- Tema escuro único e navegação pública carregam nas rotas testadas.
- Slots Adsterra e gate Anti-Adblock continuam sendo integrações existentes; não foram endurecidos neste diagnóstico.
- Nenhuma chamada abriu checkout, clicou anúncio, alterou placement ou tocou em credenciais.
- A autorização de download permanece server-side; a detecção de bloqueador não é usada como autorização.

## Não confirmado neste lote

- Mensagens exatas do console e o responsável por cada uma.
- Elemento exato que produz cada salto de layout nas quatro superfícies (home, categoria, detalhe e download).
- Compatibilidade de mudanças adicionais em CSP/HSTS com YouTube, Adsterra e autenticação.
- Falso positivo do Anti-Adblock sob rede lenta ou campanha Adsterra sem preenchimento.

## Próximo lote

O Lote 1 deve ser uma única rodada de estabilidade: reservar dimensões com fallback seguro para slots, confirmar CLS com teste automatizado/visual, separar erros próprios de terceiros, corrigir contraste e decidir a implementação explícita de `/llms.txt`. Depois devem rodar lint, TypeScript, build, smoke e uma verificação mobile/desktop antes de qualquer publicação.

## Progresso após o diagnóstico

O subset seguro do Lote 1 foi publicado: `public/llms.txt`, reservas de altura dos shells inline, correção direcionada de contraste nos rótulos de publicidade e um bypass explícito do proxy para `/llms.txt`. A verificação pública havia confirmado que o arquivo estático sozinho ainda caía em HTML localizado; o commit `6a4cd20` corrige essa regressão de produção. Lint, TypeScript, build e smoke 22/22 passaram. A classificação de console continua pendente até haver uma captura reproduzível.

O primeiro subset do Lote 2 também foi publicado em `79a36b7`: as variantes do Next/Image agora contemplam os breakpoints reais do hero e dos cards mobile. Na medição PageSpeed de 19/09 às 12:14 BRT, a oportunidade de entrega de imagens caiu para 47 KiB no mobile e 181 KiB no desktop. As notas gerais oscilaram entre execuções (mobile 46–62; CLS 0,312–0,487), então permanecem apenas como indicador; o próximo diagnóstico deve capturar o console e os eventos de layout em um navegador limpo.

## Hotfix de imagem — 19/09/2026

O detalhe de erros do PageSpeed revelou dezenas de respostas `400 (Bad Request)` para `/_next/image?...&w=384` nas imagens de catálogo. O allowlist customizado publicado em `79a36b7` havia removido `384px`, embora navegadores móveis de alta densidade ainda solicitassem esse tamanho. A correção restaura `384` em `deviceSizes` e `imageSizes`, sem voltar a entregar o hero de 750px para um slot de aproximadamente 400px.

Uma captura limpa no domínio público continua sem erros próprios de console. O PageSpeed também registrou duas falhas `500` do `invoke.js` da Adsterra; elas permanecem classificadas como terceiro/provedor até que um navegador limpo reproduza falha visível no site. Não alterar Anti-Adblock ou a origem do anúncio por essa evidência isolada.

Após a publicação de `db5e62a`, a verificação pública do endpoint confirmou `402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` na Vercel para uma transformação `/_next/image`. Isso transforma a quota do otimizador em risco real de cards quebrados, não apenas em uma oportunidade de performance. O fallback publicado em seguida mantém `deviceSizes`/`imageSizes` documentados, mas define `images.unoptimized: true` para que as imagens remotas do catálogo sejam carregadas diretamente das fontes já existentes. A medição PageSpeed deve confirmar a redução dos erros; a possível economia menor de bytes será reavaliada somente depois da estabilidade.

O commit `b542e48` está publicado em `origin/main`. Após o deploy, a captura limpa do domínio mostrou os cartões e o hero renderizando com URLs remotas diretas, sem requisições `/_next/image`, e o console do navegador permaneceu vazio em `warn`/`error`. A nova execução da interface PageSpeed ficou presa em carregamento e a API direta retornou `429 Quota exceeded`; portanto, o custo de bytes deve ser medido somente após a renovação da quota, sem desfazer o fallback estável por um relatório indisponível.

## Remeasurement pós-deploy — 19/09/2026, 19:38 BRT

O mesmo perfil mobile do PageSpeed voltou a executar após a renovação da cota.
O relatório marcou Performance 76, Accessibility 96, Best Practices 96 e SEO
100; FCP 0,9 s, LCP 1,7 s, TBT 120 ms, CLS 0,487, Speed Index 4,1 s e payload
total de 11.079 KiB. A oportunidade de entrega de imagens ficou em 48 KiB,
enquanto o cache de terceiros ainda representa aproximadamente 5.846 KiB.

O detalhe de layout atribuiu 0,312 ao deslocamento do corpo/rodapé e 0,175 ao
shell do anúncio móvel. Um navegador limpo em produção permaneceu sem erros
próprios de console após o carregamento. Como as execuções anteriores também
oscilaram bastante, o relatório confirma o foco (CLS mobile), mas não autoriza
alterar o gate Anti-Adblock, remover anúncios ou trocar criativos por conta de
um resultado sintético. A correção publicada em `9a00d2e` prioriza apenas a
primeira imagem do hero; o próximo diagnóstico deve capturar layout/console em
um viewport mobile reproduzível antes de outro ajuste.

### Ajuste de estabilidade antes da nova medição

Duas execuções consecutivas mantiveram o CLS em `0,487`, então a home passou a
reservar a altura dos oito trilhos do catálogo e a mostrar placeholders enquanto
as consultas bounded terminam. O ajuste preserva cards, anúncios e a hierarquia
visual. Lint, TypeScript, build e smoke `30/30` passaram; a eficácia só será
confirmada no próximo relatório PageSpeed pós-deploy.

## Confirmação pós-deploy — 19/09/2026, 19:55 BRT

No mesmo perfil mobile, o relatório pós-deploy retornou Performance 74,
Accessibility 91, Best Practices 96 e SEO 100; FCP 0,9 s, LCP 31,1 s, TBT
60 ms, CLS `0,045`, Speed Index 3,0 s e payload 11.088 KiB. O detalhe de
layout não lista mais o corpo/rodapé nem o shell móvel: resta apenas o cabeçalho
de `Most downloaded`, com 0,045. A reserva dos trilhos fechou o problema de CLS
reproduzido.

O LCP oscilou entre 1,7 s e 31,1 s em execuções próximas, enquanto a entrega de
imagens voltou a estimar 10.325 KiB e o cache de terceiros 5.880 KiB. Como o
navegador limpo segue sem erro próprio e as imagens diretas estão estáveis, não
reativar `/_next/image`, remover anúncios ou contratar CDN por uma pontuação
isolada. O próximo passo de performance depende de uma decisão explícita de
origem/loader e custo.

### Correção preventiva do Anti-Adblock

O gate agora aguarda além do timeout de 10 segundos usado pelos hosts
Adsterra antes de classificar slots silenciosamente bloqueados. Estados
`loading` não abrem a parede; somente `failed`/`timeout` em todos os slots,
sem criativo, ou a sonda cosmética, confirmam o bloqueio. Um `onload` sem
criativo continua sendo tratado como no-fill legítimo.

## Auditoria pública pós-deploy — 19/09/2026

Em navegador limpo, `/en`, `/en/category/maps` e `/en/mod/c2aaf8bb-8de8-426b-ae34-db6f853c600d` carregaram sem avisos ou erros próprios no console. A categoria exibiu os cards; o detalhe preservou Download, Technical Specifications, mídia e anúncios; todas as imagens observadas no detalhe usaram URLs remotas diretas. A leitura pública de `/llms.txt` confirmou `200`, `Content-Type: text/plain`, `X-Matched-Path: /llms.txt` e corpo Markdown começando por `# GuizzMods`.

O smoke do download protegido também foi concluído em navegador anônimo: o botão Download criou a sessão e o fluxo avançou por “Securing your file”, “Almost there” e “Ready to download”, mantendo os anúncios 728×90/300×250 em cada etapa e sem erros próprios no console. O botão final para abrir o arquivo externo não foi acionado.

O favicon foi verificado no HTML e nos assets de produção: `/en` aponta o shortcut/regular icon para `/icon.jpg`, que retorna `200 image/jpeg`; o Apple touch icon `/icons/guizz-180.png` retorna `200 image/png`. Não há fallback para um ícone variável do provedor.

Os assets públicos de descoberta também foram conferidos: `robots.txt` responde `200 text/plain`, permite o catálogo, bloqueia API/admin/auth/settings/favorites/upload/search e referencia o sitemap; `sitemap.xml` responde `200 application/xml` com 33 URLs e 99 alternates de idioma; `manifest.webmanifest` responde `200 application/manifest+json`, com os ícones 192×192 e 512×512 disponíveis em `200 image/png`.

As APIs anônimas de produção foram verificadas sem mutação: `/api/admin/status` e `/api/download/open` respondem `403` em JSON sem cache, `/api/download/session` rejeita `GET` com `405`, e `/api/vip/status` retorna somente `{"vip":false}` com `no-store`. Os cabeçalhos `X-Content-Type-Options: nosniff` e `X-Frame-Options: DENY` permanecem presentes.

As 12 páginas de confiança pública (`about`, `privacy`, `terms`, `contact` em `en`, `pt` e `es`) retornam `200`, exibem títulos localizados e não contêm `mercadopago_access_token`, `service_role`, `private_note` ou `terabox_url` no HTML entregue.

## Higiene do harness de testes — 19/09/2026

O comando amplo `node --test tests/*.mjs` não é o runner oficial: sete testes isolados exigem um caminho explícito para dependências temporárias e falham com `process.argv[2]` ausente. Dois outros checks estavam desatualizados/sem isolamento: o teste de foco procurava `setFocusEmail(true)` embora a implementação use `focusEmailRef.current = true`, e o teste de subcategorias não isolava `FavoriteButton`. As duas correções foram aplicadas somente aos testes e os focos passaram; o produto não mudou. A tentativa de instalar temporariamente as dependências foi interrompida porque o cache local não tinha a versão exigida de `nanoid`, sem modificar `package.json` ou `package-lock.json`.

## Auditoria de superfícies autenticadas — 19/09/2026

Foi feita uma verificação somente leitura no domínio oficial para as quatro superfícies que mais facilmente confundem estado público e estado autenticado:

- `/en/login` responde `200`, mantém a tela de autenticação e não depende de uma sessão anterior.
- `/en/vip` responde `200`; a página é pública para explicar o plano, mas o status e qualquer entitlement continuam consultados/decididos no servidor.
- `/en/favorites` responde `200` para visitante, sem dados de usuário, mostrando o estado vazio e a indicação de entrar para visualizar favoritos.
- `/en/settings` não expõe o formulário sem sessão: a proteção client-side redireciona o visitante para `/en/login`.

O navegador limpo exibiu o tema escuro e não registrou erro próprio durante a navegação. O comportamento foi preservado porque está alinhado ao desenho atual: descoberta pública, dados de favoritos isolados por usuário e configurações protegidas. Nenhum código, conta ou configuração de provedor foi alterado neste checkpoint.

## QA do Anti-Adblock — 19/09/2026

O gate foi reproduzido em dois perfis sem alterar configurações do provedor:

- No navegador limpo, os dois hosts laterais Adsterra montaram iframes do provedor e a página permaneceu acessível. Não houve entradas próprias de `warn` ou `error` no console.
- No Edge com bloqueador ativo, os slots foram suprimidos e a parede premium “We detected an ad blocker” apareceu. Também não houve erro próprio no console.
- O botão de retry foi acionado com o bloqueador ainda ativo; após a nova checagem, a parede continuou presente. Portanto, o retry não é um bypass.

O resultado confirma o comportamento pretendido e não justifica tornar o detector mais agressivo: a diferença entre os perfis foi observável e reproduzível, enquanto a autorização de download continua independente e server-side.

## Auditoria dos cabeçalhos de segurança — 19/09/2026

As respostas de produção foram conferidas na home, no detalhe de mod e nas APIs de admin, download e VIP. Todas mantêm:

- CSP com `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` e `form-action 'self'`;
- HSTS com `max-age=31536000`;
- `X-Content-Type-Options: nosniff` e `X-Frame-Options: DENY`;
- `Referrer-Policy` apropriada e `Permissions-Policy` fechando câmera, microfone, geolocalização, pagamento, USB e tópicos de navegação;
- `Cache-Control: no-store` nas APIs sensíveis, incluindo respostas anônimas `403`.

`Cross-Origin-Opener-Policy` não é enviado atualmente. Isso foi registrado como follow-up não bloqueante: habilitá-lo sem testar o popup do Google OAuth poderia interromper o fluxo de autenticação. Nenhuma configuração foi alterada neste checkpoint.

## Matriz de rotas localizadas — 19/09/2026

Foram consultadas em produção a home, a busca e as sete categorias (`addons`, `maps`, `textures`, `shaders`, `skins`, `holoprint` e `mash-up`) nos três locales suportados (`en`, `pt` e `es`). As 27 combinações retornaram `200`, permaneceram em seus caminhos canônicos e não apresentaram fallback ou redirecionamento inesperado.

## Integridade do sitemap — 19/09/2026

O `sitemap.xml` público contém 33 URLs canônicas. Cada uma foi aberta em uma verificação somente leitura, seguindo eventuais redirecionamentos; todas terminaram em resposta `2xx`. Não foram encontrados links quebrados entre catálogo, locales, páginas legais ou assets de descoberta.

## Dependências e segurança de release — 19/09/2026

Uma auditoria nova identificou um advisory crítico no `next@16.2.10`, além de avisos transitivos. O pacote foi atualizado de forma direcionada para `next@16.3.5` e `eslint-config-next@16.3.5`, versão compatível com o Node 26.8.1 do ambiente.

Após a atualização, o build de produção, lint, TypeScript e smoke oficial (24/24) passaram. A instalação reportou quatro avisos transitivos restantes (um moderado e três altos, em ferramentas de desenvolvimento); a consulta detalhada seguinte foi interrompida pelo `503` de manutenção do endpoint de auditoria do npm. O `audit fix --force` não foi usado, para evitar upgrades não classificados.

O lint também apontou uma navegação relativa no fluxo de download. A correção tornou a URL do endpoint explícita/absoluta e manteve a navegação completa necessária para que o servidor valide a sessão assinada e faça o redirecionamento externo. O lint final ficou limpo, o TypeScript passou e o smoke permaneceu em 24/24.

Uma rodada de manutenção executou `npm update` sem alterar majors ou ampliar as faixas declaradas. Supabase, Tailwind, ESLint, next-intl, framer-motion, lucide e Zustand foram atualizados dentro das versões permitidas; Next.js permaneceu fixado em `16.3.5`. Build, lint, TypeScript e smoke 24/24 continuam verdes. A nova tentativa de `npm audit` ainda recebeu `503` do endpoint de advisories em manutenção.

Após o deploy dessa atualização, o smoke público confirmou home e detalhe em `200`, `/api/admin/status` anônimo em `403` e `/llms.txt` como `text/plain`. Nenhuma regressão de rota ou contrato de segurança foi observada.

## Probes de borda das APIs protegidas — 19/09/2026

Sem usar sessão, segredo ou pagamento, foram enviados requests de contrato em produção:

- `/api/download/session`: `GET` → `405`, tipo de conteúdo inválido → `400`, `Sec-Fetch-Site: cross-site` → `403`;
- `/api/download/open` com origem cross-site → `403`;
- `/api/admin/mods` anônimo → `403`;
- `/api/vip/webhook/mercadopago`: `GET` → `405`, POST sem assinatura → `401`;
- `/api/vip/checkout` anônimo → `503 {"error":"disabled"}`, confirmando que o checkout real segue desligado.

As respostas mantiveram JSON sem cache quando aplicável. Nenhum estado externo foi alterado.

## QA funcional pós-deploy do download — 19/09/2026

No navegador limpo, o detalhe de `Island Castle` carregou o botão Download, Technical Specifications e as unidades Adsterra 320×50, 728×90 e 300×250. O fluxo anônimo abriu as três etapas protegidas; os controles Skip 1/3 e Skip 2/3 chegaram a “Ready to download”. Não houve avisos/erros próprios no console e o botão final para o arquivo externo não foi acionado.
