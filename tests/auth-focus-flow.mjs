import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/app/[locale]/login/page.tsx', 'utf8');

assert.match(source, /emailInputRef = useRef<HTMLInputElement>\(null\)/);
assert.match(source, /emailInputRef\.current\?\.focus\(\)/);
assert.match(source, /focusEmailRef\.current\s*=\s*true/);
assert.match(source, /ref=\{emailInputRef\}/);
assert.match(source, /aria-live="polite"/);
assert.match(source, /const googleEnabled = mode !== 'reset'/);
assert.doesNotMatch(source, /googleProviderEnabled/);

console.log('PASS: auth mode changes restore email focus and announce the current mode.');
