import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const COPY: Record<string, { title: string; description: string }> = {
  en: { title: 'Search Minecraft Mods | GuizzMods', description: 'Search Minecraft mods, add-ons, textures, maps, skins and more on GuizzMods.' },
  pt: { title: 'Buscar Mods de Minecraft | GuizzMods', description: 'Busque mods, add-ons, texturas, mapas, skins e mais no GuizzMods.' },
  es: { title: 'Buscar Mods de Minecraft | GuizzMods', description: 'Busca mods, add-ons, texturas, mapas, skins y más en GuizzMods.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = COPY[locale] ?? COPY.en;
  const url = `/${locale}/search`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: { title: copy.title, description: copy.description, url, type: 'website', images: [{ url: '/logo.jpg', alt: 'GuizzMods' }] },
    twitter: { card: 'summary', title: copy.title, description: copy.description, images: ['/logo.jpg'] },
  };
}

export default function SearchLayout({ children }: Props) {
  return children;
}
