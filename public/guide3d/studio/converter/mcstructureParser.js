import { extractBlocks } from './structureData.js'
import { isGzipBuffer, isZlibBuffer, prepareMcstructureBuffer } from './mcstructureBinary.js'
import { parseLittleEndianNbt } from './nbtLite.js'
import { parseSchematicFile } from './schematicParser.js'

const MAX_FILE_BYTES = 128 * 1024 * 1024

async function decodeNbt(arrayBuffer) {
  let bytes = prepareMcstructureBuffer(arrayBuffer)
  const compression = isGzipBuffer(bytes) ? 'gzip' : isZlibBuffer(bytes) ? 'deflate' : null
  if (compression) {
    if (typeof DecompressionStream !== 'function') throw new Error(`Este navegador não oferece DecompressionStream(${compression}).`)
    console.log(`[mcstructure] iniciando DecompressionStream(${compression}).`)
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(compression))
    bytes = new Uint8Array(await new Response(stream).arrayBuffer())
    bytes = prepareMcstructureBuffer(bytes)
  }
  return parseLittleEndianNbt(bytes)
}

async function parseOnMainThread(arrayBuffer) {
  return extractBlocks(await decodeNbt(arrayBuffer))
}

function parseInWorker(arrayBuffer) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./workers/mcstructureWorker.js', import.meta.url), { type: 'module' })
    const finish = () => worker.terminate()
    worker.onmessage = ({ data }) => {
      finish()
      if (data?.error) {
        const error = new Error(data.error)
        if (data.stack) error.stack = data.stack
        reject(error)
      }
      else resolve(data.blocks)
    }
    worker.onerror = (event) => {
      finish()
      reject(new Error(event.message || 'O processo de leitura em segundo plano falhou.'))
    }
    worker.postMessage({ arrayBuffer }, [arrayBuffer])
  })
}

export async function parseMcstructureFile(file) {
  console.log('[mcstructure] upload recebido:', file?.name, 'tamanho:', file?.size)
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Selecione um arquivo .mcstructure para continuar.')
  }
  if (typeof file.name !== 'string' || !/\.(mcstructure|nbt|schem|schematic)$/i.test(file.name)) {
    throw new Error('Formato inválido. Use .mcstructure, .nbt, .schem ou .schematic.')
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('O arquivo está vazio ou não pode ser lido.')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('O arquivo excede o limite de 128 MB. Exporte uma região menor.')
  }
  let arrayBuffer
  try {
    arrayBuffer = await file.arrayBuffer()
  } catch {
    throw new Error('Não foi possível ler o arquivo. Selecione-o novamente.')
  }
  if (!arrayBuffer.byteLength || arrayBuffer.byteLength > MAX_FILE_BYTES) {
    throw new Error('O arquivo está vazio ou excede o limite de 128 MB.')
  }
  try {
    const extension = file.name.toLowerCase().split('.').pop()
    const blocks = extension === 'schem' || extension === 'schematic' || extension === 'nbt'
      ? await parseSchematicFile(file)
      : typeof Worker === 'function'
        ? await parseInWorker(arrayBuffer)
        : await parseOnMainThread(arrayBuffer)
    console.log('[mcstructure] upload concluído:', blocks.length, 'blocos visíveis')
    return blocks
  } catch (error) {
    console.error('[mcstructure] falha no parsing:', error)
    console.error('[mcstructure] mensagem original:', error?.message)
    console.error('[mcstructure] stack original:', error?.stack)
    throw new Error('Não foi possível decodificar o NBT Little Endian. Verifique se o arquivo é uma estrutura válida do Minecraft Bedrock.', { cause: error })
  }
}
