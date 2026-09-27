import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const search = await readFile('src/app/[locale]/search/page.tsx', 'utf8');
const category = await readFile('src/app/[locale]/category/[slug]/page.tsx', 'utf8');
const viewer = await readFile('src/components/ModViewer.tsx', 'utf8');
const favorite = await readFile('src/components/FavoriteButton.tsx', 'utf8');
const checkout = await readFile('src/lib/mercadopago-checkout.ts', 'utf8');
const messages = await readFile('src/messages/en.json', 'utf8');

assert.doesNotMatch(search, /console\.(?:error|warn|log)\([^)]*\berr\b/i);
assert.match(search, /loadError/);
assert.match(search, /categoryT\('retry'\)/);
assert.doesNotMatch(category, /console\.(?:error|warn|log)/);
assert.doesNotMatch(viewer, /console\.(?:error|warn|log)\([^)]*\berr\b/i);
assert.doesNotMatch(viewer, /favorite(?:Add|Remove)Error',\s*\{\s*message:/u);
assert.doesNotMatch(favorite, /favorite(?:Add|Remove)Error',\s*\{\s*message:/u);
assert.doesNotMatch(messages, /favorite(?:Add|Remove)Error[^\n]*\{message\}/u);
assert.doesNotMatch(checkout, /providerErrorMessage|console\.error/);
assert.match(checkout, /logServerFailure\('mercadopago-checkout'/);

console.log('PASS: client/provider diagnostics do not expose raw exception details.');
