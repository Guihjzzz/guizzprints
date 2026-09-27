# Matriz de homologação — Mercado Pago Sandbox

Atualizado em 20/09/2026. Esta matriz cobre a execução controlada em Preview,
com Access Token de teste e payer de teste configurados diretamente no Vercel
e no Mercado Pago. Não colar credenciais no chat, no Git ou em variáveis
`NEXT_PUBLIC_*`. O checkout de produção foi ativado após o handoff comercial;
nenhum pagamento Sandbox foi liquidado durante esta rodada.

## Pré-condições

- `MERCADOPAGO_TEST_CHECKOUT_ENABLED=true` somente no Preview usado para o ensaio.
- `MERCADOPAGO_LIVE_CHECKOUT_ENABLED=true` somente em Production após o handoff
  comercial; Preview continua usando apenas a flag de teste.
- `MERCADOPAGO_TEST_USER_IDS` contém apenas o usuário de teste autorizado.
- `MERCADOPAGO_TEST_PAYER_EMAIL` é um payer de teste válido (`@testuser.com`).
- Access Token e segredo do webhook são de teste e ficam server-only.
- O preço e os dias são lidos do catálogo server-owned: Diário R$1,99, Semanal
  R$6,70 e Mensal R$19,90.
- O webhook de teste aponta para a URL oficial de Preview e a assinatura é
  validada antes de consultar ou alterar qualquer pedido.

## Estado do adaptador após a publicação — 20/09/2026

- O primeiro deploy da correção do formato Sandbox falhou apenas no build por
  um estreitamento TypeScript incompleto. O commit `2c840f2` corrigiu isso e
  ficou **Ready** em produção. O checkout live foi ligado depois, em um
  redeploy de produção separado e rastreável.
- A validação local passou **8/8** e o build/smoke passou **30/30**. A resposta
  PIX exige `payment_method` presente e continua presa à referência externa,
  quantia aceita, método PIX, status permitido e URL HTTPS de ticket.
- Em retry, uma ordem Sandbox antiga pode retornar o total comercial
  server-owned do mesmo plano; essa é a única alternativa ao valor Sandbox
  configurado. O cliente não escolhe nenhum dos dois valores.
- Diário, Semanal e Mensal foram exercitados no ambiente de teste ou cobertos
  pela matriz automatizada; os tickets não foram pagos e nenhum webhook de
  liquidação/entitlement VIP foi produzido. A próxima evidência necessária é
  um evento oficial Sandbox ou fixture assinada controlada.

### Handoff comercial e simulação de webhook — 20/09/2026

- Credenciais de produção e a URL oficial `https://www.guizz.xyz/api/vip/webhook/mercadopago`
  foram conferidas no painel do Mercado Pago sem expor valores sensíveis.
- A flag `MERCADOPAGO_LIVE_CHECKOUT_ENABLED` foi salva como `true` em Production
  e o redeploy `BELHhJSNgp4TNHcbYcbK3YTMh8sA` ficou **Ready**. Os probes públicos
  `/api/health` e `/en/vip` responderam `200` após a publicação.
- O simulador de notificações do Mercado Pago foi executado contra o endpoint
  de branch e contra o endpoint oficial; ambos retornaram `401`. O simulador
  não forneceu a assinatura HMAC (`x-signature`/`x-request-id`) exigida pelo
  endpoint fail-closed, portanto isso não é prova de falha do adaptador nem
  de liquidação.
- Em seguida, o proprietário pagou o PIX live semanal de R$6,70. A página VIP
  autenticada confirmou o entitlement semanal ativo até 27/09/2026, evidência
  do caminho de liquidação/webhook assinado e concessão server-side. Nenhum
  código, ID ou hash do ticket foi registrado.
- Replay, expiração e reembolso continuam cobertos pela matriz automatizada e
  devem ser observados sem criar nova cobrança real neste ensaio.

## Execução registrada — 20/09/2026

- Preview `site-mods-926eus9eh-guizz1.vercel.app` ficou Ready após incluir uma
  conta de teste sem entitlement na allowlist de Preview. O callback desse
  hostname foi permitido individualmente no Supabase.
- O plano **Semanal** (R$6,70) abriu um ticket PIX Sandbox do Mercado Pago com
  QR/código e vencimento visíveis. A ordem ficou no ambiente de teste; nenhum
  pagamento foi confirmado, nenhum webhook de liquidação foi recebido e nenhum
  VIP foi ativado.
- Isso aprova apenas o caso **MP-09** para o Semanal e confirma o caminho de
  autenticação/origem/catálogo. MP-10–MP-27 e os planos Diário/Mensal seguem
  pendentes; não usar o ticket para transferência real.

### Tentativa de simulação oficial — 20/09/2026

- O painel do aplicativo foi acessado sem alterar configurações. O Mercado
  Pago exigiu verificação de identidade por canal no celular, QR pelo app ou
  código temporário do Google Authenticator.
- Como nenhum código/segredo foi fornecido ou digitado, não foi possível
  consultar um eventual botão oficial de simulação nem gerar um webhook de
  liquidação. O resultado permanece **sem evento oficial**; não houve
  pagamento, reconciliação ou entitlement.
- Não tratar redirecionamento visual, QR ou código de pagamento como prova de
  liquidação. O próximo ensaio depende dessa verificação do operador ou de uma
  fixture controlada que preserve a assinatura e a idempotência.

### Retomada após validação da conta — 20/09/2026 (registro histórico)

- A validação adicional da conta foi concluída pelo operador e o painel voltou
  a liberar as credenciais/áreas de teste.
- O plano Semanal (R$6,70) gerou novamente um ticket PIX Sandbox válido no
  Preview, sem pagamento, webhook de liquidação ou ativação VIP.
- Diário (R$1,99) e Mensal (R$19,90) retornaram `502 provider_invalid` em
  `/api/vip/checkout` quando o provedor reutilizou uma ordem com total antigo;
  essa observação foi supersedida pela correção publicada abaixo.

### Correção do formato de teste — 20/09/2026

- A documentação oficial do Mercado Pago confirma que o teste PIX por Orders
  usa uma order pré-definida: valor de teste configurável e `payer.first_name`
  igual a `APRO`. O nosso Preview estava enviando os preços comerciais e não
  preenchia esse marcador, explicando as respostas inválidas para Diário/Mensal.
- O adaptador agora aceita `MERCADOPAGO_TEST_ORDER_AMOUNT` somente no modo
  Sandbox e envia `APRO`; o preço/dias do plano continuam server-owned na linha
  `vip_orders`, e a variável foi criada no Vercel **Preview** com `50.00`.
  Produção nunca consulta essa variável e mantém os valores comerciais.
  A validação local passou **8/8** no adaptador (incluindo retry seguro de ordem
  antiga e fallback para valor de teste malformado). Nenhum pagamento ou
  entitlement foi realizado.

## Casos de borda HTTP (sem criar pedido)

| ID | Ensaio | Resultado esperado | Evidência |
|---|---|---|---|
| MP-01 | Checkout sem flag de teste/live | `503`, resposta genérica de desabilitado | Log sanitizado, sem token |
| MP-02 | Origem diferente da URL de teste | `403 invalid_origin` | Nenhuma chamada ao provedor |
| MP-03 | Sessão ausente ou inválida | `401`/redirecionamento de autenticação | Nenhum pedido criado |
| MP-04 | Usuário autenticado fora da allowlist | `403 tester_only` | Nenhum pedido criado |
| MP-05 | Plano inexistente, locale inválido ou corpo malformado | `400` genérico | Catálogo server-owned preservado |
| MP-06 | Método diferente de `POST` | `405` | Nenhuma chamada ao provedor |
| MP-07 | Corpo não JSON ou acima do limite | `400` antes do parse completo | Sem log de payload |
| MP-08 | Requisição repetida com a mesma intenção | Reutiliza a ordem/idempotência, sem segundo pedido | IDs internos não expostos |

## Checkout de teste e persistência

| ID | Ensaio | Resultado esperado | Evidência |
|---|---|---|---|
| MP-09 | Criar checkout para cada plano | URL HTTPS de ticket/sandbox validada; valor e dias corretos | Linha `checkout_created` |
| MP-10 | Repetir a chamada após timeout do cliente | A mesma intenção é recuperável; não duplica cobrança | Uma ordem lógica |
| MP-11 | Provedor indisponível ou resposta inválida | Erro genérico `502/503`; pedido não é marcado como pago | Log apenas com classe/código |
| MP-12 | URL de retorno com host/path não permitido | Não redireciona; erro genérico | Allowlist de origem preservada |
| MP-13 | Usuário tenta alterar preço/plano no corpo | Valor salvo continua sendo o do catálogo | Nenhuma mutação client-side |

## Webhook assinado e idempotência

| ID | Ensaio | Resultado esperado | Evidência |
|---|---|---|---|
| MP-14 | Webhook sem `x-signature`/`x-request-id` | `401` ou `405`; nenhuma consulta/mutação | Sem detalhe do provedor |
| MP-15 | Assinatura inválida ou timestamp fora da janela | `401`; evento não persiste | Sem entitlement |
| MP-16 | Evento válido de ordem de teste | Persiste evento e verifica a ordem no provedor | Ordem é sandbox |
| MP-17 | Mesmo `notification_id` reenviado | Resposta idempotente; uma única aplicação | Índice/evento único |
| MP-18 | Ordem inexistente, de outro usuário ou outro ambiente | Ignora com estado seguro; não concede VIP | Entitlement ausente |
| MP-19 | Valor, moeda ou método diferente de PIX | Não concede VIP; marca divergência | Motivo sanitizado |
| MP-20 | Evento chega antes da conclusão ou fica pendente | Permanece recuperável; reconciliação posterior | Estado `pending` |
| MP-21 | Reembolso, cancelamento, expiração ou disputa | Entitlement não é criado/é revogado conforme regra server-side | Histórico preservado |

## Reconciliação administrativa

| ID | Ensaio | Resultado esperado | Evidência |
|---|---|---|---|
| MP-22 | Admin anônimo ou sem papel permitido | `403` | Nenhuma consulta ao provedor |
| MP-23 | `limit` ausente, menor que 1 ou maior que 20 | `400`; limite não é ampliado | Sem carga ilimitada |
| MP-24 | Pedido live pendente com ID correspondente | Consulta no máximo até o deadline de 45 s e aplica RPC idempotente | `applied=true` somente uma vez |
| MP-25 | Pedido sandbox encontrado na fila live | Ignora com razão `sandbox_order` | Nenhuma concessão live |
| MP-26 | ID externo divergente, valor divergente ou múltiplos pagamentos | Falha segura; não aplica entitlement | Motivo sanitizado |
| MP-27 | Timeout de uma consulta | Continua/encerra dentro do deadline; pedido permanece recuperável | Sem 500 com dados sensíveis |

## Critério de aprovação

O lote só passa quando MP-01–MP-27 estiverem registrados em Preview, sem
transferência real, sem entitlement de produção e sem segredo aparecer em
resposta, log, HTML ou bundle. Um retorno visual do Mercado Pago nunca é prova
de pagamento: somente webhook assinado, consulta server-side e RPC idempotente
podem concluir o fluxo.

Após o handoff comercial, a flag live permanece ligada em Production. O
primeiro PIX live supervisionado foi liquidado e concedeu o plano semanal;
não criar uma segunda cobrança apenas para teste.

## Referências de implementação

- `src/app/api/vip/checkout/route.ts`
- `src/app/api/vip/webhook/mercadopago/route.ts`
- `src/app/api/admin/vip/reconcile/route.ts`
- `src/lib/mercadopago-checkout.ts`
- `src/lib/mercadopago-webhook.ts`
- `docs/SECURITY_ROUTE_MATRIX.md`
