# Runbook de continuidade — Supabase Free

Atualizado em 19/09/2026. Este runbook documenta a alternativa sem contratar
um plano novo. Não executar restauração no projeto de produção: a restauração
de um banco pode causar indisponibilidade e exige confirmação explícita.

## Conclusão verificada

- O projeto atual está no plano **Free**, com primário único, sem réplicas e
  0,00 GB de uso exibido no painel consultado.
- A documentação oficial informa que backups automáticos diários são
  disponibilizados para Pro, Team e Enterprise; para Free, recomenda exportar
  regularmente com `supabase db dump` e manter uma cópia fora do projeto.
- A checklist oficial de produção informa que backups de banco não ficam
  disponíveis para download no Free. PITR é add-on de Pro/Team/Enterprise.
- Portanto, o item “backup/restore” não pode ser marcado como concluído por uma
  tela do painel Free. O caminho sem custo é um dump lógico operado localmente,
  seguido de um ensaio em um projeto separado quando houver autorização.

Fontes oficiais: [Database Backups](https://supabase.com/docs/guides/platform/backups),
[Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
e [CLI `db dump`](https://supabase.com/docs/reference/cli/supabase-db-dump).

## Exportação local

1. Instalar a Supabase CLI somente na máquina do operador. Ela não deve entrar
   no bundle Next.js nem nas variáveis da Vercel.
2. Vincular a CLI ao projeto diretamente na máquina do operador com
   `supabase link --project-ref <PROJECT_REF>`. Digite a senha do banco no
   prompt local; a CLI pode guardá-la no armazenamento nativo. Não coloque a
   senha na linha de comando, em arquivo, no Git ou no chat.
3. Executar:

   ```powershell
   .\scripts\supabase-free-backup.ps1
   ```

   O script grava `schema.sql`, `data.sql` e `roles.sql` em uma pasta marcada
   como ignorada pelo Git e mostra somente hashes SHA-256.
4. Copiar a pasta para armazenamento externo privado e registrar a data, o
   projeto e os hashes. Não colocar o dump em `public/`, Storage público ou
   repositório.

O dump padrão não inclui os schemas gerenciados `auth` e `storage`; também não
   substitui cópia dos objetos do Storage. Este projeto usa imagens/destinos
   externos e não possui bucket Supabase ativo, mas essa limitação deve ser
   reavaliada se o produto passar a armazenar arquivos.

## Ensaio de restauração

O ensaio deve ser feito somente em um projeto separado e autorizado:

- criar o projeto de teste sem apontar o domínio oficial;
- restaurar primeiro o schema, depois os dados e, por último, revisar roles;
- reaplicar migrations/RLS e executar os testes de leitura, autenticação e
  consultas públicas;
- comparar contagens e hashes esperados sem importar segredos de produção;
- destruir o projeto de teste somente após registrar a evidência e confirmar o
  alvo exato.

Até esse ensaio existir, o mapa de lançamento permanece com backup/restore
**pendente**, não “concluído”.
