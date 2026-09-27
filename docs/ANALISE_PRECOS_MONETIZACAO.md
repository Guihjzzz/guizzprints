# Análise de preço VIP e monetização — 19/09/2026

## Resultado do teste real

O fluxo público foi testado em produção no detalhe de um mod, em viewport desktop e em 390×844.

- Detalhe do mod: 5 slots carregáveis.
- Cada uma das 3 etapas normais do download: 3 slots (dois banners e um retângulo).
- Etapa final de abertura: 2 banners.
- O teste original confirmou que os mesmos três hosts eram preservados enquanto o usuário avançava com Skip; a implementação local agora remonta somente esses slots da etapa ativa quando há uma mudança causada pelo clique real.
- Total atual de um download concluído: **10 oportunidades de impressão** (5 no detalhe, 3 no fluxo normal e 2 na etapa final).
- Em viewport com pelo menos 1800px, entram ainda dois laterais 160×600: **12 oportunidades**.
- Com a remontagem por avanço, o desenho passa a oferecer até **16 oportunidades** (ou 18 com laterais) por download concluído, desde que o provedor preencha as novas solicitações. Isso não é uma promessa de impressões pagas.

O número acima é de slots carregados pelo site, não uma promessa de impressões pagas. A Adsterra só contabiliza o anúncio quando ele termina de carregar; bloqueador, no-fill, VPN/proxy e falhas do provedor reduzem o número efetivo.

## Dados observados na conta Adsterra

Consulta feita em 19/09/2026 com o intervalo exibido de 21/08 a 19/09. A tabela continha dados somente de 18 e 19/09:

| Métrica | Valor |
|---|---:|
| Impressões | 821 |
| Cliques | 6 |
| CTR | 0,731% |
| eCPM médio | US$ 0,012 |
| Receita | US$ 0,01 |

Por placement: 160×600 = 244 impressões, 300×250 = 128, 320×50 = 276, 468×60 = 11 e 728×90 = 162. O único retorno material foi o 320×50 (eCPM exibido de US$0,032); o restante estava em US$0 ou próximo disso.

## Valor perdido por usuário

Usando o eCPM observado (US$0,012) e aproximadamente R$5,13 por dólar:

- 10 impressões por dia × 30 dias: cerca de **R$0,02/mês** de anúncios por usuário.
- Tela muito larga (12/dia): cerca de **R$0,02/mês**.
- O cenário com a remontagem por Skip (16/dia) chegaria a aproximadamente **R$0,03/mês** no eCPM observado.

Isso não é uma projeção madura: são apenas dois dias de dados e 821 impressões. A Adsterra explica que eCPM varia por GEO, dispositivo, formato, demanda, cliques e conversões; portanto esse valor deve ser recalculado com uma janela de 30 dias.

## Sobre recarregar anúncios ao clicar em Skip

O refresh implementado é disparado somente pela transição real de etapa após o clique em Skip. Ele desmonta os hosts antigos, adiciona um identificador de montagem à URL do `invoke.js` para evitar cache e monta os três slots visíveis da nova etapa (dois leaderboards e um retângulo). Nos formatos horizontais, as unidades aprovadas alternam quando cabem no container; não há timer, chamada oculta, duplicata ou refresh no terceiro clique que fecha a etapa normal. A etapa final mantém seus próprios banners.

Isso força uma nova solicitação ao provedor, mas não garante uma campanha visual diferente: a Adsterra pode devolver a mesma criatividade por leilão, frequência, geografia ou falta de fill. O teste público precisa ocorrer depois do deploy desta versão; uma página antiga continuará exibindo o comportamento anterior.

Isso é uma nova oportunidade legítima quando o anúncio é carregado e exibido, mas continua sujeito às regras da Adsterra para refresh/smart refresh. Antes do lançamento, confirmar na conta do provedor se esse formato e essa frequência são permitidos e acompanhar `initial_load` versus `user_advance`, fill, eCPM e sinais de tráfego inválido.

## Custos que entram no preço

- **Vercel:** Hobby é gratuito, mas a própria Vercel limita-o a uso pessoal/não comercial; Pro parte de US$20 por usuário/mês, com créditos e uso excedente conforme o consumo.
- **Supabase:** Free é US$0; Pro parte de US$25/mês e inclui créditos de compute. Backups/PITR e compute adicional podem aumentar a fatura; PITR aparece como add-on de US$100 por 7 dias de retenção.
- **Mercado Pago:** o checkout cobra taxa por transação e prazo/método. A referência publicada em 2026 indica faixa online de aproximadamente 0,99% a 4,99%; confirmar a taxa específica da conta antes de decidir preço.
- **Domínio `.xyz`:** renovação anual do registrador; o valor não está disponível no repositório e precisa vir da fatura da conta.
- **Adsterra:** não há mensalidade de plataforma no fluxo de publisher; o custo é oportunidade/receita variável por eCPM, fill, bloqueadores e qualidade do tráfego.
- **Analytics/monitoramento:** Vercel Analytics e Search Console podem permanecer dentro das cotas gratuitas; alertas avançados podem ter cobrança conforme o plano.

Com isso, o preço mínimo não pode ser apenas “anúncios perdidos”: precisa cobrir gateway, infraestrutura, domínio, impostos e uma reserva operacional.

## Decisão comercial aplicada

Como o eCPM observado ainda é muito baixo e a infraestrutura/gateway também precisam ser pagos, a tabela foi simplificada para três entradas, com preço diário regressivo:

| Plano | Dias | Total | Custo aproximado/dia | Papel |
|---|---:|---:|---:|---|
| Diário | 1 | R$1,99 | R$1,99 | Entrada imediata, deliberadamente mais cara por dia |
| Semanal | 7 | R$6,70 | **R$0,96** | Plano intermediário solicitado |
| Mensal | 30 | R$19,90 | ~R$0,66 | Melhor valor e principal âncora |

Trimestral e anual não são mais oferecidos para novas compras. Os identificadores antigos continuam aceitos somente no banco para preservar o histórico de pedidos e acessos já pagos; o checkout e a página pública usam apenas Diário, Semanal e Mensal.

Essa tabela ainda deve ser acompanhada após a abertura do checkout real. Medir receita líquida após Mercado Pago, conversão, abandono e renovação antes de fazer outro ajuste. O valor anunciado não deve ser alterado apenas para compensar uma amostra curta de eCPM.

## Como medir a decisão

O teste deve usar atribuição server-side por usuário, sem confiar no preço enviado pelo navegador. Medir:

1. conversão de usuário que iniciou download para pagamento aprovado;
2. receita líquida após tarifa do Mercado Pago;
3. receita de anúncios por usuário não-VIP;
4. conclusão do download e abandono;
5. reembolso, suporte e renovação/segunda compra.

Regra de proteção: não escolher a variante apenas por conversão. Ela precisa aumentar a receita líquida por downloader sem derrubar conclusão do download nem levar o eCPM sustentado acima do valor coberto pelo plano.
