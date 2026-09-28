import { normalizeBedrockStates, normalizeBlockId, resolveBlockName } from './blockStates.js'
import { mapBlock as mapUpstreamBlock } from '../vendor/taku128-core-map.mjs'

const IGNORED_BLOCKS = new Set(['minecraft:air', 'minecraft:cave_air', 'minecraft:void_air', 'minecraft:structure_void'])
const MAX_CELLS = 16_777_216
const isList = (value) => Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView))

// @taku128/core carries a maintained Bedrock -> Java state table. Use its
// canonical name/properties when it can translate the entry, while retaining
// our raw Bedrock name/states for lossless .mcstructure export and all layers.
// The upstream mcstructure wrapper itself only reads layer 0, so only its
// mapping engine is used here; extraction remains the lossless Guizz parser.
function upstreamMapping(sourceBlockName, states) {
  try {
    const mapped = mapUpstreamBlock(sourceBlockName, states)
    const name = normalizeBlockId(mapped?.name)
    if (!mapped || name === 'minecraft:air' || name === 'minecraft:unknown_parsing_error') return null
    const javaStates = mapped.properties && typeof mapped.properties === 'object'
      ? Object.fromEntries(Object.entries(mapped.properties)
        .filter(([, value]) => ['boolean', 'number', 'string'].includes(typeof value)))
      : {}
    return { blockName: name, javaStates }
  } catch (error) {
    console.warn('[Conversor Guizz] mapeamento externo falhou; usando compatibilidade interna.', {
      sourceBlockName,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

// Bedrock's legacy palette uses one generic ID for several block-entity
// variants.  The actual visual identity lives in block_position_data.  Keep
// this table beside the parser so the conversion layer and the renderer see
// the same canonical names instead of painting every banner/bed white.
const DYE_NAMES = [
  'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
  'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black',
]

function entityVariantName(sourceBlockName, blockEntityData) {
  if (!blockEntityData || typeof blockEntityData !== 'object') return null
  const source = normalizeBlockId(sourceBlockName)
  // Some exporters write the legacy short entity id (`FlowerPot`) while
  // newer tools may include a namespace (`minecraft:flower_pot`).  Compare
  // the canonical suffix so both forms use the same variant resolver.
  const id = String(blockEntityData.id || '').toLowerCase().replace(/^.*:/, '')

  if (id === 'flowerpot' || id === 'flower_pot') {
    const plant = blockEntityData.PlantBlock
    if (!plant || typeof plant !== 'object' || !plant.name) return 'minecraft:flower_pot'
    const plantName = resolveBlockName(
      normalizeBlockId(plant.name),
      plant.states && typeof plant.states === 'object' ? plant.states : {},
    ).replace(/^minecraft:/, '')
    // The Java/vanilla model catalog uses potted_<canonical plant>.  If a
    // future Bedrock plant has no dedicated potted model it still remains a
    // visible pot/cross candidate instead of disappearing as a wrong cube.
    return `minecraft:potted_${plantName}`
  }

  if (id === 'banner' || id === 'standingbanner' || id === 'wallbanner') {
    const base = Number(blockEntityData.Base)
    const dye = Number.isInteger(base) && base >= 0 && base < DYE_NAMES.length ? DYE_NAMES[base] : null
    if (!dye) return null
    const wall = source.endsWith('wall_banner') || id === 'wallbanner'
    return `minecraft:${dye}_${wall ? 'wall_banner' : 'banner'}`
  }

  if (id === 'bed') {
    const color = Number(blockEntityData.color)
    const dye = Number.isInteger(color) && color >= 0 && color < DYE_NAMES.length ? DYE_NAMES[color] : null
    if (dye) return `minecraft:${dye}_bed`
  }
  return null
}

export function extractBlocks(root) {
  if (!root || !isList(root.size) || root.size.length !== 3) {
    throw new Error('Arquivo .mcstructure inválido: as três dimensões da estrutura estão ausentes.')
  }
  const [sizeX, sizeY, sizeZ] = root.size
  if (![sizeX, sizeY, sizeZ].every((size) => Number.isSafeInteger(size) && size > 0)) {
    throw new Error('Arquivo .mcstructure inválido: as dimensões devem ser inteiros positivos.')
  }
  const volume = sizeX * sizeY * sizeZ
  if (!Number.isSafeInteger(volume) || volume > MAX_CELLS) {
    throw new Error('A estrutura excede o limite de 16.777.216 posições. Exporte uma região menor.')
  }
  const palette = root.structure?.palette?.default?.block_palette
  const blockPositionData = root.structure?.palette?.default?.block_position_data
  const layers = root.structure?.block_indices
  if (!Array.isArray(palette) || !palette.length || !Array.isArray(layers) || !layers.length) {
    throw new Error('Arquivo .mcstructure inválido: a paleta ou as camadas de índices estão ausentes.')
  }
  for (const [layerIndex, layer] of layers.entries()) {
    if (!isList(layer)) {
      throw new Error(`A camada ${layerIndex} de block_indices não é uma lista de índices.`)
    }
    if (layer.length !== volume) {
      console.warn('[mcstructure] camada com comprimento inesperado; posições ausentes serão preservadas como unknown_parsing_error.', {
        layer: layerIndex,
        expected: volume,
        received: layer.length,
      })
    }
  }
  const resolvedPalette = palette.map((entry) => {
    const name = entry?.name ?? entry?.Name
    if (typeof name !== 'string' || !name.trim()) {
      return {
        blockName: 'minecraft:unknown_parsing_error',
        states: {},
        sourceBlockName: 'minecraft:unknown_parsing_error',
        parsingError: 'Entrada da paleta sem nome',
      }
    }
    const rawStates = entry.states ?? entry.States ?? {}
    if (!rawStates || typeof rawStates !== 'object' || Array.isArray(rawStates)) {
      return {
        blockName: 'minecraft:unknown_parsing_error',
        states: {},
        sourceBlockName: normalizeBlockId(name),
        parsingError: 'Estados da paleta malformados',
      }
    }
    const sourceBlockName = normalizeBlockId(name)
    const states = normalizeBedrockStates(sourceBlockName, rawStates)
    try {
      const localName = resolveBlockName(sourceBlockName, states)
      const upstream = upstreamMapping(sourceBlockName, states)
      // Exact modern Bedrock IDs are already authoritative and must never be
      // replaced with a merely similar Java block. This guards distinctions
      // such as hyphae/stem and floor/wall skulls. The upstream name is used
      // for legacy aliases only; its normalized properties remain available
      // as a secondary state source.
      const exactModernName = localName === sourceBlockName
      const resolved = {
        blockName: exactModernName ? localName : (upstream?.blockName || localName),
        javaStates: upstream?.javaStates || {},
        states,
        sourceBlockName,
        mappingSource: exactModernName ? 'Bedrock exact' : (upstream ? '@taku128/core' : 'Guizz'),
      }
      if (Number.isInteger(entry.version)) resolved.version = entry.version
      return resolved
    } catch (error) {
      return {
        blockName: 'minecraft:unknown_parsing_error',
        states,
        sourceBlockName,
        parsingError: error instanceof Error ? error.message : String(error),
      }
    }
  })
  // Keep a compact audit trail of the raw Bedrock palette. This runs once per
  // upload (never in the render loop) and makes directional/state regressions
  // immediately visible in DevTools without dumping every block coordinate.
  console.groupCollapsed?.(`[mcstructure] palette absorvida (${resolvedPalette.length} entradas)`)
  console.table?.(resolvedPalette.map((entry, index) => ({
    index,
    source: entry.sourceBlockName,
    resolved: entry.blockName,
    mapping: entry.mappingSource || 'Guizz',
    states: JSON.stringify(entry.states),
  })))
  console.groupEnd?.()
  const blocks = []
  const layerExtracted = new Array(layers.length).fill(0)
  const layerParsingErrors = new Array(layers.length).fill(0)
  // Bedrock uses x-major order, then y, with z changing fastest. Keep the
  // explicit triple loop here so the flattening formula cannot drift when the
  // parser is changed: flatIndex = x * sizeY * sizeZ + y * sizeZ + z.
  for (let x = 0; x < sizeX; x += 1) {
    for (let y = 0; y < sizeY; y += 1) {
      for (let z = 0; z < sizeZ; z += 1) {
        const flatIndex = (x * sizeY * sizeZ) + (y * sizeZ) + z
        // Every layer represents real data. Layer 1 may overlap layer 0 for
        // waterlogged blocks and must never be discarded.
        const positionEntry = blockPositionData && typeof blockPositionData === 'object'
          ? blockPositionData[String(flatIndex)]
          : undefined
        const blockEntityData = positionEntry?.block_entity_data ?? positionEntry?.blockEntityData
        const secondaryPaletteIndex = layers.length > 1 && flatIndex < layers[1].length
          ? layers[1][flatIndex]
          : -1
        const secondaryEntry = Number.isInteger(secondaryPaletteIndex) && secondaryPaletteIndex >= 0
          ? resolvedPalette[secondaryPaletteIndex]
          : undefined
        const waterlogged = Boolean(secondaryEntry && /(?:^|:)(?:flowing_)?(?:water|lava)$/.test(secondaryEntry.blockName))

        for (let layer = 0; layer < layers.length; layer += 1) {
          const paletteIndex = flatIndex < layers[layer].length ? layers[layer][flatIndex] : undefined
          if (paletteIndex === -1) continue
          const validIndex = Number.isInteger(paletteIndex) && paletteIndex >= 0 && paletteIndex < resolvedPalette.length
          const entry = validIndex
            ? resolvedPalette[paletteIndex]
            : {
              blockName: 'minecraft:unknown_parsing_error',
              states: {},
              sourceBlockName: 'minecraft:unknown_parsing_error',
              parsingError: `Índice de paleta inválido: ${String(paletteIndex)}`,
              rawPaletteIndex: paletteIndex,
            }
          if (IGNORED_BLOCKS.has(entry.blockName)) continue
          const block = { x, y, z, ...entry, states: { ...(entry.states || {}) }, layer, rawPaletteIndex: paletteIndex }
          // Bedrock stores signs, banners, containers, beds and other block
          // entities in a coordinate-indexed companion compound. Keeping it
          // on the block makes the internal model lossless and allows future
          // renderers/exporters to use that data without reparsing the NBT.
          if (layer === 0 && blockEntityData && typeof blockEntityData === 'object') {
            block.blockEntityData = blockEntityData
            const entityName = entityVariantName(block.sourceBlockName, blockEntityData)
            if (entityName) block.blockName = entityName
            // Standing skulls/heads keep their precise 0..360-degree yaw in
            // the Skull block entity.  The palette only says that the block is
            // attached to the floor (`facing_direction=1`), so dropping this
            // companion value makes every head point north after conversion.
            const entityId = String(blockEntityData.id || '').toLowerCase().replace(/^.*:/, '')
            const skullRotation = Number(blockEntityData.Rotation)
            if (entityId === 'skull' && Number.isFinite(skullRotation)) {
              block.states.skull_rotation_degrees = ((skullRotation % 360) + 360) % 360
            }
          }
          if (layer === 0 && waterlogged) {
            block.waterlogged = true
            block.states.waterlogged = true
          }
          blocks.push(block)
          layerExtracted[layer] += 1
          if (entry.blockName === 'minecraft:unknown_parsing_error') layerParsingErrors[layer] += 1
        }
      }
    }
  }
  // Count directly to avoid cloning typed arrays with `[...layer]`. Large
  // structures can contain millions of indices; the audit must not create a
  // second copy of those arrays or block the worker with avoidable GC work.
  const countNonEmpty = (layer) => {
    let count = 0
    for (let index = 0; index < layer.length; index += 1) {
      if (layer[index] !== -1) count += 1
    }
    return count
  }
  const totalIndices = layers.reduce((total, layer) => total + layer.length, 0)
  const expectedIndices = volume * layers.length
  const nonEmptyIndices = layers.reduce((total, layer) => total + countNonEmpty(layer), 0)
  const layer1Indices = layers.slice(1).reduce((total, layer) => total + countNonEmpty(layer), 0)
  const parsingErrors = blocks.filter(({ blockName }) => blockName === 'minecraft:unknown_parsing_error')
  const blockEntities = blocks.reduce((total, block) => total + (block.blockEntityData ? 1 : 0), 0)
  const waterloggedBlocks = blocks.reduce((total, block) => total + (block.waterlogged ? 1 : 0), 0)
  const audit = {
    totalIndices,
    expectedIndices,
    missingIndices: Math.max(0, expectedIndices - totalIndices),
    extraIndices: Math.max(0, totalIndices - expectedIndices),
    nonEmptyIndices,
    validBlocks: blocks.length - parsingErrors.length,
    extractedBlocks: blocks.length,
    layer1Blocks: layer1Indices,
    parsingErrorBlocks: parsingErrors.length,
    blockEntities,
    waterloggedBlocks,
  }
  console.log('[mcstructure] auditoria de índices:', audit)
  console.table?.([audit])
  console.table?.(layers.map((layer, layerIndex) => ({
    layer: layerIndex,
    receivedIndices: layer.length,
    expectedIndices: volume,
    nonEmptyIndices: countNonEmpty(layer),
    extractedBlocks: layerExtracted[layerIndex],
    parsingErrorBlocks: layerParsingErrors[layerIndex],
  })))
  if (parsingErrors.length) {
    console.warn('[mcstructure] blocos preservados como unknown_parsing_error:', parsingErrors.length)
    console.table?.(parsingErrors.slice(0, 50).map(({ x, y, z, layer, sourceBlockName, parsingError, rawPaletteIndex }) => ({
      x, y, z, layer, sourceBlockName, parsingError, rawPaletteIndex,
    })))
  }
  if (!blocks.length) throw new Error('A estrutura não contém blocos visíveis.')
  return blocks
}
