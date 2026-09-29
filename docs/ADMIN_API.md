# API administrativa do Guizzprints

As rotas abaixo exigem um token de identidade Firebase no cabeçalho. Durante a
migração de autenticação, o servidor também aceita a sessão Supabase do
administrador já cadastrado, sempre validada no servidor:

```http
Authorization: Bearer <firebase-id-token>
```

O servidor verifica a assinatura do token, o projeto Firebase e a lista
`FIREBASE_ADMIN_EMAILS`. Na sessão legada ele confere o registro em `admins` e
o mesmo allowlist de e-mails. Nenhuma rota administrativa aceita uma chave no
navegador, e todas retornam `Cache-Control: no-store`.

| Rota | Métodos | Uso |
| --- | --- | --- |
| `/api/admin/status` | `GET` | Confirma o acesso administrativo e a configuração do catálogo e do armazenamento. |
| `/api/admin/mods` | `GET`, `POST`, `PUT`, `DELETE` | Gerencia itens legados ou individuais: catálogo, exportação CSV, criação, edição e exclusão. |
| `/api/admin/minecraft` | `POST` | Importa dados de um item oficial do Minecraft Marketplace. |
| `/api/admin/publisher/assets` | `GET`, `POST` | Informa os formatos aceitos e envia arquivos gerados ou arquivos de download para o GitHub Releases. |
| `/api/admin/publisher/publish` | `POST` | Cria a publicação do Publicador 3D nas categorias Bedrock e Java. |
| `/api/admin/publisher/publication` | `GET`, `PUT`, `DELETE` | Lê, edita ou exclui juntas as edições Bedrock e Java de uma publicação 3D. |

## Envio de arquivos

`POST /api/admin/publisher/assets` recebe `multipart/form-data` com `kind`,
`slug` e `file`. Para arquivos que serão oferecidos para download, envie também
`format` e use `kind=download`. O limite é 100 MB por arquivo.

| `format` | Extensões permitidas |
| --- | --- |
| `holoprint`, `mcstructure` | `.mcstructure` |
| `mcaddon` | `.mcaddon` |
| `mcworld` | `.mcworld` |
| `litematic` | `.litematic` |
| `schematic` | `.schematic`, `.schem` |
| `world` | `.zip`, `.mcworld` |
| `mcfunction` | `.mcfunction` |

O resultado contém a URL pública do GitHub Releases. O painel preenche esse
link automaticamente no formato correspondente e continua aceitando um link
HTTPS externo quando o administrador preferir usá-lo.

## Publicações em duas edições

O Publicador 3D mantém um par de registros para cada construção: um em Bedrock
e outro em Java. `PUT` e `DELETE` em `/api/admin/publisher/publication` sempre
operam sobre o par completo. A exclusão remove os registros do catálogo; os
arquivos do GitHub Releases são preservados para não quebrar outros itens que
possam compartilhá-los.
