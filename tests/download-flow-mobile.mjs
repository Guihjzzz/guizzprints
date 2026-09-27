import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile('src/components/DownloadFlowView.module.css', 'utf8');
assert.match(css, /@media\(max-width:359px\)\{[\s\S]*?\.rectangle\{min-width:0\}[\s\S]*?\.rectanglePlaceholder\{width:100%;height:auto;aspect-ratio:6 \/ 5\}/);
assert.match(css, /\.vipPromo\{[\s\S]*?left:50%;[\s\S]*?width:min\(calc\(100% - 16px\),746px\)[\s\S]*?transform:translate3d\(-50%,0,0\)[\s\S]*?animation:promoIn \.36s ease-out both/);

console.log('PASS: narrow download layouts keep the rectangle ad placeholder within the viewport.');
