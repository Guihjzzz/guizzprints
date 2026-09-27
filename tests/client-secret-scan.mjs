import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { test } from 'node:test';

const root = process.cwd();
const sourceRoots = [join(root, 'src', 'app'), join(root, 'src', 'components')];
const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const forbiddenClientPatterns = [
  /SUPABASE_SERVICE_ROLE/iu,
  /SUPABASE_SECRET_KEY/iu,
  /MERCADOPAGO_ACCESS_TOKEN/iu,
  /MERCADOPAGO_WEBHOOK_SECRET/iu,
  /DOWNLOAD_TOKEN_SECRET/iu,
  /NEXT_PUBLIC_MERCADOPAGO_/iu,
  /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE/iu,
];

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(path));
    else if (sourceExtensions.has(path.slice(path.lastIndexOf('.')))) files.push(path);
  }
  return files;
}

test('client bundles do not reference server-only secrets or provider tokens', () => {
  const violations = [];
  for (const file of sourceRoots.flatMap(collectFiles)) {
    const source = readFileSync(file, 'utf8');
    if (!/^["']use client["'];?/mu.test(source)) continue;
    for (const pattern of forbiddenClientPatterns) {
      if (pattern.test(source)) violations.push(`${relative(root, file)} matches ${pattern}`);
    }
  }
  assert.deepEqual(violations, [], `Server-only values found in client files:\n${violations.join('\n')}`);
});

console.log('PASS: client source contains no server-only secrets or payment tokens.');
