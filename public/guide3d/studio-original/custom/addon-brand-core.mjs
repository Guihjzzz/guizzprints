import { strFromU8, strToU8, unzipSync, zipSync } from './fflate.mjs'

export const GUIZZ_SITE = 'guizz.xyz'
export const GUIZZ_PROVIDER = 'Provided by §r§6§l@Guihjzzz'
export const GUIZZ_WATERMARK = '§r§6§lGuizz§9Mods'

const UTF8 = new TextEncoder()
const ZIP_HEADER = [0x50, 0x4b, 0x03, 0x04]

export const isZip = bytes => {
  const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return ZIP_HEADER.every((byte, index) => source[index] === byte)
}

export const sha256Hex = async bytes => {
  if (!globalThis.crypto?.subtle) return 'unavailable'
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

export const rewriteGuizzText = value => String(value ?? '')
  .replace(/\bbloxelizer\.com\b/gi, GUIZZ_SITE)
  .replace(/\bbloxelizer\b/gi, 'Guizz')

const appendOnce = (value, suffix) => {
  const cleaned = String(value ?? '').trim()
  if (cleaned.toLocaleLowerCase().includes(suffix.toLocaleLowerCase())) return cleaned
  return cleaned ? `${cleaned} | ${suffix}` : suffix
}

const withSite = value => {
  const cleaned = rewriteGuizzText(value).trim()
  if (/guizz\.xyz/i.test(cleaned)) return cleaned
  return cleaned ? `${cleaned} · ${GUIZZ_SITE}` : GUIZZ_SITE
}

const safeJson = (bytes, fallback) => {
  try {
    return JSON.parse(strFromU8(bytes))
  } catch {
    return fallback
  }
}

const jsonBytes = value => strToU8(`${JSON.stringify(value, null, 2)}\n`)

const isResourcePack = manifest => Array.isArray(manifest?.modules)
  && manifest.modules.some(module => module?.type === 'resources')

const keepOrReplaceTitle = manifest => {
  const header = manifest.header || (manifest.header = {})
  header.name = withSite(header.name || 'Guizz add-on')
  header.description = appendOnce(withSite(rewriteGuizzText(header.description || 'Guizz add-on')), GUIZZ_PROVIDER)
  return manifest
}

const brandLanguageFile = bytes => {
  const text = strFromU8(bytes)
  const lines = text.split(/\r?\n/).map(line => {
    const separator = line.indexOf('=')
    if (separator < 0) return rewriteGuizzText(line)
    const key = line.slice(0, separator)
    let value = rewriteGuizzText(line.slice(separator + 1))
    if (/^pack(?:_|\.)description$/i.test(key.trim())) value = appendOnce(value, GUIZZ_PROVIDER)
    if (/^pack(?:_|\.)name$/i.test(key.trim())) value = withSite(value)
    return `${key}=${value}`
  })
  return strToU8(lines.join('\n'))
}

const pauseScreenWatermark = existing => {
  const base = existing && typeof existing === 'object' && !Array.isArray(existing)
    ? existing
    : { namespace: 'pause_screen' }
  if (!base.namespace) base.namespace = 'pause_screen'
  base.guizzmods_watermark = {
    type: 'label',
    text: GUIZZ_WATERMARK,
    anchor_from: 'bottom_right',
    anchor_to: 'bottom_right',
    offset: [-8, -8],
    shadow: true,
    layer: 100,
    font_scale_factor: 0.8,
  }
  return base
}

const processingMarker = ({ sourceSha256, resourcePack }) => ({
  processor: 'GuizzMods-Lote compatible browser branding',
  site: GUIZZ_SITE,
  watermark: GUIZZ_WATERMARK,
  provider: '@Guihjzzz',
  source_sha256: sourceSha256 || 'unavailable',
  resource_pack: Boolean(resourcePack),
  operations: [
    'applied Guizz branding',
    'added pack icon',
    ...(resourcePack ? ['added title texture', 'added pause-screen watermark'] : []),
  ],
})

const renameArchiveEntry = name => rewriteGuizzText(name)

/**
 * Rebrands one .mcpack while keeping its UUIDs, versions, dependencies,
 * scripts, structures and every unknown file intact.
 */
export function brandMcpack(bytes, assets, options = {}) {
  const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const files = unzipSync(source)
  const manifestPath = Object.keys(files).find(path => path.toLowerCase() === 'manifest.json')
  if (!manifestPath) return { bytes: source, changed: false, resourcePack: false, label: 'Pacote sem manifest.json' }

  const manifest = safeJson(files[manifestPath], null)
  if (!manifest || typeof manifest !== 'object') {
    return { bytes: source, changed: false, resourcePack: false, label: 'Manifest inválido' }
  }

  keepOrReplaceTitle(manifest)
  const resourcePack = isResourcePack(manifest)
  files[manifestPath] = jsonBytes(manifest)

  for (const path of Object.keys(files)) {
    if (/^texts\/[^/]+\.lang$/i.test(path)) files[path] = brandLanguageFile(files[path])
  }

  if (assets.packIcon?.length) files['pack_icon.png'] = assets.packIcon
  if (resourcePack) {
    if (assets.minecraftTitle?.length) files['textures/ui/title.png'] = assets.minecraftTitle
    const pausePath = Object.keys(files).find(path => path.toLowerCase() === 'ui/pause_screen.json')
    // If another author already owns this file but it is malformed, preserve it
    // exactly as it is.  A fresh generated hologram pack has no pause screen,
    // so Guizz's watermark is still added in the normal export path.
    if (pausePath) {
      const existingPause = safeJson(files[pausePath], undefined)
      if (existingPause && typeof existingPause === 'object' && !Array.isArray(existingPause)) {
        files[pausePath] = jsonBytes(pauseScreenWatermark(existingPause))
      }
    } else {
      files['ui/pause_screen.json'] = jsonBytes(pauseScreenWatermark(null))
    }
  }

  files['guizzmods_processing.json'] = jsonBytes(processingMarker({
    sourceSha256: options.sourceSha256,
    resourcePack,
  }))

  return {
    bytes: zipSync(files, { level: 6 }),
    changed: true,
    resourcePack,
    label: manifest.header?.name || 'Guizz pack',
  }
}

/**
 * Rebrands a nested .mcaddon, or a standalone .mcpack.  It deliberately
 * preserves content outside manifests, UI additions, title and icon files.
 */
export async function brandBedrockArchive(bytes, assets) {
  const source = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  if (!isZip(source)) throw new Error('O arquivo exportado não é um ZIP Bedrock válido.')

  const outer = unzipSync(source)
  const mcpackEntries = Object.keys(outer).filter(path => /\.mcpack$/i.test(path))
  if (!mcpackEntries.length) {
    const hash = await sha256Hex(source)
    const result = brandMcpack(source, assets, { sourceSha256: hash })
    return { bytes: result.bytes, packs: result.changed ? 1 : 0, resourcePacks: result.resourcePack ? 1 : 0 }
  }

  let resourcePacks = 0
  for (const path of mcpackEntries) {
    const inner = outer[path]
    const hash = await sha256Hex(inner)
    const result = brandMcpack(inner, assets, { sourceSha256: hash })
    if (result.changed) outer[path] = result.bytes
    if (result.resourcePack) resourcePacks += 1
  }

  return {
    bytes: zipSync(outer, { level: 6 }),
    packs: mcpackEntries.length,
    resourcePacks,
  }
}

export const brandedDownloadName = originalName => {
  const original = String(originalName || 'guizz-addon.mcaddon')
  const fixed = rewriteGuizzText(original)
  return fixed || 'guizz-addon.mcaddon'
}
