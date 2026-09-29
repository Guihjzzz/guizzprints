import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const COPY: Record<string, { title: string; description: string }> = {
  en: { title: 'Search Minecraft Builds | Guizzprints', description: 'Search Bedrock and Java builds and download supported files directly.' },
  pt: { title: 'Buscar Construções Minecraft | Guizzprints', description: 'Busque construções Bedrock e Java e baixe os arquivos compatíveis diretamente.' },
  es: { title: 'Buscar Construcciones Minecraft | Guizzprints', description: 'Busca construcciones Bedrock y Java y descarga directamente los archivos compatibles.' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = COPY[locale] ?? COPY.en;
  const url = `/${locale}/search`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    openGraph: { title: copy.title, description: copy.description, url, type: 'website', images: [{ url: '/guizz-cover.jpg', alt: 'Guizzprints' }] },
    twitter: { card: 'summary', title: copy.title, description: copy.description, images: ['/guizz-cover.jpg'] },
  };
}

export default function SearchLayout({ children }: Props) {
  return children;
}
