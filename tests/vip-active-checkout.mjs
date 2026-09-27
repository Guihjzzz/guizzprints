import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/components/VipExperience.tsx', 'utf8');

assert.match(source, /checkoutMode && signedIn && !vipEntitlement && <button/u);
assert.match(source, /vipEntitlement \? copy\.activeStatus : checkoutMode \? checkoutCopy\.notice : copy\.paymentStatus/u);
assert.match(source, /vipEntitlement \? copy\.activePlansNote : checkoutMode \? checkoutCopy\.note : copy\.paymentNote/u);

console.log('PASS: active VIP members see account status instead of a duplicate checkout action.');
