import { createClient } from 'npm:@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@6';

const PROJECT_ID = 'ghuizz-hololab';
const ADMIN_EMAILS = new Set(['junindacosta00241@gmail.com']);
const BEDROCK_FORMATS = new Set(['holoprint', 'mcstructure', 'mcaddon', 'mcworld']);
const JAVA_FORMATS = new Set(['litematic', 'schem', 'schematic', 'world', 'mcfunction']);
const ALL_FORMATS = new Set([...BEDROCK_FORMATS, ...JAVA_FORMATS]);
const FORMAT_IDS = new Set(['default', ...ALL_FORMATS]);
const CONTENT_THEMES = new Set(['Ancestral', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Outro']);
const CONTENT_SIZES = new Set(['Pequeno', 'Médio', 'Grande', 'Enorme']);
const CONTENT_CATEGORIES = new Set([
  'Arenas', 'Castelos', 'Masmorras', 'Jogos', 'Casas e lojas', 'Variado',
  'Pedra vermelha', 'Templos', 'Torres', 'Cidades', 'Ilhas Flutuantes',
  'Jardins', 'Ilhas', 'Arte em pixel', 'Estátuas e esculturas', 'Barcos',
  'Máquinas Voadoras', 'Veículos terrestres',
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FIREBASE_KEYS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

type LinkEntry = { id: string; url: string; fileName?: string };
type AssetUrls = { source?: string; schem?: string; cover?: string; views?: string[]; board?: string };

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

function text(value: unknown, max = 12_000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function serviceKey() {
  const modern = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, unknown>;
      if (typeof parsed.default === 'string' && parsed.default) return parsed.default;
    } catch {
      // Continue to the final configuration error below.
    }
  }
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacy) return legacy;
  throw new Error('Supabase server credentials are unavailable.');
}

function admin() {
  const url = Deno.env.get('SUPABASE_URL');
  if (!url) throw new Error('Supabase URL is unavailable.');
  const key = serviceKey();
  // The modern sb_secret key is opaque, so it must remain in apikey and must
  // never be copied to Authorization as a Bearer JWT by supabase-js.
  const serverFetch: typeof fetch = (input, init) => {
    const request = new Request(input, init);
    const headers = new Headers(request.headers);
    headers.delete('authorization');
    headers.set('apikey', key);
    return fetch(new Request(request, { headers }));
  };
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: serverFetch },
  });
}

function publicHttps(value: string) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  const isLocal = host === 'localhost' || host === '::1' || host === '0.0.0.0'
    || host.endsWith('.local') || /^(127\.|10\.|192\.168\.|169\.254\.)/.test(host)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (url.protocol !== 'https:' || isLocal || url.username || url.password || url.port) throw new Error('Use a public HTTPS download link.');
  return url;
}

function githubReleaseAsset(value: unknown) {
  const raw = text(value, 2_000);
  const url = publicHttps(raw);
  if (url.hostname !== 'github.com' || !url.pathname.startsWith('/Guizzhjz/guizzprints-assets/releases/download/')) {
    throw new Error('Generated media must be stored in Guizzprints GitHub Releases.');
  }
  return url.toString();
}

function validVersion(value: string) {
  if (!/^[0-9A-Za-z][0-9A-Za-z._ -]{0,49}$/.test(value)) throw new Error('Invalid Minecraft version.');
  return value;
}

function selectedLabels(value: unknown, allowed: Set<string>, label: string) {
  if (!Array.isArray(value)) throw new Error(`Escolha ${label} válidos para a construção.`);
  const values = value.map((entry) => typeof entry === 'string' ? entry.trim() : '');
  if (!values.length || values.some((entry) => !allowed.has(entry))) {
    throw new Error(`Escolha ${label} válidos para a construção.`);
  }
  return [...new Set(values)];
}

function parseContentTaxonomy(body: Record<string, unknown>) {
  const themes = selectedLabels(body.content_themes, CONTENT_THEMES, 'os temas');
  const categories = selectedLabels(body.content_categories, CONTENT_CATEGORIES, 'as categorias');
  const size = typeof body.content_size === 'string' ? body.content_size.trim() : '';
  if (!CONTENT_SIZES.has(size)) throw new Error('Escolha um tamanho válido para a construção.');
  return { content_themes: themes, content_size: size, content_categories: categories };
}

function linksFrom(value: unknown) {
  if (!Array.isArray(value)) return [] as LinkEntry[];
  const output: LinkEntry[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const id = text((item as { id?: unknown }).id, 32).toLowerCase();
    const rawUrl = text((item as { url?: unknown }).url, 2_000);
    if (!ALL_FORMATS.has(id) || !rawUrl || output.some((entry) => entry.id === id)) continue;
    const url = publicHttps(rawUrl).toString();
    const fileName = text((item as { fileName?: unknown }).fileName, 180);
    output.push({ id, url, ...(fileName ? { fileName } : {}) });
  }
  return output;
}

function hasFormat(downloadFormats: unknown, format: string, fallback: unknown, primary: unknown) {
  if (format === 'default') return typeof fallback === 'string' && Boolean(fallback.trim());
  if (Array.isArray(downloadFormats)) {
    const entry = downloadFormats.find((item) => item && typeof item === 'object' && (item as { id?: unknown }).id === format) as { url?: unknown } | undefined;
    if (typeof entry?.url === 'string') {
      try { publicHttps(entry.url); return true; } catch { return false; }
    }
  }
  return format === primary && typeof fallback === 'string' && Boolean(fallback.trim());
}

function destination(downloadFormats: unknown, format: string, fallback: unknown, primary: unknown) {
  if (format === 'default') return typeof fallback === 'string' ? publicHttps(fallback).toString() : null;
  if (Array.isArray(downloadFormats)) {
    const entry = downloadFormats.find((item) => item && typeof item === 'object' && (item as { id?: unknown }).id === format) as { url?: unknown } | undefined;
    if (typeof entry?.url === 'string') return publicHttps(entry.url).toString();
  }
  return format === primary && typeof fallback === 'string' ? publicHttps(fallback).toString() : null;
}

async function isFirebaseAdmin(request: Request) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token || token.length > 12_000) return false;
  try {
    const { payload } = await jwtVerify(token, FIREBASE_KEYS, {
      audience: PROJECT_ID,
      issuer: `https://securetoken.google.com/${PROJECT_ID}`,
      algorithms: ['RS256'],
    });
    return typeof payload.email === 'string' && ADMIN_EMAILS.has(payload.email.toLowerCase());
  } catch {
    return false;
  }
}

async function publish(request: Request, body: Record<string, unknown>) {
  if (!await isFirebaseAdmin(request)) return response({ error: 'Administrator access required.' }, 403);
  const title = text(body.title, 160);
  const description = text(body.description, 12_000);
  if (!title || !description) return response({ error: 'Title and detailed description are required.' }, 400);

  let version: string;
  let assets: AssetUrls;
  let links: LinkEntry[];
  let taxonomy: ReturnType<typeof parseContentTaxonomy>;
  try {
    version = validVersion(text(body.version, 50) || '1.0.0');
    taxonomy = parseContentTaxonomy(body);
    assets = body.assets && typeof body.assets === 'object' && !Array.isArray(body.assets) ? body.assets as AssetUrls : {};
    links = linksFrom(body.download_links);
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : 'Invalid publication.' }, 400);
  }
  if (!assets.source || !assets.schem || !assets.cover || !Array.isArray(assets.views) || assets.views.length !== 8 || !assets.board) {
    return response({ error: 'Generate and upload the .mcstructure, .schem, four-view cover, eight views and Guizz Studio board before publishing.' }, 400);
  }
  if (!links.length) return response({ error: 'Add at least one direct download link.' }, 400);

  try {
    const source = githubReleaseAsset(assets.source);
    const schem = githubReleaseAsset(assets.schem);
    const cover = githubReleaseAsset(assets.cover);
    const board = githubReleaseAsset(assets.board);
    const views = assets.views.map((value) => githubReleaseAsset(value));
    const bedrockLinks = links.filter((link) => BEDROCK_FORMATS.has(link.id));
    const javaLinks = links.filter((link) => JAVA_FORMATS.has(link.id));
    if (!bedrockLinks.length || !javaLinks.length) {
      return response({ error: 'Adicione pelo menos um link HTTPS de download para Bedrock e outro para Java.' }, 400);
    }

    const common = {
      title, description, version, file_size: text(body.file_size, 80) || 'N/A', price: 'Free',
      image_url_1: views[0], image_url_2: views[1], image_url_3: views[2], image_url_4: views[3],
      image_url_5: views[4], image_url_6: views[5], image_url_7: views[6], image_url_8: views[7],
      showcase_cover_url: cover, guide_mcstructure_url: source, guide_schem_url: schem, studio_board_url: board, spin_video_url: null,
      ...taxonomy,
    };
    const bedrockId = crypto.randomUUID();
    const javaId = crypto.randomUUID();
    const { error } = await admin().from('mods').insert([
      { ...common, id: bedrockId, category: 'bedrock', subcategory: taxonomy.content_categories[0], terabox_url: bedrockLinks[0].url, download_formats: bedrockLinks, available_formats: bedrockLinks.map((link) => link.id) },
      { ...common, id: javaId, category: 'java', subcategory: taxonomy.content_categories[0], terabox_url: javaLinks[0].url, download_formats: javaLinks, available_formats: javaLinks.map((link) => link.id) },
    ]);
    if (error) throw new Error('Unable to publish this item.');
    return response({ data: { bedrockId, javaId } }, 201);
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : 'Unable to publish this item.' }, 400);
  }
}

async function createDownloadSession(body: Record<string, unknown>) {
  const modId = text(body.modId, 64);
  const format = text(body.format, 32).toLowerCase() || 'default';
  if (!UUID.test(modId) || !FORMAT_IDS.has(format)) return response({ error: 'Invalid mod.' }, 400);
  const client = admin();
  const { data: mod, error } = await client.from('mods').select('id, terabox_url, download_formats, subcategory').eq('id', modId).maybeSingle();
  if (error) return response({ error: 'The catalog is temporarily unavailable.' }, 503);
  if (!mod || !hasFormat(mod.download_formats, format, mod.terabox_url, mod.subcategory)) return response({ error: 'Mod not found.' }, 404);
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000;
  const nonce = crypto.randomUUID();
  const { error: sessionError } = await client.from('download_access_sessions').insert({
    nonce, mod_id: modId, format_id: format, ready_at: new Date(now).toISOString(), expires_at: new Date(expiresAt).toISOString(), vip: false,
  });
  if (sessionError) return response({ error: 'Unable to start the protected download.' }, 503);
  return response({ readyAt: now, expiresAt, serverTime: now, vip: false, nonce });
}

async function openDownload(body: Record<string, unknown>) {
  const modId = text(body.modId, 64);
  const format = text(body.format, 32).toLowerCase() || 'default';
  const nonce = text(body.nonce, 128);
  if (!UUID.test(modId) || !FORMAT_IDS.has(format) || !UUID.test(nonce)) return response({ error: 'This download must be started from its mod page.' }, 403);
  const client = admin();
  const { data: mod, error } = await client.from('mods').select('terabox_url, download_formats, subcategory').eq('id', modId).maybeSingle();
  if (error || !mod) return response({ error: 'The download is unavailable.' }, 404);
  let url: string | null;
  try { url = destination(mod.download_formats, format, mod.terabox_url, mod.subcategory); } catch { url = null; }
  if (!url) return response({ error: 'The requested download format is unavailable.' }, 404);
  const now = new Date().toISOString();
  const { data: consumed, error: consumeError } = await client.from('download_access_sessions')
    .update({ consumed_at: now }).eq('nonce', nonce).eq('mod_id', modId).eq('format_id', format)
    .is('consumed_at', null).lte('ready_at', now).gt('expires_at', now).select('nonce').maybeSingle();
  if (consumeError) return response({ error: 'Unable to open the download right now.' }, 503);
  if (!consumed) return response({ error: 'This download session has already been used. Start again from the mod page.' }, 401);
  await client.rpc('increment_download', { mod_id: modId });
  return response({ url });
}

async function checkDownload(body: Record<string, unknown>) {
  const modId = text(body.modId, 64);
  const format = text(body.format, 32).toLowerCase() || 'default';
  const nonce = text(body.nonce, 128);
  if (!UUID.test(modId) || !FORMAT_IDS.has(format) || !UUID.test(nonce)) return response({ error: 'This download must be started from its mod page.' }, 403);
  const now = new Date().toISOString();
  const { data, error } = await admin().from('download_access_sessions')
    .select('nonce').eq('nonce', nonce).eq('mod_id', modId).eq('format_id', format)
    .is('consumed_at', null).lte('ready_at', now).gt('expires_at', now).maybeSingle();
  if (error || !data) return response({ error: 'This download session expired. Start again from the mod page.' }, 401);
  return response({ ready: true });
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return response({ error: 'Method not allowed.' }, 405);
  const length = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(length) && length > 128 * 1024) return response({ error: 'Invalid request.' }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
    body = parsed as Record<string, unknown>;
  } catch {
    return response({ error: 'Invalid request.' }, 400);
  }
  const action = text(body.action, 32);
  if (action === 'publish') return publish(request, body);
  if (action === 'create-download-session') return createDownloadSession(body);
  if (action === 'check-download') return checkDownload(body);
  if (action === 'open-download') return openDownload(body);
  return response({ error: 'Invalid request.' }, 400);
});
