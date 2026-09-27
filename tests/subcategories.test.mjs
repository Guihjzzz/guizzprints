import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';
import { belongsToCategory, categoryFilter } from '../src/lib/mod-categories.ts';

const require = createRequire(import.meta.url);
function compile(file) {
  const exports = {};
  const js = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  new Function('require', 'exports', js)(name => {
    if (name === '@/lib/mod-categories') return compile('src/lib/mod-categories.ts');
    if (name === '@/components/CategoryBadges') return compile('src/components/CategoryBadges.tsx');
    if (name === '@/components/FavoriteButton') return { FavoriteButton: () => null };
    if (name === '@/components/InstallAppButton') return { InstallAppButton: () => null };
    if (name === '@/components/AdPlaceholder' || name === './DownloadFlow') return { __esModule: true, default: () => null, AdPlaceholder: () => null };
    if (name === '@/lib/supabase') return { supabase: {} };
    if (name === 'next/link') return { __esModule: true, default: 'a' };
    if (name === 'next/image') return { __esModule: true, default: () => null };
    if (name === 'next-intl') return { useTranslations: () => key => key };
    return require(name);
  }, exports);
  return exports;
}

test('Secondary-category membership includes Mash-ups once, with exact matching', () => {
  const items = [
    { id: 1, category: 'mash-up', subcategory: 'skins' },
    { id: 2, category: 'skins', subcategory: 'skins' },
    { id: 3, category: 'mash-up', subcategory: 'textures' },
    { id: 4, category: 'maps', subcategory: null },
  ];
  assert.deepEqual(items.filter(row => belongsToCategory(row, 'skins')).map(row => row.id), [1, 2]);
  assert.deepEqual(items.filter(row => belongsToCategory(row, 'mash-up')).map(row => row.id), [1, 3]);
  assert.deepEqual(items.filter(row => belongsToCategory(row, 'textures')).map(row => row.id), [3]);
  assert.ok(belongsToCategory({ category: 'Mash-up', subcategory: 'Add-ons' }, 'addons'));
  assert.ok(!belongsToCategory({ category: 'skins-extra' }, 'skins'));
});

test('Public queries send a bounded category OR subcategory filter using the installed client', async () => {
  let requested;
  const client = createClient('https://example.supabase.co', 'test-key', {
    auth: { persistSession: false },
    global: { fetch: async url => { requested = new URL(url); return new Response('[]', { headers: { 'Content-Type': 'application/json' } }); } },
  });
  await client.from('public_mods').select('id, category, subcategory').or(categoryFilter('skins')).order('created_at', { ascending: false }).order('id', { ascending: false }).range(0, 19);
  assert.equal(requested.searchParams.get('or'), '(category.ilike.skins,subcategory.ilike.skins)');
  assert.equal(requested.searchParams.get('limit'), '20');
  assert.equal(requested.searchParams.get('select'), 'id,category,subcategory');
  assert.ok(categoryFilter('add-ons').includes('subcategory.ilike.add-ons'));
  for (const value of ['skins,category.neq.maps', '%', '*', '__proto__', '']) assert.equal(categoryFilter(value), 'id.is.null');
});

test('Cards render both badges, wrap on small screens, and omit empty/duplicate badges', () => {
  const { CategoryBadges } = compile('src/components/CategoryBadges.tsx');
  const render = props => renderToStaticMarkup(React.createElement(CategoryBadges, props));
  const both = render({ category: 'mash-up', subcategory: 'skins' });
  assert.ok(both.includes('Mash-up') && both.includes('Skins'));
  assert.ok(both.includes('flex-wrap') && both.includes('break-words'));
  assert.equal((render({ category: 'skins', subcategory: null }).match(/<span/g) || []).length, 1);
  assert.equal((render({ category: 'addons', subcategory: 'Add-ons' }).match(/<span/g) || []).length, 1);
});

test('Technical specifications render the main category and optional subcategory', () => {
  const Viewer = compile('src/components/ModViewer.tsx').default;
  const render = subcategory => renderToStaticMarkup(React.createElement(Viewer, { locale: 'en', mod: { id: 'test', title: 'Test', category: 'mash-up', subcategory, version: '1.0.9' } }));
  const both = render('skins');
  assert.ok(both.includes('subcategory') && both.includes('Skins') && both.includes('Mash-up'));
  assert.ok(!render(null).includes('>subcategory<'));
});
