# Mapa de implementação e lançamento — GuizzMods

Data da análise: 2026-09-19

Este documento transforma as referências enviadas e o estado atual do projeto em lotes de trabalho. Ele é um mapa de decisão, não uma autorização para alterar tudo imediatamente.

## 1. O que foi analisado

### Referências do TikTok

Os links foram abertos e os títulos/captions visíveis foram usados como sinais de conceito. O TikTok exibiu login/intersticiais em parte dos vídeos, portanto não foi feita uma transcrição integral nem uma cópia literal de nenhuma interface.

- [Referência 1](https://vt.tiktok.com/ZSq7216w4/) — checklist visual de coisas que um site/app pode estar esquecendo.
- [Referência 2](https://vt.tiktok.com/ZSq7YcvLX/) — descoberta de componentes e referências de interface para não criar tudo do zero.
- [Referência 3](https://vt.tiktok.com/ZSq7YGPsG/) — checklist de proteção antes de colocar um produto público no ar.
- [Referência 4](https://vt.tiktok.com/ZSq72FGyd/) — cuidados legais para evitar problemas com um site/app.
- [Referência 5](https://vt.tiktok.com/ZSq72YgJV/) — começar por OWASP Top 10 e analisar um risco por vez.

Conclusão: as referências reforçam processo, segurança, clareza e consistência; não justificam trocar a identidade visual ou reescrever a navegação inteira.

### PageSpeed Insights

Relatório fornecido: [PageSpeed do GuizzMods](https://pagespeed.web.dev/analysis/https-guizz-xyz/ri28x3ck7h?form_factor=desktop), captura de 18/09/2026.

| Área | Desktop | Celular | Leitura |
|---|---:|---:|---|
| Desempenho | 95 | 68 | O gargalo real é o celular, não o desktop. |
| Acessibilidade | 96 | 96 | Há uma falha de contraste para corrigir. |
| Práticas recomendadas | 96 | 96 | Há erro de console e verificações de segurança manuais. |
| SEO | 100 | 100 | Não reescrever metadata/rotas sem evidência. |
| Navegação agêntica | 1/3 | 1/3 | `llms.txt` e CLS são oportunidades, não bloqueio de publicação. |

Métricas principais:

- Desktop: FCP 0,3 s, LCP 0,6 s, TBT 40 ms, CLS 0,125, Speed Index 1,2 s.
- Celular: FCP 1,7 s, LCP 4,0 s, TBT 80 ms, CLS 0,312, Speed Index 4,8 s.
- Diagnósticos repetidos: JavaScript não usado (~77–78 KiB), JavaScript legado (~14 KiB), uma tarefa longa, causas de troca de layout, solicitações que bloqueiam renderização e custo de terceiros.

## 2. O que já está funcionando e deve ser preservado

- Tema único escuro, inclusive em navegador configurado para tema claro.
- Catálogo limitado/paginado, busca, categorias, favoritos e navegação mobile.
- Página de detalhe responsiva; o resumo desktop/mobile está centralizado.
- Slots Adsterra responsivos, laterais condicionais à tela, Anti-Adblock aprovado e gate premium.
- Download protegido por sessão HMAC/nonce; o detector de AdBlock nunca é a autorização do download.
- Fluxo VIP com entitlement server-side, expiração e checkout Mercado Pago
  comercial ativo em Production após um PIX supervisionado; Sandbox permanece
  isolado em Preview.
- Login Google/email, Turnstile, confirmação, recuperação e mensagens genéricas.
- Páginas legais públicas, SEO 100 no relatório e disclaimer de Minecraft.
- Testes atuais: lint, TypeScript, build e smoke 20/20 nas últimas alterações.

## 3. Riscos que devem orientar qualquer mudança

1. **CLS causado por publicidade e mídia:** `AdsterraInlineBanner` escolhe a unidade depois do `ResizeObserver`; reservar espaço sem quebrar o formato do provedor é o primeiro ponto a investigar.
2. **Falso positivo do Anti-Adblock:** rede lenta, campanha sem preenchimento ou montagem tardia de vários slots podem parecer bloqueador. Não endurecer o gate antes de testar esses cenários.
3. **Terceiros:** YouTube e Adsterra podem produzir erros de console que não são do app. Corrigir somente erros próprios identificados.
4. **Global do Adsterra:** `window.atOptions` e a fila de montagem precisam permanecer centralizados em `AdsterraSidebar.tsx`.
5. **Layout móvel já aprovado pelo usuário:** qualquer alteração de wrapper/breakpoint deve ser comparada com celular e desktop antes do deploy.
6. **Segurança/legal:** não remover CSP/HSTS/COOP, não expor Terabox ou segredos e não ativar checkout real sem handoff supervisionado.
7. **Performance versus receita:** não remover anúncios automaticamente para obter nota; medir primeiro o impacto de lazy-load, dimensões reservadas e quantidade de terceiros.
8. **`llms.txt` confirmado:** o caminho raiz hoje retorna HTML da rota localizada (`Content-Type: text/html`), apesar do relatório esperar um recurso de texto. Corrigir explicitamente no Lote 1 e testar sem alterar as rotas de locale.

## 4. Ordem recomendada e lotes coesos

### Lote 0 — diagnóstico congelado (somente leitura)

Objetivo: transformar os achados em evidência antes de editar.

- Capturar console errors no domínio oficial em Chrome limpo, bloqueador ativo e rede lenta.
- Medir quais elementos causam CLS no detalhe, home, categoria e download.
- Conferir cabeçalhos CSP, HSTS, COOP, Referrer-Policy e permissões sem afrouxá-los.
- Repetir navegação mobile/desktop em home → categoria → detalhe → download → login/VIP.
- Registrar cada achado como próprio do app, terceiro, intermitente ou falso positivo.

Saída: uma lista curta de problemas confirmados e uma linha de base PageSpeed.

Saída realizada em `docs/DIAGNOSTIC_LOTE0_2026-09-19.md`: `/llms.txt` é fallback HTML; o celular permanece no foco (CLS/LCP); os slots inline são uma causa provável de CLS; os erros de console ainda precisam de classificação em DevTools.

### Lote 1 — estabilidade, acessibilidade e confiança (P0/P1)

Implementar junto porque são correções de base e devem compartilhar a mesma regressão:

- reservar dimensões estáveis para banners, mídia e promoções sem deformar criativos;
- corrigir contraste apontado pelo PageSpeed usando os tokens escuros existentes;
- corrigir erros de console próprios;
- adicionar testes de CLS/slots, AdBlock com rede lenta/no-fill, mobile e desktop;
- revisar copy/legal de anúncios, privacidade, termos e contato.

Critério de aceite: fluxo atual visualmente igual, sem regressão mobile, gate sem falso bloqueio confirmado e smoke/focados verdes.

### Lote 2 — performance mobile (P1)

- reduzir JavaScript não usado (~77 KiB) e legado (~14 KiB) com divisão/lazy-load seguro;
- adiar mídia e anúncios fora da primeira tela, preservando detecção e receita acima da dobra;
- otimizar ordem de carregamento do hero, imagens e YouTube sem alterar o conteúdo;
- revisar tarefas longas e dependências de terceiros.

Critério de aceite: nova medição mobile melhora LCP/CLS sem remover slots, quebrar Anti-Adblock ou mudar a hierarquia aprovada.

Primeiro subset local concluído: a home agora solicita apenas campos usados pelos cards e inicia as leituras latest/trending/categorias em paralelo. Após duas execuções mobile com CLS 0,487, a home passou a reservar a altura dos oito trilhos durante o carregamento; o pós-deploy confirmou CLS 0,045. O custo de mídia/terceiros continua separado e não justifica trocar o loader sem decisão de origem e preço.

### Lote 3 — navegação e polimento visual (P1/P2)

Aplicar apenas ideias comprovadamente úteis das referências:

- checklist de descoberta/estado vazio e navegação mais explícita;
- componentes reutilizáveis e consistentes inspirados na referência de componentes;
- hierarquia dos cards, CTA e feedback de ação, sem trocar a paleta nem refazer todas as páginas;
- revisão final de mobile/desktop e acessibilidade manual.

Este lote só começa depois de congelar os lotes 1 e 2; não misturar redesign com diagnóstico de performance.

### Lote 4 — lançamento comercial supervisionado (P0) — concluído

- handoff das credenciais e webhook Mercado Pago em produção;
- teste PIX real supervisionado, concessão server-side e expiração registrada;
- confirmar páginas legais, suporte e a sonda pública de saúde;
- manter o checkout live ligado somente em Production; nunca reutilizar o
  token live no Preview/Sandbox.

Critério de aceite: nenhum segredo no cliente, nenhum VIP concedido por retorno do navegador e download protegido verificado de ponta a ponta.

## 5. Mapa de arquivos por lote

| Lote | Arquivos principais |
|---|---|
| Diagnóstico | `tests/site-smoke.test.mjs`, `src/app/[locale]/layout.tsx`, cabeçalhos/proxy, páginas públicas |
| Estabilidade/ads | `src/components/AdsterraSidebar.tsx`, `AdPlaceholder.tsx`, `VipAdGate.tsx`, `AdblockAccessGate.tsx`, `ModViewer.tsx` |
| Performance | `src/app/[locale]/page.tsx`, `category/[slug]/page.tsx`, `search/page.tsx`, `DownloadFlowView.tsx`, CSS de mídia/motion |
| Navegação/UX | `TopHeader.tsx`, `MobileNav.tsx`, `ModCard.tsx`, `FavoriteButton.tsx`, `ModViewer.tsx`, mensagens |
| Lançamento | `mercadopago-*`, rotas `/api/vip/*`, `docs/mercadopago-payments.md`, testes de webhook/reconciliação |

## 6. Decisões para evitar retrabalho

- Não copiar visual ou comportamento dos TikToks literalmente.
- Não criar um segundo sistema de anúncios; todas as unidades passam por `AdPlaceholder`/`AdsterraSidebar`.
- Não mexer no checkout real durante o trabalho visual/performance.
- Não publicar cada microajuste: validar um lote inteiro e fazer um deploy coeso.
- Não considerar uma nota alta de desktop como prova de que o celular está pronto; o 68 mobile é o principal sinal de trabalho.
- Não tratar `llms.txt` como prioridade maior que CLS, console, contraste e segurança de lançamento.

## 7. Próximo comando recomendado

Começar pelo **Lote 0** e retornar com a lista de problemas confirmados. Depois disso, implementar o Lote 1 em uma única rodada, testar, revisar visualmente e só então decidir o Lote 2.
