import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseAllowedDownloadUrl } from '../src/lib/download-url.ts';
import { validateModVersion, normalizeModVersion } from '../src/lib/mod-version.ts';
import { contentCategoryLabel } from '../src/lib/mod-categories.ts';

test('Terabox aliases work without allowing lookalikes, credentials or insecure links', () => {
  for (const host of ['terabox.com', 'www.terabox.com', 'terabox.app', '1024terabox.com', 'www.1024terabox.com']) {
    assert.equal(parseAllowedDownloadUrl(`https://${host}/s/example?pwd=1234`).hostname, host);
  }
  for (const url of [
    'http://1024terabox.com/s/example', 'https://1024terabox.com.evil.test/s/example',
    'https://evil1024terabox.com/s/example', 'https://1024terabox.com@evil.test/s/example',
    'https://name:password@1024terabox.com/s/example', 'https://1024terabox.com:8080/s/example',
    'javascript:alert(1)', 'not a url',
  ]) assert.throws(() => parseAllowedDownloadUrl(url), url);
});

test('Version prefix is normalized once and release identifiers support prereleases', () => {
  assert.equal(validateModVersion('# v1.0.8'), '1.0.8');
  assert.equal(validateModVersion('v1.0.8'), '1.0.8');
  assert.equal(validateModVersion('1.0.8-beta.2+build3'), '1.0.8-beta.2+build3');
  assert.equal(validateModVersion('beta'), 'beta');
  assert.equal(normalizeModVersion('# vBeta'), 'Beta');
  for (const version of ['', '# v', '<script>', '1 2', 'a'.repeat(51)]) {
    assert.throws(() => validateModVersion(version), version);
  }
});

test('Portuguese Redstone label preserves the stored category and other locales', () => {
  assert.equal(contentCategoryLabel('Pedra vermelha', 'pt'), 'Redstone');
  assert.equal(contentCategoryLabel('pedra vermelha', 'pt-BR'), 'Redstone');
  assert.equal(contentCategoryLabel('Pedra vermelha', 'en'), 'Pedra vermelha');
  assert.equal(contentCategoryLabel('Arenas', 'pt'), 'Arenas');
});

test('separate .schem downloads are accepted by the UI, API and catalog function', () => {
  const flow = readFileSync('src/components/DownloadFlow.tsx', 'utf8');
  const sessionRoute = readFileSync('src/app/api/download/session/route.ts', 'utf8');
  const catalog = readFileSync('supabase/functions/guizz-catalog/index.ts', 'utf8');
  for (const id of ['schem', 'schematic']) {
    assert.ok(flow.includes(`{ id: '${id}'`), `DownloadFlow is missing ${id}`);
    assert.ok(sessionRoute.includes(`'${id}'`), `download session route is missing ${id}`);
    assert.ok(catalog.includes(`'${id}'`), `catalog edge function is missing ${id}`);
  }
});


test('Portuguese Redstone remains display-only for existing catalog filters', () => {
  const taxonomy = readFileSync('src/lib/mod-categories.ts', 'utf8');
  assert.match(taxonomy, /'Pedra vermelha'/);
  assert.equal(contentCategoryLabel('Pedra vermelha', 'pt'), 'Redstone');
});
test('Portuguese Redstone is localized in technical specs', () => {
  const viewer = readFileSync('src/components/ModViewer.tsx', 'utf8');
  assert.ok(viewer.includes('contentCategoryLabel(mod.subcategory, locale)'));
});
