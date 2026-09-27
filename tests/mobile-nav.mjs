import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('src/components/MobileNav.tsx', 'utf8');

assert.match(source, /useRef\(0\)/, 'scroll position should live in a ref');
assert.match(source, /useEffect\(\(\) => \{/);
assert.match(source, /\}, \[\]\);/, 'scroll listener should be mounted once');
assert.match(source, /lastScrollY\.current = currentScrollY/);
assert.match(source, /setIsVisible\(\(previous\) => previous === nextVisible \? previous : nextVisible\)/);
assert.doesNotMatch(source, /useState\(0\)/, 'scroll position must not trigger listener recreation');

console.log('PASS: mobile navigation scroll listener is stable and avoids redundant state updates.');
