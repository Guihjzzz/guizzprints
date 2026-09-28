const encoder = new TextEncoder()

const TAG = {
  end: 0,
  byte: 1,
  int: 3,
  double: 6,
  string: 8,
  list: 9,
  compound: 10,
  intArray: 11,
}

class LittleEndianNbtWriter {
  constructor() {
    this.bytes = []
  }

  byte(value) { this.bytes.push(value & 0xff) }

  short(value) {
    this.byte(value)
    this.byte(value >>> 8)
  }

  int(value) {
    const safe = Number.isFinite(value) ? Math.trunc(value) : 0
    this.byte(safe)
    this.byte(safe >>> 8)
    this.byte(safe >>> 16)
    this.byte(safe >>> 24)
  }

  double(value) {
    const buffer = new ArrayBuffer(8)
    new DataView(buffer).setFloat64(0, Number.isFinite(value) ? value : 0, true)
    for (const byte of new Uint8Array(buffer)) this.byte(byte)
  }

  string(value) {
    const encoded = encoder.encode(String(value ?? ''))
    if (encoded.length > 0xffff) throw new Error('Uma string NBT excedeu 65.535 bytes.')
    this.short(encoded.length)
    for (const byte of encoded) this.byte(byte)
  }

  header(type, name) {
    this.byte(type)
    this.string(name)
  }

  namedInt(name, value) { this.header(TAG.int, name); this.int(value) }
  namedString(name, value) { this.header(TAG.string, name); this.string(value) }
  namedIntArray(name, values) {
    this.header(TAG.intArray, name)
    this.int(values.length)
    for (const value of values) this.int(value)
  }

  namedCompound(name, writePayload) {
    this.header(TAG.compound, name)
    writePayload()
    this.byte(TAG.end)
  }

  namedList(name, elementType, values, writeElement) {
    this.header(TAG.list, name)
    this.byte(elementType)
    this.int(values.length)
    for (const value of values) writeElement(value)
  }

  writeState(name, value) {
    if (typeof value === 'boolean') {
      this.header(TAG.byte, name)
      this.byte(value ? 1 : 0)
    } else if (typeof value === 'number' && Number.isInteger(value)) {
      this.namedInt(name, value)
    } else if (typeof value === 'number') {
      this.header(TAG.double, name)
      this.double(value)
    } else {
      this.namedString(name, value)
    }
  }

  writeDynamic(name, value) {
    if (value === null || value === undefined) {
      this.namedString(name, '')
    } else if (typeof value === 'object' && !Array.isArray(value) && !ArrayBuffer.isView(value)) {
      this.namedCompound(name, () => this.writeCompoundPayload(value))
    } else if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
      this.namedIntArray(name, Array.from(value, Number))
    } else if (Array.isArray(value)) {
      this.writeDynamicList(name, value)
    } else {
      this.writeState(name, value)
    }
  }

  writeDynamicList(name, values) {
    const list = values.filter((value) => value !== undefined && value !== null)
    if (!list.length) {
      this.namedList(name, TAG.end, [], () => {})
      return
    }
    if (list.every((value) => typeof value === 'object' && value !== null && !Array.isArray(value))) {
      this.namedList(name, TAG.compound, list, (value) => {
        this.writeCompoundPayload(value)
        this.byte(TAG.end)
      })
    } else if (list.every((value) => typeof value === 'string')) {
      this.namedList(name, TAG.string, list, (value) => this.string(value))
    } else if (list.every((value) => typeof value === 'number' && Number.isInteger(value))) {
      this.namedList(name, TAG.int, list, (value) => this.int(value))
    } else if (list.every((value) => typeof value === 'number')) {
      this.namedList(name, TAG.double, list, (value) => this.double(value))
    } else {
      // Arbitrary entity payloads occasionally contain mixed arrays. Preserve
      // them as JSON text instead of emitting an invalid heterogeneous NBT list.
      this.namedString(name, JSON.stringify(values))
    }
  }

  writeCompoundPayload(value) {
    for (const [key, child] of Object.entries(value || {})) {
      if (!key || key.length > 0xffff) continue
      this.writeDynamic(key, child)
    }
  }

  finish() { return new Uint8Array(this.bytes) }
}

function stableStates(states = {}) {
  return Object.fromEntries(
    Object.entries(states)
      .filter(([key, value]) => !key.startsWith('__') && ['boolean', 'number', 'string'].includes(typeof value))
      .sort(([a], [b]) => a.localeCompare(b)),
  )
}

function paletteKey(name, states) {
  return `${name}\u0000${JSON.stringify(states)}`
}

export function createMcstructureBytes(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) throw new Error('Não há blocos para exportar.')

  const finiteBlocks = blocks.filter(({ x, y, z }) => [x, y, z].every(Number.isFinite))
  if (!finiteBlocks.length) throw new Error('A estrutura não possui coordenadas válidas.')

  const minX = Math.min(...finiteBlocks.map(({ x }) => x))
  const minY = Math.min(...finiteBlocks.map(({ y }) => y))
  const minZ = Math.min(...finiteBlocks.map(({ z }) => z))
  const maxX = Math.max(...finiteBlocks.map(({ x }) => x))
  const maxY = Math.max(...finiteBlocks.map(({ y }) => y))
  const maxZ = Math.max(...finiteBlocks.map(({ z }) => z))
  const size = [maxX - minX + 1, maxY - minY + 1, maxZ - minZ + 1]
  const volume = size[0] * size[1] * size[2]
  if (!Number.isSafeInteger(volume) || volume > 16_777_216) {
    throw new Error('A estrutura é grande demais para exportação local.')
  }

  const palette = []
  const paletteIndices = new Map()
  const layerCount = Math.max(2, ...finiteBlocks.map(({ layer }) => Number.isInteger(layer) ? layer + 1 : 1))
  const layers = Array.from({ length: layerCount }, () => new Int32Array(volume).fill(-1))
  const positionData = new Map()

  for (const block of finiteBlocks) {
    const layer = Number.isInteger(block.layer) && block.layer >= 0 ? block.layer : 0
    const name = String(block.sourceBlockName || block.blockName || 'minecraft:unknown_parsing_error')
    const states = stableStates(block.states)
    const key = paletteKey(name, states)
    let paletteIndex = paletteIndices.get(key)
    if (paletteIndex === undefined) {
      paletteIndex = palette.length
      paletteIndices.set(key, paletteIndex)
      palette.push({ name, states, version: Number.isInteger(block.version) ? block.version : 18168865 })
    }
    const x = Math.trunc(block.x - minX)
    const y = Math.trunc(block.y - minY)
    const z = Math.trunc(block.z - minZ)
    const flatIndex = (x * size[1] * size[2]) + (y * size[2]) + z
    layers[layer][flatIndex] = paletteIndex
    if (layer === 0 && block.blockEntityData && typeof block.blockEntityData === 'object') {
      positionData.set(flatIndex, block.blockEntityData)
    }
  }

  const writer = new LittleEndianNbtWriter()
  writer.byte(TAG.compound)
  writer.string('')
  writer.namedInt('format_version', 1)
  writer.namedList('size', TAG.int, size, (value) => writer.int(value))
  writer.namedList('structure_world_origin', TAG.int, [0, 0, 0], (value) => writer.int(value))
  writer.namedCompound('structure', () => {
    writer.namedList('block_indices', TAG.list, layers, (indices) => {
      writer.byte(TAG.int)
      writer.int(indices.length)
      for (const index of indices) writer.int(index)
    })
    writer.namedList('entities', TAG.compound, [], () => {})
    writer.namedCompound('palette', () => {
      writer.namedCompound('default', () => {
        writer.namedList('block_palette', TAG.compound, palette, (entry) => {
          writer.namedString('name', entry.name)
          writer.namedCompound('states', () => {
            for (const [name, value] of Object.entries(entry.states)) writer.writeState(name, value)
          })
          writer.namedInt('version', entry.version)
          writer.byte(TAG.end)
        })
        writer.namedCompound('block_position_data', () => {
          for (const [index, entityData] of positionData) {
            writer.namedCompound(String(index), () => {
              writer.namedCompound('block_entity_data', () => writer.writeCompoundPayload(entityData))
            })
          }
        })
      })
    })
  })
  writer.byte(TAG.end)

  console.log('[mcstructure export] arquivo criado:', {
    blocks: finiteBlocks.length,
    palette: palette.length,
    layers: layerCount,
    size,
    bytes: writer.bytes.length,
  })
  return writer.finish()
}

export function downloadMcstructure(blocks, originalName = 'estrutura.mcstructure') {
  const bytes = createMcstructureBytes(blocks)
  const baseName = String(originalName).replace(/\.mcstructure$/i, '').replace(/[<>:"/\\|?*]+/g, '_') || 'estrutura'
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${baseName}-editada.mcstructure`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
