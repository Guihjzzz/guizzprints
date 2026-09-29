import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

const LABELS: Record<string, Record<string, string>> = {
  en: { bedrock: 'Minecraft Bedrock', java: 'Minecraft Java' },
  pt: { bedrock: 'Minecraft Bedrock', java: 'Minecraft Java' },
  es: { bedrock: 'Minecraft Bedrock', java: 'Minecraft Java' },
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Browse Minecraft {category} builds and download them directly from Guizzprints.',
  pt: 'Explore construções {category} de Minecraft e baixe diretamente no Guizzprints.',
  es: 'Explora construcciones {category} de Minecraft y descárgalas directamente en Guizzprints.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const language = LABELS[locale] ? locale : 'en';
  const category = LABELS[language][slug] ?? slug.replace(/-/g, ' ');
  const title = `${category} | Guizzprints`;
  const description = DESCRIPTIONS[language].replace('{category}', category);
  const url = `/${locale}/category/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', images: [{ url: '/guizz-cover.jpg', alt: 'Guizzprints' }] },
    twitter: { card: 'summary', title, description, images: ['/guizz-cover.jpg'] },
  };
}

export default function CategoryLayout({ children }: Props) {
  return children;
}
