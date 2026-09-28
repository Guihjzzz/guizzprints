// Keep this as a JavaScript module instead of importing JSON directly. The
// guide is also served as a static browser app, where JSON module assertions
// are not consistently available across browsers.
import BEDROCK_ALIASES from './generated/bedrockAliases.js'

// Bedrock palettes can use one legacy identifier plus states for many variants.
// Keep the original states: geometry, face orientation and double plants need them.
export function normalizeBlockId(blockName) {
  const id = String(blockName ?? '').trim().toLowerCase()
  return id.includes(':') ? id : `minecraft:${id}`
}

const ALIASES = {
  grass: 'grass_block', grass_path: 'dirt_path', yellow_flower: 'dandelion',
  string: 'tripwire', trip_wire: 'tripwire',
  deadbush: 'dead_bush', reeds: 'sugar_cane', waterlily: 'lily_pad',
  web: 'cobweb', lit_pumpkin: 'jack_o_lantern', hardened_clay: 'terracotta',
  brick_block: 'bricks', nether_brick: 'nether_bricks', red_nether_brick: 'red_nether_bricks',
  end_bricks: 'end_stone_bricks', slime: 'slime_block', snow_layer: 'snow',
  melon_block: 'melon', lit_furnace: 'furnace',
  lit_redstone_ore: 'redstone_ore', lit_deepslate_redstone_ore: 'deepslate_redstone_ore',
  portal: 'nether_portal',
  wooden_door: 'oak_door', trapdoor: 'oak_trapdoor', fence_gate: 'oak_fence_gate',
  lit_redstone_lamp: 'redstone_lamp', daylight_detector_inverted: 'daylight_detector',
  normal_stone_stairs: 'stone_stairs', normal_stone_slab: 'stone_slab',
  glow_frame: 'glow_item_frame', noteblock: 'note_block',
  // These three legacy IDs carry their dye in block_position_data (Base/color),
  // not in the palette name.  They are resolved per coordinate by
  // structureData; keeping the bare IDs here prevents every banner/bed from
  // being silently rewritten to white before that entity data is available.
  azalea_leaves_flowered: 'flowering_azalea_leaves',
  darkoak_wall_sign: 'dark_oak_wall_sign', darkoak_standing_sign: 'dark_oak_sign',
  // `bush` is a real 1.21+ decorative block with its own cross model and
  // `bush.png` texture. It must stay distinct from azalea. Modern hyphae IDs
  // must likewise stay exact: `stripped_warped_hyphae` has bark on every face,
  // while `stripped_warped_stem` has end-grain faces and is a different block.
}

const STONES = {
  stone: 'stone', granite: 'granite', smooth_granite: 'polished_granite',
  diorite: 'diorite', smooth_diorite: 'polished_diorite',
  andesite: 'andesite', smooth_andesite: 'polished_andesite',
}
const FLOWERS = {
  poppy: 'poppy', orchid: 'blue_orchid', blue_orchid: 'blue_orchid',
  allium: 'allium', houstonia: 'azure_bluet', azure_bluet: 'azure_bluet',
  tulip_red: 'red_tulip', tulip_orange: 'orange_tulip', tulip_white: 'white_tulip',
  tulip_pink: 'pink_tulip', oxeye: 'oxeye_daisy', oxeye_daisy: 'oxeye_daisy',
  cornflower: 'cornflower', lily_of_the_valley: 'lily_of_the_valley',
}
const DOUBLE_PLANTS = {
  sunflower: 'sunflower', syringa: 'lilac', lilac: 'lilac', grass: 'tall_grass',
  fern: 'large_fern', rose: 'rose_bush', rose_bush: 'rose_bush',
  paeonia: 'peony', peony: 'peony',
}
const SLAB_TYPES = {
  1: {
    smooth_stone: 'smooth_stone', sandstone: 'sandstone', wood: 'petrified_oak',
    cobblestone: 'cobblestone', brick: 'brick', stone_brick: 'stone_brick',
    quartz: 'quartz', nether_brick: 'nether_brick',
  },
  2: {
    red_sandstone: 'red_sandstone', purpur: 'purpur', prismarine_rough: 'prismarine',
    prismarine_dark: 'dark_prismarine', prismarine_brick: 'prismarine_brick',
    mossy_cobblestone: 'mossy_cobblestone', smooth_sandstone: 'smooth_sandstone',
    red_nether_brick: 'red_nether_brick',
  },
  3: {
    end_stone_brick: 'end_stone_brick', smooth_red_sandstone: 'smooth_red_sandstone',
    polished_andesite: 'polished_andesite', andesite: 'andesite', diorite: 'diorite',
    polished_diorite: 'polished_diorite', granite: 'granite', polished_granite: 'polished_granite',
  },
  4: {
    mossy_stone_brick: 'mossy_stone_brick', smooth_quartz: 'smooth_quartz',
    stone: 'stone', cut_sandstone: 'cut_sandstone', cut_red_sandstone: 'cut_red_sandstone',
  },
}
const SLAB_DEFAULTS = { 1: 'smooth_stone', 2: 'red_sandstone', 3: 'end_stone_brick', 4: 'mossy_stone_brick' }
const COLOR_FAMILIES = {
  wool: 'wool', carpet: 'carpet', stained_glass: 'stained_glass',
  stained_glass_pane: 'stained_glass_pane', stained_hardened_clay: 'terracotta',
  concrete: 'concrete', concrete_powder: 'concrete_powder', shulker_box: 'shulker_box',
}
const COLORS = new Set(['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'])
const WOODS = new Set(['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'mangrove', 'cherry', 'bamboo', 'crimson', 'warped', 'pale_oak'])

// Generated from PrismarineJS' Bedrock 1.20 block-state mappings. Geometry
// states stay untouched; this lookup only supplies the canonical material ID
// when old Bedrock names encode it in a state (walls, colors, slabs, etc.).
function generatedAlias(id, states) {
  const rule = BEDROCK_ALIASES[id]
  if (typeof rule === 'string') return rule
  if (!rule?.keys || !rule?.map) return null
  const selector = rule.keys.map((key) => String(states[key] ?? '')).join('|')
  return rule.map[selector] ?? null
}

function woodVariant(states, keys, fallback = 'oak') {
  const wood = keys.map((key) => states[key]).find((value) => typeof value === 'string')
  return WOODS.has(wood) ? wood : fallback
}

// A few legacy Bedrock IDs encode a visual state in the identifier itself.
// Preserve that information before the ID is flattened to its modern name.
export function normalizeBedrockStates(blockName, states = {}) {
  const name = normalizeBlockId(blockName).slice('minecraft:'.length)
  if (name === 'lit_redstone_lamp') return { ...states, lit_bit: 1 }
  if (name === 'daylight_detector_inverted') return { ...states, inverted_bit: 1 }
  return states
}

export function resolveBlockName(blockName, states = {}) {
  const id = normalizeBlockId(blockName)
  if (!id.startsWith('minecraft:')) return id
  const name = id.slice('minecraft:'.length)
  const toId = (variant) => `minecraft:${variant}`
  if (!states || typeof states !== 'object') states = {}

  if (name === 'planks') return toId(`${woodVariant(states, ['wood_type'])}_planks`)
  // Modern Java/Sponge and newer Bedrock exports use `snow` for the variable
  // 1..7-layer model and `snow_block` for the full eight-layer cube.  The old
  // unconditional alias turned every thin layer into a one-block cube.
  if (name === 'snow') {
    const layers = Number(states.layers)
    return Number.isFinite(layers) && layers >= 8 ? toId('snow_block') : toId('snow')
  }
  if (name === 'log' || name === 'log2') {
    return toId(`${woodVariant(states, [name === 'log' ? 'old_log_type' : 'new_log_type', 'wood_type'], name === 'log' ? 'oak' : 'acacia')}_log`)
  }
  if (name === 'leaves' || name === 'leaves2') {
    return toId(`${woodVariant(states, [name === 'leaves' ? 'old_leaf_type' : 'new_leaf_type', 'wood_type'], name === 'leaves' ? 'oak' : 'acacia')}_leaves`)
  }
  if (name === 'wood') {
    const stripped = states.stripped_bit === true || states.stripped_bit === 1
    return toId(`${stripped ? 'stripped_' : ''}${woodVariant(states, ['wood_type'])}_wood`)
  }
  if (name === 'sapling') return toId(`${woodVariant(states, ['sapling_type', 'wood_type'])}_sapling`)
  if (name === 'fence') return toId(`${woodVariant(states, ['wood_type'])}_fence`)

  const stoneSlab = /^(double_)?stone_block_slab([2-4]?)$/.exec(name)
  if (stoneSlab) {
    const series = stoneSlab[2] || '1'
    const stateKey = series === '1' ? 'stone_slab_type' : `stone_slab_type_${series}`
    const variant = SLAB_TYPES[series][states[stateKey]] ?? SLAB_DEFAULTS[series]
    return toId(`${variant}${stoneSlab[1] ? '_double' : ''}_slab`)
  }
  if (name === 'wooden_slab' || name === 'double_wooden_slab') {
    return toId(`${woodVariant(states, ['wood_type'])}${name.startsWith('double_') ? '_double' : ''}_slab`)
  }
  // Newer Bedrock palettes also emit material-specific IDs such as
  // `cobblestone_double_slab` and `mossy_cobblestone_double_slab`.  The Java
  // model registry has one `<material>_slab` model whose `type=double` state
  // selects the full-height variant.  Keeping `_double_slab` in the ID misses
  // that model and used to send these real blocks to the texture fallback.
  // formatBridge still sees sourceBlockName and therefore retains
  // `type=double`; only the model/texture lookup name is canonicalized here.
  if (name.endsWith('_double_slab')) return toId(name.replace(/_double_slab$/, '_slab'))

  if (name === 'stone') return toId(STONES[states.stone_type] ?? 'stone')
  if (name === 'dirt') return toId(states.dirt_type === 'coarse' ? 'coarse_dirt' : 'dirt')
  if (name === 'sand') return toId(states.sand_type === 'red' ? 'red_sand' : 'sand')
  if (name === 'stonebrick') {
    return toId(({ mossy: 'mossy_stone_bricks', cracked: 'cracked_stone_bricks', chiseled: 'chiseled_stone_bricks' })[states.stone_brick_type] ?? 'stone_bricks')
  }
  if (name === 'prismarine') {
    return toId(({ dark: 'dark_prismarine', bricks: 'prismarine_bricks' })[states.prismarine_block_type] ?? 'prismarine')
  }
  if (name === 'sandstone' || name === 'red_sandstone') {
    const prefix = ({ heiroglyphs: 'chiseled_', cut: 'cut_', smooth: 'smooth_' })[states.sand_stone_type] ?? ''
    return toId(`${prefix}${name}`)
  }
  if (name === 'quartz_block') {
    return toId(({ chiseled: 'chiseled_quartz_block', lines: 'quartz_pillar', smooth: 'smooth_quartz' })[states.chisel_type] ?? 'quartz_block')
  }

  if (COLOR_FAMILIES[name]) {
    const color = states.color === 'silver' ? 'light_gray' : states.color
    return toId(`${COLORS.has(color) ? color : 'white'}_${COLOR_FAMILIES[name]}`)
  }
  if (name === 'red_flower') return toId(FLOWERS[states.flower_type] ?? 'poppy')
  if (name === 'double_plant') return toId(DOUBLE_PLANTS[states.double_plant_type] ?? 'sunflower')
  if (name === 'tallgrass') {
    return toId(({ fern: 'fern', default: 'dead_bush' })[states.tall_grass_type] ?? 'short_grass')
  }
  // `flower_pot`, `standing_banner`, `wall_banner` and `bed` are entity-backed
  // legacy IDs.  Their generated alias table contains a historical default
  // colour/plant, which is unsafe when the palette entry has no companion
  // entity.  Keep the raw canonical family here; structureData replaces it
  // with the exact potted/dyed variant when block_position_data provides one.
  if (name === 'flower_pot' || name === 'standing_banner' || name === 'wall_banner' || name === 'bed') {
    return toId(name)
  }
  const explicitAlias = ALIASES[name]
  if (explicitAlias) return toId(explicitAlias)
  // Keep flowing fluids distinct so the renderer can select their animated
  // flow texture instead of collapsing them into the still-fluid ID.
  if (name !== 'flowing_water' && name !== 'flowing_lava') {
    const mapped = generatedAlias(id, states)
    if (mapped) return normalizeBlockId(mapped)
  }
  return toId(name)
}
