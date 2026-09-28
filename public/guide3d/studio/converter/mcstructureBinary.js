const ROOT_COMPOUND = 0x0a

export function isGzipBuffer(value) {
  return value?.[0] === 0x1f && value?.[1] === 0x8b
}

export function isZlibBuffer(value) {
  return value?.[0] === 0x78 && [0x01, 0x5e, 0x9c, 0xda].includes(value?.[1])
}

function asBytes(input) {
  if (input instanceof Uint8Array) return input
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  throw new TypeError('O payload do .mcstructure não é um ArrayBuffer válido.')
}

function hexPreview(bytes, length = 16) {
  return [...bytes.subarray(0, length)].map((byte) => byte.toString(16).padStart(2, '0')).join(' ')
}

// Bedrock structures are commonly raw little-endian NBT. Some older export
// tools prepend a 4-byte little-endian format version, so both layouts work.
export function prepareMcstructureBuffer(arrayBuffer) {
  // Keep this stage browser-native. Older versions used Buffer.readUInt16LE,
  // which made Vite builds depend on a Node polyfill and caused silent upload
  // failures. DataView gives the same little-endian reads in every browser.
  const bytes = asBytes(arrayBuffer)
  const gzip = isGzipBuffer(bytes)
  console.log('[mcstructure] primeiros bytes:', hexPreview(bytes))
  const zlib = isZlibBuffer(bytes)
  console.log('[mcstructure] tamanho:', bytes.byteLength, 'bytes; gzip:', gzip, 'zlib:', zlib)
  if (gzip || zlib) {
    // The caller performs browser-native DecompressionStream for compressed
    // signatures; raw Bedrock NBT never goes through an inflate operation.
    console.log('[mcstructure] GZIP detectado; descompressão será feita no pipeline.')
    return bytes
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const version = bytes.length >= 4 ? view.getUint32(0, true) : null
  const candidates = []
  // Search the complete first 16 bytes instead of assuming a fixed header.
  // A valid Compound tag is followed by a 2-byte LE name length and then a
  // legal NBT tag id (or 0 for an empty compound).
  for (let offset = 0; offset <= Math.min(15, bytes.length - 4); offset += 1) {
    if (bytes[offset] !== ROOT_COMPOUND) continue
    const nameLength = view.getUint16(offset + 1, true)
    const nextTagOffset = offset + 3 + nameLength
    const nextTag = bytes[nextTagOffset]
    const validName = nextTagOffset < bytes.length
    const validTag = nextTag === 0 || (nextTag >= 1 && nextTag <= 12)
    if (validName && validTag) candidates.push({ offset, nameLength })
  }
  console.log('[mcstructure] offsets NBT candidatos (0..15):', candidates)
  const match = candidates[0]
    ? { ...candidates[0], label: candidates[0].offset === 0 ? 'NBT direto' : 'cabeçalho/prefixo detectado dinamicamente' }
    : null
  if (!match) throw new Error(`Compound NBT (0x0A) ausente. Bytes iniciais: ${hexPreview(bytes)}`)
  if (match.offset === 0) {
    console.log('[mcstructure] Compound 0x0A no byte 0; nenhum cabeçalho removido.')
    return bytes
  }
  console.log(`[mcstructure] removendo ${match.label}; versão ${version}; offset NBT ${match.offset}`)
  return bytes.subarray(match.offset)
}
