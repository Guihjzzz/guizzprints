import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  fetchMinecraftMarketplaceMetadata,
  parseMinecraftMarketplaceApiPayload,
  parseMinecraftMarketplaceHtml,
  parseMinecraftMarketplaceUrl,
} from '../src/lib/minecraft-marketplace.ts';

const sourceUrl = 'https://www.minecraft.net/en-us/marketplace/pdp/floruit/senna-world/1548c541-f594-4518-8ffa-617db18d1476';
const canonicalPunctuationUrl = 'https://www.minecraft.net/en-us/marketplace/pdp/oreville-studios/actions-&-stuff:-flat-textures/c627051d-d062-4322-a533-a7b52238500d';
const encodedPunctuationUrl = 'https://www.minecraft.net/en-us/marketplace/pdp/oreville-studios/actions-%26-stuff%3A-flat-textures/c627051d-d062-4322-a533-a7b52238500d';
const fixture = `<!doctype html>
<html><head>
<title>Senna World | Minecraft</title>
<meta property="og:description" content="A complete racing world">
<script type="application/ld+json">{
  "@type":"Product",
  "name":"Senna World",
  "description":"Put on your helmet &amp; start the engine.",
  "image":"https://xforgeassets002.xboxlive.com/pf-namespace-b63a0803d3653643/dbf2e7c6-b082-4b9b-8ec2-80dd62d184fe/Senna_thumbnail_0.jpg"
}</script></head><body>
<h1>Senna World</h1><p>1 World and 16 Skins</p>
<iframe src="https://www.youtube.com/embed/Vz9g1zgusrQ?autoplay=0"></iframe>
<img src="https://xforgeassets002.xboxlive.com/pf-namespace-b63a0803d3653643/edb10a1e-6707-42e9-b8ff-349eb7d038f6/Senna_screenshot_1.jpg">
<img src="https://xforgeassets002.xboxlive.com/pf-namespace-b63a0803d3653643/966206ba-a548-4e04-880d-3040a7310bf4/Senna_screenshot_2.jpg">
<img src="https://xforgeassets002.xboxlive.com/pf-namespace-b63a0803d3653643/b31217f4-8fc4-43ff-8bfc-84fbb40bd508/Senna_screenshot_3.jpg">
<img src="https://xforgeassets002.xboxlive.com/pf-namespace-b63a0803d3653643/7b15d9c8-ea4f-4d4d-9f6c-2b4f5e6a7c80/Senna_screenshot_4.jpg">
</body></html>`;

test('Marketplace URLs are restricted to official item pages', () => {
  assert.equal(parseMinecraftMarketplaceUrl(sourceUrl).hostname, 'www.minecraft.net');
  assert.equal(parseMinecraftMarketplaceUrl(canonicalPunctuationUrl).pathname, new URL(canonicalPunctuationUrl).pathname);
  assert.equal(parseMinecraftMarketplaceUrl(encodedPunctuationUrl).pathname, new URL(encodedPunctuationUrl).pathname);
  for (const value of [
    'http://www.minecraft.net/en-us/marketplace/pdp/floruit/senna-world/1548c541-f594-4518-8ffa-617db18d1476',
    'https://evil.example/en-us/marketplace/pdp/floruit/senna-world/1548c541-f594-4518-8ffa-617db18d1476',
    'https://www.minecraft.net/en-us/marketplace',
    'https://www.minecraft.net:8443/en-us/marketplace/pdp/floruit/senna-world/1548c541-f594-4518-8ffa-617db18d1476',
  ]) assert.throws(() => parseMinecraftMarketplaceUrl(value));
});

test('Marketplace parser extracts current title, media and a safe category suggestion', () => {
  const data = parseMinecraftMarketplaceHtml(fixture, sourceUrl);
  assert.equal(data.title, 'Senna World');
  assert.equal(data.description, 'Put on your helmet & start the engine.');
  assert.equal(data.youtubeTrailerUrl, 'https://www.youtube.com/watch?v=Vz9g1zgusrQ');
  assert.equal(data.categorySuggestion, 'maps');
  assert.equal(data.imageUrls.length, 5);
  assert.match(data.imageUrls[0], /Senna_thumbnail_0\.jpg$/u);
  assert.match(data.imageUrls[3], /Senna_screenshot_3\.jpg$/u);
  assert.match(data.imageUrls[4], /Senna_screenshot_4\.jpg$/u);
  assert.match(data.fingerprint, /^[a-f0-9]{64}$/u);
});

test('Official Marketplace catalog payload is normalized for publishing', () => {
  const data = parseMinecraftMarketplaceApiPayload({
    result: {
      title: 'Senna World',
      description: 'Official description',
      image: 'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_thumbnail_0.jpg',
      images: [
        'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_screenshot_0.jpg',
        'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_screenshot_1.jpg',
        'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_screenshot_2.jpg',
        'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_screenshot_3.jpg',
        'https://xforgeassets002.xboxlive.com/pf-namespace/demo/Senna_screenshot_4.jpg',
        'https://evil.example/not-allowed.jpg',
      ],
      videoUrl: 'https://www.youtube.com/watch?v=Vz9g1zgusrQ',
      packType: 'WorldTemplate',
      creator: { name: 'Floruit Studios' },
      tags: ['Cars', { name: 'Racing' }, 'Cars'],
      time: 1709296200,
    },
  }, sourceUrl);
  assert.equal(data.title, 'Senna World');
  assert.equal(data.categorySuggestion, 'maps');
  assert.equal(data.subcategorySuggestion, 'maps');
  assert.equal(data.creator, 'Floruit Studios');
  assert.deepEqual(data.tags, ['Cars', 'Racing']);
  assert.equal(data.publishedAt, '2024-03-01T12:30:00.000Z');
  assert.equal(data.packType, 'WorldTemplate');
  assert.equal(data.imageUrls.length, 5);
  assert.match(data.imageUrls[4], /Senna_screenshot_3\.jpg$/u);
  assert.equal(data.youtubeTrailerUrl, 'https://www.youtube.com/watch?v=Vz9g1zgusrQ');
});

test('Official package types map to the catalog subcategory vocabulary', () => {
  const cases = [
    ['ResourcePack', 'textures'],
    ['SkinPack', 'skins'],
    ['ShaderPack', 'shaders'],
    ['Mashup', 'mash-up'],
    ['AddonPack', 'addons'],
  ];
  for (const [packType, expected] of cases) {
    const data = parseMinecraftMarketplaceApiPayload({
      result: { title: 'Example', packType },
    }, sourceUrl);
    assert.equal(data.subcategorySuggestion, expected, packType);
  }
});

test('Importer enforces official redirects, bounded responses and no client-side fetch requirement', async () => {
  const data = await fetchMinecraftMarketplaceMetadata(sourceUrl, async (url, init) => {
    assert.equal(url.toString(), sourceUrl);
    assert.equal(init?.method, 'GET');
    assert.equal(init?.redirect, 'follow');
    return {
      ok: true,
      url: sourceUrl,
      headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
      text: async () => fixture,
    };
  });
  assert.equal(data.sourceUrl, sourceUrl);
  await assert.rejects(
    fetchMinecraftMarketplaceMetadata(sourceUrl, async () => ({
      ok: true,
      url: sourceUrl,
      headers: new Headers({ 'content-length': '99999999' }),
      text: async () => '',
    })),
    /too large/u,
  );
});
