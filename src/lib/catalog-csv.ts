export type CatalogExportRow = {
  id: string;
  title: string | null;
  category: string | null;
  subcategory: string | null;
  version: string | null;
  created_at: string | null;
};

const categories: Record<string, string> = {
  addons: 'Add-ons', maps: 'Maps', textures: 'Textures', skins: 'Skins',
  shaders: 'Shaders', holoprint: 'Holoprint', 'mash-up': 'Mash-up',
};
const publicationDate = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'medium',
});

function csvCell(value: string) {
  // Prevent spreadsheet applications from interpreting a catalog title as a formula.
  const safe = /^[\s]*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function catalogCsvRows(items: CatalogExportRow[]) {
  return items.map(item => {
    const date = item.created_at ? new Date(item.created_at) : null;
    return [
      item.title || '',
      categories[item.category?.toLowerCase() || ''] || item.category || '',
      item.subcategory || '',
      item.version ? `# v${item.version.trim().replace(/^(?:#\s*v\s*|v(?=\d))/i, '')}` : '',
      date && !Number.isNaN(date.getTime()) ? publicationDate.format(date) : '',
    ].map(csvCell).join(';');
  }).join('\r\n') + (items.length ? '\r\n' : '');
}

export async function collectCatalogCsv(
  fetchBatch: (cursor: string | null) => Promise<{ items: CatalogExportRow[]; nextCursor: string | null }>,
  onProgress: (count: number) => void,
  signal: AbortSignal,
) {
  const parts = ['\uFEFFTítulo do Mod;Categoria;Subcategoria;Versão;Data de publicação (São Paulo)\r\n'];
  let count = 0;
  let cursor: string | null = null;
  do {
    signal.throwIfAborted();
    const batch = await fetchBatch(cursor);
    signal.throwIfAborted();
    if (batch.nextCursor && (batch.nextCursor === cursor || !batch.items.length)) {
      throw new Error('A exportação não avançou. Tente novamente.');
    }
    parts.push(catalogCsvRows(batch.items));
    count += batch.items.length;
    onProgress(count);
    cursor = batch.nextCursor;
  } while (cursor);
  return { parts, count };
}
