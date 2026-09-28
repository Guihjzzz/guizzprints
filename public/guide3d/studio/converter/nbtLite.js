// Small browser-native Little Endian NBT reader. It uses only DataView and
// Uint8Array, so it does not depend on protodef, eval, or Node's Buffer.
const decoder = new TextDecoder()

class Reader {
  constructor(bytes, littleEndian = true) {
    this.bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
    this.view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
    this.offset = 0
    this.littleEndian = littleEndian
  }

  ensure(length) {
    if (this.offset + length > this.bytes.byteLength) throw new Error(`NBT truncado no offset ${this.offset}; faltam ${length} bytes.`)
  }

  byte() { this.ensure(1); return this.view.getInt8(this.offset++) }
  unsignedByte() { this.ensure(1); return this.view.getUint8(this.offset++) }
  short() { this.ensure(2); const value = this.view.getInt16(this.offset, this.littleEndian); this.offset += 2; return value }
  int() { this.ensure(4); const value = this.view.getInt32(this.offset, this.littleEndian); this.offset += 4; return value }
  long() {
    this.ensure(8)
    const value = this.view.getBigInt64(this.offset, this.littleEndian)
    this.offset += 8
    return value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER) ? Number(value) : value
  }
  float() { this.ensure(4); const value = this.view.getFloat32(this.offset, this.littleEndian); this.offset += 4; return value }
  double() { this.ensure(8); const value = this.view.getFloat64(this.offset, this.littleEndian); this.offset += 8; return value }
  string() {
    const length = this.view.getUint16(this.offset, this.littleEndian)
    this.offset += 2
    this.ensure(length)
    const value = decoder.decode(this.bytes.subarray(this.offset, this.offset + length))
    this.offset += length
    return value
  }

  payload(type) {
    switch (type) {
      case 1: return this.byte()
      case 2: return this.short()
      case 3: return this.int()
      case 4: return this.long()
      case 5: return this.float()
      case 6: return this.double()
      case 7: {
        const length = this.int(); if (length < 0) throw new Error('NBT ByteArray com tamanho negativo.')
        this.ensure(length); const value = [...this.bytes.subarray(this.offset, this.offset + length)]; this.offset += length; return value
      }
      case 8: return this.string()
      case 9: {
        const elementType = this.unsignedByte(); const length = this.int()
        if (length < 0 || length > 16_777_216) throw new Error(`NBT List com tamanho inválido: ${length}.`)
        const value = new Array(length); for (let index = 0; index < length; index += 1) value[index] = this.payload(elementType); return value
      }
      case 10: {
        const value = {}
        while (true) {
          const elementType = this.unsignedByte()
          if (elementType === 0) return value
          if (elementType < 1 || elementType > 12) throw new Error(`NBT Compound contém tag inválida ${elementType} no offset ${this.offset - 1}.`)
          value[this.string()] = this.payload(elementType)
        }
      }
      case 11: {
        const length = this.int(); if (length < 0 || length > 16_777_216) throw new Error(`NBT IntArray com tamanho inválido: ${length}.`)
        const value = new Array(length); for (let index = 0; index < length; index += 1) value[index] = this.int(); return value
      }
      case 12: {
        const length = this.int(); if (length < 0 || length > 16_777_216) throw new Error(`NBT LongArray com tamanho inválido: ${length}.`)
        const value = new Array(length); for (let index = 0; index < length; index += 1) value[index] = this.long(); return value
      }
      default: throw new Error(`Tipo NBT desconhecido: ${type} no offset ${this.offset}.`)
    }
  }
}

export function parseNbt(input, littleEndian = true) {
  const reader = new Reader(input, littleEndian)
  const rootType = reader.unsignedByte()
  if (rootType !== 10) throw new Error(`A raiz NBT deveria ser Compound (0x0A), mas foi 0x${rootType.toString(16).padStart(2, '0')} no offset 0.`)
  const rootName = reader.string()
  const value = reader.payload(rootType)
  console.log(`[nbt] NBT nativo decodificado (${littleEndian ? 'little' : 'big'} endian); raiz:`, JSON.stringify(rootName), 'bytes consumidos:', reader.offset)
  return value
}

export function parseLittleEndianNbt(input) {
  return parseNbt(input, true)
}

export function parseBigEndianNbt(input) {
  return parseNbt(input, false)
}
