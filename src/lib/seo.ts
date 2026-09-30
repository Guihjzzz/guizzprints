import { SITE_URL } from '@/lib/catalog-sitemap';

type Construction = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  content_categories?: readonly string[] | null;
  content_themes?: readonly string[] | null;
  showcase_cover_url?: string | null;
  image_url_1?: string | null;
  created_at?: string | null;
  version?: string | null;
  file_size?: string | null;
};

function absoluteUrl(value?: string | null) {
  if (!value) return undefined;
  return /^https?:\/\//i.test(value) ? value : new URL(value, SITE_URL).toString();
}

function descriptionFor(item: Construction) {
  const source = item.description?.replace(/\s+/g, ' ').trim();
  return source?.slice(0, 500) || `Construção Minecraft ${item.title || 'publicada'} para ${item.category === 'java' ? 'Java' : 'Bedrock'} no Guizzprints.`;
}

export function siteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Guizzprints',
        alternateName: ['Guizz Prints', 'Guizz'],
        url: `${SITE_URL}/`,
        inLanguage: ['pt-BR', 'en', 'es'],
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Guizzprints',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.jpg`,
      },
    ],
  };
}

export function constructionStructuredData(item: Construction, locale: string) {
  const url = `${SITE_URL}/${locale}/mod/${item.id}`;
  const image = absoluteUrl(item.showcase_cover_url || item.image_url_1) || `${SITE_URL}/guizz-cover.jpg`;
  const category = item.content_categories?.filter(Boolean).join(', ') || item.category || 'Minecraft';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#construction`,
        name: item.title || 'Construção Minecraft',
        description: descriptionFor(item),
        url,
        image,
        datePublished: item.created_at || undefined,
        inLanguage: locale === 'pt' ? 'pt-BR' : locale,
        keywords: [
          'Minecraft',
          item.category === 'java' ? 'Minecraft Java' : 'Minecraft Bedrock',
          category,
          ...(item.content_themes || []),
        ],
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        additionalProperty: [
          item.version ? { '@type': 'PropertyValue', name: 'Versão do Minecraft', value: item.version } : null,
          item.file_size ? { '@type': 'PropertyValue', name: 'Tamanho do arquivo', value: item.file_size } : null,
        ].filter(Boolean),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Guizzprints', item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: item.category === 'java' ? 'Minecraft Java' : 'Minecraft Bedrock', item: `${SITE_URL}/${locale}/category/${item.category === 'java' ? 'java' : 'bedrock'}` },
          { '@type': 'ListItem', position: 3, name: item.title || 'Construção Minecraft', item: url },
        ],
      },
    ],
  };
}
