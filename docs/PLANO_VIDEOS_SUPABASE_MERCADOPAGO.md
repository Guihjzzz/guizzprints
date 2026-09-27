# Plano integrado — domínio Supabase, Mercado Pago e proteção de lançamento

Atualizado em 20/09/2026. Correção de escopo: o primeiro vídeo mostra como
substituir o host padrão cheio de caracteres do Supabase por um hostname
personalizado do projeto, e não apenas uma revisão genérica de segurança. Este
documento transforma esse objetivo, o Mercado Pago e o segundo vídeo em um
plano executável. Os vídeos são referências de conceito, não especificações
para copiar literalmente.

## Decisões principais

- O vídeo sobre Supabase fica registrado como referência, mas não haverá
  contratação de plano novo nesta fase. O projeto permanece no host padrão
  `PROJECT_REF.supabase.co`, com HTTPS; domínio customizado fica opcional e
  adiado. A revisão de segurança continua obrigatória; backup/restauração foi
  documentado e permanece adiado pelo proprietário.
- O Mercado Pago é o único provedor de pagamento. A base técnica já está
  implementada com Orders/PIX, webhook assinado, idempotência, reconciliação e
  entitlement server-side. O próximo trabalho é homologar e operar com
  segurança, não trocar o provedor.
- `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` está ativo somente em Production,
  com credenciais, webhook oficial, produtos/preços conferidos e um único PIX
  semanal supervisionado de R$6,70. Preview continua isolado em Sandbox e o
  retorno do navegador nunca concede VIP.
- A checklist do segundo vídeo será aplicada somente onde cabe ao produto:
  limites, estados de erro, pagamentos duplicados, consultas, uploads,
  observabilidade, testes de carga e restauração. Não serão adicionados
  serviços pagos ou bloqueios frágeis sem evidência e autorização.

## Fase 0 — domínio personalizado do Supabase (adiado por custo)

O painel confirmou que o projeto está no plano Free e que Custom Domains
exigem Pro mais US$10/mês por domínio. Como não haverá novo plano, nenhuma
ação de DNS, OAuth ou troca de `NEXT_PUBLIC_SUPABASE_URL` será feita agora.
O host padrão permanece a fonte de verdade e continua protegido por HTTPS.

**Objetivo futuro:** trocar o endereço técnico do Supabase sem quebrar OAuth,
sessão, webhooks, storage, funções ou downloads, somente se o orçamento mudar.

1. Escolher o hostname. O padrão recomendado é um subdomínio, por exemplo
   `api.guizz.xyz`; não apontar o domínio raiz do site diretamente para o
   Supabase.
2. Confirmar no plano Supabase a disponibilidade do add-on **Custom Domains**.
   Ele é pago, aceita um único domínio por projeto e usa CNAME. Se a intenção
   for algo como `guizzmods.supabase.co`, isso é a alternativa experimental
   **Vanity Subdomain**, com requisitos diferentes e configuração via CLI.
3. No painel Supabase, abrir as configurações gerais de Custom Domains e
   registrar o hostname escolhido.
4. No DNS do domínio (se ele foi comprado/gerenciado pelo Google, usar o
   painel DNS atual do registrador), criar o CNAME indicado pelo Supabase,
   apontando o hostname para `PROJECT_REF.supabase.co`.
5. Criar também o TXT `_acme-challenge.<hostname>` com o valor entregue pelo
   Supabase. Aguardar a verificação e a emissão do certificado TLS.
6. Antes de ativar, adicionar os novos callbacks/URLs nos consoles do Google
   OAuth e de qualquer integração externa. Manter o host antigo disponível como
   fallback durante a transição.
7. Depois de verificado, atualizar `NEXT_PUBLIC_SUPABASE_URL` no Vercel e no
   ambiente local para `https://<hostname>`, publicar e testar login Google,
   confirmação/recuperação de e-mail, Turnstile, sessão, VIP, downloads,
   Storage e funções.
8. Se qualquer teste falhar, reverter apenas a variável de URL para o host
   padrão; não remover o domínio nem apagar dados.

**Aceite:** DNS CNAME/TXT verificados, certificado ativo, smoke autenticado
completo e nenhum segredo exposto. A documentação oficial confirma que o host
original continua funcionando após a ativação, permitindo rollback seguro.

## Fase 0.1 — segurança e continuidade do Supabase (P0)

**Auditoria Free de 19/09/2026:** o painel de infraestrutura mostrou projeto
`SITE-MODS Free`, sem réplicas de leitura e com o primário atendendo leituras e
escritas. O uso de disco exibido foi 0,00 GB (limite informado pelo painel:
2 GB). Não foi encontrado no painel consultado um controle/evidência de PITR
ou de restauração para ensaiar; isso fica pendente e não deve ser marcado como
backup verificado. A documentação oficial recomenda, para Free, exportação
lógica com `supabase db dump` e cópia fora do projeto; o procedimento está em
`docs/SUPABASE_FREE_CONTINUITY_RUNBOOK.md`. Nenhum dado foi apagado,
restaurado ou alterado.

1. Conferir confirmação de e-mail, Google OAuth, Turnstile/Attack Protection,
   allowlist de callbacks, chaves públicas e separação da service role.
2. Revisar RLS, views públicas e funções `SECURITY DEFINER`, incluindo
   `search_path` e permissões de execução.
3. Confirmar que downloads, admin e VIP só usam caminhos server-side.
4. Registrar backup/PITR disponível e executar ensaio de restauração não
   produtivo; registrar a limitação do plano Free se aplicável.
5. Manter alertas/logs sanitizados para auth, download, webhook e reconciliação.

**Aceite:** evidência no painel/migration + teste de leitura e restauração sem
alterar dados de produção. O aviso de leaked-password do plano Free continua
explicitamente classificado como limitação opcional, não como falso “concluído”.

## Fase 1 — Mercado Pago em sandbox/homologação (P0)

**Objetivo:** provar o fluxo completo sem liberar cobrança pública.

A sequência executável está em `docs/MERCADO_PAGO_SANDBOX_MATRIX.md` (MP-01 a
MP-27). Ela cobre bordas HTTP, criação/idempotência, webhook assinado,
duplicidade, divergência, timeout e reconciliação. A matriz é um plano de
ensaio, não uma evidência de que o sandbox já foi executado. O Preview já tem
token de teste, flag de sandbox, payer `@testuser.com`, UUID real do Supabase e
segredo server-only. O modo de teste do Mercado Pago está com Order apontando
para `https://site-mods-git-main-guizz1.vercel.app/api/vip/webhook/mercadopago`;
esse domínio de branch é a única exceção pública de proteção Vercel e fica
acessível durante a homologação para permitir a entrega externa.

- Confirmar Access Token de teste, payer de teste, planos/preços server-owned,
  allowlist de usuários de teste e a assinatura Order (feito; falta exercitar o
  fluxo).
- Criar um pedido PIX de teste e validar: persistência, idempotency key,
  external reference, retorno apenas da URL validada e nenhuma concessão pelo
  navegador.
- Reenviar webhook assinado e verificar processamento idempotente; testar
  assinatura inválida, evento duplicado, pedido de outro valor, provider ID
  divergente, timeout e webhook atrasado.
- Exercitar o endpoint de reconciliação para pedido pendente/paid, além de
  cancelamento, expiração, reembolso e disputa sem reativar entitlement.
- Conferir logs e respostas públicas: sem token, order ID sensível ou detalhes
  do provedor no cliente.

**Aceite:** testes focados + um teste ponta a ponta autorizado em sandbox,
com evidência de que somente uma transação válida ativa o VIP e que todos os
casos ambíguos permanecem recuperáveis.

## Fase 2 — Checklist adaptada dos 20 itens do vídeo (P1)

Legenda: **✅ feito e evidenciado**, **◐ parcial**, **⏳ pendente**, **— não se aplica por desenho atual**.

| # | Item do vídeo | Estado atual | Evidência/lacuna | Próxima ação agrupada |
|---:|---|---|---|---|
| 1 | Rate limiting | ◐ Parcial | Supabase/Auth, CAPTCHA e cooldowns existem; não há limitador distribuído geral para todas as APIs | Revisar limites por rota e alertas |
| 2 | API limits | ✅ Feito | Bodies, páginas, cursores e reconciliação têm limites server-side | Manter e testar excesso |
| 3 | Spending caps | ⏳ Pendente | Não há teto/alerta operacional comprovado para Mercado Pago, Vercel ou add-ons Supabase | Definir limites e alertas antes do comercial |
| 4 | Error handling | ✅ Feito | APIs retornam erros genéricos; telas têm mensagens localizadas | Cobrir falhas raras restantes |
| 5 | Loading states | ✅ Feito | Login, catálogo, download, VIP e admin exibem estados de carregamento | Regressão visual mobile/desktop |
| 6 | Empty states | ✅ Feito | Busca, favoritos, catálogo e listas vazias têm estados próprios | Manter cobertura |
| 7 | Failed requests | ◐ Parcial | Retry de busca/categorias e recuperação de webhook/download existem; não é política global para toda chamada | Testar rotas críticas e falhas transitórias |
| 8 | API timeouts | ◐ Parcial | Mercado Pago, download e admin têm deadlines/abort; outras dependências ainda dependem do provedor | Exercitar deadlines e recuperação |
| 9 | Duplicate subscriptions | — N/A por desenho | Não existe assinatura recorrente; VIP usa pedidos PIX pontuais | Não criar recorrência sem novo desenho |
| 10 | Duplicate payments | ◐ Parcial | Índice, idempotência e webhook protegem duplicação; homologação ponta a ponta ainda falta | Repetir pedido, webhook e timeout em sandbox |
| 11 | Optimize DB queries | ◐ Parcial | Selects bounded, leituras paralelas e consultas paginadas já foram aplicados; faltam métricas/EXPLAIN de produção | Medir consultas críticas |
| 12 | DB indexes | ◐ Parcial | Índices das rotas principais estão nas migrations; revisão baseada em tráfego ainda não ocorreu | Conferir planos após métricas reais |
| 13 | Paginate large results | ✅ Feito | Catálogo/admin/export usam limites e cursores/páginas bounded | Testar limites máximos |
| 14 | Compress files | ⏳ Pendente | Imagens remotas usam fallback direto porque a quota `/_next/image` retornou 402; não há CDN próprio | Escolher CDN/loader e medir bytes |
| 15 | Limit upload size | ✅ Feito no modelo atual | Admin rejeita body grande antes do parse; o produto recebe URLs, não binários | Revalidar se upload de arquivo for adicionado |
| 16 | Cache repeat requests | ◐ Parcial | Há dedupe/cooldown de entitlement e `no-store` em dados sensíveis; não há cache geral deliberado | Adicionar somente com medição e invalidação |
| 17 | Uptime monitoring | ◐ Parcial | `.github/workflows/health-check.yml` sonda `/api/health` a cada 15 min; preferências de alerta ainda são opcionais | Manter o workflow gratuito e revisar alertas quando necessário |
| 18 | Error logging | ◐ Parcial | Logs server-side sanitizados existem; alertas, retenção e painel operacional ainda não foram demonstrados | Definir alertas e retenção |
| 19 | Simultaneous users | ⏳ Pendente | Nenhum teste de carga concorrente foi executado | Testar em local/Preview, nunca contra produção sem janela |
| 20 | Backup restore | ⏳ Pendente | Backup/PITR e restauração ainda não têm ensaio documentado | Executar restore não produtivo na Fase 0.1 |

Os itens “compress files”, carga simultânea e backup dependem de infraestrutura
ou de uma janela controlada; não serão simulados como concluídos.

## Fase 3 — Handoff comercial do Mercado Pago (concluída em 20/09/2026)

1. Credenciais de produção, produtos/preços e segredo do webhook foram
   configurados diretamente no provedor/Vercel, sem registrar valores sensíveis
   no chat ou em `NEXT_PUBLIC_*`.
2. O webhook Order está apontado para o domínio oficial e permanece fail-closed
   para chamadas sem assinatura HMAC.
3. Um único PIX real semanal de R$6,70 foi pago e o entitlement server-side foi
   confirmado até 27/09/2026. Não criar outra cobrança para testar replay,
   expiração ou reconciliação.
4. `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` permanece apenas em Production;
   Preview usa Sandbox separado. A matriz formal de evento assinado Sandbox é
   uma pendência opcional de evidência, não um motivo para misturar ambientes.

## Fase 4 — Manutenção pós-lançamento sem plano pago

- Repetir `npm audit` quando o endpoint do npm sair da manutenção e classificar
  avisos transitivos.
- Repetir PageSpeed com a mesma configuração; medir CLS/LCP e não alterar
  anúncios ou imagens por um número isolado.
- Manter o workflow gratuito de saúde, observar expiração/replay e usar a
  reconciliação administrativa apenas quando necessário.
- Revalidar callbacks de auth, textos legais, PWA e smoke público em `en/pt/es`
  em cada mudança relevante. Backup/restore continua explicitamente adiado.
- Repetir os testes locais e `npm audit` em cada release; qualquer CDN,
  limitador distribuído, alerta pago ou teste de carga deve ser decidido por
  evidência e sem contratar plano novo.

## Ordem prática das próximas rodadas

1. Manter as evidências de segurança e o limite do plano Free documentados.
2. Se a homologação formal exigir, executar apenas a fixture/evento assinado de
   Sandbox em Preview, sem cobrança real adicional.
3. Monitorar o site com o workflow gratuito e repetir smoke/audit em releases.
4. Priorizar melhorias de tráfego real (rate limit distribuído, compressão,
   cache e carga em Preview) somente quando houver evidência e sem plano pago.

O domínio personalizado do Supabase continua como opção futura, fora da ordem
de lançamento atual, porque o proprietário decidiu não contratar um plano novo.

### Fora do escopo automático

Não ativar cobrança real, não criar assinatura recorrente, não instalar serviço
de monitoramento pago, não executar teste de carga contra produção e não
solicitar/armazenar credenciais no chat sem uma autorização específica para a
etapa correspondente.
