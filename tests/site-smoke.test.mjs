import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 3200 + Math.floor(Math.random() * 800);
const baseUrl = `http://127.0.0.1:${port}`;
const nextBin = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

let server;
let serverOutput = '';

async function waitForServer() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (server?.exitCode !== null) {
      throw new Error(`The test server stopped before becoming ready.\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/en`, { redirect: 'manual' });
      if (response.status === 200) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out while starting the test server.\n${serverOutput}`);
}

async function fetchManual(pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, { redirect: 'manual', ...options });
}

function flattenKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      return flattenKeys(child, fullKey);
    }
    return [fullKey];
  });
}

test('VIP pages expose honest pre-launch plans in every locale', async () => {
  for (const [locale, title, unavailable] of [
    ['pt', 'Seu apoio.', 'Pagamento ainda indisponível'],
    ['en', 'Your support.', 'Payments are not available yet'],
    ['es', 'Tu apoyo.', 'Pagos aún no disponibles'],
  ]) {
    const response = await fetchManual(`/${locale}/vip?plan=monthly`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(title));
    assert.ok(html.includes(unavailable));
    assert.match(html, /Guizz VIP/);
    assert.match(html, /30/);
    assert.match(html, /manifest\.webmanifest/);
    assert.match(html, /icon\.jpg/);
    assert.match(html, /guizz-180\.png/);
    assert.ok(!html.includes('checkout.livepix.gg'));
  }
});

test('installation manifest and generated icons are served publicly', async () => {
  const response = await fetchManual('/manifest.webmanifest');
  assert.equal(response.status, 200);
  const manifest = await response.json();
  assert.equal(manifest.name, 'GuizzMods');
  assert.equal(manifest.display, 'standalone');
  for (const icon of manifest.icons) {
    const asset = await fetchManual(icon.src);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('content-type'), /image\/png/);
  }
});

test('VIP price ladder keeps weekly at R$6.70 and hides retired terms', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'lib', 'vip-plans.ts'), 'utf8');
  assert.match(source, /id: 'daily', days: 1, priceCents: 199/u);
  assert.match(source, /id: 'weekly', days: 7, priceCents: 670/u);
  assert.match(source, /id: 'monthly', days: 30, priceCents: 1990/u);
  assert.doesNotMatch(source, /fortnightly|quarterly|yearly/u);
});

test('root llms.txt is plain text without changing locale routing', async () => {
  const proxy = await readFile(path.join(projectRoot, 'src', 'proxy.ts'), 'utf8');
  assert.match(proxy, /pathname === '\/llms\.txt'/u);
  assert.match(proxy, /return NextResponse\.next\(\)/u);

  const response = await fetchManual('/llms.txt');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /^text\/plain(?:;|$)/u);
  const text = await response.text();
  assert.match(text, /^# GuizzMods\s/u);
  assert.doesNotMatch(text, /<!DOCTYPE html>/iu);
  assert.match(text, /https:\/\/guizz\.xyz\/en\//u);

  const localized = await fetchManual('/en');
  assert.equal(localized.status, 200);
  assert.match(await localized.text(), /GuizzMods/u);
});

test('public health probe is cache-free and does not expose runtime details', async () => {
  const response = await fetchManual('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
  assert.deepEqual(await response.json(), { ok: true, service: 'guizzmods' });
});

test('homepage catalog requests stay bounded to card fields', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'), 'utf8');
  assert.match(source, /const HOME_MOD_FIELDS = 'id, title, category, subcategory, image_url_1, rating, downloads, created_at'/u);
  assert.doesNotMatch(source, /public_mods'\)\.select\('\*'\)/u);
});

test('homepage caps mobile rails without changing the ad surfaces', async () => {
  const home = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'), 'utf8');
  const placeholder = await readFile(path.join(projectRoot, 'src', 'components', 'AdPlaceholder.tsx'), 'utf8');

  assert.match(home, /matchMedia\('\(max-width: 767px\)'\)/u);
  assert.match(home, /const railLimit = isMobileViewport \? 6 : 8/u);
  assert.match(home, /\.limit\(railLimit\)/u);
  assert.match(home, /\.slice\(0, railLimit\)/u);
  assert.match(home, /viewAllHref=\{`\/\$\{locale\}\/search`\}/u);
  assert.match(home, /<AdPlaceholder format="mobile" className="xl:hidden w-full min-w-0">/u);
  assert.match(placeholder, /<VipAdGate><AdblockGuard>\{ad\}<\/AdblockGuard><\/VipAdGate>/u);
});

test('inline ad shells reserve their format height before provider mount', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'components', 'AdPlaceholder.tsx'), 'utf8');
  assert.match(source, /const reservedHeight = format === 'rectangle' \? 284/u);
  assert.match(source, /format === 'leaderboard' \? 124/u);
  assert.match(source, /format === 'download-banner' \? 94/u);
  assert.match(source, /style=\{\{ minHeight: reservedHeight \}\}/u);
});

test('download Skip advances remount only the active ad stage', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'components', 'DownloadFlowView.tsx'), 'utf8');
  assert.ok(source.includes("key={`download-${showFinalModal ? 'final' : `stage-${step}`}-banner`}"));
  assert.ok(source.includes('key={`download-stage-${step}-rectangle`}'));
  assert.ok(source.includes('refreshKey={stageRefreshKey}'));
  assert.doesNotMatch(source, /setInterval|setTimeout\([^)]*ad/iu);
});

test('image optimization includes the actual mobile card and hero breakpoints', async () => {
  const config = await readFile(path.join(projectRoot, 'next.config.ts'), 'utf8');
  const mediaRoute = await readFile(path.join(projectRoot, 'src', 'app', 'api', 'media', 'route.ts'), 'utf8');
  const assetRoute = await readFile(path.join(projectRoot, 'src', 'app', 'api', 'asset', 'route.ts'), 'utf8');
  const mediaHelper = await readFile(path.join(projectRoot, 'src', 'lib', 'media-image.ts'), 'utf8');
  const optimizedImage = await readFile(path.join(projectRoot, 'src', 'components', 'OptimizedImage.tsx'), 'utf8');
  assert.match(config, /unoptimized: true/u);
  assert.match(config, /deviceSizes: \[384, 400, 640, 750/u);
  assert.match(config, /imageSizes: \[16, 32, 48, 64, 96, 128, 160, 220, 256, 320, 384\]/u);
  assert.match(mediaRoute, /sharp\(input[\s\S]*\.webp\(\{ quality, effort: 3 \}\)/u);
  assert.match(mediaRoute, /MAX_SOURCE_BYTES = 8 \* 1024 \* 1024/u);
  assert.match(mediaRoute, /Private image hosts are not allowed/u);
  assert.match(mediaRoute, /max-age=2592000, s-maxage=31536000/u);
  assert.match(mediaHelper, /return `\/api\/asset\?\$\{params\.toString\(\)\}`/u);
  assert.match(mediaHelper, /optimizedImageSrcSet/u);
  assert.match(mediaHelper, /proportionalHeight/u);
  assert.match(assetRoute, /export \{ GET \} from '\.\.\/media\/route'/u);
  assert.match(optimizedImage, /setFailedSource\(transformedSrc\)/u);
  assert.match(optimizedImage, /<source srcSet=\{transformedSrcSet\} sizes=\{sizes\}/u);
  assert.match(config, /source: '\/logo\.jpg'[\s\S]*max-age=2592000/u);
});

test('homepage prioritizes only the first hero image', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'), 'utf8');
  assert.match(source, /mods\.map\(\(mod, index\) =>/u);
  assert.match(source, /priority=\{index === 0\}/u);
});

test('homepage reserves catalog rail space while data loads', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'), 'utf8');
  assert.match(source, /mods=\{mostDownloaded\} loading=\{loading\}/u);
  assert.match(source, /if \(loading\) \{[\s\S]*min-h-\[204px\]/u);
  assert.match(source, /Array\.from\(\{ length: 4 \}/u);
});

before(async () => {
  server = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

  await waitForServer();
});

after(async () => {
  if (!server || server.exitCode !== null) return;

  server.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);

  if (server.exitCode === null) server.kill('SIGKILL');
});

test('admin editor keeps Minecraft Marketplace import available', async () => {
  const source = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'upload', 'page.tsx'), 'utf8');
  assert.match(source, /Importar do Minecraft Marketplace/u);
  assert.match(source, /setMinecraftUrl\(data\.source_url \|\| ''\)/u);
  assert.match(source, /source_url: metadata\.sourceUrl \|\| sourceUrl/u);
  assert.doesNotMatch(source, /\{!isEditing && \(/u);
});

test('fifth gallery image is wired through publish, edit, sync and public viewing', async () => {
  const upload = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'upload', 'page.tsx'), 'utf8');
  const adminRoute = await readFile(path.join(projectRoot, 'src', 'app', 'api', 'admin', 'mods', 'route.ts'), 'utf8');
  const viewer = await readFile(path.join(projectRoot, 'src', 'components', 'ModViewer.tsx'), 'utf8');
  const refresh = await readFile(path.join(projectRoot, 'src', 'app', 'api', 'mods', '[id]', 'refresh', 'route.ts'), 'utf8');
  const cron = await readFile(path.join(projectRoot, 'src', 'app', 'api', 'cron', 'sync-minecraft', 'route.ts'), 'utf8');
  const migration = await readFile(path.join(projectRoot, 'supabase', 'migrations', '20260921_09_catalog_gallery_image_5.sql'), 'utf8');

  assert.match(upload, /image_url_5: ''/u);
  assert.match(upload, /image_url_5: images\[4\]/u);
  assert.match(upload, /image_url_5: data\.image_url_5/u);
  assert.match(upload, /image_url_5: formData\.image_url_5/u);
  assert.match(upload, /name="image_url_5"/u);
  assert.match(adminRoute, /image_url_5: nullableString\(body\.image_url_5\)/u);
  assert.match(viewer, /image_url_5\?: string \| null/u);
  assert.match(viewer, /mod\.image_url_5 \? \{ type: 'image', url: mod\.image_url_5 \} : null/u);
  assert.match(viewer, /rawMediaList\.filter\(/u);
  assert.match(refresh, /image_url_5/u);
  assert.match(refresh, /images\[4\]/u);
  assert.match(cron, /image_url_5/u);
  assert.match(cron, /images\[4\]/u);
  assert.match(migration, /add column if not exists image_url_5 text/u);
  assert.match(migration, /grant select \([\s\S]*image_url_5/u);
});

test('English is the default locale', async () => {
  const response = await fetchManual('/');
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), '/en');
});

test('root locale follows supported browser language preferences', async () => {
  const portuguese = await fetchManual('/', { headers: { 'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8' } });
  assert.equal(portuguese.status, 307);
  assert.equal(portuguese.headers.get('location'), '/pt');

  const spanish = await fetchManual('/', { headers: { 'accept-language': 'es-ES,es;q=0.9,en;q=0.8' } });
  assert.equal(spanish.status, 307);
  assert.equal(spanish.headers.get('location'), '/es');

  const explicitEnglish = await fetchManual('/en', { headers: { 'accept-language': 'pt-BR,pt;q=0.9' } });
  assert.equal(explicitEnglish.status, 200);
});

test('invalid and missing locale prefixes are normalized', async () => {
  const invalid = await fetchManual('/xx');
  assert.equal(invalid.status, 307);
  assert.equal(invalid.headers.get('location'), '/en');

  const invalidWithPath = await fetchManual('/fr-FR/search?q=test');
  assert.equal(invalidWithPath.status, 307);
  assert.equal(invalidWithPath.headers.get('location'), '/en/search?q=test');

  const missing = await fetchManual('/search?q=test');
  assert.equal(missing.status, 307);
  assert.equal(missing.headers.get('location'), '/en/search?q=test');
});

test('English, Spanish, and Portuguese pages render their translations', async () => {
  const cases = [
    ['/en/search', 'Search Hub'],
    ['/es/search', 'Centro de búsqueda'],
    ['/pt/search', 'Central de busca'],
  ];

  for (const [pathname, expectedText] of cases) {
    const response = await fetchManual(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expectedText, 'u'));
  }
});

test('public SEO metadata and custom 404 are present', async () => {
  const home = await fetchManual('/en');
  assert.equal(home.status, 200);
  const homeHtml = await home.text();
  assert.match(homeHtml, /name="google-site-verification" content="[^"]+"/u);

  const search = await fetchManual('/en/search');
  assert.equal(search.status, 200);
  const searchHtml = await search.text();
  assert.match(searchHtml, /<title>Search Minecraft Mods \| GuizzMods<\/title>/u);
  assert.match(searchHtml, /property="og:image"/u);
  assert.match(searchHtml, /name="twitter:card"/u);

  const category = await fetchManual('/pt/category/mash-up');
  assert.equal(category.status, 200);
  const categoryHtml = await category.text();
  assert.match(categoryHtml, /<title>Mash-up Minecraft \| GuizzMods<\/title>/u);
  assert.match(categoryHtml, /mash-up/iu);

  const missing = await fetchManual('/en/does-not-exist');
  assert.equal(missing.status, 404);
  const missingHtml = await missing.text();
  assert.match(missingHtml, />404<\/h1>/u);
  assert.match(missingHtml, /404 navigation/u);
});

test('all locale message files expose the same keys', async () => {
  const locales = ['en', 'es', 'pt'];
  const keySets = [];

  for (const locale of locales) {
    const file = await readFile(path.join(projectRoot, 'src', 'messages', `${locale}.json`), 'utf8');
    keySets.push(flattenKeys(JSON.parse(file)).sort());
  }

  assert.deepEqual(keySets[1], keySets[0]);
  assert.deepEqual(keySets[2], keySets[0]);
});

test('legal and trust pages are public in every supported language', async () => {
  const cases = [
    ['/en/privacy', 'Privacy Policy'],
    ['/es/terms', 'Términos de Uso'],
    ['/pt/about', 'Sobre o GuizzMods'],
    ['/pt/contact', 'Contato'],
  ];

  for (const [pathname, expectedText] of cases) {
    const response = await fetchManual(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expectedText, 'u'));
  }
});

test('Adsterra placements have no obsolete AdSense ownership metadata or unfinished placeholders', async () => {
  const response = await fetchManual('/en');
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.doesNotMatch(html, /google-adsense-account|ca-pub-6724689825230861/iu);
  assert.match(html, /href="\/en\/privacy"/u);
  assert.doesNotMatch(html, /Ad Slot/iu);
  assert.doesNotMatch(html, /click to support/iu);
});

test('Vercel observability components and search discovery files are configured', async () => {
  const layout = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx'), 'utf8');
  assert.match(layout, /<Analytics\s*\/>/u);
  assert.match(layout, /<SpeedInsights\s*\/>/u);

  const robots = await fetchManual('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/www\.guizz\.xyz\/sitemap\.xml/u);

  const sitemap = await fetchManual('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /https:\/\/www\.guizz\.xyz\/en\/about/u);
  assert.match(xml, /https:\/\/www\.guizz\.xyz\/es\/about/u);
  assert.match(xml, /https:\/\/www\.guizz\.xyz\/pt\/about/u);
  assert.match(xml, /https:\/\/www\.guizz\.xyz\/en\/category\/mash-up/u);
  assert.match(xml, /https:\/\/www\.guizz\.xyz\/pt\/category\/mash-up/u);
});

test('desktop header keeps VIP discoverable with an accessible active state', async () => {
  const header = await readFile(path.join(projectRoot, 'src', 'components', 'TopHeader.tsx'), 'utf8');
  assert.match(header, /href=\{vipPath\}/u);
  assert.match(header, /aria-current=\{vipActive \? 'page' : undefined\}/u);
  assert.match(header, /t\('vip'\)/u);
  const motion = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'site-motion.css'), 'utf8');
  assert.match(motion, /\.vip-header-link\s*\{/u);
  assert.match(motion, /prefers-reduced-motion: no-preference/u);
});

test('settings logout clears sensitive state and replaces the protected history entry', async () => {
  const settings = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'settings', 'page.tsx'), 'utf8');
  assert.match(settings, /if \(signingOut\) return/u);
  assert.match(settings, /await supabase\.auth\.signOut\(\)/u);
  assert.match(settings, /setUser\(null\)/u);
  assert.match(settings, /setVipStatus\(null\)/u);
  assert.match(settings, /router\.replace\(`\/\$\{locale\}\/login`\)/u);
  const logoutBlock = settings.match(/const handleLogout = async \(\) => \{[\s\S]*?\n  \};/u)?.[0];
  assert.ok(logoutBlock);
  assert.doesNotMatch(logoutBlock, /router\.push\(/u);
  assert.doesNotMatch(settings, /if \(!session\) \{\r?\n\s+router\.push\(/u);
  assert.match(settings, /t\('signOutError'\)/u);
  assert.match(settings, /t\('profileError'\)/u);
  assert.match(settings, /t\('passwordError'\)/u);
  assert.doesNotMatch(settings, /text: error\.message/u);
});

test('VIP ad gate rechecks entitlement whenever the auth session changes', async () => {
  const gate = await readFile(path.join(projectRoot, 'src', 'components', 'VipAdGate.tsx'), 'utf8');
  assert.match(gate, /supabase\.auth\.onAuthStateChange/u);
  assert.match(gate, /resolveAds\(session\?\.access_token\)/u);
  assert.match(gate, /setShowAds\(false\)/u);
  assert.match(gate, /supabase\.auth\.getSession\(\)/u);
  assert.match(gate, /requestId/u);
  assert.match(gate, /subscription\.unsubscribe\(\)/u);
});

test('VIP status refreshes after returning to the page or browser tab', async () => {
  const vip = await readFile(path.join(projectRoot, 'src', 'components', 'VipExperience.tsx'), 'utf8');
  assert.match(vip, /const refreshSession = async \(\)/u);
  assert.match(vip, /window\.addEventListener\('pageshow', refreshSession\)/u);
  assert.match(vip, /document\.addEventListener\('visibilitychange', onVisibilityChange\)/u);
  assert.match(vip, /window\.removeEventListener\('pageshow', refreshSession\)/u);
  assert.match(vip, /document\.removeEventListener\('visibilitychange', onVisibilityChange\)/u);
});

test('download countdowns resynchronize when a hidden tab becomes visible', async () => {
  const flow = await readFile(path.join(projectRoot, 'src', 'components', 'DownloadFlow.tsx'), 'utf8');
  assert.match(flow, /const stepDeadlineRef = useRef<number \| null>\(null\)/u);
  assert.match(flow, /const resetFlow = useCallback\(\(\) => \{/u);
  assert.match(flow, /const syncWhenVisible = \(\) => \{/u);
  assert.match(flow, /document\.visibilityState !== 'visible'/u);
  assert.match(flow, /window\.addEventListener\('pageshow', syncWhenVisible\)/u);
  assert.match(flow, /document\.addEventListener\('visibilitychange', syncWhenVisible\)/u);
  assert.match(flow, /window\.removeEventListener\('pageshow', syncWhenVisible\)/u);
  assert.match(flow, /document\.removeEventListener\('visibilitychange', syncWhenVisible\)/u);
  assert.match(flow, /Math\.ceil\(\(stepDeadline - now\) \/ 1000\)/u);
  assert.match(flow, /Math\.ceil\(\(session\.readyAt - now\) \/ 1000\)/u);
  assert.match(flow, /stepDeadlineRef\.current = Date\.now\(\) \+ 8_000/u);
  assert.match(flow, /const cancel = resetFlow/u);
});

test('VIP recovery bounds repeated provider lookups per user', async () => {
  const entitlement = await readFile(path.join(projectRoot, 'src', 'lib', 'vip-entitlement.ts'), 'utf8');
  assert.match(entitlement, /const LIVE_RECONCILE_COOLDOWN_MS = 30_000/u);
  assert.match(entitlement, /const LIVE_RECONCILE_MAX_USERS = 512/u);
  assert.match(entitlement, /const liveReconcileAttempts = new Map<string, number>\(\)/u);
  assert.match(entitlement, /lastAttempt !== undefined && now - lastAttempt < LIVE_RECONCILE_COOLDOWN_MS/u);
  assert.match(entitlement, /if \(!allowLiveReconcileAttempt\(userId\)\) return;/u);
  assert.match(entitlement, /while \(liveReconcileAttempts\.size > LIVE_RECONCILE_MAX_USERS\)/u);
});

test('Skins, Holoprint, social links, and real catalog discovery are configured', async () => {
  const layout = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'layout.tsx'), 'utf8');
  const home = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'page.tsx'), 'utf8');
  const upload = await readFile(path.join(projectRoot, 'src', 'app', '[locale]', 'upload', 'page.tsx'), 'utf8');
  const viewer = await readFile(path.join(projectRoot, 'src', 'components', 'ModViewer.tsx'), 'utf8');

  assert.match(layout, /id: "skins"[^\n]+\/category\/skins/u);
  assert.match(upload, /id: 'skins'[^\n]+label: 'Skins'/u);
  assert.match(home, /category\/holoprint/u);
  assert.match(home, /https:\/\/www\.tiktok\.com\/@guihjzzz/u);
  assert.match(viewer, /https:\/\/www\.tiktok\.com\/@guihjzzz/u);
  assert.match(viewer, /\.order\('downloads', \{ ascending: false \}\)/u);
  assert.doesNotMatch(viewer, /SUGGESTED_MODS_FALLBACK/u);
});

test('anonymous visitors cannot access administrative APIs or see the admin link', async () => {
  const statusResponse = await fetchManual('/api/admin/status');
  assert.equal(statusResponse.status, 403);
  assert.deepEqual(await statusResponse.json(), { isAdmin: false });

  const modsResponse = await fetchManual('/api/admin/mods');
  assert.equal(modsResponse.status, 403);

  const pageResponse = await fetchManual('/en');
  assert.equal(pageResponse.status, 200);
  assert.doesNotMatch(await pageResponse.text(), /href="\/en\/upload"/u);
});

test('the final download route rejects requests without a signed waiting session', async () => {
  const response = await fetchManual('/api/download/open?mod=smoke-test');
  assert.equal(response.status, 403);
});

test('public page output does not expose private Terabox fields or links', async () => {
  const response = await fetchManual('/en');
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.doesNotMatch(html, /terabox_url/iu);
  assert.doesNotMatch(html, /https?:\/\/[^"'\s]*terabox\.(?:com|app)/iu);
});

test('security headers are present on pages and APIs', async () => {
  const responses = [
    await fetchManual('/en'),
    await fetchManual('/api/download/open?mod=smoke-test'),
  ];

  for (const response of responses) {
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.match(response.headers.get('content-security-policy') || '', /frame-ancestors 'none'/u);
    assert.match(response.headers.get('permissions-policy') || '', /camera=\(\)/u);
  }
  assert.equal(responses[1].headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
});
