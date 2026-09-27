const categoryNames: Record<string, string> = {
  bedrock: 'Bedrock', java: 'Java', holoprint: 'Holoprint', mcstructure: 'MCStructure',
  mcaddon: 'MCAddon', mcworld: 'MCWorld', litematic: 'Litematic', schematic: 'Schematic',
  world: 'World', mcfunction: 'MC Function',
};

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
