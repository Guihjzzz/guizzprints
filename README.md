# Guizzprints

Catálogo profissional de construções Minecraft Bedrock e Java, derivado da interface completa do projeto original e adaptado para downloads diretos, sem anúncios e sem planos VIP.

## Catálogo

- **Bedrock:** Holoprint, `.mcstructure`, `.mcaddon` e `.mcworld`.
- **Java:** `.litematic`, `.schematic`/`.schem`, world e `.mcfunction`.
- Página própria para cada construção, galeria, vídeo, favoritos, avaliações, pesquisa e filtros.
- Downloads diretos validados no servidor, sem contagem regressiva ou intermediários publicitários.

## Configuração local

Copie `.env.example` para `.env.local` e informe as credenciais do projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SECRET_KEY=sb_secret_sua-chave-do-servidor
DOWNLOAD_TOKEN_SECRET=um-segredo-aleatorio-com-pelo-menos-32-caracteres
```

Nunca coloque `SUPABASE_SECRET_KEY` ou `DOWNLOAD_TOKEN_SECRET` em variáveis `NEXT_PUBLIC_*`.

O login do site está configurado no Firebase `ghuizz-hololab` (`.firebaserc`) com e-mail/senha e Google. Para produção, copie os identificadores `NEXT_PUBLIC_FIREBASE_*` do `.env.local` para as variáveis públicas da hospedagem e mantenha `FIREBASE_ADMIN_EMAILS` somente no servidor.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/pt`.

## Validação de produção

```bash
npm run lint
npm run build
```

O formulário administrativo em `/pt/upload` publica as duas plataformas e limita os formatos disponíveis conforme Bedrock ou Java. O campo de download aceita apenas links HTTPS públicos.

## Banco de dados

As migrações existentes em `supabase/migrations` mantêm compatibilidade com o banco original. A aplicação usa a view `public_mods`; para preencher o catálogo, publique as construções pelo painel administrativo com `category` igual a `bedrock` ou `java` e o formato em `subcategory`.

O histórico do projeto original foi preservado no Git antes da adaptação.
