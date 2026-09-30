# Matriz de segurança das rotas — GuizzMods

Atualizado em 28/09/2026. A validação automatizada confirma que cada endpoint
está representado e desabilita cache quando a resposta contém dados sensíveis.
Esta matriz registra o contrato observado no código
e separa proteções próprias de limites que ainda dependem do provedor. Ela não
substitui um rate limiter distribuído nem um teste de carga.

O Guia 3D local é iniciado junto com `npm run dev` e `npm run start`. A pasta
original pode ser configurada por `GUIZZ_STUDIO_ROOT`; por padrão o projeto usa
`D:\\DOWN\\mcstructure certo\\3dvilw-slim`.

## Rotas públicas e de usuário

| Rota/método | Acesso e validação | Limites/tempo | Efeito protegido |
|---|---|---|---|
| `/api/health` GET | Público; não consulta banco/provedor | `no-store`, `noindex` | Sonda barata para monitor externo |
| `/api/asset` GET | Alias público de mídia; delega validação de origem para `/api/media` | `no-store` | Mantém compatibilidade sem abrir caminho de transformação novo |
| `/api/media` GET | URL remota validada, bloqueia hosts privados e limita redirecionamentos e bytes | Fonte até 8 MiB; timeout 8 s; `no-store` nos erros | Evita SSRF e processamento ilimitado de imagem |
| `/api/guide3d/source` GET | Aceita exclusivamente o URL HTTPS de um `.mcstructure` nos GitHub Releases oficiais do Guizzprints | Fonte até 100 MiB; sem cache | Entrega ao Guia 3D o arquivo publicado, sem permitir proxy para hosts arbitrários |
| `/api/original-converter/[...path]` GET | Caminho fixo para os assets públicos do conversor original; segmentos normalizados e sem traversal | Upstream com timeout de 30 s; resposta cacheável por 10 min; HTML/JS/CSS reescritos somente para manter os assets no proxy | Mantém o motor original no mesmo domínio do publicador sem expor um proxy para destinos arbitrários |
| `/api/vip/status` GET | Bearer opcional; entitlement é validado no servidor | `no-store`; falha retorna `vip:false` | Nunca concede benefício no cliente |
| `/api/download/session` POST | Same-origin quando `Origin`/Fetch Metadata presentes; JSON; `modId` obrigatório | Corpo máximo 2 KiB; sessão/nonce com expiração | Cria uma única sessão assinada e registra nonce privado |
| `/api/download/open` GET | Cookie assinado, `mod` compatível, expiração e timer; rejeita sinal cross-site | Prévia não consome; abertura faz update atômico | Impede replay, contagem duplicada e destino arbitrário |
| `/api/mods/[id]/refresh` POST | ID UUID; consulta privada e sem URL de origem no retorno | Cooldown server-side de 30 min por item; API oficial com deadline; `no-store` | Atualiza itens importados ao abrir a página sem expor Terabox ou permitir chamadas ilimitadas |
| `/api/vip/checkout` POST | Gate live/test; origem allowlisted; Bearer; JSON com somente `planId`/`locale` | `content-length` e corpo UTF-8 máximos de 1 KiB; timeout do provedor 15 s; planos server-owned | Idempotência por pedido; live ativo somente no domínio oficial em Production |

## Webhook e administração

| Rota/método | Acesso e validação | Limites/tempo | Efeito protegido |
|---|---|---|---|
| `/api/vip/webhook/mercadopago` POST | Assinatura HMAC, evento, modo live/test, pedido, valor e PIX conferidos | `content-length` é rejeitado antes de trabalho externo; corpo máximo 256 KiB; consulta ao provedor com deadline | Evento idempotente; somente pagamento acreditado pode ativar VIP |
| `/api/admin/status` GET | Bearer admin verificado no servidor | Resposta mínima e sem cache | Não expõe dados de autorização |
| `/api/admin/publisher/assets` GET/POST | Bearer admin verificado no servidor; arquivo, formato e extensão allowlisted | Consulta mínima; upload até 100 MiB; nomes únicos; `no-store` | Expõe apenas a capacidade de upload e envia mídia gerada ou downloads válidos ao release GitHub ativo |
| `/api/admin/publisher/publish` POST | Bearer admin verificado no servidor; o servidor valida token e links antes de gravar | Corpo JSON até 128 KiB; `no-store` | Cria as entradas Bedrock e Java sem expor credenciais ou links não allowlisted |
| `/api/admin/publisher/publication` GET/PUT/DELETE | Bearer admin verificado no servidor; UUID e par Bedrock/Java conferidos pela origem `.mcstructure` compartilhada | Corpo máximo 32 KiB; URLs HTTPS allowlisted; `no-store` | Carrega, salva ou remove as duas edições juntas; a exclusão preserva assets compartilháveis do GitHub Releases |
| `/api/admin/mods` GET | Bearer admin; categoria/sort/page/pageSize/cursor allowlisted | `pageSize` 10/20/50; export 200 por página; busca ≤100 chars | Paginação bounded e respostas sem colunas privadas desnecessárias |
| `/api/admin/mods` POST/PUT | Bearer admin; JSON estruturado; URLs e versão validadas | Corpo máximo 64 KiB | Impede payload amplo e destino Terabox inválido |
| `/api/admin/mods` DELETE | Bearer admin; `id` obrigatório | Uma operação por requisição | Mutação server-side, sem acesso público |
| `/api/admin/minecraft` POST | Bearer admin; JSON com URL HTTPS oficial e caminho Marketplace allowlisted | Corpo máximo 8 KiB; API oficial server-side com timeout de 9 s; JSON ≤2,5 MB | Impede SSRF e mantém chaves/provedor fora do cliente; retorna apenas metadados bounded |
| `/api/admin/vip/reconcile` POST | Bearer admin; `limit` 1–20; somente pedidos live | Máximo 20 pedidos e deadline de 45 s | Reconciliação não varre sandbox nem volume ilimitado |
| `/api/cron/sync-minecraft` GET | `Authorization: Bearer CRON_SECRET` com comparação constante; segredo obrigatório | Até 10 itens antigos por execução; fetch concorrente com timeout de 9 s; `no-store` | Atualiza somente itens cuja origem oficial foi salva; não expõe URLs privadas nem aceita chamadas públicas |

## Lacunas aceitas antes do lançamento

- Não há rate limiter distribuído próprio para cada rota pública; Auth,
  Turnstile, cooldowns, limites de corpo/página e idempotência cobrem os
  abusos conhecidos. Reavaliar após tráfego real ou antes de uma campanha.
- O workflow gratuito `.github/workflows/health-check.yml` já sonda o domínio
  oficial a cada 15 minutos; preferências de alerta do GitHub, alertas de
  provedor e ensaio de backup/restore ainda dependem de configuração externa.
  O plano atual do Supabase é Free.
- Teste de concorrência deve ocorrer em Preview/local, nunca contra produção
  sem janela e sem dados reais.
