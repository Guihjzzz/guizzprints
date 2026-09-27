import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/lib/vip-checkout-copy.ts', 'utf8');
const component = await readFile('src/components/VipExperience.tsx', 'utf8');

for (const field of ['heroNote', 'plansNote']) {
  assert.equal((source.match(new RegExp(`\\b${field}:`, 'g')) || []).length, 6, `${field} should exist in test/live copy for all locales`);
}
assert.match(component, /checkoutMode \? checkoutCopy\.heroNote : copy\.heroNote/);
assert.match(component, /checkoutMode \? checkoutCopy\.plansNote : copy\.plansNote/);

console.log('PASS: VIP availability copy matches the active test/live checkout mode.');
