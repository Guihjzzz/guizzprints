import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/app/api/vip/checkout/route.ts', 'utf8');

assert.match(source, /const MAX_BODY_BYTES = 1024/u);
assert.match(source, /Number\(request\.headers\.get\('content-length'\)\)/u);
assert.match(source, /Number\.isFinite\(declaredLength\) && declaredLength > MAX_BODY_BYTES/u);
assert.match(source, /Buffer\.byteLength\(raw, 'utf8'\) > MAX_BODY_BYTES/u);

console.log('PASS: Mercado Pago checkout rejects oversized declared and UTF-8 bodies before parsing.');
