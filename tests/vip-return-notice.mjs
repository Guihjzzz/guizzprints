import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const copy = await readFile('src/lib/vip-copy.ts', 'utf8');
const component = await readFile('src/components/VipExperience.tsx', 'utf8');

assert.equal((copy.match(/returnNotice:/g) || []).length, 3, 'all locale VIP copies need a safe return notice');
assert.match(component, /returnedFromCheckout &&/);
assert.match(component, /checkoutMode \? checkoutCopy\.returned : copy\.returnNotice/);
assert.doesNotMatch(component, /returnedFromCheckout && checkoutMode &&/);

console.log('PASS: returning from checkout always shows a safe, non-entitling notice.');
