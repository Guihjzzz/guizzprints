# Mapa mestre de lançamento — GuizzMods

Atualizado em 20/09/2026. Este é o mapa único para reunir as pendências das
duas listas enviadas, do PageSpeed e das revisões anteriores. Novas listas
devem ser incorporadas aqui antes de iniciar outra rodada de implementação.

Legenda: **✅ concluído e evidenciado**, **◐ parcial**, **⏳ pendente**, **⏸
adiado pelo proprietário**, **— fora do escopo atual**.

## 1. Base já concluída e que não deve ser desfeita

- ✅ Tema escuro único, inclusive em navegador configurado para tema claro.
- ✅ Catálogo, busca, categorias, favoritos, navegação mobile e layout de
  detalhe responsivo.
- ✅ Adsterra centralizado, slots responsivos, Anti-Adblock premium e VIP gate.
- ✅ Download protegido por sessão/nonce, origem, assinatura e reconciliação.
- ✅ Google/email auth, confirmação, recuperação, Turnstile e mensagens
  genéricas.
- ✅ Mercado Pago Orders/PIX, webhook assinado, idempotência, reconciliação e
  entitlement server-side; checkout live comercial ativo em Production após
  um PIX supervisionado.
- ✅ Páginas legais, favicon, manifest, robots, analytics Vercel, headers de
  segurança, `llms.txt` e smoke público.

## 2. Checklist do vídeo: 20 proteções

| # | Item | Estado | Próxima decisão |
|---:|---|---|---|
| 1 | Rate limiting | ◐ | Adicionar/revisar limite distribuído para APIs fora do Auth |
| 2 | API limits | ✅ | Manter limites de body, página, cursor e reconciliação |
| 3 | Spending caps | ⏳ | Definir teto/alertas para Mercado Pago, Vercel e Supabase |
| 4 | Error handling | ✅ | Preservar erros genéricos e localizados |
| 5 | Loading states | ✅ | Regressão visual contínua |
| 6 | Empty states | ✅ | Manter catálogo, busca e favoritos cobertos |
| 7 | Failed requests | ◐ | Testar falhas transitórias de todas as rotas críticas |
| 8 | API timeouts | ◐ | Uniformizar deadlines onde ainda dependem do provedor |
| 9 | Duplicate subscriptions | — | Não há assinatura recorrente no produto atual |
| 10 | Duplicate payments | ◐ | Guardrails e suíte simulada passam; homologar duplicata, retry e webhook atrasado em sandbox |
| 11 | Optimize DB queries | ◐ | Medir consultas críticas e evitar payload amplo |
| 12 | DB indexes | ◐ | Conferir índices com métricas/EXPLAIN após tráfego real |
| 13 | Paginate large results | ✅ | Manter limites e cursores |
| 14 | Compress files | ⏳ | Escolher CDN/loader; `/_next/image` está desativado por quota |
| 15 | Limit upload size | ✅ | Revalidar caso o modelo passe a aceitar binários |
| 16 | Cache repeat requests | ◐ | Adicionar cache apenas com invalidação e medição |
| 17 | Uptime monitoring | ◐ | `/api/health` fornece uma sonda pública mínima, sem cache e sem dependências externas; workflow gratuito do GitHub Actions roda a cada 15 min e as execuções `35479199762` e `GuizzMods health check #2` passaram; preferências de notificação ainda dependem do GitHub |
| 18 | Error logging | ◐ | Falhas de auth/download/VIP/admin usam labels sanitizados; ainda faltam alertas, retenção e painel operacional |
| 19 | Simultaneous users | ⏳ | Testar concorrência apenas em local/Preview |
| 20 | Backup restore | ⏸ | Adiado pelo proprietário; runbook permanece pronto para futura janela operacional |

## 3. Checklist essencial de sites gerados por IA

| # | Item | Estado | Evidência/lacuna |
|---:|---|---|---|
| 1 | CTA na primeira dobra | ✅ | QA público confirmou CTA/ação inicial na home, busca, categoria e VIP; detalhe mantém View details/Download |
| 2 | Meta title por página | ✅ | Home, legal, detalhe, VIP, categorias e busca têm títulos próprios ou específicos |
| 3 | Meta description por página | ✅ | Home, legal, detalhe, VIP, categorias e busca têm descrições específicas |
| 4 | Favicon | ✅ | `/icon.jpg` e ícone Apple verificados em produção |
| 5 | Alt text | ✅ | Cards e media do detalhe usam o título do mod ou uma descrição específica; padrões genéricos conhecidos foram removidos |
| 6 | Responsividade mobile | ✅ | QA mobile/desktop e correções de centralização publicados |
| 7 | Erros de formulários | ✅ | Auth/admin têm validação, estados e mensagens localizadas |
| 8 | Privacidade/termos | ✅ | Rotas legais en/pt/es públicas e revisadas |
| 9 | Analytics/Search Console | ◐ | Vercel Analytics/Speed Insights ativos; propriedade `https://www.guizz.xyz/` verificada e sitemap enviado; o painel ainda precisa rechecagem do fetch |
| 10 | Imagens comprimidas | ⏳ | Fallback de imagem direta estável; compressão/CDN ainda pendente |
| 11 | 404 personalizada | ✅ | `src/app/not-found.tsx` oferece estado escuro, links de navegação e smoke 25/25 |
| 12 | Open Graph image | ✅ | Metadata padrão, categorias, busca e detalhe usam imagem OG/Twitter; detalhe prefere a imagem do mod |
| 13 | `robots.txt` | ✅ | Público, com regras de API/privado e sitemap |
| 14 | `sitemap.xml` | ✅ | `mash-up` foi incluído e as URLs públicas passam no smoke atualizado |

## 4. Checklist de segurança da terceira lista

| # | Item | Estado | Evidência/lacuna |
|---:|---|---|---|
| 0 | Esconder chaves de API | ✅ | Chave pública do Supabase/Turnstile é pública por desenho; service role, Mercado Pago e segredos ficam server-only |
| 1 | Limpar segredos do Git | ◐ | 205 commits e o working tree foram varridos por padrões de alta confiança sem matches; scanner completo de provedor ainda não está disponível |
| 2 | Usar chave pública do banco | ✅ | Browser usa apenas `NEXT_PUBLIC_SUPABASE_ANON_KEY`; service role fica no servidor |
| 3 | Ativar RLS | ✅ | Policies e views públicas/privadas estão nas migrations e foram endurecidas |
| 4 | Criptografar dados sensíveis | ◐ | HTTPS/HSTS e criptografia gerenciada do provedor; não há criptografia de campo própria nem foi necessária para credenciais de pagamento |
| 5 | Forçar autenticação no servidor | ✅ | Admin, download, VIP e webhook validam sessão/assinatura no servidor |
| 6 | Travar acesso aos registros | ✅ | RLS, colunas privadas e permissões `service_role` restringem pedidos, sessões e URLs |
| 7 | Bloquear adulteração de campos | ✅ | Preços/entitlement são server-owned; payloads admin e valores PIX são validados |
| 8 | Proteger cookies de sessão | ✅ | Cookies de download/callback usam `httpOnly`, `sameSite` e `secure` em produção |
| 9 | Fazer hash das senhas | ✅ | Supabase Auth gerencia hash; o app nunca recebe nem armazena senha em texto |
| 10 | Limitar tentativas de login | ◐ | Rate limits do Supabase + Turnstile + cooldown UX; falta limitador distribuído próprio |
| 11 | Adicionar proteção contra bots | ✅ | Turnstile/Attack Protection ativos no fluxo de autenticação |
| 12 | Parametrizar queries | ✅ | Consultas usam Supabase query builder; não há SQL concatenado com entrada pública |
| 13 | Validar toda entrada | ✅ | Auth, admin, download e pagamentos validam limites/formatos; `docs/SECURITY_ROUTE_MATRIX.md` cobre as 9 rotas e passa 2/2 |
| 14 | Escapar conteúdo do usuário | ✅ | React escapa texto por padrão e não há `dangerouslySetInnerHTML` no produto |
| 15 | Restringir upload de arquivos | ✅ no modelo atual | Admin aceita URLs e body limitado; não há upload binário público para validar MIME |
| 16 | Enxugar respostas da API | ✅ | Campos de catálogo são bounded; status VIP e erros públicos são mínimos |
| 17 | Adicionar cabeçalhos de segurança | ✅ | CSP, HSTS, nosniff, frame-deny, referrer e permissions foram verificados |
| 18 | Forçar HTTPS | ✅ | Domínio oficial usa HTTPS/HSTS; links sensíveis rejeitam destinos inseguros |
| 19 | Escanear dependências | ✅ | `npm audit --audit-level=high` e `npm audit --omit=dev --audit-level=high` retornaram 0 vulnerabilidades |

### Próximas ações de segurança

1. Repetir uma varredura especializada quando o scanner estiver disponível e
   revogar qualquer segredo antigo se for encontrado.
2. A matriz inicial está em `docs/SECURITY_ROUTE_MATRIX.md`; revalidar quando
   uma rota mudar e decidir se um rate limiter distribuído é necessário antes
   do tráfego comercial.
3. Manter `npm audit` no checklist de cada release e classificar qualquer
   advisory novo antes de publicar.

## 5. Itens P0 externos e continuidade pós-lançamento

1. **Supabase custom domain:** **adiado por decisão do proprietário**. O
   projeto permanece no host padrão HTTPS do Supabase; não comprar Pro, não
   alterar DNS e não trocar `NEXT_PUBLIC_SUPABASE_URL`. Se o orçamento mudar,
   reabrir a Fase 0 com CNAME/TXT/certificado e callbacks OAuth.
2. **Supabase continuidade:** **adiada pelo proprietário**. A auditoria Free de
   19/09 mostrou primário único, sem réplicas e 0,00 GB usados; o runbook em
   `docs/SUPABASE_FREE_CONTINUITY_RUNBOOK.md` permanece pronto para uma futura
   exportação e ensaio separados, sem restaurar produção.
3. **Mercado Pago sandbox (evidência opcional):** Preview já possui token de teste, flag, payer
   `@testuser.com`, UUID da conta GuizzMods e segredo server-only. O evento Order
   aponta para `https://site-mods-git-main-guizz1.vercel.app/api/vip/webhook/mercadopago`;
   esse domínio de branch recebeu exceção pública da proteção Vercel durante a
   homologação (o domínio oficial permanece protegido).
   Falta, se a homologação formal exigir, executar o evento assinado externo
   (ou fixture equivalente) e registrar os casos MP-01–MP-27. Isso não bloqueia
   a operação comercial já validada; Production permanece separada, com
   cobrança live ativa apenas no domínio oficial.
4. **Mercado Pago produção:** ✅ concluído com credenciais, webhook oficial e
   teste PIX supervisionado; manter a separação entre Production live e
   Preview Sandbox.
5. **Spending caps e observabilidade:** uptime gratuito já está ativo; alertas
   financeiros/provedor e painel de erros permanecem uma rotina operacional a
   configurar quando as contas oferecerem a opção sem custo.

## 6. Lote de SEO, compartilhamento e confiança (P1)

Executar junto, sem publicar microajustes isolados:

- validar metadata própria para home, categorias, busca, VIP e páginas de
  descoberta após cada mudança de rota;
- manter imagem OG estável e `og:image`/Twitter metadata por rota, usando a
  imagem do mod quando apropriado;
- manter `not-found.tsx` com links para home, busca e categorias;
- confirmar todas as categorias publicadas no sitemap;
- revisar alts genéricos (`Media`, `Thumb`, `Video Thumb`) sem preencher alt em
  imagens puramente decorativas;
- manter a propriedade `https://www.guizz.xyz/` verificada e rechecar o fetch do
  sitemap quando o painel atualizar; o endpoint público já retorna XML 200.

## 7. Lote de performance e confiabilidade (P1)

- medir novamente PageSpeed com quota disponível, separando CLS próprio de
  Adsterra/YouTube;
- manter a matriz de validação em `docs/SECURITY_ROUTE_MATRIX.md` alinhada ao
  código quando uma rota nova for criada;
- manter a janela de decisão do Anti-Adblock acima do timeout dos slots, para
  não transformar carregamento lento/no-fill em bloqueio falso;
- escolher CDN/loader ou estratégia de compressão para imagens remotas;
- cadastrar um monitor externo para `/api/health` e validar alertas sanitizados;
- executar carga concorrente em Preview, nunca na produção sem janela;
- documentar restore e limites do plano Supabase;
- só depois decidir cache adicional, lazy-load e COOP/OAuth.

### Gates externos herdados

- repetir `npm audit` em cada release e classificar os avisos transitivos antes
  do deploy;
- repetir PageSpeed no mesmo perfil quando a quota retornar, sem reativar a
  otimização Vercel por causa de uma pontuação isolada;
- capturar console/CLS separando app, Adsterra, YouTube e extensões antes de
  alterar o Anti-Adblock ou adiar anúncios acima da dobra;
- testar `Cross-Origin-Opener-Policy` somente junto com Google OAuth popup e
  callback;
- confirmar instalação PWA e retorno real de e-mail em uma janela controlada,
  sem guardar credenciais no projeto.

## 8. Critério de conclusão e continuidade

- Uma rodada só termina quando o lote inteiro tiver testes, QA visual e
  evidência registrada.
- Novas listas entram primeiro na seção correspondente deste mapa; itens
  duplicados são consolidados, não implementados duas vezes.
- Não alterar a identidade visual, o layout aprovado, o Anti-Adblock ou o
  checkout real apenas para perseguir uma pontuação isolada.
- O próximo trabalho automático é o primeiro lote pendente na ordem P0, salvo
  se a nova lista introduzir um risco mais urgente.

## 9. Documentos relacionados

- `docs/PLANO_VIDEOS_SUPABASE_MERCADOPAGO.md`
- `docs/RELEASE_READINESS.md`
- `docs/LAUNCH_MAP.md`
- `docs/DIAGNOSTIC_LOTE0_2026-09-19.md`
