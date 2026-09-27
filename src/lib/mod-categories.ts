const categoryNames: Record<string, string> = {
  addons: 'Add-ons', maps: 'Maps', textures: 'Textures', skins: 'Skins',
  shaders: 'Shaders', holoprint: 'Holoprint', 'mash-up': 'Mash-up',
};

export function normalizeCategory(value?: string | null) {
  const normalized = value?.trim().toLowerCase() || '';
  return normalized === 'add-ons' ? 'addons' : normalized;
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
  const values = normalized === 'addons' ? ['addons', 'add-ons'] : [normalized];
  return values.flatMap(value => [`category.ilike.${value}`, `subcategory.ilike.${value}`]).join(',');
}
