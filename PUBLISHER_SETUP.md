# Publicador Guizz — configuração

O painel fica em `/<idioma>/admin/publisher` e aceita somente a conta Firebase
definida em `FIREBASE_ADMIN_EMAILS`.

O catálogo usa o projeto Supabase `mygycewxyepjpuyikump`. A base está criada
pela migração `supabase/migrations/20260928185916_bootstrap_catalog.sql` e a
O endpoint protegido do servidor Next.js grava as publicações diretamente no
Supabase. Ele valida novamente o token Firebase antes de publicar e usa a
credencial interna do Supabase, sem colocar uma chave secreta no app público.
As Edge Functions continuam reservadas para as sessões protegidas de download.

Variáveis necessárias no site:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`) somente no servidor,
  necessário para carregar e gerenciar o catálogo administrativo
- `GITHUB_RELEASES_REPOSITORY=Guizzhjz/guizzprints-assets`
- `GITHUB_RELEASES_TOKEN` com **Contents: Read and write** limitado a esse
  repositório
- `DOWNLOAD_TOKEN_SECRET` com pelo menos 32 caracteres
- `FIREBASE_ADMIN_EMAILS=junindacosta00241@gmail.com`

Fluxo da publicação:

1. Entre com a conta administradora e abra o painel.
2. Informe título, descrição, versão e os links extras que existirem.
3. Envie o `.mcstructure` e gere a capa com quatro vistas, oito vistas, a
   prancha completa do Guizz Studio e o `.schem`.
4. Clique em **Publicar no catálogo**.

Cada item cria uma página Bedrock e outra Java. As duas recebem a mídia gerada,
mas cada uma mostra apenas os formatos da própria edição. Os arquivos são
enviados para o release atual `assets-batch-NNN`; ao alcançar 1.000 ativos, o
publicador escolhe o próximo release automaticamente.

## Editar e excluir

Em `/<idioma>/upload`, a aba **Catálogo** mostra os botões **Editar** e
**Excluir** em cada publicação. A edição mantém as mídias geradas e atualiza
os dados da página; a exclusão remove somente o registro selecionado, então as
versões Bedrock e Java podem ser administradas separadamente. O cartão exibido
após uma publicação também traz atalhos diretos para editar cada versão.

## Firebase Authentication

O login usa o projeto Firebase `ghuizz-hololab`, definido em `.firebaserc`.
Nenhuma chave privada do Firebase ou do Supabase deve ser incluída em variáveis
`NEXT_PUBLIC_`.
