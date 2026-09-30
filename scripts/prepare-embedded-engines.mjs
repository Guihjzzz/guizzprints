import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const publicRoot = join(process.cwd(), 'public', 'guide3d');
const engines = [
  { name: 'Guizz Studio original', directory: join(publicRoot, 'studio-original'), prefix: '/guide3d/studio-original', injectStudioBridge: true },
  { name: 'Conversor original', directory: join(publicRoot, 'original-converter'), prefix: '/guide3d/original-converter', injectStudioBridge: false },
];
const textExtensions = new Set(['.html', '.js', '.mjs', '.css', '.json']);

function isRequiredTextAsset(relativePath, injectStudioBridge) {
  if (relativePath.startsWith('_next/')) return true;
  if (injectStudioBridge && (relativePath === 'viewer.html' || relativePath.startsWith('custom/'))) return true;
  if (!injectStudioBridge && relativePath.endsWith('.html')) return true;
  return !injectStudioBridge && ['bridge.html', 'converter-embedded.html', 'converter.html'].includes(relativePath);
}

async function walk(directory, root, injectStudioBridge) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path, root, injectStudioBridge));
    else if (textExtensions.has(extname(entry.name).toLowerCase()) && isRequiredTextAsset(relative(root, path).replaceAll('\\', '/'), injectStudioBridge)) files.push(path);
  }
  return files;
}

function rebaseAssetUrls(source, prefix) {
  return source
    .replaceAll('"/_next/', `"${prefix}/_next/`)
    .replaceAll("'/_next/", `'${prefix}/_next/`)
    .replaceAll('`/_next/', `\`${prefix}/_next/`)
    .replaceAll('"/pack.zip', `"${prefix}/pack.zip`)
    .replaceAll("'/pack.zip", `'${prefix}/pack.zip`)
    .replaceAll('"/pack-entities.zip', `"${prefix}/pack-entities.zip`)
    .replaceAll("'/pack-entities.zip", `'${prefix}/pack-entities.zip`);
}

function removeHostedOnlyScripts(source) {
  return source
    .replace(
    /<script\b[^>]*\bsrc=["'][^"']*(?:cdn-cgi|static\.cloudflareinsights\.com)[^"']*["'][^>]*>\s*<\/script>/gi,
    '',
    )
    .replace(
      /<script>\(function\(\)\{function c\(\)\{[\s\S]*?cdn-cgi[\s\S]*?<\/script>/gi,
      '',
    );
}

function removeBundledServiceTokens(source) {
  // The upstream static bundles include a third-party Mapbox access token.
  // Maps are not part of the converter or Guizz Studio publishing workflow;
  // remove the upstream credential instead of carrying it into this project.
  return source.replace(/pk\.[A-Za-z0-9._-]+/g, 'guizzprints-map-service-disabled');
}

function injectStudioBridge(source, bridgeSource) {
  const inlineBridge = `<script data-guizz-studio-embed>${bridgeSource.replace(/<\/script/gi, '<\\/script')}</script>`;
  // Only the inline bridge has no `src`. The other marked scripts load the
  // Studio's local CSS/modules and must remain in place. Matching every
  // marked script would duplicate the bridge on every prebuild run.
  const bridgeTag = /<script\b(?=[^>]*data-guizz-studio-embed)(?![^>]*\bsrc\s*=)[^>]*>[\s\S]*?<\/script>/gi;
  if (source.includes('data-guizz-studio-embed')) {
    // The publisher bridge is inlined so the Studio can work from the same
    // Vercel deployment. Replace every older/inlined copy with one canonical
    // copy; otherwise a later prebuild would append it again.
    return source.replace(bridgeTag, inlineBridge);
  }
  const head = `<link data-guizz-studio-embed rel="stylesheet" href="./custom/structure-studio.css?v=31"><script data-guizz-studio-embed defer src="./custom/pt-br.js?v=31"></script><script data-guizz-studio-embed defer src="./custom/brand-guizz.js?v=31"></script><script data-guizz-studio-embed type="module" src="./custom/addon-branding.js?v=31"></script>`;
  const body = `<script data-guizz-studio-embed defer src="./custom/video-export.js?v=31"></script><script data-guizz-studio-embed defer src="./custom/image-export.js?v=32"></script>${inlineBridge}<script data-guizz-studio-embed defer src="./custom/hologram-video.js?v=31"></script><script data-guizz-studio-embed defer src="./custom/media-dock.js?v=31"></script>`;
  return source.replace(/<\/head>/i, `${head}</head>`).replace(/<\/body>/i, `${body}</body>`);
}

for (const engine of engines) {
  if (!existsSync(engine.directory)) {
    throw new Error(`${engine.name} não foi encontrado em ${relative(process.cwd(), engine.directory)}.`);
  }
  const files = await walk(engine.directory, engine.directory, engine.injectStudioBridge);
  const studioBridgeSource = engine.injectStudioBridge
    ? await readFile(join(engine.directory, 'custom', 'publisher-bridge.js'), 'utf8')
    : '';
  for (const file of files) {
    let source = await readFile(file, 'utf8');
    const before = source;
    source = rebaseAssetUrls(source, engine.prefix);
    if (extname(file).toLowerCase() === '.html') source = removeHostedOnlyScripts(source);
    source = removeBundledServiceTokens(source);
    if (engine.injectStudioBridge && relative(engine.directory, file).replaceAll('\\', '/') === 'viewer.html') {
      source = injectStudioBridge(source, studioBridgeSource);
    }
    if (source !== before) await writeFile(file, source, 'utf8');
  }
  console.log(`${engine.name}: ${files.length} arquivos estáticos preparados.`);
}
