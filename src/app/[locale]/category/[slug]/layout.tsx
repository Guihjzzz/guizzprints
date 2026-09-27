import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

const LABELS: Record<string, Record<string, string>> = {
  en: { addons: 'Add-ons', maps: 'Maps', textures: 'Textures', skins: 'Skins', shaders: 'Shaders', holoprint: 'Holoprint', 'mash-up': 'Mash-up' },
  pt: { addons: 'Add-ons', maps: 'Mapas', textures: 'Texturas', skins: 'Skins', shaders: 'Shaders', holoprint: 'Holoprint', 'mash-up': 'Mash-up' },
  es: { addons: 'Add-ons', maps: 'Mapas', textures: 'Texturas', skins: 'Skins', shaders: 'Shaders', holoprint: 'Holoprint', 'mash-up': 'Mash-up' },
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Browse Minecraft {category} and discover your next GuizzMods download.',
  pt: 'Explore {category} de Minecraft e encontre seu próximo download no GuizzMods.',
  es: 'Explora {category} de Minecraft y encuentra tu próxima descarga en GuizzMods.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const language = LABELS[locale] ? locale : 'en';
  const category = LABELS[language][slug] ?? slug.replace(/-/g, ' ');
  const title = `${category} Minecraft | GuizzMods`;
  const description = DESCRIPTIONS[language].replace('{category}', category);
  const url = `/${locale}/category/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: '/logo.jpg', alt: 'GuizzMods' }] },
    twitter: { card: 'summary', title, description, images: ['/logo.jpg'] },
  };
}

export default function CategoryLayout({ children }: Props) {
  return children;
}
