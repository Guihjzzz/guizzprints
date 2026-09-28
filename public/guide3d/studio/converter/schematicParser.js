import { extractBlocks } from './structureData.js'
import { isGzipBuffer, isZlibBuffer, prepareMcstructureBuffer } from './mcstructureBinary.js'
import { parseBigEndianNbt, parseLittleEndianNbt } from './nbtLite.js'

const AIR = new Set(['minecraft:air', 'minecraft:cave_air', 'minecraft:void_air'])

const LEGACY_BLOCK_NAMES = {
  0: 'air', 1: 'stone', 2: 'grass_block', 3: 'dirt', 4: 'cobblestone', 5: 'oak_planks',
  7: 'bedrock', 8: 'water', 9: 'water', 10: 'lava', 11: 'lava', 12: 'sand', 13: 'gravel',
  17: 'oak_log', 18: 'oak_leaves', 20: 'glass', 24: 'sandstone', 35: 'white_wool',
  41: 'gold_block', 42: 'iron_block', 45: 'bricks', 46: 'tnt', 47: 'bookshelf',
  48: 'mossy_cobblestone', 49: 'obsidian', 50: 'torch', 54: 'chest', 57: 'diamond_block',
  58: 'crafting_table', 61: 'furnace', 78: 'snow', 79: 'ice', 80: 'snow_block',
  87: 'netherrack', 88: 'soul_sand', 89: 'glowstone', 98: 'stone_bricks',
  101: 'iron_bars', 102: 'glass_pane', 103: 'melon', 112: 'nether_bricks',
  121: 'end_stone', 123: 'redstone_lamp', 133: 'emerald_block', 152: 'redstone_block',
  155: 'quartz_block', 159: 'white_terracotta', 165: 'slime_block', 166: 'barrier',
}

function parsePaletteName(rawName) {
  const raw = String(rawName || 'minecraft:unknown_parsing_error')
  const bracket = raw.indexOf('[')
  const plain = bracket >= 0 ? raw.slice(0, bracket) : raw
  const name = plain.includes(':') ? plain : `minecraft:${plain}`
  const states = {}
  if (bracket >= 0 && raw.endsWith(']')) {
    for (const pair of raw.slice(bracket + 1, -1).split(',')) {
      const equals = pair.indexOf('=')
      if (equals < 1) continue
      const key = pair.slice(0, equals).trim(); const value = pair.slice(equals + 1).trim()
      states[key] = value === 'true' ? true : value === 'false' ? false : /^-?\d+$/.test(value) ? Number(value) : value
    }
  }
  return { name, states }
}

async function decodeCompressed(input) {
  let bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  const compression = isGzipBuffer(bytes) ? 'gzip' : isZlibBuffer(bytes) ? 'deflate' : null
  if (!compression) return bytes
  if (typeof DecompressionStream !== 'function') throw new Error(`Este navegador não oferece DecompressionStream(${compression}).`)
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(compression))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

function asNumber(value, fallback = 0) {
  const number = typeof value === 'bigint' ? Number(value) : Number(value)
  return Number.isFinite(number) ? number : fallback
}

function rootCompound(root) {
  if (root?.Schematic && typeof root.Schematic === 'object') return root.Schematic
  return root
}

function decodeVarInts(bytes) {
  const output = []
  let offset = 0
  while (offset < bytes.length) {
    let value = 0
    let shift = 0
    let done = false
    for (let count = 0; count < 5 && offset < bytes.length; count += 1) {
      const current = bytes[offset++] & 0xff
      value |= (current & 0x7f) << shift
      if (!(current & 0x80)) { done = true; break }
      shift += 7
    }
    if (!done) throw new Error('BlockData VarInt inválido no arquivo Schematic.')
    output.push(value >>> 0)
  }
  return output
}

export function extractSpongeSchematic(root) {
  const source = rootCompound(root)
  const width = asNumber(source.Width)
  const height = asNumber(source.Height)
  const length = asNumber(source.Length)
  if (![width, height, length].every((value) => Number.isSafeInteger(value) && value > 0)) {
    throw new Error('Schematic inválido: Width, Height e Length estão ausentes.')
  }
  const volume = width * height * length
  const paletteObject = source.Palette || source.palette
  const paletteEntries = paletteObject && typeof paletteObject === 'object'
    ? Object.entries(paletteObject).sort(([, a], [, b]) => asNumber(a) - asNumber(b))
    : []
  if (!paletteEntries.length && !source.Blocks) throw new Error('Schematic sem Palette/Blocks.')
  const namesByIndex = new Map(paletteEntries.map(([name, index]) => [asNumber(index), parsePaletteName(name)]))
  const encoded = source.BlockData ?? source.block_data
  const encodedBytes = Array.isArray(encoded) || ArrayBuffer.isView(encoded)
    ? encoded
    : encoded === undefined ? null : [encoded]
  const legacyBytes = source.Blocks === undefined
    ? []
    : (Array.isArray(source.Blocks) || ArrayBuffer.isView(source.Blocks) ? Array.from(source.Blocks, (value) => asNumber(value) & 0xff) : [asNumber(source.Blocks) & 0xff])
  const paletteIndices = encodedBytes ? decodeVarInts(encodedBytes) : legacyBytes
  if (paletteIndices.length < volume) throw new Error(`Schematic truncado: esperados ${volume} blocos, recebidos ${paletteIndices.length}.`)
  const blocks = []
  for (let y = 0; y < height; y += 1) {
    for (let z = 0; z < length; z += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * length * width) + (z * width) + x
        const resolved = namesByIndex.get(paletteIndices[index]) || (source.Blocks
          ? { name: `minecraft:${LEGACY_BLOCK_NAMES[paletteIndices[index]] || `legacy_block_${paletteIndices[index]}`}`, states: {} }
          : { name: 'minecraft:unknown_parsing_error', states: {} })
        const name = resolved.name
        if (AIR.has(name)) continue
        blocks.push({ x, y, z, layer: 0, blockName: name, sourceBlockName: name, states: resolved.states })
      }
    }
  }
  if (!blocks.length) throw new Error('A Schematic não contém blocos visíveis.')
  console.log('[schematic] estrutura convertida para o modelo interno:', { width, height, length, palette: namesByIndex.size, blocks: blocks.length })
  return blocks
}

export async function parseSchematicFile(file) {
  const bytes = await decodeCompressed(await file.arrayBuffer())
  let root
  try {
    root = parseBigEndianNbt(bytes)
  } catch (bigError) {
    try {
      // Bedrock `.nbt` exports may carry a version prefix. Strip it only for
      // the little-endian retry; Sponge schematics are big-endian and must be
      // parsed from byte zero (their root name may be non-empty).
      root = parseLittleEndianNbt(prepareMcstructureBuffer(bytes))
    } catch {
      throw bigError
    }
  }
  const source = rootCompound(root)
  if (source?.structure?.block_indices && source?.size) return extractBlocks(source)
  return extractSpongeSchematic(source)
}
