import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const helper = await readFile('src/lib/server-observability.ts', 'utf8');
assert.match(helper, /safeLabel/);
assert.match(helper, /replace\(\/\[\^a-z0-9_\-\]/i);
assert.match(helper, /stage: safeLabel\(stage\)/);
assert.match(helper, /code: safeLabel\(code\)/);

for (const file of [
  'src/app/auth/callback/route.ts',
  'src/app/api/vip/status/route.ts',
  'src/app/api/download/session/route.ts',
  'src/app/api/download/open/route.ts',
  'src/app/api/admin/mods/route.ts',
  'src/app/api/vip/checkout/route.ts',
]) {
  const source = await readFile(file, 'utf8');
  assert.match(source, /logServerFailure/);
  assert.doesNotMatch(source, /logServerFailure\([^)]*(?:email|userId|accessToken|modId|destination)/i);
}

console.log('PASS: server diagnostics are sanitized and contain no user/provider data fields.');
