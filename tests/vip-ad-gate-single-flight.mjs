import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/components/VipAdGate.tsx', 'utf8');

assert.match(source, /let sharedStatusRequest: SharedStatusRequest \| null = null/u);
assert.match(source, /if \(sharedStatusRequest\?\.token === accessToken\) return sharedStatusRequest\.promise/u);
assert.match(source, /sharedStatusRequest = \{ token: accessToken, promise \}/u);
assert.match(source, /await requestVipStatus\(accessToken\)/u);
assert.match(source, /const expiresAt = typeof payload\?\.expiresAt === 'string' \? Date\.parse\(payload\.expiresAt\) : NaN/u);
assert.match(source, /scheduleExpiryRefresh\(accessToken, status\.expiresAt\)/u);
assert.match(source, /void resolveAds\(accessToken\)/u);
assert.match(source, /if \(sharedStatusRequest\?\.promise === promise\) sharedStatusRequest = null/u);

console.log('PASS: concurrent ad slots share one VIP entitlement request.');
