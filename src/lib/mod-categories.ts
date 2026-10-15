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

const CATEGORY_LABELS: Record<string, readonly string[]> = {
  en: ['Arenas', 'Castles', 'Dungeons', 'Games', 'Houses and shops', 'Miscellaneous', 'Redstone', 'Temples', 'Towers', 'Cities', 'Floating islands', 'Gardens', 'Islands', 'Pixel art', 'Statues and sculptures', 'Boats', 'Flying machines', 'Land vehicles'],
  es: ['Arenas', 'Castillos', 'Mazmorras', 'Juegos', 'Casas y tiendas', 'Variado', 'Redstone', 'Templos', 'Torres', 'Ciudades', 'Islas flotantes', 'Jardines', 'Islas', 'Arte pixelado', 'Estatuas y esculturas', 'Barcos', 'Máquinas voladoras', 'Vehículos terrestres'],
  pt: ['Arenas', 'Castelos', 'Masmorras', 'Jogos', 'Casas e lojas', 'Variado', 'Redstone', 'Templos', 'Torres', 'Cidades', 'Ilhas flutuantes', 'Jardins', 'Ilhas', 'Arte em pixel', 'Estátuas e esculturas', 'Barcos', 'Máquinas voadoras', 'Veículos terrestres'],
  fr: ['Arènes', 'Châteaux', 'Donjons', 'Jeux', 'Maisons et boutiques', 'Divers', 'Redstone', 'Temples', 'Tours', 'Villes', 'Îles flottantes', 'Jardins', 'Îles', 'Pixel art', 'Statues et sculptures', 'Bateaux', 'Machines volantes', 'Véhicules terrestres'],
  de: ['Arenen', 'Burgen', 'Dungeons', 'Spiele', 'Häuser und Läden', 'Verschiedenes', 'Redstone', 'Tempel', 'Türme', 'Städte', 'Fliegende Inseln', 'Gärten', 'Inseln', 'Pixelkunst', 'Statuen und Skulpturen', 'Boote', 'Flugmaschinen', 'Landfahrzeuge'],
  it: ['Arene', 'Castelli', 'Dungeon', 'Giochi', 'Case e negozi', 'Varie', 'Redstone', 'Templi', 'Torri', 'Città', 'Isole galleggianti', 'Giardini', 'Isole', 'Pixel art', 'Statue e sculture', 'Barche', 'Macchine volanti', 'Veicoli terrestri'],
  pl: ['Areny', 'Zamki', 'Lochy', 'Gry', 'Domy i sklepy', 'Różne', 'Redstone', 'Świątynie', 'Wieże', 'Miasta', 'Latające wyspy', 'Ogrody', 'Wyspy', 'Pixel art', 'Posągi i rzeźby', 'Łodzie', 'Latające maszyny', 'Pojazdy lądowe'],
  id: ['Arena', 'Kastel', 'Ruang bawah tanah', 'Permainan', 'Rumah dan toko', 'Lain-lain', 'Redstone', 'Kuil', 'Menara', 'Kota', 'Pulau melayang', 'Taman', 'Pulau', 'Seni piksel', 'Patung dan pahatan', 'Perahu', 'Mesin terbang', 'Kendaraan darat'],
  hi: ['अखाड़े', 'महल', 'कालकोठरी', 'खेल', 'घर और दुकानें', 'विविध', 'Redstone', 'मंदिर', 'मीनारें', 'शहर', 'तैरते द्वीप', 'बगीचे', 'द्वीप', 'पिक्सेल कला', 'मूर्तियाँ और शिल्प', 'नावें', 'उड़ने वाली मशीनें', 'ज़मीनी वाहन'],
  ja: ['アリーナ', '城', 'ダンジョン', 'ゲーム', '家とショップ', 'その他', 'レッドストーン', '寺院', '塔', '都市', '浮島', '庭園', '島', 'ドット絵', '像と彫刻', '船', '飛行マシン', '陸上の乗り物'],
  ko: ['경기장', '성', '던전', '게임', '집과 상점', '기타', '레드스톤', '사원', '탑', '도시', '공중섬', '정원', '섬', '픽셀 아트', '조각상과 조형물', '배', '비행 기계', '지상 차량'],
  vi: ['Đấu trường', 'Lâu đài', 'Ngục tối', 'Trò chơi', 'Nhà và cửa hàng', 'Khác', 'Redstone', 'Đền', 'Tháp', 'Thành phố', 'Đảo bay', 'Vườn', 'Đảo', 'Nghệ thuật pixel', 'Tượng và tác phẩm điêu khắc', 'Thuyền', 'Máy bay', 'Phương tiện trên đất liền'],
  th: ['สนามประลอง', 'ปราสาท', 'ดันเจี้ยน', 'เกม', 'บ้านและร้านค้า', 'อื่น ๆ', 'เรดสโตน', 'วิหาร', 'หอคอย', 'เมือง', 'เกาะลอยฟ้า', 'สวน', 'เกาะ', 'พิกเซลอาร์ต', 'รูปปั้นและประติมากรรม', 'เรือ', 'เครื่องจักรบินได้', 'ยานพาหนะทางบก'],
};

const THEME_LABELS: Record<string, readonly string[]> = {
  en: ['Ancient', 'Asian', 'Futuristic', 'Medieval', 'Modern', 'Other'],
  es: ['Antiguo', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Otro'],
  pt: ['Ancestral', 'Asiático', 'Futurista', 'Medieval', 'Moderno', 'Outro'],
  fr: ['Ancien', 'Asiatique', 'Futuriste', 'Médiéval', 'Moderne', 'Autre'],
  de: ['Antik', 'Asiatisch', 'Futuristisch', 'Mittelalterlich', 'Modern', 'Sonstiges'],
  it: ['Antico', 'Asiatico', 'Futuristico', 'Medievale', 'Moderno', 'Altro'],
  pl: ['Starożytny', 'Azjatycki', 'Futurystyczny', 'Średniowieczny', 'Nowoczesny', 'Inny'],
  id: ['Kuno', 'Asia', 'Futuristik', 'Abad pertengahan', 'Modern', 'Lainnya'],
  hi: ['प्राचीन', 'एशियाई', 'भविष्यवादी', 'मध्यकालीन', 'आधुनिक', 'अन्य'],
  ja: ['古代', 'アジア風', '未来風', '中世', '現代風', 'その他'],
  ko: ['고대', '아시아풍', '미래풍', '중세', '현대', '기타'],
  vi: ['Cổ đại', 'Châu Á', 'Tương lai', 'Trung cổ', 'Hiện đại', 'Khác'],
  th: ['โบราณ', 'เอเชีย', 'โลกอนาคต', 'ยุคกลาง', 'สมัยใหม่', 'อื่น ๆ'],
};

const SIZE_LABELS: Record<string, readonly string[]> = {
  en: ['Small', 'Medium', 'Large', 'Huge'], es: ['Pequeño', 'Mediano', 'Grande', 'Enorme'],
  pt: ['Pequeno', 'Médio', 'Grande', 'Enorme'], fr: ['Petit', 'Moyen', 'Grand', 'Énorme'],
  de: ['Klein', 'Mittel', 'Groß', 'Riesig'], it: ['Piccolo', 'Medio', 'Grande', 'Enorme'],
  pl: ['Mały', 'Średni', 'Duży', 'Ogromny'], id: ['Kecil', 'Sedang', 'Besar', 'Sangat besar'],
  hi: ['छोटा', 'मध्यम', 'बड़ा', 'बहुत बड़ा'], ja: ['小', '中', '大', '特大'],
  ko: ['작음', '중간', '큼', '매우 큼'], vi: ['Nhỏ', 'Vừa', 'Lớn', 'Khổng lồ'],
  th: ['เล็ก', 'กลาง', 'ใหญ่', 'ใหญ่มาก'],
};

function localizedTaxonomyLabel(value: string | null | undefined, locale: string, source: readonly string[], translations: Record<string, readonly string[]>) {
  const label = value?.trim() || '';
  const baseLocale = locale.toLowerCase().split('-')[0];
  const index = source.findIndex((entry) => entry.toLocaleLowerCase('pt-BR') === label.toLocaleLowerCase('pt-BR'));
  return index >= 0 ? translations[baseLocale]?.[index] || label : label;
}

/** Local presentation keeps the persisted Portuguese category stable for filters and old catalog rows. */
export function contentCategoryLabel(value?: string | null, locale = 'pt') {
  const label = value?.trim() || '';
  return localizedTaxonomyLabel(label, locale, CONTENT_CATEGORIES, CATEGORY_LABELS);
}

export function contentThemeLabel(value?: string | null, locale = 'pt') {
  return localizedTaxonomyLabel(value, locale, CONTENT_THEMES, THEME_LABELS);
}

export function contentSizeLabel(value?: string | null, locale = 'pt') {
  return localizedTaxonomyLabel(value, locale, CONTENT_SIZES, SIZE_LABELS);
}

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
