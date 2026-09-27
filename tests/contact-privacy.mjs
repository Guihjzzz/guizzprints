import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('public contact channels do not expose personal or backend addresses', async () => {
  const pages = await readFile(path.join(projectRoot, 'src', 'lib', 'site-pages.ts'), 'utf8');
  const infoPage = await readFile(path.join(projectRoot, 'src', 'components', 'SiteInfoPage.tsx'), 'utf8');
  const authDocs = await readFile(path.join(projectRoot, 'docs', 'auth-rollout.md'), 'utf8');

  assert.doesNotMatch(pages, /mailto:|@[a-z0-9.-]+\.(?:com|net|org|br|xyz)\b/iu);
  assert.doesNotMatch(pages, /https?:\/\/[^\s'"`]*supabase\.(?:co|com)\b/iu);
  assert.doesNotMatch(authDocs, /https:\/\/[a-z0-9-]{20,}\.supabase\.co\b/iu);
  assert.match(pages, /https:\/\/discord\.gg\//u);
  assert.match(pages, /https:\/\/www\.youtube\.com\/@Guihjzz/u);
  assert.match(infoPage, /referrerPolicy="no-referrer"/u);
  assert.match(infoPage, /rel="noopener noreferrer"/u);
});
