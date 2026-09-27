import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const login = await readFile('src/app/[locale]/login/page.tsx', 'utf8');
const update = await readFile('src/app/[locale]/login/update-password/page.tsx', 'utf8');
const locales = await Promise.all(['en', 'pt', 'es'].map(locale => readFile(`src/messages/${locale}.json`, 'utf8').then(JSON.parse)));

assert.match(login, /showPassword/);
assert.match(login, /aria-pressed=\{showPassword\}/);
assert.match(update, /visibleField/);
assert.match(update, /aria-pressed=\{visibleField === field\.id\}/);
for (const messages of locales) {
  assert.equal(typeof messages.Auth.showPassword, 'string');
  assert.equal(typeof messages.Auth.hidePassword, 'string');
}

console.log('PASS: password fields provide localized, accessible show/hide controls.');
