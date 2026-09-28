/*
 * Browser-only format bridge for the Guizz guide.
 *
 * Every input is reduced to the same internal block array used by the native
 * guide engine and then encoded as a Sponge .schem.  This keeps the existing
 * renderer, timelapse and manipulation code untouched while allowing the
 * uploader to accept the common Java and Bedrock formats locally.
 */
import { extractBlocks } from './structureData.js'
import { createMcstructureBytes } from './mcstructureWriter.js'
import { parseBigEndianNbt, parseLittleEndianNbt } from './nbtLite.js'
import { parseSchematicFile, extractSpongeSchematic } from './schematicParser.js'
import { isGzipBuffer, isZlibBuffer, prepareMcstructureBuffer } from './mcstructureBinary.js'

const SUPPORTED = new Set(['schem', 'schematic', 'mcstructure', 'litematic', 'nbt', 'bp', 'zip', 'mcstructurezip'])
const AIR = new Set(['minecraft:air', 'minecraft:cave_air', 'minecraft:void_air', 'minecraft:structure_void'])
const MAX_CELLS = 16_777_216

function extension(name = '') {
  return String(name).toLowerCase().split('.').pop() || ''
}

function baseName(name = 'estrutura') {
  return String(name).replace(/\.(mcstructurezip|mcstructure|litematic|schematic|schem|nbt|bp|zip)$/i, '')
    .replace(/[<>:"/\\|?*]+/g, '_') || 'estrutura'
}

function asNumber(value, fallback = 0) {
  const n = typeof value === 'bigint' ? Number(value) : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function arrayOf(value) {
  if (Array.isArray(value)) return value
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) return Array.from(value)
  // Litematica stores vectors such as Size and Position as compounds
  // ({x, y, z}) in the canonical NBT format.  It also uses numeric-keyed
  // compounds for some palette/list representations.  Normalize both forms
  // before the existing conversion logic consumes them.
  if (value && typeof value === 'object') {
    if (Object.prototype.hasOwnProperty.call(value, 'x') &&
        Object.prototype.hasOwnProperty.call(value, 'y') &&
        Object.prototype.hasOwnProperty.call(value, 'z')) {
      return [value.x, value.y, value.z]
    }
    const numericKeys = Object.keys(value)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
    if (numericKeys.length) return numericKeys.map((key) => value[key])
  }
  return []
}

async function inflate(bytes) {
  const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  const compression = isGzipBuffer(input) ? 'gzip' : isZlibBuffer(input) ? 'deflate' : null
  if (!compression) return input
  if (typeof DecompressionStream !== 'function') {
    throw new Error(`Este navegador não oferece DecompressionStream(${compression}).`)
  }
  const stream = new Blob([input]).stream().pipeThrough(new DecompressionStream(compression))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

function gzip(bytes) {
  const pako = globalThis.pako || globalThis.window?.pako
  if (pako?.gzip) return new Uint8Array(pako.gzip(bytes))
  // Uncompressed NBT remains valid for the local readers. Browsers without
  // pako still get a usable download instead of a blank export.
  console.warn('[Formato] pako não está disponível; exportando NBT sem gzip.')
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
}

function safeStates(block) {
  return Object.fromEntries(Object.entries(block?.states || {})
    .filter(([key, value]) => !key.startsWith('__') && ['boolean', 'number', 'string'].includes(typeof value))
    .sort(([a], [b]) => a.localeCompare(b)))
}

function stateBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

/*
 * The native viewer parses Sponge/Java block-state keys. Bedrock stores the
 * same facts under different keys, so preserving the Bedrock compound without
 * translating it makes the renderer choose the wrong door half, log end face,
 * stair direction, slab half, etc. These correspondences come directly from
 * the block alias/state tables bundled with the downloaded original site.
 *
 * This conversion is used only by Java/Sponge/Litematica output. The internal
 * block array retains the original Bedrock states for lossless `.mcstructure`
 * export.
 */
export function rendererStates(block) {
  const source = safeStates(block)
  const output = { ...source }
  const name = safeName(block).replace(/^minecraft:/, '')
  const rawName = String(block?.sourceBlockName || '').replace(/^minecraft:/, '')
  const has = (key) => Object.prototype.hasOwnProperty.call(source, key)
  // Modern Bedrock palettes store cardinal connections under namespaced keys.
  // The native viewer expects the equivalent Java/Sponge side properties.
  for (const side of ['north', 'east', 'south', 'west']) {
    const key = `minecraft:connection_${side}`
    if (has(key) && !has(side)) output[side] = stateBoolean(source[key])
  }
  // The original viewer's wall model reads Java-style low/tall/none sides and
  // `up`. Bedrock records the same shape as short/tall/none plus wall_post_bit.
  if (name.endsWith('_wall')) {
    for (const side of ['north', 'east', 'south', 'west']) {
      const key = `wall_connection_type_${side}`
      if (has(key) && !has(side)) {
        output[side] = String(source[key]) === 'short' ? 'low' :
          String(source[key]) === 'tall' ? 'tall' : 'none'
      }
    }
    if (has('wall_post_bit') && !has('up')) output.up = stateBoolean(source.wall_post_bit)
  }

  if (block?.waterlogged === true && !has('waterlogged')) output.waterlogged = true

  if (has('pillar_axis') && !has('axis')) output.axis = String(source.pillar_axis)
  if (has('minecraft:cardinal_direction') && !has('facing')) {
    output.facing = String(source['minecraft:cardinal_direction'])
  }
  // Attachables (amethyst buds/clusters, wall-mounted vegetation and several
  // 1.21 blocks) use the namespaced Bedrock key `minecraft:block_face`.  The
  // vanilla blockstate catalog calls the same six directions `facing`; leaving
  // this key untranslated makes mcModelsForRun find no variant and the safety
  // cube hides the real model.
  if (has('minecraft:block_face') && !has('facing')) {
    output.facing = String(source['minecraft:block_face'])
  }

  if (!has('facing') && has('weirdo_direction')) {
    output.facing = ({ 3: 'north', 2: 'south', 1: 'west', 0: 'east' })[Number(source.weirdo_direction)] || 'north'
  } else if (!has('facing') && has('direction')) {
    const direction = Number(source.direction)
    const map = name.endsWith('_fence_gate')
      ? { 2: 'north', 0: 'south', 1: 'west', 3: 'east' }
      : name.endsWith('_door') && !name.endsWith('_trapdoor')
        ? { 3: 'north', 1: 'south', 2: 'west', 0: 'east' }
        : { 3: 'north', 2: 'south', 1: 'west', 0: 'east' }
    output.facing = map[direction] || 'north'
  }

  if (!has('facing') && has('facing_direction')) {
    output.facing = ({ 2: 'north', 3: 'south', 4: 'west', 5: 'east' })[Number(source.facing_direction)] || 'north'
  }
  if ((name.endsWith('_head') || name.endsWith('_skull')) && has('facing_direction')) {
    const direction = Number(source.facing_direction)
    output.face = direction === 1 ? 'floor' : direction === 0 ? 'ceiling' : 'wall'
    if (has('skull_rotation_degrees')) {
      // Java/Sponge encode standing-head yaw as 0..15 quarter-octants.
      output.rotation = Number(source.skull_rotation_degrees) / 22.5
    }
  }
  if (has('attachment') && !has('face')) {
    output.face = ({ standing: 'floor', hanging: 'ceiling', wall: 'wall' })[String(source.attachment)] || String(source.attachment)
  }
  if (name.endsWith('_button') && !has('face') && has('facing_direction')) {
    const direction = Number(source.facing_direction)
    output.face = direction === 1 ? 'floor' : direction === 0 ? 'ceiling' : 'wall'
  }

  if (has('open_bit') && !has('open')) output.open = stateBoolean(source.open_bit)
  if (has('in_wall_bit') && !has('in_wall')) output.in_wall = stateBoolean(source.in_wall_bit)
  if (has('attached_bit') && !has('attached')) output.attached = stateBoolean(source.attached_bit)
  if (has('disarmed_bit') && !has('disarmed')) output.disarmed = stateBoolean(source.disarmed_bit)
  if (has('powered_bit') && !has('powered')) output.powered = stateBoolean(source.powered_bit)
  if (has('occupied_bit') && !has('occupied')) output.occupied = stateBoolean(source.occupied_bit)
  if (has('door_hinge_bit') && !has('hinge')) output.hinge = stateBoolean(source.door_hinge_bit) ? 'right' : 'left'
  if (has('upper_block_bit') && !has('half')) output.half = stateBoolean(source.upper_block_bit) ? 'upper' : 'lower'
  if (has('upside_down_bit') && !has('half')) output.half = stateBoolean(source.upside_down_bit) ? 'top' : 'bottom'
  if (has('head_piece_bit') && !has('part')) output.part = stateBoolean(source.head_piece_bit) ? 'head' : 'foot'
  if (has('bite_counter') && !has('bites')) output.bites = Math.max(0, Math.min(6, Number(source.bite_counter) || 0))
  if (has('composter_fill_level') && !has('level')) output.level = Math.max(0, Math.min(8, Number(source.composter_fill_level) || 0))
  if (has('cracked_state') && !has('hatch')) {
    const hatch = ({ no_cracks: 0, cracked: 1, slightly_cracked: 1, very_cracked: 2 })[String(source.cracked_state)]
    output.hatch = hatch === undefined ? (Number(source.cracked_state) || 0) : hatch
  }
  if (has('turtle_egg_count') && !has('eggs')) {
    const eggs = ({ one_egg: 1, two_egg: 2, three_egg: 3, four_egg: 4 })[String(source.turtle_egg_count)]
    output.eggs = eggs === undefined ? (Number(source.turtle_egg_count) || 1) : eggs
  }
  if (has('structure_block_type') && !has('mode')) output.mode = String(source.structure_block_type)

  if (name.endsWith('_stairs')) {
    if (!output.half) output.half = 'bottom'
    if (!output.shape) output.shape = 'straight'
  }
  if (name.endsWith('_slab')) {
    const isDouble = /(?:^|_)double(?:_|$)/.test(name) || /(?:^|_)double(?:_|$)/.test(rawName)
    const vertical = source['minecraft:vertical_half'] ?? source.vertical_half
    output.type = isDouble ? 'double' : vertical
      ? String(vertical)
      : stateBoolean(source.top_slot_bit) ? 'top' : 'bottom'
  }

  if (has('ground_sign_direction') && !has('rotation')) output.rotation = String(source.ground_sign_direction)
  if (has('button_pressed_bit') && !has('powered')) output.powered = stateBoolean(source.button_pressed_bit)
  if (has('redstone_signal') && !has('powered')) output.powered = Number(source.redstone_signal) > 0
  if (has('persistent_bit') && !has('persistent')) output.persistent = stateBoolean(source.persistent_bit)
  /* Keep huge_mushroom_bits intact. The Guide 3D renderer understands the
     Bedrock variant directly; expanding value 15 into six Java face flags
     changes mushroom-stem appearance and made the Warden's white details beige. */
  if (has('age_bit')) {
    if (!has('stage')) output.stage = stateBoolean(source.age_bit) ? 1 : 0
    if (name === 'bamboo' && !has('age')) output.age = stateBoolean(source.age_bit) ? 1 : 0
  }
  if ((name === 'pink_petals' || name === 'wildflowers' || name === 'leaf_litter') && has('growth')) {
    const raw = source.growth
    const growth = raw === true || String(raw) === 'true' ? 1
      : raw === false || String(raw) === 'false' ? 0
        : Number(raw) || 0
    const amount = Math.max(1, Math.min(4, growth + 1))
    if (name === 'leaf_litter' && !has('segment_amount')) output.segment_amount = amount
    if (name !== 'leaf_litter' && !has('flower_amount')) output.flower_amount = amount
  }
  if (name === 'bamboo' && has('bamboo_leaf_size') && !has('leaves')) {
    output.leaves = ({
      no_leaves: 'none',
      small_leaves: 'small',
      large_leaves: 'large',
    })[String(source.bamboo_leaf_size)] || String(source.bamboo_leaf_size)
  }
  if (name === 'bamboo' && has('bamboo_stalk_thickness') && !has('stalk_thickness')) {
    // Bedrock uses this state independently from leaf size.  The vanilla
    // model is 2px wide for `thin` and 3px for `thick`; dropping the state
    // made every thick (age=1) bamboo stalk visibly too narrow.
    output.stalk_thickness = String(source.bamboo_stalk_thickness)
  }
  if (name === 'tall_seagrass' && has('sea_grass_type') && !has('half')) {
    output.half = String(source.sea_grass_type).includes('top') ? 'upper' : 'lower'
  }
  if (name === 'sea_pickle') {
    if (has('cluster_count') && !has('pickles')) {
      output.pickles = Math.max(1, Math.min(4, Number(source.cluster_count) + 1))
    }
    if (has('dead_bit') && !has('waterlogged')) output.waterlogged = !stateBoolean(source.dead_bit)
  }
  if (has('hanging_bit') && !has('hanging')) output.hanging = stateBoolean(source.hanging_bit)
  if (has('big_dripleaf_tilt') && !has('tilt')) output.tilt = String(source.big_dripleaf_tilt)
  if (!has('facing') && has('coral_direction')) {
    output.facing = ({ 0: 'west', 1: 'east', 2: 'north', 3: 'south' })[Number(source.coral_direction)] || 'north'
  }
  if (has('multi_face_direction_bits')) {
    // Exact bit order from the original site's bundled Java<->Bedrock table:
    // down=1, up=2, south=4, west=8, north=16, east=32.
    const bits = Number(source.multi_face_direction_bits) || 0
    if (!has('down')) output.down = Boolean(bits & 1)
    if (!has('up')) output.up = Boolean(bits & 2)
    if (!has('south')) output.south = Boolean(bits & 4)
    if (!has('west')) output.west = Boolean(bits & 8)
    if (!has('north')) output.north = Boolean(bits & 16)
    if (!has('east')) output.east = Boolean(bits & 32)
  }

  const railDirection = Number(source.rail_direction)
  if (has('rail_direction') && !has('shape')) {
    output.shape = ({
      0: 'north_south', 1: 'east_west', 2: 'ascending_east', 3: 'ascending_west',
      4: 'ascending_north', 5: 'ascending_south', 6: 'south_east', 7: 'south_west',
      8: 'north_west', 9: 'north_east',
    })[railDirection] || 'north_south'
  }

  // Prefer the maintained Java properties produced by @taku128/core. Raw
  // Bedrock states remain attached to the block for round-trip export; this
  // overlay only controls the Sponge/Java model selected by the viewer.
  if (block?.javaStates && typeof block.javaStates === 'object') {
    for (const [key, value] of Object.entries(block.javaStates)) {
      if (!Object.prototype.hasOwnProperty.call(output, key)
        && ['boolean', 'number', 'string'].includes(typeof value)) output[key] = value
    }
  }

  const knownBedrockKeys = [
    'pillar_axis', 'minecraft:cardinal_direction', 'minecraft:block_face', 'weirdo_direction', 'direction',
    'facing_direction', 'open_bit', 'in_wall_bit', 'attached_bit', 'disarmed_bit',
    'powered_bit', 'occupied_bit', 'head_piece_bit', 'bite_counter', 'composter_fill_level', 'door_hinge_bit',
    'upper_block_bit', 'upside_down_bit', 'minecraft:vertical_half', 'vertical_half',
    'top_slot_bit', 'ground_sign_direction', 'button_pressed_bit', 'redstone_signal',
    'persistent_bit', 'update_bit', 'age_bit', 'rail_direction', 'bamboo_leaf_size',
    'bamboo_stalk_thickness', 'sea_grass_type', 'cluster_count', 'dead_bit',
    'hanging_bit', 'big_dripleaf_tilt', 'coral_direction', 'multi_face_direction_bits',
    'attachment', 'cracked_state', 'turtle_egg_count', 'structure_block_type',
    'skull_rotation_degrees',
    'minecraft:connection_north', 'minecraft:connection_east',
    'minecraft:connection_south', 'minecraft:connection_west',
    'wall_connection_type_north', 'wall_connection_type_east',
    'wall_connection_type_south', 'wall_connection_type_west', 'wall_post_bit',
  ]
  for (const key of knownBedrockKeys) delete output[key]

  // NBT TAG_Byte commonly reaches JavaScript as 0/1 even when the semantic
  // property is boolean. Sponge block-state strings and vanilla model variants
  // use false/true; leaving 0/1 here prevents an exact variant match and used
  // to turn tripwire, candles, scaffolding, sensors and rods into fallback
  // cubes. Restrict conversion to known boolean state names so numeric ages,
  // levels, layer counts and candle counts remain numeric.
  const booleanStateKeys = new Set([
    'powered', 'lit', 'open', 'in_wall', 'attached', 'disarmed', 'occupied',
    'triggered', 'inverted', 'extended', 'locked', 'bloom', 'can_summon',
    'bottom', 'waterlogged', 'ominous', 'eye', 'crafting', 'map', 'short',
    'tip', 'snowy', 'persistent', 'hanging', 'berries',
    'east', 'west', 'north', 'south', 'up', 'down',
  ])
  for (const [key, value] of Object.entries(output)) {
    // Wall arms are three-valued (none/low/tall), unlike boolean fence arms.
    // Converting "low" and "tall" with stateBoolean made every wall a post.
    if (name.endsWith('_wall') && ['east', 'west', 'north', 'south'].includes(key)) continue
    if (booleanStateKeys.has(key) || /^slot_\d+_occupied$/.test(key)) {
      output[key] = stateBoolean(value)
    }
  }
  return Object.fromEntries(Object.entries(output).sort(([a], [b]) => a.localeCompare(b)))
}

function safeName(block) {
  // `sourceBlockName` is the raw Bedrock palette identifier (for example
  // `minecraft:planks` + a wood_type state).  The native BuildIt renderer
  // resolves its complete VANILLA_MODELS/BLOCK_MODELS table by the canonical
  // name produced by structureData (`minecraft:oak_planks`, etc.).  Feeding
  // the raw alias here bypasses those entries and makes the renderer fall
  // through to a wrong/blank texture.  Always prefer the canonical name and
  // retain the raw name only as a last-resort diagnostic fallback.
  const value = String(block?.blockName || block?.sourceBlockName || 'minecraft:unknown_parsing_error')
  return value.includes(':') ? value : `minecraft:${value}`
}

function safeSourceName(block) {
  const value = String(block?.sourceBlockName || block?.blockName || 'minecraft:unknown_parsing_error')
  return value.includes(':') ? value : `minecraft:${value}`
}

function finiteBlocks(blocks) {
  return (Array.isArray(blocks) ? blocks : []).filter((block) => {
    if (!block || AIR.has(safeName(block))) return false
    return [block.x, block.y, block.z].every((value) => Number.isFinite(Number(value)))
  }).map((block) => ({
    ...block,
    x: Math.trunc(Number(block.x)), y: Math.trunc(Number(block.y)), z: Math.trunc(Number(block.z)),
    layer: Number.isInteger(block.layer) && block.layer >= 0 ? block.layer : 0,
    blockName: safeName(block), sourceBlockName: safeSourceName(block), states: safeStates(block),
  }))
}

function isFluidBlock(block) {
  return /^minecraft:(?:flowing_)?(?:water|lava)$/.test(safeName(block))
    || safeName(block) === 'minecraft:bubble_column'
}

/* Sponge, Litematica and Java Structure store one block state per coordinate,
   while Bedrock mcstructure can store a solid/plant in layer 0 and its fluid
   in layer 1.  Preserve the visible block and carry waterlogged on it; retain
   a layer-1 fluid only when that coordinate has no primary block. */
function singleLayerBlocks(blocks) {
  const selected = new Map()
  for (const block of finiteBlocks(blocks)) {
    const key = `${block.x},${block.y},${block.z}`
    const current = selected.get(key)
    if (!current) { selected.set(key, block); continue }
    const currentFluid = isFluidBlock(current)
    const incomingFluid = isFluidBlock(block)
    if (currentFluid && !incomingFluid) selected.set(key, block)
    else if (currentFluid === incomingFluid && Number(block.layer) < Number(current.layer)) selected.set(key, block)
  }
  return Array.from(selected.values())
}

/* Public, side-effect-free diagnostics for the Bedrock -> one-cell bridge.
   The viewer consumes Sponge .schem, which can store only one block state at a
   coordinate.  Bedrock may keep a solid/plant in layer 0 and fluid in layer 1.
   Reporting that collapse lets the shell explain the conversion instead of
   making six water cells, for example, appear to have vanished silently. */
export function conversionDiagnostics(blocks) {
  const clean = finiteBlocks(blocks)
  const selected = singleLayerBlocks(clean)
  const coordinates = new Map()
  let secondaryLayerBlocks = 0
  let fluidBlocks = 0
  let parsingErrors = 0
  for (const block of clean) {
    const key = `${block.x},${block.y},${block.z}`
    coordinates.set(key, (coordinates.get(key) || 0) + 1)
    if (Number(block.layer) > 0) secondaryLayerBlocks += 1
    if (isFluidBlock(block)) fluidBlocks += 1
    if (safeName(block) === 'minecraft:unknown_parsing_error') parsingErrors += 1
  }
  const overlappingCoordinates = Array.from(coordinates.values()).filter((count) => count > 1).length
  return {
    extractedBlocks: clean.length,
    visibleCoordinates: selected.length,
    collapsedBlocks: Math.max(0, clean.length - selected.length),
    overlappingCoordinates,
    secondaryLayerBlocks,
    fluidBlocks,
    parsingErrors,
    oneCellFormatIsLossless: clean.length === selected.length,
  }
}

function bounds(blocks) {
  const clean = finiteBlocks(blocks)
  if (!clean.length) throw new Error('A estrutura não contém blocos visíveis.')
  const minX = Math.min(...clean.map((b) => b.x)); const maxX = Math.max(...clean.map((b) => b.x))
  const minY = Math.min(...clean.map((b) => b.y)); const maxY = Math.max(...clean.map((b) => b.y))
  const minZ = Math.min(...clean.map((b) => b.z)); const maxZ = Math.max(...clean.map((b) => b.z))
  const size = [maxX - minX + 1, maxY - minY + 1, maxZ - minZ + 1]
  const volume = size[0] * size[1] * size[2]
  if (!size.every((n) => Number.isSafeInteger(n) && n > 0) || volume > MAX_CELLS) {
    throw new Error('A estrutura excede o limite de 16.777.216 posições.')
  }
  return { clean, minX, minY, minZ, size, volume }
}

// --------------------------- Litematica reader --------------------------
function longAt(values, index) {
  const raw = values[index]
  try {
    let value = BigInt(raw ?? 0)
    if (value < 0n) value += 1n << 64n
    return value
  } catch { return 0n }
}

function packedIndex(values, bitOffset, bits) {
  const longIndex = Math.floor(bitOffset / 64); const shift = bitOffset % 64
  let value = longAt(values, longIndex) >> BigInt(shift)
  if (shift + bits > 64) value |= longAt(values, longIndex + 1) << BigInt(64 - shift)
  return Number(value & ((1n << BigInt(bits)) - 1n))
}

function regionPalette(region) {
  const palette = region?.BlockStatePalette || region?.block_state_palette || region?.Palette
  const entries = Array.isArray(palette) || ArrayBuffer.isView(palette)
    ? arrayOf(palette)
    : palette && typeof palette === 'object'
      ? Object.keys(palette)
        .filter((key) => /^\d+$/.test(key))
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => palette[key])
      : []
  return entries.map((entry) => {
    const name = String(entry?.Name || entry?.name || 'minecraft:unknown_parsing_error')
    const states = entry?.Properties || entry?.properties || entry?.states || {}
    return { name: name.includes(':') ? name : `minecraft:${name}`, states }
  })
}

function parseLitematicRoot(root) {
  const regions = root?.Regions || root?.regions
  if (!regions || typeof regions !== 'object') throw new Error('Litematic inválido: Regions ausente.')
  const output = []
  for (const [regionName, region] of Object.entries(regions)) {
    const rawSize = arrayOf(region?.Size || region?.size).map(asNumber)
    const rawPosition = arrayOf(region?.Position || region?.position).map(asNumber)
    if (rawSize.length < 3) continue
    const sx = Math.abs(rawSize[0]); const sy = Math.abs(rawSize[1]); const sz = Math.abs(rawSize[2])
    const volume = sx * sy * sz
    if (!Number.isSafeInteger(volume) || volume <= 0 || volume > MAX_CELLS) continue
    const palette = regionPalette(region)
    if (!palette.length) continue
    const packed = arrayOf(region?.BlockStates || region?.block_states)
    const bits = Math.max(2, Math.ceil(Math.log2(Math.max(2, palette.length))))
    const px = rawPosition[0] || 0; const py = rawPosition[1] || 0; const pz = rawPosition[2] || 0
    for (let y = 0; y < sy; y += 1) for (let z = 0; z < sz; z += 1) for (let x = 0; x < sx; x += 1) {
      const linear = x + sx * (z + sz * y)
      const paletteIndex = packed.length ? packedIndex(packed, linear * bits, bits) : 0
      const entry = palette[paletteIndex] || { name: 'minecraft:unknown_parsing_error', states: {} }
      if (!AIR.has(entry.name)) output.push({
        x: px + x, y: py + y, z: pz + z, layer: 0,
        blockName: entry.name, sourceBlockName: entry.name, states: entry.states, region: regionName,
      })
    }
  }
  if (!output.length) throw new Error('O Litematic não contém blocos visíveis ou sua paleta está vazia.')
  console.log('[litematic] regiões absorvidas:', { regions: Object.keys(regions).length, blocks: output.length })
  return output
}

async function parseLitematicFile(file) {
  const bytes = await inflate(new Uint8Array(await file.arrayBuffer()))
  let root
  try { root = parseBigEndianNbt(bytes) } catch (bigError) {
    try { root = parseLittleEndianNbt(prepareMcstructureBuffer(bytes)) } catch { throw bigError }
  }
  return parseLitematicRoot(root)
}

async function parseBedrockFile(file) {
  const bytes = await inflate(new Uint8Array(await file.arrayBuffer()))
  const root = parseLittleEndianNbt(prepareMcstructureBuffer(bytes))
  return extractBlocks(root)
}

function parseJavaStructureRoot(root) {
  const size = arrayOf(root?.size || root?.Size).map(asNumber)
  const palette = arrayOf(root?.palette || root?.Palette)
  const placed = arrayOf(root?.blocks || root?.Blocks)
  if (size.length < 3 || !palette.length || !placed.length) {
    throw new Error('NBT Java inválido: size, palette ou blocks ausente.')
  }
  const output = []
  for (const entry of placed) {
    const position = arrayOf(entry?.pos || entry?.Pos).map(asNumber)
    if (position.length < 3) continue
    const paletteIndex = asNumber(entry?.state ?? entry?.State, -1)
    const material = palette[paletteIndex]
    const rawName = String(material?.Name || material?.name || 'minecraft:unknown_parsing_error')
    const name = rawName.includes(':') ? rawName : `minecraft:${rawName}`
    if (AIR.has(name)) continue
    output.push({
      x: position[0], y: position[1], z: position[2], layer: 0,
      blockName: name, sourceBlockName: name,
      states: material?.Properties || material?.properties || material?.states || {},
      blockEntityData: entry?.nbt || entry?.NBT || undefined,
    })
  }
  if (!output.length) throw new Error('O NBT Java não contém blocos visíveis.')
  console.log('[NBT Java] estrutura absorvida:', { size, palette: palette.length, blocks: output.length })
  return output
}

function extractRecognizedNbt(root) {
  if (root?.structure?.block_indices && root?.size) return extractBlocks(root)
  if ((root?.palette || root?.Palette) && (root?.blocks || root?.Blocks) && (root?.size || root?.Size)) {
    return parseJavaStructureRoot(root)
  }
  if (root?.Schematic || root?.BlockData || (root?.Width && root?.Height && root?.Length)) {
    return extractSpongeSchematic(root)
  }
  return null
}

async function parseGenericNbtFile(file) {
  const bytes = await inflate(new Uint8Array(await file.arrayBuffer()))
  let bigError
  try {
    const parsed = extractRecognizedNbt(parseBigEndianNbt(bytes))
    if (parsed) return parsed
  } catch (error) { bigError = error }
  try {
    const parsed = extractRecognizedNbt(parseLittleEndianNbt(prepareMcstructureBuffer(bytes)))
    if (parsed) return parsed
  } catch (littleError) {
    throw bigError || littleError
  }
  throw new Error('NBT reconhecido, mas não contém uma estrutura Java, Sponge ou Bedrock compatível.')
}

// A .bp is used by more than one Bedrock editor. Prefer the normal Bedrock
// structure shape, then accept a Sponge payload; unknown blueprints fail with
// a clear message instead of silently producing an empty scene.
async function parseBlueprintFile(file) {
  const rawBytes = new Uint8Array(await file.arrayBuffer())
  // Some editors label a ZIP based blueprint as `.bp`; route it through the
  // same archive reader before attempting NBT decoding.
  if (rawBytes[0] === 0x50 && rawBytes[1] === 0x4b) {
    return parseZipFile(new File([rawBytes], `${baseName(file.name)}.zip`, { type: 'application/zip' }))
  }
  const bytes = await inflate(rawBytes)
  let root
  try { root = parseLittleEndianNbt(prepareMcstructureBuffer(bytes)) } catch (littleError) {
    try { root = parseBigEndianNbt(bytes) } catch { throw littleError }
  }
  if (root?.structure?.block_indices && root?.size) return extractBlocks(root)
  if (root?.Schematic || root?.Palette || root?.BlockData) return extractSpongeSchematic(root)
  throw new Error('Formato .bp não identificado. Este arquivo não contém uma estrutura Bedrock/Sponge reconhecível.')
}

async function parseZipFile(file) {
  const JSZip = globalThis.JSZip
  if (!JSZip) throw new Error('O conversor ZIP não foi carregado. Recarregue a página e tente novamente.')
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const entries = Object.values(zip.files).filter((entry) => !entry.dir && SUPPORTED.has(extension(entry.name)) && extension(entry.name) !== 'zip' && extension(entry.name) !== 'mcstructurezip')
  if (!entries.length) throw new Error('O ZIP não contém .schem, .mcstructure, .litematic, .nbt, .schematic ou .bp.')
  if (entries.length > 1) console.warn('[Formato] ZIP com várias estruturas; usando a primeira entrada:', entries.map((entry) => entry.name))
  const entry = entries[0]
  const blob = await entry.async('blob')
  return parseAnyFile(new File([blob], entry.name, { type: 'application/octet-stream' }))
}

async function parseAnyFile(file) {
  const ext = extension(file.name)
  if (ext === 'zip' || ext === 'mcstructurezip') return parseZipFile(file)
  if (ext === 'litematic') return parseLitematicFile(file)
  if (ext === 'bp') return parseBlueprintFile(file)
  if (ext === 'mcstructure') return parseBedrockFile(file)
  if (ext === 'nbt') return parseGenericNbtFile(file)
  // parseSchematicFile already handles Sponge, legacy MCEdit, Java structure
  // NBT and Bedrock little-endian NBT (including compressed variants).
  return parseSchematicFile(file)
}

// ----------------------------- Sponge writer -----------------------------
const TAG = { end: 0, byte: 1, short: 2, int: 3, long: 4, float: 5, double: 6, byteArray: 7, string: 8, list: 9, compound: 10, intArray: 11, longArray: 12 }

class BigWriter {
  constructor() { this.bytes = []; this.encoder = new TextEncoder() }
  byte(value) { this.bytes.push(Number(value) & 0xff) }
  short(value) { const n = Math.trunc(Number(value)); this.byte(n >> 8); this.byte(n) }
  int(value) { const n = Math.trunc(Number(value)); this.byte(n >> 24); this.byte(n >> 16); this.byte(n >> 8); this.byte(n) }
  long(value) { let n; try { n = BigInt(value) } catch { n = 0n }; if (n < 0n) n += 1n << 64n; for (let i = 7; i >= 0; i -= 1) this.byte(Number((n >> BigInt(i * 8)) & 255n)) }
  float(value) { const b = new ArrayBuffer(4); new DataView(b).setFloat32(0, Number(value) || 0, false); for (const n of new Uint8Array(b)) this.byte(n) }
  double(value) { const b = new ArrayBuffer(8); new DataView(b).setFloat64(0, Number(value) || 0, false); for (const n of new Uint8Array(b)) this.byte(n) }
  string(value) { const b = this.encoder.encode(String(value ?? '')); if (b.length > 65535) throw new Error('String NBT excede 65.535 bytes.'); this.short(b.length); for (const n of b) this.byte(n) }
  header(type, name) { this.byte(type); this.string(name) }
  named(type, name, value) { this.header(type, name); this.payload(type, value) }
  payload(type, value) {
    if (type === TAG.byte) this.byte(value); else if (type === TAG.short) this.short(value); else if (type === TAG.int) this.int(value); else if (type === TAG.long) this.long(value); else if (type === TAG.float) this.float(value); else if (type === TAG.double) this.double(value); else if (type === TAG.string) this.string(value)
    else if (type === TAG.byteArray) { const a = arrayOf(value); this.int(a.length); for (const n of a) this.byte(n) }
    else if (type === TAG.intArray) { const a = arrayOf(value); this.int(a.length); for (const n of a) this.int(n) }
    else if (type === TAG.longArray) { const a = arrayOf(value); this.int(a.length); for (const n of a) this.long(n) }
  }
  compoundPayload(write) { write(); this.byte(TAG.end) }
  namedCompound(name, write) { this.header(TAG.compound, name); this.compoundPayload(write) }
  namedList(name, type, values, write) { this.header(TAG.list, name); this.byte(type); this.int(values.length); for (const value of values) write(value) }
  finish() { return new Uint8Array(this.bytes) }
}

const FENCE_SIDES = [
  ['north', 0, -1], ['east', 1, 0],
  ['south', 0, 1], ['west', -1, 0],
]
const FENCE_SOLID_SUFFIX = /(?:_planks|_log|_wood|_stem|_hyphae|_bricks?|_tiles?|_concrete|_terracotta|_wool|_basalt|_quartz|_deepslate|_stone|_dirt|_block)$/
const FENCE_SOLID_NAMES = new Set(['stone', 'cobblestone', 'andesite', 'diorite', 'granite', 'netherrack', 'obsidian', 'bedrock', 'sandstone', 'red_sandstone', 'basalt', 'smooth_quartz'])

function fenceNeighborConnects(fence, neighbor, side) {
  if (!neighbor) return false
  const source = safeName(fence).replace(/^minecraft:/, '')
  const name = safeName(neighbor).replace(/^minecraft:/, '')
  const sourceIsWall = source.endsWith('_wall')
  if (name.endsWith('_wall')) return sourceIsWall
  if (name.endsWith('_fence') && !name.endsWith('_fence_gate')) {
    // Nether-brick fences are a separate connection family from wood.
    return !sourceIsWall && (source === 'nether_brick_fence') === (name === 'nether_brick_fence')
  }
  if (name.endsWith('_fence_gate')) {
    const facing = rendererStates(neighbor).facing || 'south'
    return facing === 'north' || facing === 'south'
      ? side === 'east' || side === 'west'
      : side === 'north' || side === 'south'
  }
  // Full solid neighbors can anchor a fence. Thin blocks, plants, leaves,
  // slabs and stairs do not generate an invented arm.
  return FENCE_SOLID_SUFFIX.test(name) || FENCE_SOLID_NAMES.has(name)
}

// Infer only absent fence/wall sides from final neighboring cells, once at
// import time. Explicit Bedrock or Sponge values always win over inference.
export function resolveFenceConnections(blocks) {
  const cells = new Map(blocks.map(block => [`${block.x},${block.y},${block.z}`, block]))
  return blocks.map(block => {
    const states = rendererStates(block)
    const isWall = safeName(block).endsWith('_wall')
    if (!isWall && !safeName(block).endsWith('_fence')) return { ...block, states }
    for (const [side, dx, dz] of FENCE_SIDES) {
      if (Object.prototype.hasOwnProperty.call(states, side)) continue
      const neighbor = cells.get(`${block.x + dx},${block.y},${block.z + dz}`)
      const connected = fenceNeighborConnects(block, neighbor, side)
      states[side] = isWall ? (connected ? 'low' : 'none') : connected
    }
    if (isWall && !Object.prototype.hasOwnProperty.call(states, 'up')) {
      const connected = side => states[side] === 'low' || states[side] === 'tall' || states[side] === 'true' || states[side] === true
      const straight = (connected('north') && connected('south') && !connected('east') && !connected('west')) ||
        (connected('east') && connected('west') && !connected('north') && !connected('south'))
      states.up = !straight
    }
    return { ...block, states }
  })
}

function paletteData(clean, javaStates = false) {
  // Dense formats initialize every cell with zero. Reserve palette index zero
  // for air or every empty coordinate becomes a copy of the first real block.
  const palette = [{ name: 'minecraft:air', states: {} }]
  const byKey = new Map([['minecraft:air\u0000{}', 0]])
  const indices = []
  for (const block of javaStates ? resolveFenceConnections(clean) : clean) {
    const name = safeName(block); const states = safeStates(block); const key = `${name}\u0000${JSON.stringify(states)}`
    let index = byKey.get(key)
    if (index === undefined) { index = palette.length; byKey.set(key, index); palette.push({ name, states }) }
    indices.push({ block, index })
  }
  return { palette, indices }
}

function writeCompoundEntry(writer, entry, includeStates = true) {
  writer.named(TAG.string, 'Name', entry.name)
  if (includeStates) writer.namedCompound('Properties', () => { for (const [key, value] of Object.entries(entry.states || {})) writer.named(TAG.string, key, String(value)) })
}

function spongePaletteName(entry) {
  const states = Object.entries(entry?.states || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value).toLowerCase()}`)
  return states.length ? `${entry.name}[${states.join(',')}]` : entry.name
}

function varInts(values) {
  const bytes = []
  for (const input of values) { let value = input >>> 0; do { let part = value & 127; value >>>= 7; if (value) part |= 128; bytes.push(part) } while (value) }
  return bytes
}

export function createSpongeSchemBytes(blocks, title = 'Guizz') {
  const merged = singleLayerBlocks(blocks)
  const { clean, minX, minY, minZ, size } = bounds(merged); const { palette, indices } = paletteData(clean, true)
  const volume = size[0] * size[1] * size[2]; const flat = new Uint32Array(volume)
  for (const { block, index } of indices) { const x = block.x - minX; const y = block.y - minY; const z = block.z - minZ; flat[(y * size[2] + z) * size[0] + x] = index }
  const writer = new BigWriter(); writer.byte(TAG.compound); writer.string('')
  writer.named(TAG.int, 'Version', 2); writer.named(TAG.int, 'DataVersion', 3953); writer.named(TAG.short, 'Width', size[0]); writer.named(TAG.short, 'Height', size[1]); writer.named(TAG.short, 'Length', size[2])
  writer.namedCompound('Palette', () => { palette.forEach((entry, index) => writer.named(TAG.int, spongePaletteName(entry), index)) })
  writer.named(TAG.byteArray, 'BlockData', varInts(flat)); writer.namedCompound('Metadata', () => writer.named(TAG.string, 'Name', title)); writer.byte(TAG.end)
  return gzip(writer.finish())
}

export function createJavaStructureBytes(blocks, title = 'Guizz') {
  const merged = singleLayerBlocks(blocks)
  const { clean, minX, minY, minZ, size } = bounds(merged); const { palette, indices } = paletteData(clean, true); const byPosition = new Map(indices.map(({ block, index }) => [`${block.x},${block.y},${block.z}`, index]))
  const writer = new BigWriter(); writer.byte(TAG.compound); writer.string('')
  writer.namedList('size', TAG.int, size, (n) => writer.int(n))
  writer.namedList('palette', TAG.compound, palette, (entry) => { writeCompoundEntry(writer, entry); writer.byte(TAG.end) })
  const placed = []
  for (let y = 0; y < size[1]; y += 1) for (let z = 0; z < size[2]; z += 1) for (let x = 0; x < size[0]; x += 1) { const index = byPosition.get(`${x + minX},${y + minY},${z + minZ}`); if (index !== undefined) placed.push({ pos: [x, y, z], state: index }) }
  writer.namedList('blocks', TAG.compound, placed, (entry) => { writer.namedList('pos', TAG.int, entry.pos, (n) => writer.int(n)); writer.named(TAG.int, 'state', entry.state); writer.byte(TAG.end) })
  writer.namedList('entities', TAG.compound, [], () => {}); writer.byte(TAG.end); return gzip(writer.finish())
}

export function createLegacySchematicBytes(blocks, title = 'Guizz') {
  const merged = singleLayerBlocks(blocks)
  const { clean, minX, minY, minZ, size } = bounds(merged); const volume = size[0] * size[1] * size[2]; const blockIds = new Uint8Array(volume); const data = new Uint8Array(volume)
  const ids = { air: 0, stone: 1, grass_block: 2, dirt: 3, cobblestone: 4, oak_planks: 5, planks: 5, bedrock: 7, water: 9, lava: 11, sand: 12, gravel: 13, oak_log: 17, leaves: 18, glass: 20, sandstone: 24, wool: 35, bricks: 45, tnt: 46, bookshelf: 47, obsidian: 49, torch: 50, chest: 54, diamond_block: 57, crafting_table: 58, furnace: 61, snow: 78, ice: 79, netherrack: 87, soul_sand: 88, glowstone: 89, stone_bricks: 98, iron_bars: 101, glass_pane: 102 }
  const warned = new Set(); for (const block of clean) { const x = block.x - minX; const y = block.y - minY; const z = block.z - minZ; const index = (y * size[2] + z) * size[0] + x; const shortName = safeName(block).replace('minecraft:', ''); const id = ids[shortName] ?? ids[shortName.replace(/_(stairs|slab|wall|fence|button|pressure_plate)$/, '')] ?? 1; if (ids[shortName] === undefined && !warned.has(shortName)) { warned.add(shortName); console.warn('[Formato] bloco legado aproximado no .schematic:', safeName(block)) }; blockIds[index] = id }
  const writer = new BigWriter(); writer.byte(TAG.compound); writer.string(''); writer.named(TAG.short, 'Width', size[0]); writer.named(TAG.short, 'Height', size[1]); writer.named(TAG.short, 'Length', size[2]); writer.named(TAG.string, 'Materials', 'Alpha'); writer.named(TAG.byteArray, 'Blocks', blockIds); writer.named(TAG.byteArray, 'Data', data); writer.namedList('Entities', TAG.compound, [], () => {}); writer.namedList('TileEntities', TAG.compound, [], () => {}); writer.namedCompound('Metadata', () => writer.named(TAG.string, 'Name', title)); writer.byte(TAG.end); return gzip(writer.finish())
}

function writeLitematicLongs(values, bits) {
  const count = Math.ceil((values.length * bits) / 64); const longs = Array.from({ length: count }, () => 0n)
  values.forEach((value, i) => { const offset = i * bits; const at = Math.floor(offset / 64); const shift = offset % 64; longs[at] |= BigInt(value) << BigInt(shift); if (shift + bits > 64) longs[at + 1] |= BigInt(value) >> BigInt(64 - shift) })
  return longs.map((value) => value >= (1n << 63n) ? value - (1n << 64n) : value)
}

export function createLitematicBytes(blocks, title = 'Guizz') {
  const merged = singleLayerBlocks(blocks)
  const { clean, minX, minY, minZ, size } = bounds(merged); const { palette, indices } = paletteData(clean, true); const volume = size[0] * size[1] * size[2]; const flat = new Uint32Array(volume)
  for (const { block, index } of indices) flat[(block.x - minX) + size[0] * ((block.z - minZ) + size[2] * (block.y - minY))] = index
  const bits = Math.max(2, Math.ceil(Math.log2(Math.max(2, palette.length)))); const writer = new BigWriter(); writer.byte(TAG.compound); writer.string('')
  writer.namedCompound('Metadata', () => { writer.named(TAG.string, 'Name', title); writer.named(TAG.int, 'Version', 6); writer.named(TAG.int, 'MinecraftDataVersion', 3465); writer.named(TAG.long, 'TimeCreated', Date.now()); writer.named(TAG.long, 'TimeModified', Date.now()) })
  writer.namedCompound('Regions', () => writer.namedCompound('Guizz', () => { writer.named(TAG.intArray, 'Position', [0, 0, 0]); writer.named(TAG.intArray, 'Size', size); writer.namedList('BlockStatePalette', TAG.compound, palette, (entry) => { writeCompoundEntry(writer, entry); writer.byte(TAG.end) }); writer.named(TAG.longArray, 'BlockStates', writeLitematicLongs(Array.from(flat), bits)); writer.named(TAG.int, 'PendingBlockTicks', 0); writer.named(TAG.int, 'PendingFluidTicks', 0); writer.namedList('TileEntities', TAG.compound, [], () => {}) }))
  writer.byte(TAG.end); return gzip(writer.finish())
}

export function exportFormatBytes(blocks, format, title = 'Guizz') {
  if (format === 'mcstructure') return createMcstructureBytes(blocks)
  if (format === 'litematic') return createLitematicBytes(blocks, title)
  if (format === 'nbt') return createJavaStructureBytes(blocks, title)
  if (format === 'schematic') return createLegacySchematicBytes(blocks, title)
  return createSpongeSchemBytes(blocks, title)
}

export async function convertFileToSchem(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('Selecione um arquivo para converter.')
  const sourceFormat = extension(file.name)
  if (!SUPPORTED.has(sourceFormat)) throw new Error('Formato não suportado. Use .schem, .schematic, .mcstructure, .litematic, .nbt, .bp ou .zip.')
  const parsedBlocks = await parseAnyFile(file)
  const blocks = finiteBlocks(parsedBlocks)
  const diagnostics = conversionDiagnostics(blocks)
  // Audit the hand-off to the native engine.  This makes it obvious when a
  // Bedrock legacy alias was canonicalized (the renderer must receive the
  // canonical ID, while states remain attached for model selection).
  const resolutionAudit = new Map()
  for (const block of Array.isArray(parsedBlocks) ? parsedBlocks : []) {
    const source = String(block?.sourceBlockName || block?.blockName || 'minecraft:unknown_parsing_error')
    const resolved = safeName(block)
    const key = `${source} -> ${resolved}`
    resolutionAudit.set(key, (resolutionAudit.get(key) || 0) + 1)
  }
  console.info('[Conversor Guizz] nomes enviados ao motor nativo:',
    Array.from(resolutionAudit, ([mapping, count]) => ({ mapping, count })).slice(0, 200))
  const bytes = createSpongeSchemBytes(blocks, baseName(file.name))
  const converted = new File([bytes], `${baseName(file.name)}.schem`, { type: 'application/octet-stream' })
  console.log('[Conversor Guizz] conversão concluída:', {
    origem: file.name,
    formato: sourceFormat,
    blocos: blocks.length,
    destino: converted.name,
    bytes: bytes.length,
    diagnostics,
  })
  if (!diagnostics.oneCellFormatIsLossless) {
    console.warn('[Conversor Guizz] camadas sobrepostas adaptadas ao formato Sponge de uma célula:', diagnostics)
  }
  return { file: converted, blocks, bytes, sourceFormat, sourceName: file.name, diagnostics }
}

export function downloadExport(blocks, format, title = 'guizz-estrutura') {
  const safeFormat = ['schem', 'mcstructure', 'litematic', 'nbt', 'schematic'].includes(format) ? format : 'schem'
  const bytes = exportFormatBytes(blocks, safeFormat, title); const blob = new Blob([bytes], { type: 'application/octet-stream' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${baseName(title)}.${safeFormat}`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); return bytes.length
}
