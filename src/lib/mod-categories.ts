const categoryNames: Record<string, string> = {
  bedrock: 'Bedrock', java: 'Java', holoprint: 'Holoprint', mcstructure: 'MCStructure',
  mcaddon: 'MCAddon', mcworld: 'MCWorld', litematic: 'Litematic', schematic: 'Schematic',
  world: 'World', mcfunction: 'MC Function',
};

// Metadata used by the public catalog and by the administrator publisher.
// Values intentionally stay in Portuguese because they are persisted in the
// catalog and make shared search URLs stable across the website.
export const CONTENT_THEMES = ['Ancestral', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Outro'] as const;
export const CONTENT_SIZES = ['Pequeno', 'Médio', 'Grande', 'Enorme'] as const;
export const CONTENT_CATEGORIES = [
  'Arenas',
  'Castelos',
  'Masmorras',
  'Jogos',
  'Casas e lojas',
  'Variado',
  'Pedra vermelha',
  'Templos',
  'Torres',
  'Cidades',
  'Ilhas Flutuantes',
  'Jardins',
  'Ilhas',
  'Arte em pixel',
  'Estátuas e esculturas',
  'Barcos',
  'Máquinas Voadoras',
  'Veículos terrestres',
] as const;

export type ContentTheme = typeof CONTENT_THEMES[number];
export type ContentSize = typeof CONTENT_SIZES[number];
export type ContentCategory = typeof CONTENT_CATEGORIES[number];
export type ContentTaxonomy = {
  content_themes: ContentTheme[];
  content_size: ContentSize;
  content_categories: ContentCategory[];
};

type TaxonomyOptions = { required?: boolean };

function selectedValue<T extends readonly string[]>(value: unknown, allowed: T): T[number] | null {
  if (typeof value !== 'string') return null;
  const selected = value.trim();
  return allowed.includes(selected as T[number]) ? selected as T[number] : null;
}

function selectedValues<T extends readonly string[]>(value: unknown, allowed: T) {
  if (!Array.isArray(value)) return [] as T[number][];
  const selected = value.map((entry) => selectedValue(entry, allowed));
  if (selected.some((entry) => !entry)) {
    throw new Error('Uma ou mais classificações da construção não são válidas.');
  }
  const unique = [...new Set(selected.filter((entry): entry is T[number] => Boolean(entry)))];
  return unique;
}

/**
 * Validates the classification shared by the two editions of one publication.
 * Values stay as the Portuguese labels used by the catalog so links and filters
 * can use the same stable, human-readable vocabulary.
 */
export function parseContentTaxonomy(
  body: Record<string, unknown>,
  { required = true }: TaxonomyOptions = {},
): ContentTaxonomy {
  const themes = selectedValues(body.content_themes, CONTENT_THEMES);
  const size = selectedValue(body.content_size, CONTENT_SIZES);
  const categories = selectedValues(body.content_categories, CONTENT_CATEGORIES);

  if (required && themes.length === 0) throw new Error('Escolha pelo menos um tema para a construção.');
  if (required && !size) throw new Error('Escolha um tamanho para a construção.');
  if (required && categories.length === 0) {
    throw new Error('Escolha ao menos uma categoria para a construção.');
  }

  return {
    content_themes: themes.length ? themes : ['Outro'],
    content_size: size || 'Médio',
    content_categories: categories.length ? categories : ['Variado'],
  };
}

export function normalizeCategory(value?: string | null) {
  const normalized = value?.trim().toLowerCase() || '';
  return normalized === 'mc function' || normalized === 'mc-function' ? 'mcfunction' : normalized;
}

export function categoryLabel(value?: string | null) {
  return categoryNames[normalizeCategory(value)] || value?.trim() || '';
}

export function belongsToCategory(item: { category?: string | null; subcategory?: string | null }, category: string) {
  const normalized = normalizeCategory(category);
  return Boolean(normalized) && [item.category, item.subcategory].some(value => normalizeCategory(value) === normalized);
}

// Only known, literal category values may enter a raw PostgREST OR expression.
export function categoryFilter(category: string) {
  const normalized = normalizeCategory(category);
  if (!Object.hasOwn(categoryNames, normalized)) return 'id.is.null';
  const values = [normalized];
  return values.flatMap(value => [`category.ilike.${value}`, `subcategory.ilike.${value}`]).join(',');
}
