import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const gate = await readFile('src/components/AdblockAccessGate.tsx', 'utf8');
const adsterra = await readFile('src/components/AdsterraSidebar.tsx', 'utf8');
const layout = await readFile('src/app/[locale]/layout.tsx', 'utf8');

assert.match(layout, /<AdblockAccessGate locale=\{locale\}>/u);
assert.match(gate, /adsbox ad-banner ad-placement advert advertisement/u);
assert.match(gate, /adsbygoogle ad-unit ad-container/u);
assert.match(gate, /bait\.offsetWidth < 2/u);
assert.match(gate, /waitForAdsterraSignal/u);
assert.match(gate, /failed >= signals\.attempted/u);
assert.match(gate, /ADSTERRA_SIGNAL_GRACE_MS = 11_000/u);
assert.match(gate, /adsterraScriptState === 'failed' \|\| host\.dataset\.adsterraScriptState === 'timeout'/u);
assert.doesNotMatch(gate, /everyScriptUnconfirmed/u);
assert.match(gate, /expiresAt > Date\.now\(\)/u);
assert.match(gate, /\(login\|vip\|about\|privacy\|terms\|contact\)/u);
assert.match(gate, /adblock-wall/u);
assert.match(gate, /adblock-card/u);
assert.match(gate, /ShieldAlert/u);
assert.match(gate, /adblock-reload-button/u);
assert.match(adsterra, /__guizzAdsterraSignals/u);
assert.match(adsterra, /recordAdsterraSignal\('failed'\)/u);
assert.match(adsterra, /guizz:adsterra-script-error/u);
assert.doesNotMatch(gate, /service_role|SUPABASE_SERVICE_ROLE|private_key/iu);

console.log('PASS: site-wide gate combines cosmetic probes, provider failures, VIP bypass and server-side separation.');
