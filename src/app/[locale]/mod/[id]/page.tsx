import { Metadata } from 'next';
import ModViewer from '@/components/ModViewer';
import { getTranslations } from 'next-intl/server';
import { DEMO_BUILD, DEMO_BUILD_ID } from '@/lib/demo-build';
import { siteLocales, toSiteLocale } from '@/lib/site-pages';
import { getPublicMod } from '@/lib/public-mod';
import { JsonLd } from '@/components/JsonLd';
import { constructionStructuredData } from '@/lib/seo';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Mod' });
  const safeLocale = toSiteLocale(locale);
  const canonical = `/${safeLocale}/mod/${id}`;
  const alternates = {
    canonical,
    languages: Object.fromEntries(siteLocales.map((alternateLocale) => [alternateLocale, `/${alternateLocale}/mod/${id}`])),
  };

  if (id === DEMO_BUILD_ID) {
    return {
      title: `${DEMO_BUILD.title} | Guizzprints`,
      description: DEMO_BUILD.description.substring(0, 160),
      authors: [{ name: 'Guizzprints' }],
      alternates,
      openGraph: {
        title: DEMO_BUILD.title,
        description: DEMO_BUILD.description.substring(0, 160),
        siteName: 'Guizzprints',
        type: 'article',
        images: [{ url: DEMO_BUILD.showcase_cover_url || DEMO_BUILD.image_url_1, alt: DEMO_BUILD.title }],
      },
      twitter: { card: 'summary_large_image', title: DEMO_BUILD.title, description: DEMO_BUILD.description.substring(0, 160), images: [DEMO_BUILD.showcase_cover_url || DEMO_BUILD.image_url_1] },
    };
  }
  
  // CORREÇÃO: Removido 'author' para evitar Erro 400
  const data = await getPublicMod(id);

  if (!data) {
    return { title: `${t('notFound')} | Guizzprints`, alternates };
  }

  return {
    title: `${data.title} | Guizzprints`,
    description: data.description?.substring(0, 160) || t('metadataDescription'),
    authors: [{ name: 'Guizzprints' }],
    alternates,
    openGraph: {
      title: data.title,
      description: data.description?.substring(0, 160),
      siteName: 'Guizzprints',
      type: 'article',
      images: [{ url: data.showcase_cover_url || data.image_url_1 || '/guizz-cover.jpg', alt: data.title }],
    },
    twitter: { card: 'summary_large_image', title: data.title, description: data.description?.substring(0, 160), images: [data.showcase_cover_url || data.image_url_1 || '/guizz-cover.jpg'] },
  };
}

export default async function ModDetailsPage({ params }: Props) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Mod' });

  if (id === DEMO_BUILD_ID) {
    return <><JsonLd data={constructionStructuredData(DEMO_BUILD, toSiteLocale(locale))} /><ModViewer mod={DEMO_BUILD} locale={locale} /></>;
  }
  
  const data = await getPublicMod(id);

  if (!data) {
    return <div className="p-10 text-white text-center font-bold">{t('notFound')}</div>;
  }

  return <><JsonLd data={constructionStructuredData(data, toSiteLocale(locale))} /><ModViewer mod={data} locale={locale} /></>;
}
